/* ========================================
   CELÉBRALO PE - Chatbot "Celé" v3.0
   Tu asistente festivo con flujo guiado
   + Chat con propietarios
   + Persistencia de conversaciones
   + Enlaces a recomendaciones
   ======================================== */

class EventBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.mode = 'assistant'; // 'assistant' o 'owner'
        this.currentOwner = null;
        this.currentLocal = null;

        // Contexto mejorado para flujo guiado
        this.context = {
            eventType: null,
            date: null,
            guests: null,
            budget: null,
            stage: 'greeting',
            userName: null,
            preferences: [],
            searchHistory: []
        };

        // Configuración del wizard
        this.wizardSteps = ['event_type', 'guests', 'budget', 'recommendations'];
        this.currentStep = 0;

        // Storage keys
        this.STORAGE_KEY = 'celebralo_chat_history';
        this.OWNER_CHATS_KEY = 'celebralo_owner_chats';

        this.init();
    }

    init() {
        this.chatbot = document.getElementById('chatbot');
        this.trigger = document.getElementById('chatbotTrigger');
        this.window = document.getElementById('chatbotWindow');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.form = document.getElementById('chatbotForm');
        this.input = document.getElementById('chatInput');
        this.quickActions = document.getElementById('quickActions');
        this.closeBtn = document.getElementById('chatbotClose');

        if (!this.chatbot) return;

        // Bind events
        this.trigger.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Quick actions
        if (this.quickActions) {
            this.quickActions.querySelectorAll('.quick-action').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    this.handleQuickAction(action);
                });
            });
        }

        // Cargar historial si existe
        this.loadChatHistory();

        // Detectar si estamos en página de local
        this.detectLocalPage();

        // Initial greeting si no hay historial
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addBotMessage(this.getGreeting(), {
                    buttons: [
                        { text: '🎊 Organizar evento', value: 'organizar_evento' },
                        { text: '🔍 Solo explorar', value: 'explorar' }
                    ]
                });
            }, 500);
        }
    }

    // ==========================================
    // PERSISTENCIA DE CONVERSACIONES
    // ==========================================

    loadChatHistory() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                // Solo cargar si es del mismo día
                const savedDate = new Date(data.date).toDateString();
                const today = new Date().toDateString();

                if (savedDate === today && data.messages && data.messages.length > 0) {
                    this.messages = data.messages;
                    this.context = data.context || this.context;
                    // Renderizar mensajes guardados
                    this.messages.forEach(msg => this.renderMessage(msg, false));
                }
            }
        } catch (e) {
            console.warn('Error loading chat history:', e);
        }
    }

    saveChatHistory() {
        try {
            const data = {
                date: new Date().toISOString(),
                messages: this.messages.slice(-50), // Últimos 50 mensajes
                context: this.context
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Error saving chat history:', e);
        }
    }

    // Guardar conversaciones con propietarios
    saveOwnerChat(ownerId, message, type) {
        try {
            const chats = JSON.parse(localStorage.getItem(this.OWNER_CHATS_KEY) || '{}');
            if (!chats[ownerId]) {
                chats[ownerId] = [];
            }
            chats[ownerId].push({
                text: message,
                type: type,
                timestamp: new Date().toISOString()
            });
            // Mantener últimos 100 mensajes por propietario
            if (chats[ownerId].length > 100) {
                chats[ownerId] = chats[ownerId].slice(-100);
            }
            localStorage.setItem(this.OWNER_CHATS_KEY, JSON.stringify(chats));
        } catch (e) {
            console.warn('Error saving owner chat:', e);
        }
    }

    loadOwnerChat(ownerId) {
        try {
            const chats = JSON.parse(localStorage.getItem(this.OWNER_CHATS_KEY) || '{}');
            return chats[ownerId] || [];
        } catch (e) {
            return [];
        }
    }

    // ==========================================
    // MODO PROPIETARIO (Owner Mode)
    // ==========================================

    detectLocalPage() {
        // Detectar si estamos en página de detalle de local o servicio
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const pathname = window.location.pathname.toLowerCase();

        console.log('Detectando página:', pathname, 'slug:', slug);

        // Detectar página de local
        if (pathname.includes('local.html') && slug) {
            this.waitForData('LOCALES_DATA', () => {
                const local = LOCALES_DATA.find(l => l.slug === slug);
                if (local && local.owner) {
                    this.currentLocal = local;
                    this.currentOwner = local.owner;
                    this.providerType = 'local';
                    console.log('Local detectado:', local.name);
                    this.showOwnerBubble();
                }
            });
        }

        // Detectar página de servicio
        if (pathname.includes('servicio.html') && slug) {
            this.waitForData('SERVICIOS_DATA', () => {
                const servicio = SERVICIOS_DATA.find(s => s.slug === slug);
                if (servicio && servicio.owner) {
                    this.currentLocal = servicio; // Reutilizamos currentLocal para servicios
                    this.currentOwner = servicio.owner;
                    this.providerType = 'servicio';
                    console.log('Servicio detectado:', servicio.name);
                    this.showOwnerBubble();
                }
            });
        }
    }

    waitForData(dataName, callback, maxAttempts = 10) {
        let attempts = 0;
        const check = () => {
            if (typeof window[dataName] !== 'undefined') {
                callback();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 200);
            }
        };
        check();
    }

    showOwnerBubble() {
        // Crear burbuja de propietario si no existe
        if (document.getElementById('ownerBubble')) return;

        const bubble = document.createElement('div');
        bubble.id = 'ownerBubble';
        bubble.className = 'owner-bubble';
        bubble.innerHTML = `
            <div class="owner-bubble-avatar">${this.currentOwner.avatar}</div>
            <div class="owner-bubble-content">
                <div class="owner-bubble-name">${this.currentOwner.name}</div>
                <div class="owner-bubble-status">Disponible para chat</div>
            </div>
            <div class="owner-bubble-close" onclick="event.stopPropagation(); document.getElementById('ownerBubble').classList.add('hidden');">
                <i class="fas fa-times"></i>
            </div>
        `;

        bubble.addEventListener('click', (e) => {
            if (!e.target.closest('.owner-bubble-close')) {
                this.switchToOwnerMode();
            }
        });

        document.body.appendChild(bubble);

        // Mostrar después de 2 segundos
        setTimeout(() => {
            bubble.style.display = 'flex';
        }, 2000);
    }

    switchToOwnerMode() {
        this.mode = 'owner';
        this.chatbot.classList.add('owner-mode');

        // Ocultar burbuja
        const bubble = document.getElementById('ownerBubble');
        if (bubble) bubble.classList.add('hidden');

        // Actualizar header
        this.updateChatHeader();

        // Limpiar y cargar historial con propietario
        this.messagesContainer.innerHTML = '';
        const ownerHistory = this.loadOwnerChat(this.currentOwner.id);

        if (ownerHistory.length > 0) {
            ownerHistory.forEach(msg => {
                this.renderMessage({ type: msg.type, text: msg.text }, false);
            });
        } else {
            // Mensaje inicial del propietario
            this.addBotMessage(`¡Hola! 👋 Soy <strong>${this.currentOwner.name}</strong>, propietario de <strong>${this.currentLocal.name}</strong>.<br><br>
                ¿En qué puedo ayudarte? Puedo responder sobre:<br>
                • 📅 Disponibilidad de fechas<br>
                • 💰 Precios y paquetes<br>
                • 🎉 Detalles del local<br>
                • 📋 Reservaciones`);
        }

        // Ocultar quick actions en modo propietario
        if (this.quickActions) {
            this.quickActions.style.display = 'none';
        }

        this.open();
    }

    switchToAssistantMode() {
        this.mode = 'assistant';
        this.chatbot.classList.remove('owner-mode');

        // Restaurar header original
        this.restoreChatHeader();

        // Mostrar burbuja de nuevo
        const bubble = document.getElementById('ownerBubble');
        if (bubble) bubble.classList.remove('hidden');

        // Restaurar mensajes del asistente
        this.messagesContainer.innerHTML = '';
        this.messages.forEach(msg => this.renderMessage(msg, false));

        // Mostrar quick actions
        if (this.quickActions) {
            this.quickActions.style.display = 'flex';
        }
    }

    updateChatHeader() {
        const header = this.window.querySelector('.chatbot-header');
        if (!header) return;

        // Guardar header original
        if (!this.originalHeader) {
            this.originalHeader = header.innerHTML;
        }

        header.innerHTML = `
            <button class="chat-back-btn" onclick="window.eventBot.switchToAssistantMode()">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
            <div class="owner-avatar-small">${this.currentOwner.avatar}</div>
            <div class="chatbot-info">
                <strong>${this.currentOwner.name}</strong>
                <span>${this.currentLocal.name}</span>
            </div>
            <button class="chatbot-close" id="chatbotCloseOwner">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Re-bind close button
        document.getElementById('chatbotCloseOwner').addEventListener('click', () => this.close());
    }

    restoreChatHeader() {
        const header = this.window.querySelector('.chatbot-header');
        if (header && this.originalHeader) {
            header.innerHTML = this.originalHeader;
            // Re-bind close button
            this.closeBtn = document.getElementById('chatbotClose');
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }
        }
    }

    // ==========================================
    // FUNCIONES PRINCIPALES
    // ==========================================

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.window.style.display = 'flex';
        this.window.offsetHeight;
        this.window.classList.add('active');
        this.hideBadge();
        setTimeout(() => this.input.focus(), 300);

        if (window.analytics) {
            analytics.trackChatbotOpen();
        }
    }

    close() {
        this.isOpen = false;
        this.window.classList.add('closing');
        this.window.classList.remove('active');

        setTimeout(() => {
            this.window.style.display = 'none';
            this.window.classList.remove('closing');
        }, 300);
    }

    hideBadge() {
        const badge = this.trigger.querySelector('.chatbot-badge');
        if (badge) badge.style.display = 'none';
    }

    handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        this.addUserMessage(message);
        this.input.value = '';
        this.processMessage(message);
    }

    handleQuickAction(action) {
        const actionMap = {
            precios: '¿Cuáles son los precios?',
            disponibilidad: 'Quiero ver disponibilidad',
            paquetes: 'Muéstrame los paquetes',
            ayuda: 'Necesito ayuda',
            organizar_evento: 'Quiero organizar un evento',
            explorar: 'Solo quiero explorar opciones'
        };

        const message = actionMap[action] || action;
        this.addUserMessage(message);
        this.processMessage(message.toLowerCase());

        if (this.quickActions) {
            this.quickActions.style.display = 'none';
        }
    }

    addUserMessage(text) {
        const message = { type: 'user', text, timestamp: new Date() };

        if (this.mode === 'owner' && this.currentOwner) {
            this.saveOwnerChat(this.currentOwner.id, text, 'user');
        } else {
            this.messages.push(message);
            this.saveChatHistory();
        }

        this.renderMessage(message);
    }

    addBotMessage(text, options = {}) {
        const message = { type: 'bot', text, options, timestamp: new Date() };

        if (this.mode === 'owner' && this.currentOwner) {
            this.saveOwnerChat(this.currentOwner.id, text, 'bot');
        } else {
            this.messages.push(message);
            this.saveChatHistory();
        }

        this.renderMessage(message);
    }

    renderMessage(message, animate = true) {
        const div = document.createElement('div');
        div.className = `chat-message ${message.type}`;
        if (!animate) div.style.animation = 'none';
        div.innerHTML = message.text;

        // Añadir botones si existen
        if (message.options && message.options.buttons) {
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'chat-buttons';

            message.options.buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn.text;
                button.addEventListener('click', () => {
                    buttonsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
                    this.addUserMessage(btn.text);
                    this.processMessage(btn.value || btn.text);
                });
                buttonsDiv.appendChild(button);
            });

            div.appendChild(buttonsDiv);
        }

        // Añadir links de locales si existen
        if (message.options && message.options.localeLinks) {
            const linksDiv = document.createElement('div');
            linksDiv.style.marginTop = '12px';
            linksDiv.style.display = 'flex';
            linksDiv.style.flexDirection = 'column';
            linksDiv.style.gap = '8px';

            message.options.localeLinks.forEach(locale => {
                const link = document.createElement('a');
                link.className = 'chat-link';
                link.href = this.getLocalePath() + `local.html?slug=${locale.slug}`;
                link.innerHTML = `<i class="fas fa-external-link-alt"></i> Ver ${locale.name}`;
                linksDiv.appendChild(link);
            });

            div.appendChild(linksDiv);
        }

        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
    }

    getLocalePath() {
        // Detectar si estamos en raíz o en subcarpeta
        if (window.location.pathname.includes('/pages/')) {
            return '';
        }
        return 'pages/';
    }

    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    processMessage(message) {
        this.showTyping();
        const normalizedMsg = message.toLowerCase();
        const delay = 600 + Math.random() * 600;

        setTimeout(() => {
            this.hideTyping();

            // Si estamos en modo propietario, usar respuestas de propietario
            if (this.mode === 'owner') {
                const response = this.generateOwnerResponse(normalizedMsg);
                this.addBotMessage(response.text, response.options);
                return;
            }

            // Flujo del asistente
            if (this.context.stage !== 'free_chat') {
                const wizardResponse = this.handleWizardFlow(normalizedMsg);
                if (wizardResponse) {
                    this.addBotMessage(wizardResponse.text, wizardResponse.options);
                    this.logInteraction(message, wizardResponse.text);
                    return;
                }
            }

            const response = this.generateResponse(normalizedMsg);
            this.addBotMessage(response.text, response.options);
            this.logInteraction(message, response.text);

        }, delay);
    }

    // ==========================================
    // RESPUESTAS DEL PROPIETARIO
    // ==========================================

    generateOwnerResponse(message) {
        const provider = this.currentLocal;
        const owner = this.currentOwner;
        const isService = this.providerType === 'servicio';

        // Disponibilidad
        if (this.matchKeywords(message, ['disponib', 'fecha', 'cuando', 'libre', 'reserv'])) {
            if (isService) {
                const days = provider.availability?.operatingDays?.join(', ') || 'Todos los días';
                return {
                    text: `📅 <strong>Disponibilidad de ${provider.name}:</strong><br><br>
                        • Días de atención: ${days}<br>
                        • Reservar con: ${provider.availability?.advanceBooking || '5 días'} de anticipación<br><br>
                        ¿Te gustaría solicitar una cotización?`,
                    options: {
                        buttons: [
                            { text: '📝 Solicitar cotización', value: 'quiero cotización' },
                            { text: '📦 Ver paquetes', value: 'paquetes disponibles' }
                        ]
                    }
                };
            } else {
                const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                let availText = dayKeys.map((day, i) => {
                    const avail = provider.availability[day];
                    return avail.available ? `• ${days[i]}: ${avail.hours}` : `• ${days[i]}: Cerrado`;
                }).join('<br>');

                return {
                    text: `📅 <strong>Disponibilidad de ${provider.name}:</strong><br><br>${availText}<br><br>
                        ¿Te gustaría verificar una fecha específica o hacer una reserva?`,
                    options: {
                        buttons: [
                            { text: '📝 Solicitar reserva', value: 'quiero reservar' },
                            { text: '👁️ Agendar visita', value: 'quiero visitar' }
                        ]
                    }
                };
            }
        }

        // Precios
        if (this.matchKeywords(message, ['precio', 'costo', 'cuanto', 'cuánto', 'tarifa', 'cobr'])) {
            if (isService) {
                const packages = provider.pricing?.packages || [];
                const packagesText = packages.map(p =>
                    `• <strong>${p.name}</strong>: S/ ${p.price}${p.hours ? ` (${p.hours}h)` : ''}<br>  ${p.description}`
                ).join('<br><br>');

                return {
                    text: `💰 <strong>Precios de ${provider.name}:</strong><br><br>
                        ${packagesText}<br><br>
                        ¿Te gustaría más información sobre algún paquete?`,
                    options: {
                        buttons: [
                            { text: '📋 Cotización personalizada', value: 'quiero cotización' }
                        ]
                    }
                };
            } else {
                return {
                    text: `💰 <strong>Precios de ${provider.name}:</strong><br><br>
                        • Alquiler base: <strong>S/ ${provider.price.base.toLocaleString()}</strong><br>
                        • Hora adicional: S/ ${provider.price.perHour}<br>
                        • Depósito: S/ ${provider.price.deposit}<br><br>
                        El precio incluye: ${provider.amenities.slice(0, 3).map(a => a.name).join(', ')}.<br><br>
                        ¿Deseas más información o una cotización personalizada?`,
                    options: {
                        buttons: [
                            { text: '📋 Cotización', value: 'quiero cotización' },
                            { text: '📦 Ver paquetes', value: 'paquetes disponibles' }
                        ]
                    }
                };
            }
        }

        // Capacidad (solo para locales)
        if (!isService && this.matchKeywords(message, ['capacidad', 'personas', 'invitados', 'cupo', 'aforo'])) {
            return {
                text: `👥 <strong>Capacidad de ${provider.name}:</strong><br><br>
                    • Mínimo: ${provider.capacity.min} personas<br>
                    • Máximo: ${provider.capacity.max} personas<br>
                    • Sentados: ${provider.capacity.seated} personas<br>
                    • De pie: ${provider.capacity.standing} personas<br><br>
                    ¿Cuántos invitados tendrás en tu evento?`,
                options: {}
            };
        }

        // Servicios/Amenidades/Características
        if (this.matchKeywords(message, ['servicio', 'incluye', 'tiene', 'ofrece', 'amenidad', 'característica'])) {
            if (isService) {
                const featuresList = provider.features?.map(f => `• ${f}`).join('<br>') || 'Consultar';
                return {
                    text: `✨ <strong>Características de ${provider.name}:</strong><br><br>${featuresList}<br><br>
                        ¿Necesitas más información?`,
                    options: {}
                };
            } else {
                const amenitiesList = provider.amenities.map(a => `• ${a.name}: ${a.description}`).join('<br>');
                return {
                    text: `✨ <strong>Servicios incluidos en ${provider.name}:</strong><br><br>${amenitiesList}<br><br>
                        ¿Necesitas algún servicio adicional?`,
                    options: {}
                };
            }
        }

        // Paquetes (para servicios)
        if (isService && this.matchKeywords(message, ['paquete', 'combo', 'opcion'])) {
            const packages = provider.pricing?.packages || [];
            const packagesText = packages.map(p =>
                `<strong>${p.name}</strong> - S/ ${p.price}<br>${p.description}`
            ).join('<br><br>');

            return {
                text: `📦 <strong>Paquetes de ${provider.name}:</strong><br><br>${packagesText}`,
                options: {
                    buttons: [
                        { text: '📋 Solicitar cotización', value: 'quiero cotización' }
                    ]
                }
            };
        }

        // Reserva/Cotización
        if (this.matchKeywords(message, ['reserv', 'apartar', 'separar', 'cotiza'])) {
            const actionText = isService ? 'contratar nuestro servicio' : 'reservar';
            return {
                text: `📝 <strong>¡Excelente elección!</strong><br><br>
                    Para ${actionText} ${provider.name}, necesito algunos datos:<br><br>
                    1. ¿Fecha de tu evento?<br>
                    2. ¿Tipo de evento?<br>
                    3. ¿Número de invitados?<br><br>
                    Puedes usar el botón en la página para completar el formulario.`,
                options: {
                    buttons: [
                        { text: '📅 Completar solicitud', value: 'formulario_reserva' }
                    ]
                }
            };
        }

        // Visita (solo locales)
        if (!isService && this.matchKeywords(message, ['visit', 'conocer', 'ver el local', 'ir a ver'])) {
            return {
                text: `👁️ <strong>¡Claro que puedes visitar ${provider.name}!</strong><br><br>
                    Estamos disponibles para visitas de ${provider.availability.saturday?.hours || '10:00-18:00'} los fines de semana.<br><br>
                    Usa el botón "Solicitar Visita" en la página o dime qué día te gustaría venir.`,
                options: {}
            };
        }

        // Políticas (solo locales)
        if (!isService && this.matchKeywords(message, ['política', 'regla', 'cancelación', 'pago'])) {
            const rulesList = provider.policies.rules.map(r => `• ${r}`).join('<br>');
            return {
                text: `📋 <strong>Políticas de ${provider.name}:</strong><br><br>
                    <strong>Cancelación:</strong> ${provider.policies.cancellation}<br><br>
                    <strong>Pago:</strong> ${provider.policies.deposit}<br><br>
                    <strong>Reglas:</strong><br>${rulesList}`,
                options: {}
            };
        }

        // Saludos
        if (this.matchKeywords(message, ['hola', 'buenos', 'buenas', 'hi'])) {
            const typeText = isService ? 'servicio' : 'local';
            return {
                text: `¡Hola! 👋 Soy ${owner.name}.<br><br>
                    Gracias por tu interés en <strong>${provider.name}</strong>. Estoy aquí para ayudarte con cualquier consulta sobre nuestro ${typeText}.<br><br>
                    ¿Qué te gustaría saber?`,
                options: {
                    buttons: [
                        { text: '💰 Precios', value: 'precios' },
                        { text: '📅 Disponibilidad', value: 'disponibilidad' },
                        { text: isService ? '📦 Paquetes' : '✨ Servicios', value: isService ? 'paquetes' : 'servicios incluidos' }
                    ]
                }
            };
        }

        // Formulario reserva (abrir modal)
        if (message.includes('formulario_reserva')) {
            if (typeof openBookingModal === 'function') {
                setTimeout(() => openBookingModal(), 300);
            } else if (typeof openContactModal === 'function') {
                setTimeout(() => openContactModal(), 300);
            }
            return {
                text: `Abriendo el formulario de solicitud... 📝`,
                options: {}
            };
        }

        // Gracias
        if (this.matchKeywords(message, ['gracias', 'thanks', 'genial'])) {
            return {
                text: `¡Con gusto! 😊 Cualquier otra consulta sobre ${provider.name}, aquí estoy.<br><br>
                    <strong>Tiempo de respuesta:</strong> ${owner.responseTime}<br>
                    <strong>Tasa de respuesta:</strong> ${owner.responseRate}%`,
                options: {}
            };
        }

        // Respuesta por defecto
        const typeText = isService ? 'servicio' : 'local';
        return {
            text: `Gracias por tu mensaje. Te responderé lo antes posible.<br><br>
                Mi tiempo de respuesta habitual es <strong>${owner.responseTime}</strong>.<br><br>
                Mientras tanto, puedes revisar toda la información del ${typeText} en esta página.`,
            options: {
                buttons: [
                    { text: '💰 Ver precios', value: 'precios' },
                    { text: '📅 Ver disponibilidad', value: 'disponibilidad' }
                ]
            }
        };
    }

    // ==========================================
    // WIZARD FLOW (Flujo guiado)
    // ==========================================

    handleWizardFlow(message) {
        if (this.matchKeywords(message, ['organizar', 'planificar', 'quiero organizar', 'tengo un evento'])) {
            this.context.stage = 'event_type';
            return this.askEventType();
        }

        if (this.matchKeywords(message, ['explorar', 'solo explorar', 'ver opciones'])) {
            this.context.stage = 'free_chat';
            return {
                text: `¡Perfecto! 🔍 Explora libremente. Puedo ayudarte con:<br><br>
                    • 🏛️ <strong>Locales</strong> - "muéstrame locales"<br>
                    • 💰 <strong>Precios</strong> - "¿cuánto cuesta?"<br>
                    • 📦 <strong>Paquetes</strong> - "ver paquetes"<br>
                    • 🎉 <strong>Servicios</strong> - "qué servicios tienen"<br><br>
                    ¿Qué te gustaría ver primero?`,
                options: {
                    buttons: [
                        { text: '🏛️ Ver locales', value: 'ver locales' },
                        { text: '📦 Ver paquetes', value: 'ver paquetes' },
                        { text: '💰 Ver precios', value: 'precios' }
                    ]
                }
            };
        }

        switch (this.context.stage) {
            case 'event_type':
                return this.handleEventTypeResponse(message);
            case 'guests':
                return this.handleGuestsResponse(message);
            case 'budget':
                return this.handleBudgetResponse(message);
            case 'recommendations':
                return this.showRecommendations();
            default:
                return null;
        }
    }

    askEventType() {
        return {
            text: `¡Genial! 🎉 Vamos a encontrar el lugar perfecto para tu evento.<br><br>
                <strong>Paso 1 de 3:</strong> ¿Qué tipo de evento estás organizando?`,
            options: {
                buttons: [
                    { text: '💒 Matrimonio', value: 'matrimonio' },
                    { text: '👑 XV Años', value: 'quinceanos' },
                    { text: '🎂 Cumpleaños', value: 'cumpleanos' },
                    { text: '🏢 Corporativo', value: 'corporativo' }
                ]
            }
        };
    }

    handleEventTypeResponse(message) {
        const eventTypes = {
            'matrimonio': { type: 'matrimonio', icon: '💒', name: 'Matrimonio' },
            'boda': { type: 'matrimonio', icon: '💒', name: 'Matrimonio' },
            'xv': { type: 'quinceanos', icon: '👑', name: 'XV Años' },
            'quince': { type: 'quinceanos', icon: '👑', name: 'XV Años' },
            'quinceañ': { type: 'quinceanos', icon: '👑', name: 'XV Años' },
            'cumple': { type: 'cumpleanos', icon: '🎂', name: 'Cumpleaños' },
            'corporativo': { type: 'corporativo', icon: '🏢', name: 'Evento Corporativo' },
            'empresa': { type: 'corporativo', icon: '🏢', name: 'Evento Corporativo' },
            'bautizo': { type: 'bautizo', icon: '👶', name: 'Bautizo' },
            'graduacion': { type: 'graduacion', icon: '🎓', name: 'Graduación' }
        };

        for (const [keyword, eventInfo] of Object.entries(eventTypes)) {
            if (message.includes(keyword)) {
                this.context.eventType = eventInfo;
                this.context.stage = 'guests';

                return {
                    text: `${eventInfo.icon} <strong>${eventInfo.name}</strong> - ¡Excelente elección!<br><br>
                        <strong>Paso 2 de 3:</strong> ¿Cuántos invitados aproximadamente tendrás?`,
                    options: {
                        buttons: [
                            { text: '👥 Menos de 50', value: 'menos de 50' },
                            { text: '👥 50-100', value: '50 a 100' },
                            { text: '👥 100-200', value: '100 a 200' },
                            { text: '👥 Más de 200', value: 'mas de 200' }
                        ]
                    }
                };
            }
        }

        return {
            text: `No estoy seguro del tipo de evento. ¿Podrías elegir una opción?`,
            options: {
                buttons: [
                    { text: '💒 Matrimonio', value: 'matrimonio' },
                    { text: '👑 XV Años', value: 'quinceanos' },
                    { text: '🎂 Cumpleaños', value: 'cumpleanos' },
                    { text: '🏢 Corporativo', value: 'corporativo' }
                ]
            }
        };
    }

    handleGuestsResponse(message) {
        let guests = null;
        let guestsText = '';

        if (message.includes('menos de 50') || message.match(/[1-4]\d(?!\d)/)) {
            guests = { min: 1, max: 50 };
            guestsText = 'menos de 50 personas';
        } else if (message.includes('50') && (message.includes('100') || message.includes('a 100'))) {
            guests = { min: 50, max: 100 };
            guestsText = '50-100 personas';
        } else if (message.includes('100') && (message.includes('200') || message.includes('a 200'))) {
            guests = { min: 100, max: 200 };
            guestsText = '100-200 personas';
        } else if (message.includes('mas de 200') || message.includes('más de 200') || message.match(/[2-9]\d{2,}/)) {
            guests = { min: 200, max: 500 };
            guestsText = 'más de 200 personas';
        } else {
            const numMatch = message.match(/(\d+)/);
            if (numMatch) {
                const num = parseInt(numMatch[1]);
                if (num <= 50) guests = { min: 1, max: 50, exact: num };
                else if (num <= 100) guests = { min: 50, max: 100, exact: num };
                else if (num <= 200) guests = { min: 100, max: 200, exact: num };
                else guests = { min: 200, max: 500, exact: num };
                guestsText = `${num} personas`;
            }
        }

        if (guests) {
            this.context.guests = guests;
            this.context.stage = 'budget';

            return {
                text: `👥 <strong>${guestsText}</strong> - ¡Anotado!<br><br>
                    <strong>Paso 3 de 3:</strong> ¿Cuál es tu presupuesto aproximado para el local?`,
                options: {
                    buttons: [
                        { text: '💵 Hasta S/ 1,000', value: 'hasta 1000' },
                        { text: '💵 S/ 1,000 - 2,000', value: '1000 a 2000' },
                        { text: '💵 S/ 2,000 - 3,500', value: '2000 a 3500' },
                        { text: '💵 Sin límite', value: 'sin limite' }
                    ]
                }
            };
        }

        return {
            text: `¿Cuántos invitados tendrás? Elige una opción:`,
            options: {
                buttons: [
                    { text: '👥 Menos de 50', value: 'menos de 50' },
                    { text: '👥 50-100', value: '50 a 100' },
                    { text: '👥 100-200', value: '100 a 200' },
                    { text: '👥 Más de 200', value: 'mas de 200' }
                ]
            }
        };
    }

    handleBudgetResponse(message) {
        let budget = null;

        if (message.includes('hasta 1000') || message.includes('económico')) {
            budget = { min: 0, max: 1000, level: 'economico' };
        } else if (message.includes('1000') && message.includes('2000')) {
            budget = { min: 1000, max: 2000, level: 'estandar' };
        } else if (message.includes('2000') && message.includes('3500')) {
            budget = { min: 2000, max: 3500, level: 'premium' };
        } else if (message.includes('sin limite') || message.includes('no importa')) {
            budget = { min: 0, max: 99999, level: 'premium' };
        }

        if (budget) {
            this.context.budget = budget;
            this.context.stage = 'recommendations';
            return this.showRecommendations();
        }

        return {
            text: `¿Cuál es tu presupuesto para el local?`,
            options: {
                buttons: [
                    { text: '💵 Hasta S/ 1,000', value: 'hasta 1000' },
                    { text: '💵 S/ 1,000 - 2,000', value: '1000 a 2000' },
                    { text: '💵 S/ 2,000+', value: '2000 a 3500' },
                    { text: '💵 Sin límite', value: 'sin limite' }
                ]
            }
        };
    }

    showRecommendations() {
        const { eventType, guests, budget } = this.context;
        this.context.stage = 'free_chat';

        // Obtener locales que coincidan
        const recommendations = this.getMatchingLocales();

        let recText = '';
        let localeLinks = [];

        if (recommendations.length > 0) {
            recText = recommendations.map((r, i) =>
                `${i + 1}. <strong>${r.name}</strong> - S/ ${r.price.toLocaleString()} (Cap: ${r.capacity})`
            ).join('<br>');

            localeLinks = recommendations.map(r => ({
                name: r.name,
                slug: r.slug
            }));
        } else {
            recText = '• Salón Los Jardines Premium - S/ 1,200<br>• Quinta El Paraíso - S/ 900<br>• La Mansión - S/ 1,800';
            localeLinks = [
                { name: 'Salón Los Jardines Premium', slug: 'salon-los-jardines-premium' },
                { name: 'Quinta El Paraíso', slug: 'quinta-el-paraiso' },
                { name: 'La Mansión', slug: 'centro-eventos-la-mansion' }
            ];
        }

        return {
            text: `🎯 <strong>¡Tengo recomendaciones para ti!</strong><br><br>
                📋 <strong>Tu evento:</strong><br>
                • Tipo: ${eventType?.name || 'Evento'}<br>
                • Invitados: ${guests?.exact || `${guests?.min}-${guests?.max}`} personas<br>
                • Presupuesto: ${budget?.max === 99999 ? 'Sin límite' : 'Hasta S/ ' + budget?.max?.toLocaleString()}<br><br>
                🏛️ <strong>Locales recomendados:</strong><br>
                ${recText}`,
            options: {
                localeLinks: localeLinks,
                buttons: [
                    { text: '📦 Ver paquetes', value: 'paquetes para mi evento' },
                    { text: '🔄 Buscar de nuevo', value: 'organizar evento' }
                ]
            }
        };
    }

    getMatchingLocales() {
        if (typeof LOCALES_DATA === 'undefined') return [];

        return LOCALES_DATA
            .filter(local => {
                // Excluir el local de ejemplo (id: 0)
                if (local.id === 0) return false;

                const matchesCapacity = !this.context.guests ||
                    (local.capacity.max >= this.context.guests.min);
                const matchesBudget = !this.context.budget ||
                    (local.price.base <= this.context.budget.max);
                const matchesEvent = !this.context.eventType ||
                    local.eventTypes.includes(this.context.eventType.type);
                return matchesCapacity && matchesBudget && matchesEvent;
            })
            .slice(0, 3)
            .map(local => ({
                name: local.name,
                slug: local.slug,
                price: local.price.base,
                capacity: local.capacity.max
            }));
    }

    // ==========================================
    // RESPUESTAS GENERALES
    // ==========================================

    generateResponse(message) {
        // Precios
        if (this.matchKeywords(message, ['precio', 'costo', 'cuanto', 'cuánto', 'tarifa', 'cobran'])) {
            return {
                text: `<strong>💰 Rangos de Precios:</strong><br><br>
                    <strong>🏛️ Locales:</strong><br>
                    • Económicos: S/ 600 - S/ 1,000<br>
                    • Estándar: S/ 1,000 - S/ 1,800<br>
                    • Premium: S/ 1,800 - S/ 2,500+<br><br>
                    <strong>🎉 Servicios:</strong><br>
                    • Catering: desde S/ 35/persona<br>
                    • DJ: desde S/ 400<br>
                    • Foto/Video: desde S/ 350<br><br>
                    ¿Quieres que te ayude a encontrar opciones en tu presupuesto?`,
                options: {
                    buttons: [
                        { text: '💵 Buscar por presupuesto', value: 'organizar evento' },
                        { text: '📦 Ver paquetes', value: 'paquetes' }
                    ]
                }
            };
        }

        // Ver locales - CON LINKS
        if (this.matchKeywords(message, ['ver locales', 'mostrar locales', 'locales disponibles'])) {
            const locales = typeof LOCALES_DATA !== 'undefined'
                ? LOCALES_DATA.filter(l => l.id !== 0).slice(0, 3)
                : [];

            const localeLinks = locales.map(l => ({
                name: l.name,
                slug: l.slug
            }));

            return {
                text: `<strong>🏛️ Nuestros Locales Destacados:</strong><br><br>
                    ${locales.map(l => `⭐ <strong>${l.name}</strong><br>Capacidad: ${l.capacity.max} | Desde S/ ${l.price.base.toLocaleString()}`).join('<br><br>')}`,
                options: {
                    localeLinks: localeLinks,
                    buttons: [
                        { text: '🔍 Filtrar por capacidad', value: 'capacidad' },
                        { text: '💰 Filtrar por precio', value: 'precio' }
                    ]
                }
            };
        }

        // Paquetes
        if (this.matchKeywords(message, ['paquete', 'combo', 'todo incluido', 'bundle'])) {
            return {
                text: `<strong>📦 Paquetes Todo-en-Uno:</strong><br><br>
                    <strong>🎉 Paquete Esencial</strong> - S/ 1,500<br>
                    Local + Mobiliario + Sonido<br><br>
                    <strong>⭐ Paquete Completo</strong> - S/ 3,800<br>
                    Local + Catering + DJ + Foto<br><br>
                    <strong>👑 Paquete Premium</strong> - S/ 6,500<br>
                    Todo incluido + Decoración + Video<br><br>
                    <strong>Ahorra hasta 15%</strong> vs contratar por separado`,
                options: {
                    buttons: [
                        { text: '📋 Ver detalles', value: 'detalles paquetes' },
                        { text: '🎨 Armar mi paquete', value: 'personalizar paquete' }
                    ]
                }
            };
        }

        // Capacidad
        if (this.matchKeywords(message, ['capacidad', 'personas', 'invitados', 'aforo'])) {
            return {
                text: `<strong>👥 Locales por Capacidad:</strong><br><br>
                    <strong>Íntimos (30-80):</strong> Ideales para cumpleaños<br>
                    <strong>Medianos (80-150):</strong> Quinceaños, bautizos<br>
                    <strong>Grandes (150-250):</strong> Matrimonios<br>
                    <strong>Extra grandes (250+):</strong> Eventos corporativos<br><br>
                    ¿Para cuántas personas es tu evento?`,
                options: {
                    buttons: [
                        { text: '👥 Menos de 100', value: 'locales para 100 personas' },
                        { text: '👥 100-200', value: 'locales para 200 personas' },
                        { text: '👥 Más de 200', value: 'locales grandes' }
                    ]
                }
            };
        }

        // Matrimonios - CON LINKS
        if (this.matchKeywords(message, ['matrimonio', 'boda', 'casamiento'])) {
            this.context.eventType = { type: 'matrimonio', icon: '💒', name: 'Matrimonio' };

            const weddingLocales = typeof LOCALES_DATA !== 'undefined'
                ? LOCALES_DATA.filter(l => l.id !== 0 && l.eventTypes.includes('matrimonio')).slice(0, 3)
                : [];

            return {
                text: `<strong>💒 Locales para Matrimonios:</strong><br><br>
                    Tenemos los mejores espacios para tu gran día:<br><br>
                    ${weddingLocales.map(l => `🏆 <strong>${l.name}</strong> - S/ ${l.price.base.toLocaleString()}`).join('<br>')}`,
                options: {
                    localeLinks: weddingLocales.map(l => ({ name: l.name, slug: l.slug })),
                    buttons: [
                        { text: '📅 Verificar disponibilidad', value: 'disponibilidad matrimonio' },
                        { text: '📦 Paquetes de boda', value: 'paquete matrimonio' }
                    ]
                }
            };
        }

        // Servicios
        if (this.matchKeywords(message, ['servicio', 'catering', 'dj', 'foto', 'decoración'])) {
            return {
                text: `<strong>🎉 Servicios Disponibles:</strong><br><br>
                    🍽️ <strong>Catering</strong> - Desde S/ 35/persona<br>
                    🎵 <strong>DJ Profesional</strong> - Desde S/ 400<br>
                    📸 <strong>Fotografía</strong> - Desde S/ 350<br>
                    🎥 <strong>Video</strong> - Desde S/ 500<br>
                    🎈 <strong>Decoración</strong> - Desde S/ 450<br>
                    🎂 <strong>Tortas</strong> - Desde S/ 150<br><br>
                    Todos verificados y con garantía ✓`,
                options: {
                    buttons: [
                        { text: '📋 Ver servicios', value: 'ver todos servicios' },
                        { text: '📦 Armar paquete', value: 'armar paquete' }
                    ]
                }
            };
        }

        // Cotización
        if (this.matchKeywords(message, ['cotizar', 'cotización', 'presupuesto'])) {
            return {
                text: `<strong>📋 Solicitar Cotización:</strong><br><br>
                    Para darte una cotización personalizada, cuéntame:<br><br>
                    1️⃣ ¿Qué tipo de evento es?<br>
                    2️⃣ ¿Cuántos invitados?<br>
                    3️⃣ ¿Fecha aproximada?<br><br>
                    ¡Te prepararemos una propuesta a medida!`,
                options: {
                    buttons: [
                        { text: '📝 Empezar cotización', value: 'organizar evento' }
                    ]
                }
            };
        }

        // Pagos
        if (this.matchKeywords(message, ['pago', 'pagar', 'yape', 'plin', 'tarjeta'])) {
            return {
                text: `<strong>💳 Métodos de Pago:</strong><br><br>
                    • 📱 <strong>Yape / Plin</strong> - Instantáneo<br>
                    • 💳 <strong>Tarjetas</strong> - Visa, Mastercard<br>
                    • 🏦 <strong>Transferencia</strong> - Todos los bancos<br><br>
                    <strong>Proceso:</strong><br>
                    ✓ 50% al reservar<br>
                    ✓ 50% una semana antes<br>
                    ✓ Garantía de devolución`,
                options: {}
            };
        }

        // Ayuda
        if (this.matchKeywords(message, ['ayuda', 'contacto', 'asesor', 'humano'])) {
            return {
                text: `<strong>🤝 Estoy aquí para ayudarte</strong><br><br>
                    Puedo asistirte con:<br>
                    • Buscar locales ideales<br>
                    • Armar paquetes personalizados<br>
                    • Cotizar tu evento<br>
                    • Resolver cualquier duda<br><br>
                    Todo se gestiona por esta plataforma para tu seguridad.`,
                options: {
                    buttons: [
                        { text: '🎊 Planificar evento', value: 'organizar evento' },
                        { text: '📋 Cotizar', value: 'cotizar' }
                    ]
                }
            };
        }

        // Saludos
        if (this.matchKeywords(message, ['hola', 'buenos', 'buenas', 'hi', 'hey'])) {
            return {
                text: this.getGreeting(),
                options: {
                    buttons: [
                        { text: '🎊 Organizar evento', value: 'organizar_evento' },
                        { text: '🔍 Solo explorar', value: 'explorar' }
                    ]
                }
            };
        }

        // Gracias
        if (this.matchKeywords(message, ['gracias', 'thanks', 'genial', 'perfecto'])) {
            return {
                text: `¡Con gusto! 😊<br><br>¿Hay algo más en lo que pueda ayudarte?`,
                options: {
                    buttons: [
                        { text: '🏛️ Ver locales', value: 'ver locales' },
                        { text: '📦 Ver paquetes', value: 'paquetes' },
                        { text: '👋 Eso es todo', value: 'adios' }
                    ]
                }
            };
        }

        // Despedida
        if (this.matchKeywords(message, ['adios', 'chao', 'bye', 'eso es todo'])) {
            return {
                text: `¡Fue un gusto ayudarte! 🎉<br><br>
                    Recuerda que estoy aquí <strong>24/7</strong>.<br>
                    ¡Éxito con tu evento! 🎊`,
                options: {}
            };
        }

        // Respuesta por defecto
        return {
            text: `Entiendo. ¿En qué puedo ayudarte?<br><br>
                • 🏛️ <strong>Buscar locales</strong><br>
                • 📦 <strong>Ver paquetes</strong><br>
                • 💰 <strong>Consultar precios</strong><br>
                • 🎊 <strong>Planificar tu evento</strong>`,
            options: {
                buttons: [
                    { text: '🎊 Planificar evento', value: 'organizar evento' },
                    { text: '🏛️ Ver locales', value: 'ver locales' },
                    { text: '📦 Ver paquetes', value: 'paquetes' }
                ]
            }
        };
    }

    matchKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Hola';

        if (hour >= 5 && hour < 12) greeting = '¡Buenos días';
        else if (hour >= 12 && hour < 19) greeting = '¡Buenas tardes';
        else greeting = '¡Buenas noches';

        return `${greeting}! 👋<br><br>
            Soy <strong>Celé</strong>, tu asistente festivo 🎉<br><br>
            Te ayudo a encontrar el local perfecto para tu evento en Sullana.<br><br>
            ¿Listo para celebrar?`;
    }

    logInteraction(query, response) {
        const category = this.categorizeQuery(query.toLowerCase());

        if (typeof sendToGoogleSheets === 'function') {
            sendToGoogleSheets('Consultas', {
                id: 'CHT-' + Date.now(),
                consulta: query,
                respuesta: response.substring(0, 200).replace(/<[^>]*>/g, ''),
                categoria: category,
                contexto: JSON.stringify(this.context),
                fecha: new Date().toLocaleDateString('es-PE'),
                hora: new Date().toLocaleTimeString('es-PE'),
                timestamp: new Date().toISOString()
            });
        }

        if (window.analytics) {
            analytics.trackChatbotMessage(category);
        }
    }

    categorizeQuery(message) {
        if (this.matchKeywords(message, ['precio', 'costo', 'cuanto'])) return 'precios';
        if (this.matchKeywords(message, ['capacidad', 'personas', 'invitados'])) return 'capacidad';
        if (this.matchKeywords(message, ['disponib', 'fecha', 'reserva'])) return 'disponibilidad';
        if (this.matchKeywords(message, ['paquete', 'combo'])) return 'paquetes';
        if (this.matchKeywords(message, ['matrimonio', 'boda'])) return 'matrimonio';
        if (this.matchKeywords(message, ['cumpleaño', 'quinceañ'])) return 'cumpleanos';
        if (this.matchKeywords(message, ['corporativo', 'empresa'])) return 'corporativo';
        if (this.matchKeywords(message, ['servicio', 'catering', 'dj'])) return 'servicios';
        if (this.matchKeywords(message, ['ayuda', 'contacto'])) return 'ayuda';
        return 'general';
    }

    // Método público para resetear el wizard
    resetWizard() {
        this.context = {
            eventType: null,
            date: null,
            guests: null,
            budget: null,
            stage: 'greeting',
            userName: null,
            preferences: [],
            searchHistory: []
        };
        this.currentStep = 0;
    }

    // Método para limpiar historial
    clearHistory() {
        this.messages = [];
        localStorage.removeItem(this.STORAGE_KEY);
        this.messagesContainer.innerHTML = '';
        this.addBotMessage(this.getGreeting(), {
            buttons: [
                { text: '🎊 Organizar evento', value: 'organizar_evento' },
                { text: '🔍 Solo explorar', value: 'explorar' }
            ]
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.eventBot = new EventBot();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBot;
}
