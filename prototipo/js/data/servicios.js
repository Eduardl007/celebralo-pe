/* ========================================
   CELÉBRALO PE - Servicios Data
   ======================================== */

const SERVICIOS_DATA = [
    {
        id: 101,
        name: "Catering Premium 'Sabor Norteño'",
        slug: "catering-sabor-norteno",
        category: "catering",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura", "Talara"]
        },
        pricing: {
            type: "per-person",
            basePrice: 35,
            minOrder: 50,
            packages: [
                { name: "Básico", price: 35, description: "Entrada + Plato de fondo + Postre" },
                { name: "Premium", price: 55, description: "2 Entradas + Plato de fondo + Postre + Bebidas" },
                { name: "Gourmet", price: 85, description: "Buffet completo + Estación de postres + Open bar soft" }
            ]
        },
        rating: 4.9,
        reviewsCount: 78,
        images: [
            "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800"
        ],
        icon: "🍽️",
        description: "Servicio de catering con especialidad en comida norteña y opciones internacionales. Menús personalizados para cada tipo de evento.",
        shortDescription: "Catering especializado en comida norteña y opciones gourmet",
        features: [
            "Menú personalizado",
            "Vajilla y cristalería incluida",
            "Personal de servicio (1 mozo por cada 15 personas)",
            "Decoración de mesas",
            "Chef en vivo (opcional)"
        ],
        eventTypes: ["matrimonio", "quinceanos", "corporativo", "cumpleanos", "graduacion"],
        availability: {
            advanceBooking: "7 días",
            monday: { available: true, hours: "09:00-20:00" },
            tuesday: { available: true, hours: "09:00-20:00" },
            wednesday: { available: true, hours: "09:00-20:00" },
            thursday: { available: true, hours: "09:00-20:00" },
            friday: { available: true, hours: "09:00-22:00" },
            saturday: { available: true, hours: "09:00-23:00" },
            sunday: { available: true, hours: "10:00-18:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelacion gratuita hasta 5 dias antes del evento. 50% de devolucion hasta 3 dias antes.",
            deposit: "Se requiere 30% de adelanto para confirmar la reserva.",
            rules: [
                "Confirmar menu final 3 dias antes del evento",
                "Acceso al local 3 horas antes para montaje",
                "Vajilla incluida en todos los paquetes"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Patricia Mendoza",
                userAvatar: "PM",
                rating: 5,
                comment: "Excelente servicio de catering. La comida estuvo deliciosa y el personal muy atento. Mis invitados quedaron encantados.",
                date: "2024-12-10",
                eventType: "Matrimonio",
                verified: true,
                helpful: 15
            },
            {
                id: 2,
                userName: "Roberto Castillo",
                userAvatar: "RC",
                rating: 5,
                comment: "El Chef Miguel es un profesional. Personalizo todo el menu para nuestro evento corporativo. 100% recomendado.",
                date: "2024-11-28",
                eventType: "Corporativo",
                verified: true,
                helpful: 8
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Top Rated", "Mas Pedido"],
        owner: {
            id: 201,
            name: "Chef Miguel Angel Ramos",
            avatar: "MR",
            responseRate: 99,
            responseTime: "< 1 hora"
        }
    },
    {
        id: 102,
        name: "DJ Profesional 'Mix Master'",
        slug: "dj-mix-master",
        category: "dj",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura", "Talara", "Paita"]
        },
        pricing: {
            type: "per-event",
            basePrice: 400,
            packages: [
                { name: "Básico", price: 400, hours: 4, description: "DJ + Equipo de sonido básico" },
                { name: "Pro", price: 700, hours: 6, description: "DJ + Sonido profesional + Iluminación básica" },
                { name: "Premium", price: 1200, hours: 8, description: "DJ + Sonido + Iluminación LED + Pantalla LED" }
            ]
        },
        rating: 4.7,
        reviewsCount: 54,
        images: [
            "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
            "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800",
            "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800"
        ],
        icon: "🎵",
        description: "DJ con amplia experiencia en todo tipo de eventos. Música variada: cumbia, reggaetón, salsa, rock, electrónica y más.",
        shortDescription: "DJ profesional con equipo de sonido e iluminación",
        features: [
            "Experiencia en +200 eventos",
            "Equipo de sonido profesional",
            "Sistema de iluminación LED",
            "Repertorio musical variado",
            "Animación incluida",
            "Playlist personalizada"
        ],
        eventTypes: ["matrimonio", "quinceanos", "cumpleanos", "corporativo", "graduacion"],
        availability: {
            advanceBooking: "5 dias",
            monday: { available: false, hours: null },
            tuesday: { available: false, hours: null },
            wednesday: { available: false, hours: null },
            thursday: { available: true, hours: "18:00-02:00" },
            friday: { available: true, hours: "18:00-04:00" },
            saturday: { available: true, hours: "18:00-05:00" },
            sunday: { available: true, hours: "17:00-00:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelacion con 72 horas de anticipacion sin costo. Despues se cobra 50%.",
            deposit: "50% de adelanto para reservar fecha.",
            rules: [
                "Confirmar playlist 48 horas antes",
                "Requiere alimentacion para el DJ",
                "Tomas electricas de 220V disponibles"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Carolina Silva",
                userAvatar: "CS",
                rating: 5,
                comment: "DJ Luis puso a bailar a todos! Excelente musica y muy profesional. La iluminacion estuvo espectacular.",
                date: "2024-12-01",
                eventType: "XV Anos",
                verified: true,
                helpful: 12
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Popular"],
        owner: {
            id: 202,
            name: "Luis Fernando 'DJ Mix'",
            avatar: "LF",
            responseRate: 97,
            responseTime: "< 2 horas"
        }
    },
    {
        id: 103,
        name: "Fotografia y Video 'Momentos'",
        slug: "fotografia-momentos",
        category: "fotografia",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura", "Talara", "Paita", "Tumbes"]
        },
        pricing: {
            type: "per-event",
            basePrice: 550,
            packages: [
                { name: "Foto Básico", price: 350, description: "4 horas de cobertura + 100 fotos editadas" },
                { name: "Foto + Video", price: 800, description: "6 horas + 200 fotos + Video resumen 5 min" },
                { name: "Premium", price: 1500, description: "Cobertura completa + 400 fotos + Video cinematográfico 15 min + Álbum impreso" }
            ]
        },
        rating: 4.8,
        reviewsCount: 63,
        images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
            "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
        ],
        icon: "📸",
        description: "Capturamos los momentos más especiales de tu evento con calidad profesional. Fotografía artística y video cinematográfico.",
        shortDescription: "Fotografía profesional y video cinematográfico para eventos",
        features: [
            "Equipo profesional Canon/Sony",
            "Edición profesional incluida",
            "Entrega en USB y nube",
            "Álbum digital interactivo",
            "Sesión pre-evento (paquetes premium)",
            "Drone disponible"
        ],
        eventTypes: ["matrimonio", "quinceanos", "cumpleanos", "bautizo", "corporativo", "graduacion"],
        availability: {
            advanceBooking: "10 dias",
            monday: { available: true, hours: "09:00-20:00" },
            tuesday: { available: true, hours: "09:00-20:00" },
            wednesday: { available: true, hours: "09:00-20:00" },
            thursday: { available: true, hours: "09:00-20:00" },
            friday: { available: true, hours: "08:00-23:00" },
            saturday: { available: true, hours: "08:00-23:00" },
            sunday: { available: true, hours: "09:00-20:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Reprogramacion gratuita hasta 7 dias antes. Cancelacion con 5 dias: 70% devolucion.",
            deposit: "40% de adelanto al confirmar.",
            rules: [
                "Sesion pre-evento incluida en paquete Premium",
                "Entrega de fotos en 15 dias habiles",
                "Video en 30 dias habiles"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Maria Elena Torres",
                userAvatar: "MT",
                rating: 5,
                comment: "Las fotos quedaron hermosas! Capturaron cada momento especial de mi boda. El video cinematografico es una obra de arte.",
                date: "2024-11-20",
                eventType: "Matrimonio",
                verified: true,
                helpful: 22
            },
            {
                id: 2,
                userName: "Jorge Ramirez",
                userAvatar: "JR",
                rating: 5,
                comment: "Profesionales de primera. El drone capturo tomas increibles de nuestra fiesta de XV anos.",
                date: "2024-10-15",
                eventType: "XV Anos",
                verified: true,
                helpful: 10
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Top Rated", "Recomendado"],
        owner: {
            id: 203,
            name: "Studio Momentos",
            avatar: "SM",
            responseRate: 98,
            responseTime: "< 1 hora"
        }
    },
    {
        id: 104,
        name: "Decoracion Tematica 'Eventos Magicos'",
        slug: "decoracion-eventos-magicos",
        category: "decoracion",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura"]
        },
        pricing: {
            type: "per-event",
            basePrice: 450,
            packages: [
                { name: "Básico", price: 450, description: "Decoración de mesa principal + Globos + Letrero" },
                { name: "Estándar", price: 800, description: "Decoración completa + Centros de mesa + Backdrop" },
                { name: "Premium", price: 1500, description: "Decoración temática completa + Mobiliario + Iluminación decorativa" }
            ]
        },
        rating: 4.6,
        reviewsCount: 41,
        images: [
            "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
            "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800",
            "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800"
        ],
        icon: "🎈",
        description: "Transformamos espacios en ambientes mágicos. Especialistas en decoración temática para todo tipo de eventos.",
        shortDescription: "Decoración temática personalizada para eventos especiales",
        features: [
            "Diseño personalizado",
            "Montaje y desmontaje incluido",
            "Globos orgánicos",
            "Backdrops personalizados",
            "Centros de mesa",
            "Iluminación decorativa"
        ],
        eventTypes: ["cumpleanos", "quinceanos", "baby-shower", "bautizo", "matrimonio"],
        availability: {
            advanceBooking: "7 dias",
            monday: { available: true, hours: "09:00-18:00" },
            tuesday: { available: true, hours: "09:00-18:00" },
            wednesday: { available: true, hours: "09:00-18:00" },
            thursday: { available: true, hours: "09:00-18:00" },
            friday: { available: true, hours: "09:00-20:00" },
            saturday: { available: true, hours: "08:00-22:00" },
            sunday: { available: false, hours: null }
        },
        blockedDates: [],
        policies: {
            cancellation: "50% de devolucion hasta 5 dias antes del evento.",
            deposit: "50% de adelanto para iniciar el diseno.",
            rules: [
                "Reunion previa para definir tematica",
                "Montaje 4 horas antes del evento",
                "Desmontaje incluido el mismo dia"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Lucia Paredes",
                userAvatar: "LP",
                rating: 5,
                comment: "Ana Lucia transformo el local en un castillo de princesas. Mi hija quedo fascinada. Muy creativa y profesional.",
                date: "2024-11-30",
                eventType: "Cumpleanos",
                verified: true,
                helpful: 8
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Creativo"],
        owner: {
            id: 204,
            name: "Ana Lucia Fernandez",
            avatar: "AF",
            responseRate: 95,
            responseTime: "< 3 horas"
        }
    },
    {
        id: 105,
        name: "Animacion Infantil 'Fiesta Kids'",
        slug: "animacion-fiesta-kids",
        category: "animacion",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura"]
        },
        pricing: {
            type: "per-event",
            basePrice: 300,
            packages: [
                { name: "Básico", price: 300, hours: 2, description: "2 animadores + Juegos + Música" },
                { name: "Show", price: 500, hours: 3, description: "3 animadores + Show de magia + Caritas pintadas" },
                { name: "Mega Fiesta", price: 900, hours: 4, description: "4 animadores + Shows + Personajes + Cama saltarina" }
            ]
        },
        rating: 4.7,
        reviewsCount: 35,
        images: [
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
            "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800",
            "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800",
            "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800"
        ],
        icon: "🤹",
        description: "Shows infantiles con animadores profesionales. Payasos, magos, personajes de Disney y mucho más para hacer felices a los pequeños.",
        shortDescription: "Animación profesional para fiestas infantiles",
        features: [
            "Animadores certificados",
            "Shows de magia",
            "Personajes temáticos",
            "Caritas pintadas",
            "Globoflexia",
            "Juegos y concursos"
        ],
        eventTypes: ["cumpleanos", "baby-shower", "familiar"],
        availability: {
            advanceBooking: "3 dias",
            monday: { available: false, hours: null },
            tuesday: { available: false, hours: null },
            wednesday: { available: false, hours: null },
            thursday: { available: false, hours: null },
            friday: { available: true, hours: "15:00-21:00" },
            saturday: { available: true, hours: "10:00-22:00" },
            sunday: { available: true, hours: "10:00-20:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelacion gratuita 48 horas antes.",
            deposit: "30% para reservar fecha.",
            rules: [
                "Espacio minimo de 4x4 metros",
                "Toma electrica disponible",
                "Snacks para los animadores"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Andrea Gomez",
                userAvatar: "AG",
                rating: 5,
                comment: "Los ninos se divirtieron muchisimo! El show de magia fue increible. Super recomendados.",
                date: "2024-12-05",
                eventType: "Cumpleanos",
                verified: true,
                helpful: 6
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: false,
        badges: ["Verificado", "Kids Friendly"],
        owner: {
            id: 205,
            name: "Equipo Fiesta Kids",
            avatar: "FK",
            responseRate: 94,
            responseTime: "< 2 horas"
        }
    },
    {
        id: 106,
        name: "Tortas y Bocaditos 'Dulce Tentacion'",
        slug: "tortas-dulce-tentacion",
        category: "pasteleria",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura"]
        },
        pricing: {
            type: "custom",
            basePrice: 150,
            packages: [
                { name: "Torta Clásica", price: 150, description: "Torta decorada para 30 porciones" },
                { name: "Torta + Bocaditos", price: 350, description: "Torta 50 porciones + 100 bocaditos" },
                { name: "Mesa Dulce", price: 600, description: "Torta temática + Mesa de dulces completa" }
            ]
        },
        rating: 4.8,
        reviewsCount: 52,
        images: [
            "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800",
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
            "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800",
            "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800"
        ],
        icon: "🎂",
        description: "Tortas artesanales personalizadas y bocaditos para eventos. Especialistas en tortas temáticas y mesas de dulces.",
        shortDescription: "Tortas personalizadas y mesas de dulces para eventos",
        features: [
            "Tortas personalizadas",
            "Diseños temáticos",
            "Bocaditos dulces y salados",
            "Mesa de dulces completa",
            "Cupcakes decorados",
            "Delivery incluido"
        ],
        eventTypes: ["cumpleanos", "quinceanos", "matrimonio", "baby-shower", "bautizo"],
        availability: {
            advanceBooking: "5 dias",
            monday: { available: true, hours: "08:00-18:00" },
            tuesday: { available: true, hours: "08:00-18:00" },
            wednesday: { available: true, hours: "08:00-18:00" },
            thursday: { available: true, hours: "08:00-18:00" },
            friday: { available: true, hours: "08:00-20:00" },
            saturday: { available: true, hours: "08:00-16:00" },
            sunday: { available: false, hours: null }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelacion con 3 dias: 80% devolucion.",
            deposit: "50% al hacer el pedido.",
            rules: [
                "Recojo el dia anterior al evento",
                "Disenos personalizados +48 horas de anticipacion",
                "Delivery disponible en Sullana y Piura"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Rosa Martinez",
                userAvatar: "RM",
                rating: 5,
                comment: "La torta de XV anos quedo espectacular! El sabor exquisito y la decoracion perfecta. Carmen es muy talentosa.",
                date: "2024-11-25",
                eventType: "XV Anos",
                verified: true,
                helpful: 14
            },
            {
                id: 2,
                userName: "Fernando Diaz",
                userAvatar: "FD",
                rating: 4,
                comment: "Muy buena torta y bocaditos. La mesa de dulces fue un exito. El unico detalle fue que llegaron un poco tarde.",
                date: "2024-10-20",
                eventType: "Bautizo",
                verified: true,
                helpful: 5
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Artesanal", "Recomendado"],
        owner: {
            id: 206,
            name: "Carmen Rosa Vega",
            avatar: "CV",
            responseRate: 97,
            responseTime: "< 2 horas"
        }
    },
    {
        id: 107,
        name: "Alquiler de Mobiliario 'Event Rental'",
        slug: "alquiler-event-rental",
        category: "mobiliario",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura", "Talara"]
        },
        pricing: {
            type: "per-item",
            items: [
                { name: "Silla Tiffany", price: 8, unit: "unidad" },
                { name: "Mesa redonda", price: 25, unit: "unidad" },
                { name: "Mantel", price: 15, unit: "unidad" },
                { name: "Carpa 3x3", price: 150, unit: "día" },
                { name: "Carpa 6x6", price: 350, unit: "día" }
            ]
        },
        rating: 4.5,
        reviewsCount: 28,
        images: [
            "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800",
            "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
        ],
        icon: "🪑",
        description: "Alquiler de mobiliario para eventos: sillas, mesas, carpas, manteles y más. Todo lo que necesitas para montar tu evento.",
        shortDescription: "Alquiler de mobiliario completo para todo tipo de eventos",
        features: [
            "Sillas Tiffany y plásticas",
            "Mesas redondas y rectangulares",
            "Carpas y toldos",
            "Manteles y servilletas",
            "Vajilla y cristalería",
            "Transporte incluido"
        ],
        eventTypes: ["matrimonio", "quinceanos", "corporativo", "familiar", "graduacion"],
        availability: {
            advanceBooking: "3 dias",
            monday: { available: true, hours: "08:00-18:00" },
            tuesday: { available: true, hours: "08:00-18:00" },
            wednesday: { available: true, hours: "08:00-18:00" },
            thursday: { available: true, hours: "08:00-18:00" },
            friday: { available: true, hours: "08:00-20:00" },
            saturday: { available: true, hours: "08:00-20:00" },
            sunday: { available: true, hours: "08:00-14:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Devolucion completa hasta 48 horas antes.",
            deposit: "30% al confirmar pedido.",
            rules: [
                "Recojo y devolucion por el cliente o con delivery (costo adicional)",
                "Responsabilidad por danos: costo de reposicion",
                "Inventario al recojo y devolucion"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Carlos Vega",
                userAvatar: "CV",
                rating: 4,
                comment: "Buen servicio y mobiliario en buen estado. El transporte fue puntual.",
                date: "2024-11-10",
                eventType: "Corporativo",
                verified: true,
                helpful: 4
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: false,
        badges: ["Verificado"],
        owner: {
            id: 207,
            name: "Event Rental Sullana",
            avatar: "ER",
            responseRate: 92,
            responseTime: "< 4 horas"
        }
    },
    {
        id: 108,
        name: "Grupo Musical 'Los Sullaneros'",
        slug: "grupo-los-sullaneros",
        category: "banda",
        location: {
            district: "Sullana",
            city: "Piura",
            coverage: ["Sullana", "Piura", "Talara", "Tumbes"]
        },
        pricing: {
            type: "per-event",
            basePrice: 1200,
            packages: [
                { name: "Set Corto", price: 800, hours: 2, description: "2 horas de música en vivo" },
                { name: "Set Completo", price: 1200, hours: 4, description: "4 horas de música variada" },
                { name: "Full Show", price: 2000, hours: 6, description: "Show completo + Hora loca" }
            ]
        },
        rating: 4.9,
        reviewsCount: 45,
        images: [
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
            "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800",
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
            "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=800"
        ],
        icon: "🎤",
        description: "Orquesta versátil con repertorio de cumbia norteña, salsa, merengue, baladas y más. La mejor música para poner a bailar a todos.",
        shortDescription: "Orquesta en vivo con música variada para todo evento",
        features: [
            "8 músicos profesionales",
            "Repertorio variado",
            "Equipo de sonido propio",
            "Iluminación incluida",
            "Hora loca disponible",
            "Canciones personalizadas"
        ],
        eventTypes: ["matrimonio", "quinceanos", "corporativo", "aniversario"],
        availability: {
            advanceBooking: "15 dias",
            monday: { available: false, hours: null },
            tuesday: { available: false, hours: null },
            wednesday: { available: false, hours: null },
            thursday: { available: false, hours: null },
            friday: { available: true, hours: "20:00-04:00" },
            saturday: { available: true, hours: "20:00-05:00" },
            sunday: { available: true, hours: "18:00-01:00" }
        },
        blockedDates: ["2025-02-14", "2025-02-15"],
        policies: {
            cancellation: "50% devolucion hasta 10 dias antes. Sin devolucion despues.",
            deposit: "50% al confirmar fecha, resto 3 dias antes del evento.",
            rules: [
                "Escenario minimo 4x3 metros",
                "Camerino o espacio privado para descanso",
                "Alimentacion para los 8 musicos"
            ]
        },
        reviews: [
            {
                id: 1,
                userName: "Juan Carlos Mendoza",
                userAvatar: "JM",
                rating: 5,
                comment: "Los Sullaneros hicieron de nuestra boda una fiesta inolvidable! Todos bailaron hasta el amanecer. Musica de primera.",
                date: "2024-12-08",
                eventType: "Matrimonio",
                verified: true,
                helpful: 25
            },
            {
                id: 2,
                userName: "Martha Salazar",
                userAvatar: "MS",
                rating: 5,
                comment: "Excelente orquesta! El repertorio es muy variado y la hora loca estuvo espectacular. Vale cada sol invertido.",
                date: "2024-11-15",
                eventType: "XV Anos",
                verified: true,
                helpful: 18
            }
        ],
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Premium", "Exclusivo"],
        owner: {
            id: 208,
            name: "Orquesta Los Sullaneros",
            avatar: "LS",
            responseRate: 95,
            responseTime: "< 6 horas"
        }
    }
];

// ========================================
// CATEGORÍAS DE SERVICIOS - ESTRUCTURA SIMPLE
// ========================================

const SERVICE_CATEGORIES = {
    // Categorías base que coinciden con los datos
    catering: { name: "Catering", icon: "🍽️", color: "#FF6B35" },
    pasteleria: { name: "Pastelería", icon: "🎂", color: "#EF4444" },
    dj: { name: "DJ", icon: "🎧", color: "#8B5CF6" },
    banda: { name: "Banda / Orquesta", icon: "🎤", color: "#7C3AED" },
    fotografia: { name: "Fotografía y Video", icon: "📸", color: "#3B82F6" },
    decoracion: { name: "Decoración", icon: "🎈", color: "#EC4899" },
    animacion: { name: "Animación", icon: "🎭", color: "#F59E0B" },
    mobiliario: { name: "Mobiliario", icon: "🪑", color: "#10B981" },
    // Legacy para compatibilidad
    musica: { name: "Música", icon: "🎵", color: "#8B5CF6" }
};

// Agrupación de categorías para filtros
const SERVICE_CATEGORY_GROUPS = {
    gastronomia: {
        name: "Gastronomía",
        icon: "🍽️",
        color: "#FF6B35",
        includes: ["catering", "pasteleria"]
    },
    musica: {
        name: "Música",
        icon: "🎵",
        color: "#8B5CF6",
        includes: ["dj", "banda"]
    },
    fotografia: {
        name: "Fotografía",
        icon: "📸",
        color: "#3B82F6",
        includes: ["fotografia"]
    },
    decoracion: {
        name: "Decoración",
        icon: "🎈",
        color: "#EC4899",
        includes: ["decoracion"]
    },
    animacion: {
        name: "Animación",
        icon: "🎭",
        color: "#F59E0B",
        includes: ["animacion"]
    },
    mobiliario: {
        name: "Mobiliario",
        icon: "🪑",
        color: "#10B981",
        includes: ["mobiliario"]
    }
};

// Alias para compatibilidad
const SERVICE_CATEGORY_ALIASES = {
    catering: "gastronomia",
    pasteleria: "gastronomia",
    dj: "musica",
    banda: "musica"
};

// Helper functions
function getServiceById(id) {
    return SERVICIOS_DATA.find(service => service.id === id);
}

function getServiceBySlug(slug) {
    return SERVICIOS_DATA.find(service => service.slug === slug);
}

function getFeaturedServices(limit = 8) {
    return SERVICIOS_DATA.filter(service => service.featured).slice(0, limit);
}

function getServicesByCategory(category) {
    return SERVICIOS_DATA.filter(service => service.category === category);
}

function filterServices(filters) {
    let filtered = [...SERVICIOS_DATA];

    if (filters.category) {
        filtered = filtered.filter(service => service.category === filters.category);
    }

    if (filters.eventType) {
        filtered = filtered.filter(service =>
            service.eventTypes.includes(filters.eventType)
        );
    }

    if (filters.priceMax) {
        filtered = filtered.filter(service => {
            const basePrice = service.pricing.basePrice ||
                (service.pricing.packages && service.pricing.packages[0].price) || 0;
            return basePrice <= filters.priceMax;
        });
    }

    if (filters.verified) {
        filtered = filtered.filter(service => service.verified);
    }

    // Sort
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => {
                    const priceA = a.pricing.basePrice || a.pricing.packages[0].price;
                    const priceB = b.pricing.basePrice || b.pricing.packages[0].price;
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                filtered.sort((a, b) => {
                    const priceA = a.pricing.basePrice || a.pricing.packages[0].price;
                    const priceB = b.pricing.basePrice || b.pricing.packages[0].price;
                    return priceB - priceA;
                });
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'reviews':
                filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
                break;
        }
    }

    return filtered;
}

function searchServices(query) {
    const searchTerm = query.toLowerCase();
    return SERVICIOS_DATA.filter(service =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm)
    );
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SERVICIOS_DATA,
        SERVICE_CATEGORIES,
        getServiceById,
        getServiceBySlug,
        getFeaturedServices,
        getServicesByCategory,
        filterServices,
        searchServices
    };
}
