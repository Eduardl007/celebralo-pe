/* ========================================
   CELÉBRALO PE - Chatbot "Celé" v2.0
   Tu asistente festivo con flujo guiado
   ======================================== */

class EventBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;

        // Contexto mejorado para flujo guiado
        this.context = {
            eventType: null,
            date: null,
            guests: null,
            budget: null,
            stage: 'greeting', // greeting, event_type, guests, budget, recommendations, free_chat
            userName: null,
            preferences: [],
            searchHistory: []
        };

        // Configuración del wizard
        this.wizardSteps = ['event_type', 'guests', 'budget', 'recommendations'];
        this.currentStep = 0;

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

        // Initial greeting
        setTimeout(() => {
            this.addBotMessage(this.getGreeting(), {
                buttons: [
                    { text: '🎊 Organizar evento', value: 'organizar_evento' },
                    { text: '🔍 Solo explorar', value: 'explorar' }
                ]
            });
        }, 500);
    }

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

        // Forzar reflow para que la animación funcione
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
        this.messages.push(message);
        this.renderMessage(message);
    }

    addBotMessage(text, options = {}) {
        const message = { type: 'bot', text, options, timestamp: new Date() };
        this.messages.push(message);
        this.renderMessage(message);
    }

    renderMessage(message) {
        const div = document.createElement('div');
        div.className = `chat-message ${message.type}`;
        div.innerHTML = message.text;

        if (message.options && message.options.buttons) {
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'chat-buttons';

            message.options.buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn.text;
                button.addEventListener('click', () => {
                    // Deshabilitar botones después de hacer clic
                    buttonsDiv.querySelectorAll('button').forEach(b => b.disabled = true);
                    this.addUserMessage(btn.text);
                    this.processMessage(btn.value || btn.text);
                });
                buttonsDiv.appendChild(button);
            });

            div.appendChild(buttonsDiv);
        }

        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
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

        // Tiempo de respuesta variable para parecer más natural
        const delay = 600 + Math.random() * 600;

        setTimeout(() => {
            this.hideTyping();

            // Primero verificar si es parte del flujo guiado
            if (this.context.stage !== 'free_chat') {
                const wizardResponse = this.handleWizardFlow(normalizedMsg);
                if (wizardResponse) {
                    this.addBotMessage(wizardResponse.text, wizardResponse.options);
                    this.logInteraction(message, wizardResponse.text);
                    return;
                }
            }

            // Si no es wizard, usar respuestas contextuales
            const response = this.generateResponse(normalizedMsg);
            this.addBotMessage(response.text, response.options);
            this.logInteraction(message, response.text);

        }, delay);
    }

    handleWizardFlow(message) {
        // Detectar si quiere iniciar el wizard
        if (this.matchKeywords(message, ['organizar', 'planificar', 'quiero organizar', 'tengo un evento'])) {
            this.context.stage = 'event_type';
            return this.askEventType();
        }

        // Detectar si quiere explorar libremente
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

        // Manejar cada etapa del wizard
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

        // Si no reconoce el tipo, pedir de nuevo
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
            // Intentar extraer número
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
        let budgetText = '';

        if (message.includes('hasta 1000') || message.includes('económico')) {
            budget = { min: 0, max: 1000, level: 'economico' };
            budgetText = 'Hasta S/ 1,000';
        } else if (message.includes('1000') && message.includes('2000')) {
            budget = { min: 1000, max: 2000, level: 'estandar' };
            budgetText = 'S/ 1,000 - 2,000';
        } else if (message.includes('2000') && message.includes('3500')) {
            budget = { min: 2000, max: 3500, level: 'premium' };
            budgetText = 'S/ 2,000 - 3,500';
        } else if (message.includes('sin limite') || message.includes('no importa')) {
            budget = { min: 0, max: 99999, level: 'premium' };
            budgetText = 'Sin límite';
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

        // Generar recomendaciones basadas en el contexto
        let recommendations = this.getMatchingLocales();

        let recText = recommendations.length > 0
            ? recommendations.map((r, i) => `${i + 1}. <strong>${r.name}</strong> - ${r.price} (Cap: ${r.capacity})`).join('<br>')
            : '• Salón Los Jardines Premium - S/ 1,200<br>• Quinta El Paraíso - S/ 900<br>• La Mansión - S/ 1,800';

        return {
            text: `🎯 <strong>¡Tengo recomendaciones para ti!</strong><br><br>
                📋 <strong>Tu evento:</strong><br>
                • Tipo: ${eventType?.name || 'Evento'}<br>
                • Invitados: ${guests?.exact || `${guests?.min}-${guests?.max}`} personas<br>
                • Presupuesto: ${budget?.max === 99999 ? 'Sin límite' : 'S/ ' + budget?.max}<br><br>
                🏛️ <strong>Locales recomendados:</strong><br>
                ${recText}<br><br>
                ¿Te gustaría ver más detalles de alguno?`,
            options: {
                buttons: [
                    { text: '📍 Ver locales', value: 'ver locales recomendados' },
                    { text: '📦 Ver paquetes', value: 'paquetes para mi evento' },
                    { text: '🔄 Buscar de nuevo', value: 'organizar evento' }
                ]
            }
        };
    }

    getMatchingLocales() {
        // Si LOCALES_DATA está disponible, filtrar
        if (typeof LOCALES_DATA !== 'undefined') {
            return LOCALES_DATA
                .filter(local => {
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
                    price: `S/ ${local.price.base.toLocaleString()}`,
                    capacity: local.capacity.max
                }));
        }
        return [];
    }

    generateResponse(message) {
        // Respuestas para precios
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

        // Ver locales
        if (this.matchKeywords(message, ['ver locales', 'mostrar locales', 'locales disponibles'])) {
            return {
                text: `<strong>🏛️ Nuestros Locales Destacados:</strong><br><br>
                    ⭐ <strong>Salón Los Jardines Premium</strong><br>
                    Capacidad: 200 | Desde S/ 1,200<br><br>
                    ⭐ <strong>La Mansión</strong><br>
                    Capacidad: 300 | Desde S/ 1,800<br><br>
                    ⭐ <strong>Quinta El Paraíso</strong><br>
                    Capacidad: 150 | Desde S/ 900<br><br>
                    <a href="./pages/locales.html" style="color: var(--primary);">Ver todos los locales →</a>`,
                options: {
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

        // Matrimonios
        if (this.matchKeywords(message, ['matrimonio', 'boda', 'casamiento'])) {
            this.context.eventType = { type: 'matrimonio', icon: '💒', name: 'Matrimonio' };
            return {
                text: `<strong>💒 Locales para Matrimonios:</strong><br><br>
                    Tenemos los mejores espacios para tu gran día:<br><br>
                    🏆 <strong>La Mansión</strong> - Elegante y espacioso<br>
                    🌳 <strong>Los Jardines Premium</strong> - Áreas verdes<br>
                    🏛️ <strong>Club El Bosque</strong> - Con instalaciones deportivas<br><br>
                    Todos incluyen coordinador y opciones de catering.`,
                options: {
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
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.eventBot = new EventBot();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBot;
}
