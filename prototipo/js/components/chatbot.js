/* ========================================
   CELÉBRALO PE - Chatbot Component (EventBot)
   ======================================== */

class EventBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.context = {
            eventType: null,
            date: null,
            guests: null,
            budget: null,
            stage: 'greeting'
        };

        this.init();
    }

    init() {
        // Get DOM elements
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

        // Initial greeting with delay
        setTimeout(() => {
            this.addBotMessage(this.getGreeting());
        }, 500);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('active', this.isOpen);

        if (this.isOpen) {
            this.hideBadge();
            this.input.focus();

            // Registrar apertura del chatbot
            if (window.analytics) {
                analytics.trackChatbotOpen();
            }
        }
    }

    open() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.hideBadge();
        this.input.focus();
    }

    close() {
        this.isOpen = false;
        this.window.classList.remove('active');
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
        const messages = {
            precios: '¿Cuáles son los rangos de precios de los locales?',
            disponibilidad: 'Quiero verificar disponibilidad para una fecha',
            paquetes: '¿Qué paquetes todo-en-uno tienen disponibles?',
            ayuda: 'Necesito ayuda para organizar mi evento'
        };

        const message = messages[action] || 'Necesito información';
        this.addUserMessage(message);
        this.processMessage(message);

        // Hide quick actions after first use
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
            buttonsDiv.style.marginTop = '8px';
            buttonsDiv.style.display = 'flex';
            buttonsDiv.style.gap = '8px';
            buttonsDiv.style.flexWrap = 'wrap';

            message.options.buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = 'quick-action';
                button.textContent = btn.text;
                button.addEventListener('click', () => {
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
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    processMessage(message) {
        this.showTyping();

        // Simulate AI thinking time
        const delay = 800 + Math.random() * 700;

        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message.toLowerCase());
            this.addBotMessage(response.text, response.options);

            // Determinar categoría de la consulta
            const category = this.categorizeQuery(message.toLowerCase());

            // Registrar consulta en Google Sheets
            if (typeof sendToGoogleSheets === 'function') {
                sendToGoogleSheets('Consultas', {
                    id: 'CHT-' + Date.now(),
                    consulta: message,
                    respuesta: response.text.substring(0, 200).replace(/<[^>]*>/g, ''),
                    categoria: category,
                    fecha: new Date().toLocaleDateString('es-PE'),
                    hora: new Date().toLocaleTimeString('es-PE'),
                    timestamp: new Date().toISOString()
                });
            }
            if (window.analytics) {
                analytics.trackChatbotMessage(category);
            }
        }, delay);
    }

    categorizeQuery(message) {
        if (this.matchKeywords(message, ['precio', 'costo', 'cuanto', 'tarifa'])) return 'precios';
        if (this.matchKeywords(message, ['capacidad', 'personas', 'invitados'])) return 'capacidad';
        if (this.matchKeywords(message, ['disponib', 'fecha', 'reserva'])) return 'disponibilidad';
        if (this.matchKeywords(message, ['paquete', 'combo', 'todo incluido'])) return 'paquetes';
        if (this.matchKeywords(message, ['matrimonio', 'boda'])) return 'matrimonio';
        if (this.matchKeywords(message, ['cumpleaño', 'quinceañ', 'xv'])) return 'cumpleanos';
        if (this.matchKeywords(message, ['corporativo', 'empresa'])) return 'corporativo';
        if (this.matchKeywords(message, ['servicio', 'catering', 'dj', 'foto'])) return 'servicios';
        if (this.matchKeywords(message, ['pago', 'yape', 'plin'])) return 'pagos';
        if (this.matchKeywords(message, ['ayuda', 'contacto', 'asesor'])) return 'ayuda';
        return 'general';
    }

    generateResponse(message) {
        // Price related queries
        if (this.matchKeywords(message, ['precio', 'costo', 'cuanto', 'cuánto', 'tarifa', 'cobran'])) {
            return {
                text: `<strong>💰 Rangos de Precios en Celébralo pe:</strong><br><br>
                    <strong>Locales:</strong><br>
                    • Económicos: S/ 600 - S/ 900<br>
                    • Estándar: S/ 900 - S/ 1,500<br>
                    • Premium: S/ 1,500 - S/ 2,500+<br><br>
                    <strong>Servicios populares:</strong><br>
                    • Catering: desde S/ 35/persona<br>
                    • DJ: desde S/ 400/evento<br>
                    • Fotografía: desde S/ 350<br>
                    • Decoración: desde S/ 450<br><br>
                    ¿Te gustaría que te recomiende opciones según tu presupuesto?`,
                options: {
                    buttons: [
                        { text: 'Ver locales económicos', value: 'locales economicos' },
                        { text: 'Ver paquetes', value: 'paquetes' }
                    ]
                }
            };
        }

        // Capacity related
        if (this.matchKeywords(message, ['capacidad', 'personas', 'invitados', 'cuantos', 'aforo'])) {
            return {
                text: `<strong>👥 Capacidades Disponibles:</strong><br><br>
                    • <strong>Pequeños (30-100):</strong> Ideales para cumpleaños, bautizos<br>
                    • <strong>Medianos (100-200):</strong> Quinceaños, matrimonios íntimos<br>
                    • <strong>Grandes (200-300+):</strong> Matrimonios, eventos corporativos<br><br>
                    ¿Para cuántas personas es tu evento? 🎉`,
                options: {
                    buttons: [
                        { text: 'Menos de 100', value: 'locales para menos de 100 personas' },
                        { text: '100-200 personas', value: 'locales para 100 a 200 personas' },
                        { text: 'Más de 200', value: 'locales para mas de 200 personas' }
                    ]
                }
            };
        }

        // Availability/Date related
        if (this.matchKeywords(message, ['disponib', 'fecha', 'reserva', 'cuando', 'día', 'dia', 'agenda'])) {
            return {
                text: `<strong>📅 Verificar Disponibilidad:</strong><br><br>
                    Para verificar disponibilidad en tiempo real, necesito saber:<br><br>
                    1️⃣ ¿Qué tipo de evento organizas?<br>
                    2️⃣ ¿Fecha aproximada?<br>
                    3️⃣ ¿Número de invitados?<br><br>
                    También puedes usar nuestro <strong>buscador principal</strong> arriba para filtrar locales disponibles en tu fecha.`,
                options: {
                    buttons: [
                        { text: 'Es un matrimonio', value: 'busco local para matrimonio' },
                        { text: 'Es un cumpleaños', value: 'busco local para cumpleaños' },
                        { text: 'Otro evento', value: 'quiero organizar un evento' }
                    ]
                }
            };
        }

        // Packages
        if (this.matchKeywords(message, ['paquete', 'combo', 'todo incluido', 'todo-en-uno', 'bundle'])) {
            return {
                text: `<strong>📦 Paquetes Todo-en-Uno:</strong><br><br>
                    <strong>🎉 Paquete Básico (desde S/ 1,200)</strong><br>
                    Local + Mesas/Sillas + Sonido básico<br><br>
                    <strong>⭐ Paquete Premium (desde S/ 3,500)</strong><br>
                    Local + Catering + DJ + Fotografía + Decoración<br><br>
                    <strong>🎨 Personalizado</strong><br>
                    Arma tu paquete eligiendo los servicios que necesitas<br><br>
                    Los paquetes tienen hasta <strong>15% de descuento</strong> vs contratar por separado.`,
                options: {
                    buttons: [
                        { text: 'Ver Paquete Básico', value: 'detalles paquete basico' },
                        { text: 'Ver Paquete Premium', value: 'detalles paquete premium' },
                        { text: 'Crear mi paquete', value: 'quiero armar mi paquete' }
                    ]
                }
            };
        }

        // Wedding specific
        if (this.matchKeywords(message, ['matrimonio', 'boda', 'casamiento', 'novios'])) {
            return {
                text: `<strong>💒 Locales para Matrimonios:</strong><br><br>
                    Tenemos <strong>12 locales especializados</strong> en bodas:<br><br>
                    🏆 <strong>Top recomendados:</strong><br>
                    • La Mansión - Capacidad 300, desde S/ 1,800<br>
                    • Los Jardines Premium - Capacidad 200, desde S/ 1,200<br>
                    • Club El Bosque - Capacidad 250, desde S/ 1,500<br><br>
                    Todos incluyen coordinador de eventos y opciones de catering.`,
                options: {
                    buttons: [
                        { text: 'Ver locales para boda', value: 'mostrar locales matrimonio' },
                        { text: 'Ver paquetes de boda', value: 'paquetes matrimonio' }
                    ]
                }
            };
        }

        // Birthday/Quinceañera
        if (this.matchKeywords(message, ['cumpleaño', 'quinceañ', 'xv', '15 años', 'quince'])) {
            return {
                text: `<strong>🎂 Locales para Cumpleaños y XV Años:</strong><br><br>
                    Tenemos opciones para todos los presupuestos:<br><br>
                    <strong>Para XV Años (recomendados):</strong><br>
                    • La Mansión - El más elegante ⭐<br>
                    • Los Jardines Premium - Con áreas verdes<br>
                    • Quinta El Paraíso - Ambiente campestre<br><br>
                    <strong>Para Cumpleaños infantiles:</strong><br>
                    • Salón Fiesta Alegre - Económico<br>
                    • Quinta El Paraíso - Con piscina y juegos`,
                options: {
                    buttons: [
                        { text: 'Ver locales XV años', value: 'locales quinceañera' },
                        { text: 'Ver locales cumpleaños', value: 'locales cumpleaños' }
                    ]
                }
            };
        }

        // Corporate events
        if (this.matchKeywords(message, ['corporativo', 'empresa', 'reunión', 'conferencia', 'team building'])) {
            return {
                text: `<strong>🏢 Eventos Corporativos:</strong><br><br>
                    Espacios ideales para empresas:<br><br>
                    • <strong>Club El Bosque</strong> - Team building con áreas deportivas<br>
                    • <strong>La Mansión</strong> - Conferencias y premiaciones<br>
                    • <strong>Los Jardines</strong> - Cenas empresariales<br><br>
                    Ofrecemos <strong>facturación electrónica</strong> y descuentos para eventos recurrentes.`,
                options: {
                    buttons: [
                        { text: 'Cotizar evento corporativo', value: 'cotizar corporativo' },
                        { text: 'Ver opciones', value: 'locales corporativos' }
                    ]
                }
            };
        }

        // Services
        if (this.matchKeywords(message, ['servicio', 'catering', 'dj', 'música', 'foto', 'decoración', 'animación'])) {
            return {
                text: `<strong>🎉 Servicios Complementarios:</strong><br><br>
                    • 🍽️ <strong>Catering</strong> - Desde S/ 35/persona<br>
                    • 🎵 <strong>DJ Profesional</strong> - Desde S/ 400<br>
                    • 📸 <strong>Fotografía y Video</strong> - Desde S/ 350<br>
                    • 🎈 <strong>Decoración</strong> - Desde S/ 450<br>
                    • 🤹 <strong>Animación</strong> - Desde S/ 300<br>
                    • 🎂 <strong>Tortas y Bocaditos</strong> - Desde S/ 150<br><br>
                    Todos nuestros proveedores están verificados ✓`,
                options: {
                    buttons: [
                        { text: 'Ver todos los servicios', value: 'ver servicios' },
                        { text: 'Armar paquete', value: 'armar paquete servicios' }
                    ]
                }
            };
        }

        // Payment related
        if (this.matchKeywords(message, ['pago', 'pagar', 'yape', 'plin', 'tarjeta', 'transferencia'])) {
            return {
                text: `<strong>💳 Métodos de Pago:</strong><br><br>
                    Aceptamos múltiples formas de pago:<br><br>
                    • 📱 <strong>Yape</strong> - Pago instantáneo<br>
                    • 📱 <strong>Plin</strong> - Pago instantáneo<br>
                    • 💳 <strong>Tarjetas</strong> - Visa, Mastercard<br>
                    • 🏦 <strong>Transferencia</strong> - BCP, BBVA, Interbank<br><br>
                    <strong>¿Cómo funciona?</strong><br>
                    1. Reservas con 50% de adelanto<br>
                    2. El resto se paga 7 días antes del evento<br>
                    3. Garantía de devolución si cancelas con anticipación`,
                options: {}
            };
        }

        // Help/Contact
        if (this.matchKeywords(message, ['ayuda', 'contacto', 'hablar', 'humano', 'asesor', 'llamar'])) {
            return {
                text: `<strong>📞 ¿Necesitas ayuda personalizada?</strong><br><br>
                    Puedo asistirte aquí 24/7, pero si prefieres hablar con un asesor:<br><br>
                    📱 <strong>WhatsApp:</strong> +51 999 888 777<br>
                    📧 <strong>Email:</strong> hola@celebralo.pe<br>
                    📍 <strong>Horario:</strong> Lun-Sáb 9am-7pm<br><br>
                    También puedes dejarnos tus datos y te contactamos:`,
                options: {
                    buttons: [
                        { text: 'Enviar WhatsApp', value: 'contactar whatsapp' },
                        { text: 'Seguir aquí', value: 'quiero seguir chateando' }
                    ]
                }
            };
        }

        // Greeting
        if (this.matchKeywords(message, ['hola', 'buenos', 'buenas', 'hi', 'hey', 'saludos'])) {
            return {
                text: this.getGreeting(),
                options: {}
            };
        }

        // Thanks
        if (this.matchKeywords(message, ['gracias', 'thanks', 'genial', 'perfecto', 'excelente'])) {
            return {
                text: `¡De nada! 😊 Estoy aquí para ayudarte a organizar tu evento perfecto.<br><br>
                    ¿Hay algo más en lo que pueda asistirte?`,
                options: {
                    buttons: [
                        { text: 'Ver locales', value: 'mostrar locales' },
                        { text: 'Ver servicios', value: 'ver servicios' },
                        { text: 'Eso es todo', value: 'finalizar' }
                    ]
                }
            };
        }

        // Farewell
        if (this.matchKeywords(message, ['adios', 'chao', 'bye', 'finalizar', 'eso es todo', 'nada más'])) {
            return {
                text: `¡Perfecto! Fue un gusto ayudarte. 🎉<br><br>
                    Recuerda que estoy disponible <strong>24/7</strong> para resolver tus dudas.<br><br>
                    ¡Que tengas un excelente evento! 🎊`,
                options: {}
            };
        }

        // Default response
        return {
            text: `Entiendo tu consulta. Como tu asistente de eventos puedo ayudarte con:<br><br>
                • 🏛️ <strong>Buscar locales</strong> según tus necesidades<br>
                • 💰 <strong>Comparar precios</strong> y opciones<br>
                • 📦 <strong>Armar paquetes</strong> todo-en-uno<br>
                • 📅 <strong>Verificar disponibilidad</strong><br>
                • ❓ <strong>Resolver dudas</strong> sobre el proceso<br><br>
                ¿Qué te gustaría hacer?`,
            options: {
                buttons: [
                    { text: 'Buscar local', value: 'buscar local para evento' },
                    { text: 'Ver paquetes', value: 'paquetes disponibles' },
                    { text: 'Hablar con asesor', value: 'contactar asesor' }
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

        return `${greeting}! 👋 Soy <strong>EventBot</strong>, tu asistente virtual de Celébralo pe.<br><br>
            Estoy aquí para ayudarte a encontrar el local perfecto y los mejores servicios para tu evento en Sullana. 🎉<br><br>
            ¿Qué tipo de evento estás organizando?`;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eventBot = new EventBot();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBot;
}
