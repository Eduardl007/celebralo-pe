/* ========================================
   CELÉBRALO PE - Chatbot "Celé" v4.0
   Tu asesor inteligente de eventos
   + IA Asesora para completar ideas
   + Chat con propietarios
   + Persistencia de conversaciones
   + Recomendaciones personalizadas
   ======================================== */

class EventBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.mode = 'assistant'; // 'assistant', 'owner' o 'advisor'
        this.currentOwner = null;
        this.currentLocal = null;

        // Contexto mejorado para asesoría inteligente
        this.context = {
            eventType: null,
            date: null,
            guests: null,
            budget: null,
            stage: 'greeting',
            userName: null,
            preferences: [],
            searchHistory: [],
            // Nuevo: contexto de asesoría
            eventIdea: null,
            eventStyle: null,
            requiredServices: [],
            suggestedLocales: [],
            suggestedServices: []
        };

        // Configuración del wizard
        this.wizardSteps = ['event_type', 'guests', 'budget', 'recommendations'];
        this.currentStep = 0;

        // Palabras clave para detectar ideas de eventos
        this.eventKeywords = {
            matrimonio: ['boda', 'matrimonio', 'casamiento', 'novia', 'novio', 'altar', 'anillos'],
            quinceanos: ['quinceaños', 'quince', 'quinceañera', '15 años', 'vals'],
            cumpleanos: ['cumpleaños', 'cumple', 'fiesta de'],
            corporativo: ['empresa', 'corporativo', 'conferencia', 'reunión', 'seminario', 'capacitación'],
            bautizo: ['bautizo', 'bautismo', 'primera comunión', 'comunion'],
            graduacion: ['graduación', 'grado', 'promoción', 'egresado'],
            'baby-shower': ['baby shower', 'baby-shower', 'bebé', 'embarazo'],
            aniversario: ['aniversario', 'bodas de oro', 'bodas de plata', 'años casados']
        };

        // Estilos de eventos
        this.eventStyles = {
            elegante: ['elegante', 'formal', 'sofisticado', 'lujoso', 'glamour', 'clásico'],
            rustico: ['rústico', 'campestre', 'bohemio', 'natural', 'vintage', 'campo'],
            moderno: ['moderno', 'minimalista', 'contemporáneo', 'urbano', 'trendy'],
            tematico: ['temático', 'hawaiano', 'tropical', 'disco', 'años 80', 'mexicano'],
            infantil: ['infantil', 'niños', 'animación', 'payasos', 'princesas', 'superhéroes']
        };

        // Categorías de locales disponibles
        this.localCategories = {
            salon: { name: 'Salón de eventos', icon: '🏛️' },
            quinta: { name: 'Quinta/Hacienda', icon: '🏡' },
            club: { name: 'Club/Centro recreacional', icon: '🎪' },
            terraza: { name: 'Terraza', icon: '🌆' },
            'centro-eventos': { name: 'Centro de eventos', icon: '🎊' }
        };

        // Categorías de servicios disponibles
        this.serviceCategories = {
            catering: { name: 'Catering', icon: '🍽️', keywords: ['comida', 'buffet', 'catering', 'banquete', 'cena', 'almuerzo', 'menu'] },
            dj: { name: 'DJ y Sonido', icon: '🎵', keywords: ['música', 'dj', 'sonido', 'disco', 'baile'] },
            fotografia: { name: 'Fotografía y Video', icon: '📸', keywords: ['foto', 'fotografía', 'fotógrafo', 'fotos', 'video', 'filmación', 'drone'] },
            decoracion: { name: 'Decoración', icon: '🎈', keywords: ['decoración', 'flores', 'globos', 'luces', 'ambientación'] },
            pasteleria: { name: 'Tortas y Postres', icon: '🎂', keywords: ['torta', 'pastel', 'cake', 'postre', 'bocaditos'] },
            animacion: { name: 'Animación', icon: '🎭', keywords: ['animación', 'animador', 'payaso', 'show', 'entretenimiento', 'mago'] },
            banda: { name: 'Banda/Orquesta', icon: '🎺', keywords: ['banda', 'orquesta', 'música en vivo', 'grupo musical', 'mariachi'] },
            mobiliario: { name: 'Mobiliario', icon: '🪑', keywords: ['mesas', 'sillas', 'mobiliario', 'carpas', 'toldos', 'menaje'] }
        };

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
                        { text: '💡 Tengo una idea', value: 'tengo idea de evento' },
                        { text: '🏛️ Ver locales', value: 'ver locales' },
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

    // Guardar conversaciones con propietarios (integrado con UserManager)
    saveOwnerChat(chatId, message, type) {
        try {
            // Guardar en formato local
            const chats = JSON.parse(localStorage.getItem(this.OWNER_CHATS_KEY) || '{}');
            if (!chats[chatId]) {
                chats[chatId] = [];
            }

            const messageObj = {
                text: message,
                type: type,
                timestamp: new Date().toISOString()
            };

            chats[chatId].push(messageObj);

            // Mantener ultimos 100 mensajes por propietario
            if (chats[chatId].length > 100) {
                chats[chatId] = chats[chatId].slice(-100);
            }
            localStorage.setItem(this.OWNER_CHATS_KEY, JSON.stringify(chats));

            console.log('Mensaje guardado en chat:', chatId, 'Total mensajes:', chats[chatId].length);

            // Sincronizar con UserManager para la bandeja de mensajes
            if (window.userManager && this.currentOwner && this.currentLocal) {
                const providerData = {
                    name: this.currentOwner.name,
                    type: this.providerType || 'local',
                    slug: this.currentLocal.slug
                };

                // Solo incrementar no leidos si es mensaje del bot (proveedor)
                if (type === 'bot') {
                    providerData.incrementUnread = true;
                }

                userManager.addMessageToConversation(chatId, messageObj, providerData);
            }
        } catch (e) {
            console.warn('Error saving owner chat:', e);
        }
    }

    loadOwnerChat(ownerId) {
        try {
            let messages = [];

            // Cargar desde localStorage directo (fuente principal)
            const chats = JSON.parse(localStorage.getItem(this.OWNER_CHATS_KEY) || '{}');
            if (chats[ownerId] && chats[ownerId].length > 0) {
                messages = chats[ownerId];
            }

            // También intentar cargar desde UserManager
            if (window.userManager) {
                const conversation = userManager.getConversation(ownerId);
                if (conversation && conversation.messages && conversation.messages.length > 0) {
                    // Marcar como leido al abrir
                    userManager.markConversationAsRead(ownerId);

                    // Si no hay mensajes en localStorage, usar los de UserManager
                    if (messages.length === 0) {
                        messages = conversation.messages;
                    }
                }
            }

            console.log('Mensajes cargados para', ownerId, ':', messages.length);
            return messages;
        } catch (e) {
            console.warn('Error loading owner chat:', e);
            return [];
        }
    }

    // Obtener conteo de mensajes no leidos
    getUnreadCount() {
        if (window.userManager) {
            return userManager.getUnreadCount();
        }
        return 0;
    }

    // Actualizar badge de mensajes no leidos
    updateUnreadBadge() {
        const unread = this.getUnreadCount();
        const badge = this.trigger?.querySelector('.chatbot-badge');

        if (badge) {
            if (unread > 0) {
                badge.textContent = unread > 9 ? '9+' : unread;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        // Tambien actualizar en auth dropdown si existe
        if (window.auth && typeof auth.updateMessageBadge === 'function') {
            auth.updateMessageBadge();
        }
    }

    // ==========================================
    // MODO PROPIETARIO (Owner Mode)
    // ==========================================

    detectLocalPage() {
        // Detectar si estamos en página de detalle de local o servicio
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const fullUrl = window.location.href.toLowerCase();
        const pathname = window.location.pathname.toLowerCase();

        console.log('Detectando página - URL:', fullUrl, 'slug:', slug);

        // Detectar página de local (funciona con file:// y http://)
        const isLocalPage = fullUrl.includes('local.html') || pathname.includes('local.html');
        if (isLocalPage && slug) {
            this.waitForData('LOCALES_DATA', () => {
                const local = LOCALES_DATA.find(l => l.slug === slug);
                if (local && local.owner) {
                    this.currentLocal = local;
                    this.currentOwner = local.owner;
                    this.providerType = 'local';
                    console.log('Local detectado:', local.name, '- Mostrando burbuja');
                    this.showOwnerBubble();
                } else {
                    console.log('Local no encontrado o sin owner:', slug);
                }
            });
        }

        // Detectar página de servicio (funciona con file:// y http://)
        const isServicePage = fullUrl.includes('servicio.html') || pathname.includes('servicio.html');
        if (isServicePage && slug) {
            this.waitForData('SERVICIOS_DATA', () => {
                const servicio = SERVICIOS_DATA.find(s => s.slug === slug);
                if (servicio && servicio.owner) {
                    this.currentLocal = servicio;
                    this.currentOwner = servicio.owner;
                    this.providerType = 'servicio';
                    console.log('Servicio detectado:', servicio.name, '- Mostrando burbuja');
                    this.showOwnerBubble();
                } else {
                    console.log('Servicio no encontrado o sin owner:', slug);
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

        console.log('Creando burbuja para:', this.currentOwner.name);

        const bubble = document.createElement('div');
        bubble.id = 'ownerBubble';
        bubble.className = 'owner-bubble';
        bubble.innerHTML = `
            <div class="owner-bubble-avatar">${this.currentOwner.avatar || this.currentOwner.name?.charAt(0) || 'P'}</div>
            <div class="owner-bubble-content">
                <div class="owner-bubble-name">${this.currentOwner.name}</div>
                <div class="owner-bubble-status">💬 Chatea con el proveedor</div>
            </div>
            <div class="owner-bubble-close" onclick="event.stopPropagation(); document.getElementById('ownerBubble').remove();">
                <i class="fas fa-times"></i>
            </div>
        `;

        bubble.addEventListener('click', (e) => {
            if (!e.target.closest('.owner-bubble-close')) {
                this.switchToOwnerMode();
            }
        });

        // Mostrar después de 1.5 segundos
        setTimeout(() => {
            document.body.appendChild(bubble);
            console.log('Burbuja del propietario visible');
        }, 1500);
    }

    // Generar ID único para el chat con el proveedor
    getOwnerChatId() {
        const type = this.providerType || 'local';
        const localId = this.currentLocal?.id || this.currentLocal?.slug || 'unknown';
        return `${type}_${localId}`;
    }

    switchToOwnerMode() {
        this.mode = 'owner';
        this.chatbot.classList.add('owner-mode');

        // Ocultar burbuja
        const bubble = document.getElementById('ownerBubble');
        if (bubble) bubble.classList.add('hidden');

        // Actualizar header
        this.updateChatHeader();

        // Limpiar y cargar historial con propietario usando ID único
        this.messagesContainer.innerHTML = '';
        const chatId = this.getOwnerChatId();
        const ownerHistory = this.loadOwnerChat(chatId);

        console.log('Cargando chat con ID:', chatId);

        if (ownerHistory.length > 0) {
            ownerHistory.forEach(msg => {
                this.renderMessage({ type: msg.type, text: msg.text }, false);
            });
        } else {
            // Mensaje inicial del propietario
            const typeText = this.providerType === 'servicio' ? 'del servicio' : 'del local';
            this.addBotMessage(`¡Hola! 👋 Soy <strong>${this.currentOwner.name}</strong>, propietario ${typeText} <strong>${this.currentLocal.name}</strong>.<br><br>
                ¿En qué puedo ayudarte? Puedo responder sobre:<br>
                • 📅 Disponibilidad de fechas<br>
                • 💰 Precios y servicios<br>
                • 🎉 Detalles ${typeText}<br>
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

        // Si estamos en modo owner, marcar como leido
        if (this.mode === 'owner' && this.currentOwner && window.userManager) {
            userManager.markConversationAsRead(this.currentOwner.id);
            this.updateUnreadBadge();
        }

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
            servicios: 'Muéstrame los servicios',
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
            const chatId = this.getOwnerChatId();
            this.saveOwnerChat(chatId, text, 'user');
            // Enviar mensaje a Google Sheets para que el propietario lo vea
            this.notifyProviderMessage(text);
        } else {
            this.messages.push(message);
            this.saveChatHistory();
        }

        this.renderMessage(message);
    }

    // Notificar al proveedor sobre un nuevo mensaje
    notifyProviderMessage(message) {
        if (!this.currentOwner || !this.currentLocal) return;

        // Obtener datos del usuario si está logueado
        const user = window.userManager?.getUserData();
        const userName = user?.name || 'Usuario anónimo';
        const userEmail = user?.email || 'No proporcionado';
        const userPhone = user?.phone || 'No proporcionado';

        // Enviar a Google Sheets
        if (typeof sendToGoogleSheets === 'function') {
            sendToGoogleSheets('MensajesProveedores', {
                id: 'MSG-' + Date.now(),
                tipo: 'mensaje_chat',
                proveedorNombre: this.currentOwner.name,
                proveedorId: this.currentOwner.id,
                localServicio: this.currentLocal.name,
                localServicioSlug: this.currentLocal.slug,
                tipoProveedor: this.providerType || 'local',
                mensaje: message,
                usuarioNombre: userName,
                usuarioEmail: userEmail,
                usuarioTelefono: userPhone,
                estado: 'pendiente_respuesta',
                fecha: new Date().toLocaleDateString('es-PE'),
                hora: new Date().toLocaleTimeString('es-PE'),
                timestamp: new Date().toISOString()
            });
        }

        console.log('Mensaje enviado a proveedor:', this.currentOwner.name);
    }

    addBotMessage(text, options = {}) {
        const message = { type: 'bot', text, options, timestamp: new Date() };

        if (this.mode === 'owner' && this.currentOwner) {
            const chatId = this.getOwnerChatId();
            this.saveOwnerChat(chatId, text, 'bot');
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

            // Si estamos en modo propuesta, manejar ajustes
            if (this.context.stage === 'advisor_proposal') {
                const adjustmentResponse = this.handleProposalAdjustment(normalizedMsg);
                if (adjustmentResponse) {
                    this.addBotMessage(adjustmentResponse.text, adjustmentResponse.options);
                    this.logInteraction(message, adjustmentResponse.text);
                    return;
                }
            }

            // Intentar asesoría inteligente para ideas de eventos
            // Detecta frases como "quiero una boda elegante para 150 personas"
            if (message.length > 10 && !this.isSimpleQuestion(normalizedMsg)) {
                const advisorResponse = this.generateAdvisorResponse(normalizedMsg);
                if (advisorResponse) {
                    this.addBotMessage(advisorResponse.text, advisorResponse.options);
                    this.logInteraction(message, advisorResponse.text);
                    return;
                }
            }

            const response = this.generateResponse(normalizedMsg);
            this.addBotMessage(response.text, response.options);
            this.logInteraction(message, response.text);

        }, delay);
    }

    // Detectar si es una pregunta simple
    isSimpleQuestion(message) {
        const simplePatterns = [
            'hola', 'buenos', 'buenas', 'gracias', 'adios', 'chao',
            'precio', 'cuanto', 'cuánto', 'ayuda', 'ver locales',
            'ver servicios', 'cotizar', 'disponibilidad'
        ];
        return simplePatterns.some(p => message.includes(p));
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
                            { text: '💰 Ver precios', value: 'precios' }
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
                        ¿Te gustaría más información?`,
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
                            { text: '✨ Ver servicios', value: 'servicios incluidos' }
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

        // Opciones de servicio
        if (isService && this.matchKeywords(message, ['opcion', 'combo', 'incluye'])) {
            const packages = provider.pricing?.packages || [];
            const packagesText = packages.map(p =>
                `<strong>${p.name}</strong> - S/ ${p.price}<br>${p.description}`
            ).join('<br><br>');

            return {
                text: `✨ <strong>Opciones de ${provider.name}:</strong><br><br>${packagesText}`,
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
                        { text: '✨ Servicios', value: 'servicios incluidos' }
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

        // Contacto por WhatsApp
        if (message.includes('contacto_whatsapp') || this.matchKeywords(message, ['whatsapp', 'wsp', 'whats'])) {
            const whatsappNumber = this.getProviderWhatsApp();
            const providerName = provider.name;
            const whatsappMessage = encodeURIComponent(`Hola, me interesa información sobre ${providerName} en Celébralo pe.`);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);

            return {
                text: `📱 <strong>Abriendo WhatsApp...</strong><br><br>
                    Te conectaremos con un asesor de Celébralo pe que coordinará directamente con ${owner.name}.<br><br>
                    <a href="${whatsappUrl}" target="_blank" style="color: var(--primary);">Click aquí si no se abre automáticamente</a>`,
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
            text: `✅ <strong>¡Mensaje recibido!</strong><br><br>
                Tu consulta ha sido enviada a ${owner.name}.<br><br>
                ⏱️ <strong>Tiempo de respuesta:</strong> ${owner.responseTime}<br>
                📧 Te notificaremos cuando responda.<br><br>
                ¿Necesitas una respuesta más rápida?`,
            options: {
                buttons: [
                    { text: '📱 WhatsApp directo', value: 'contacto_whatsapp' },
                    { text: '📋 Solicitar cotización', value: 'quiero cotización' }
                ]
            }
        };
    }

    // Obtener número de WhatsApp del proveedor
    getProviderWhatsApp() {
        // Número de contacto general de Celébralo pe
        return '51972142767';
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
                    • 🎉 <strong>Servicios</strong> - "qué servicios tienen"<br>
                    • 📋 <strong>Cotizar</strong> - "quiero cotizar"<br><br>
                    ¿Qué te gustaría ver primero?`,
                options: {
                    buttons: [
                        { text: '🏛️ Ver locales', value: 'ver locales' },
                        { text: '🎉 Ver servicios', value: 'ver servicios' },
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
                    { text: '📋 Cotizar evento', value: 'cotizar' },
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
    // ASESOR INTELIGENTE DE EVENTOS
    // ==========================================

    // Analizar idea del usuario y extraer información
    analyzeEventIdea(message) {
        const idea = {
            eventType: null,
            style: null,
            guests: null,
            budget: null,
            services: [],
            keywords: []
        };

        const msgLower = message.toLowerCase();

        // Detectar tipo de evento
        for (const [type, keywords] of Object.entries(this.eventKeywords)) {
            if (keywords.some(kw => msgLower.includes(kw))) {
                idea.eventType = type;
                break;
            }
        }

        // Detectar palabras clave adicionales para eventos
        if (!idea.eventType) {
            if (msgLower.includes('fiesta') || msgLower.includes('celebr')) {
                idea.eventType = 'cumpleanos';
            } else if (msgLower.includes('reunion') || msgLower.includes('empresa')) {
                idea.eventType = 'corporativo';
            }
        }

        // Detectar estilo
        for (const [style, keywords] of Object.entries(this.eventStyles)) {
            if (keywords.some(kw => msgLower.includes(kw))) {
                idea.style = style;
                break;
            }
        }

        // Detectar número de invitados (múltiples patrones)
        const guestPatterns = [
            /(\d+)\s*(personas?|invitados?|gente|asistentes?)/i,
            /para\s*(\d+)/i,
            /de\s*(\d+)\s*(a\s*\d+)?/i,
            /(\d+)\s*-\s*(\d+)/i
        ];

        for (const pattern of guestPatterns) {
            const match = msgLower.match(pattern);
            if (match) {
                idea.guests = parseInt(match[1]);
                break;
            }
        }

        // Detectar presupuesto
        const budgetMatch = msgLower.match(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(soles?|s\/\.?)/i) ||
                           msgLower.match(/presupuesto\s*(?:de)?\s*(\d+)/i);
        if (budgetMatch) {
            idea.budget = parseInt(budgetMatch[1].replace(',', ''));
        }

        // Detectar servicios mencionados usando las categorías definidas
        for (const [category, data] of Object.entries(this.serviceCategories)) {
            if (data.keywords.some(kw => msgLower.includes(kw))) {
                idea.services.push(category);
            }
        }

        return idea;
    }

    // Generar propuesta completa basada en la idea
    generateEventProposal(idea) {
        const eventNames = {
            matrimonio: 'Matrimonio',
            quinceanos: 'Fiesta de XV Años',
            cumpleanos: 'Celebración de Cumpleaños',
            corporativo: 'Evento Corporativo',
            bautizo: 'Bautizo',
            graduacion: 'Graduación',
            'baby-shower': 'Baby Shower',
            aniversario: 'Aniversario'
        };

        const styleNames = {
            elegante: 'elegante y sofisticado',
            rustico: 'rústico y natural',
            moderno: 'moderno y minimalista',
            tematico: 'temático y divertido',
            infantil: 'infantil y colorido'
        };

        // Servicios recomendados por tipo de evento (usando categorías reales)
        const recommendedServices = {
            matrimonio: ['catering', 'fotografia', 'dj', 'decoracion', 'pasteleria', 'banda'],
            quinceanos: ['catering', 'fotografia', 'dj', 'decoracion', 'pasteleria'],
            cumpleanos: ['catering', 'fotografia', 'decoracion', 'pasteleria', 'animacion'],
            corporativo: ['catering', 'fotografia', 'mobiliario'],
            bautizo: ['catering', 'fotografia', 'decoracion', 'pasteleria'],
            graduacion: ['catering', 'fotografia', 'dj', 'decoracion'],
            'baby-shower': ['catering', 'decoracion', 'pasteleria', 'fotografia'],
            aniversario: ['catering', 'fotografia', 'decoracion', 'pasteleria', 'banda']
        };

        const eventType = idea.eventType || 'cumpleanos';
        const eventName = eventNames[eventType] || 'Evento';
        const styleName = idea.style ? styleNames[idea.style] : 'personalizado';
        const guests = idea.guests || 100;
        const services = idea.services.length > 0
            ? idea.services
            : recommendedServices[eventType] || ['catering', 'decoracion'];

        // Buscar locales que coincidan
        this.context.eventType = { type: eventType, name: eventName };
        this.context.guests = { min: guests * 0.8, max: guests * 1.2, exact: guests };
        const matchingLocales = this.getMatchingLocales();

        // Buscar servicios disponibles
        const availableServices = this.getMatchingServices(services);

        // Calcular presupuesto estimado
        const budgetEstimate = this.calculateBudgetEstimate(guests, services);

        return {
            eventType,
            eventName,
            styleName,
            guests,
            services,
            matchingLocales,
            availableServices,
            budgetEstimate
        };
    }

    // Obtener servicios que coincidan
    getMatchingServices(serviceTypes) {
        if (typeof SERVICIOS_DATA === 'undefined') return [];

        const results = [];
        for (const type of serviceTypes) {
            // Buscar servicio por categoría exacta
            const service = SERVICIOS_DATA.find(s => s.category === type);
            if (service) {
                results.push({
                    name: service.name,
                    slug: service.slug,
                    category: type,
                    price: service.pricing?.packages?.[0]?.price || service.pricing?.basePrice || 'Consultar'
                });
            }
        }
        return results.slice(0, 5);
    }

    // Calcular presupuesto estimado
    calculateBudgetEstimate(guests, services) {
        let total = 0;

        // Costo base del local (promedio)
        total += 1200;

        // Costo por servicio (basado en categorías reales)
        const serviceCosts = {
            catering: guests * 45, // S/ 45 por persona
            dj: 500,
            fotografia: 450,
            decoracion: 500,
            pasteleria: 280,
            animacion: 350,
            banda: 800,
            mobiliario: 400
        };

        for (const service of services) {
            total += serviceCosts[service] || 300;
        }

        return {
            min: Math.round(total * 0.8),
            max: Math.round(total * 1.2),
            average: Math.round(total)
        };
    }

    // Generar respuesta de asesoría
    generateAdvisorResponse(message) {
        const idea = this.analyzeEventIdea(message);

        // Si detectó alguna idea de evento
        if (idea.eventType || idea.style || idea.guests || idea.services.length > 0) {
            const proposal = this.generateEventProposal(idea);
            this.context.eventIdea = idea;
            this.context.stage = 'advisor_proposal';

            // Construir respuesta estructurada
            let responseText = `<strong>🎯 ¡Perfecto! Armé esta propuesta para ti:</strong><br><br>`;

            // Resumen del evento
            responseText += `<div style="background: linear-gradient(135deg, #667eea11, #764ba211); padding: 12px; border-radius: 12px; margin-bottom: 12px;">`;
            responseText += `<strong>📌 Tu evento:</strong> ${proposal.eventName}`;
            if (proposal.styleName !== 'personalizado') {
                responseText += ` <em>(${proposal.styleName})</em>`;
            }
            responseText += `<br>`;
            responseText += `<strong>👥 Invitados:</strong> ${proposal.guests} personas<br>`;
            responseText += `<strong>💰 Inversión estimada:</strong> S/ ${proposal.budgetEstimate.min.toLocaleString()} - S/ ${proposal.budgetEstimate.max.toLocaleString()}`;
            responseText += `</div>`;

            // Locales recomendados
            if (proposal.matchingLocales.length > 0) {
                responseText += `<strong>🏛️ Locales ideales:</strong><br>`;
                proposal.matchingLocales.forEach((l, i) => {
                    responseText += `${i + 1}. <strong>${l.name}</strong> - S/ ${l.price.toLocaleString()}<br>`;
                });
                responseText += `<br>`;
            } else {
                responseText += `<strong>🏛️ Locales:</strong> Te ayudo a encontrar el ideal<br><br>`;
            }

            // Servicios incluidos
            responseText += `<strong>🎉 Servicios recomendados:</strong><br>`;
            let serviciosList = [];
            proposal.services.forEach(s => {
                const serviceData = this.serviceCategories[s];
                if (serviceData) {
                    serviciosList.push(`${serviceData.icon} ${serviceData.name}`);
                }
            });
            responseText += serviciosList.join(' • ') + `<br><br>`;

            // Pregunta de seguimiento
            responseText += `<em>¿Quieres ajustar algo o procedemos a cotizar?</em>`;

            return {
                text: responseText,
                options: {
                    localeLinks: proposal.matchingLocales,
                    buttons: [
                        { text: '✅ Cotizar ahora', value: 'cotizar este evento' },
                        { text: '👥 Cambiar invitados', value: 'cambiar cantidad de personas' },
                        { text: '🎉 Otros servicios', value: 'ver otros servicios' }
                    ]
                }
            };
        }

        // Si detectó algo parcial, pedir más detalles
        return null;
    }

    // Manejar ajustes a la propuesta
    handleProposalAdjustment(message) {
        if (!this.context.eventIdea) return null;

        const msgLower = message.toLowerCase();

        // Cambiar cantidad de personas
        if (msgLower.includes('cambiar') && (msgLower.includes('persona') || msgLower.includes('invitado'))) {
            return {
                text: `¿Cuántas personas asistirán a tu evento?<br><br>
                    <em>Ejemplo: "seremos 80 personas"</em>`,
                options: {
                    buttons: [
                        { text: '50 personas', value: 'para 50 personas' },
                        { text: '100 personas', value: 'para 100 personas' },
                        { text: '150 personas', value: 'para 150 personas' },
                        { text: '200+ personas', value: 'para 200 personas' }
                    ]
                }
            };
        }

        // Si da un nuevo número, actualizar propuesta
        const newGuests = message.match(/(\d+)/);
        if (newGuests && this.context.stage === 'advisor_proposal') {
            this.context.eventIdea.guests = parseInt(newGuests[1]);
            return this.generateAdvisorResponse(message);
        }

        return null;
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
                        { text: '🎉 Ver servicios', value: 'ver servicios' }
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

        // Ver servicios
        if (this.matchKeywords(message, ['ver servicios', 'servicios disponibles', 'que servicios'])) {
            let servicesText = `<strong>🎉 Servicios Disponibles:</strong><br><br>`;
            for (const [key, data] of Object.entries(this.serviceCategories)) {
                servicesText += `${data.icon} <strong>${data.name}</strong><br>`;
            }
            servicesText += `<br>¿Te gustaría cotizar algún servicio?`;

            return {
                text: servicesText,
                options: {
                    buttons: [
                        { text: '📋 Cotizar servicios', value: 'cotizar' },
                        { text: '🏛️ Ver locales', value: 'ver locales' }
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
                        { text: '📋 Cotizar boda', value: 'cotizar' }
                    ]
                }
            };
        }

        // Servicios con precios
        if (this.matchKeywords(message, ['servicio', 'catering', 'dj', 'foto', 'decoración', 'animacion', 'banda', 'torta'])) {
            return {
                text: `<strong>🎉 Servicios Disponibles:</strong><br><br>
                    🍽️ <strong>Catering</strong> - Desde S/ 35/persona<br>
                    🎵 <strong>DJ y Sonido</strong> - Desde S/ 400<br>
                    📸 <strong>Fotografía y Video</strong> - Desde S/ 350<br>
                    🎈 <strong>Decoración</strong> - Desde S/ 450<br>
                    🎂 <strong>Tortas y Postres</strong> - Desde S/ 150<br>
                    🎭 <strong>Animación</strong> - Desde S/ 300<br>
                    🎺 <strong>Banda/Orquesta</strong> - Desde S/ 700<br>
                    🪑 <strong>Mobiliario</strong> - Desde S/ 350<br><br>
                    Todos verificados y con garantía ✓`,
                options: {
                    buttons: [
                        { text: '📋 Ver servicios', value: 'ver servicios' },
                        { text: '💰 Cotizar', value: 'cotizar' }
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
                    • Encontrar servicios para tu evento<br>
                    • Cotizar tu evento completo<br>
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

        // Usuario tiene una idea de evento
        if (this.matchKeywords(message, ['tengo idea', 'tengo una idea', 'mi idea', 'quiero hacer', 'quiero organizar', 'necesito hacer'])) {
            this.context.stage = 'waiting_idea';
            return {
                text: `¡Genial! 💡 Cuéntame tu idea en una frase y te armo la propuesta.<br><br>
                    <strong>Solo dime:</strong> tipo de evento + personas + lo que necesitas<br><br>
                    <em>Ejemplos:</em><br>
                    • "Boda elegante para 150 con buffet y DJ"<br>
                    • "Quinceaños para 100 personas"<br>
                    • "Cumpleaños infantil para 30 niños"`,
                options: {
                    buttons: [
                        { text: '💒 Matrimonio', value: 'quiero organizar un matrimonio' },
                        { text: '🎀 Quinceaños', value: 'quiero organizar quinceaños' },
                        { text: '🎂 Cumpleaños', value: 'quiero organizar cumpleaños' },
                        { text: '💼 Corporativo', value: 'quiero organizar evento corporativo' }
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
                        { text: '💡 Tengo una idea', value: 'tengo idea de evento' },
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
                        { text: '🎉 Ver servicios', value: 'ver servicios' },
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
                • 🎉 <strong>Ver servicios</strong><br>
                • 💰 <strong>Consultar precios</strong><br>
                • 🎊 <strong>Planificar tu evento</strong>`,
            options: {
                buttons: [
                    { text: '🎊 Planificar evento', value: 'organizar evento' },
                    { text: '🏛️ Ver locales', value: 'ver locales' },
                    { text: '🎉 Ver servicios', value: 'ver servicios' }
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
            Soy <strong>Celé</strong>, tu asesor de eventos 🎉<br><br>
            <strong>Cuéntame tu idea</strong> y te armo una propuesta completa con local + servicios.<br><br>
            <em>Ejemplo: "Quiero una boda elegante para 150 personas con buffet y DJ"</em><br><br>
            ¿Qué tienes en mente?`;
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
        if (this.matchKeywords(message, ['combo', 'todo incluido'])) return 'servicios';
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
