/* ========================================
   CELÉBRALO PE - Locales Data
   ======================================== */

const LOCALES_DATA = [
    // ============================================
    // 🎯 LOCAL DE EJEMPLO - PERSONALIZA ESTE
    // Copia esta estructura para agregar más locales
    // ============================================
    {
        id: 0,
        name: "📍 Salón de Eventos El Ejemplo",  // ← CAMBIAR: Nombre real del local
        slug: "salon-ejemplo",                    // ← CAMBIAR: URL amigable (sin espacios, minúsculas)
        category: "salon",                        // Opciones: salon, quinta, jardin, club, restaurante, hotel
        location: {
            address: "Av. San Martín 123",        // ← CAMBIAR: Dirección real
            district: "Sullana",
            city: "Piura",
            coordinates: { lat: -4.9034, lng: -80.6879 }  // ← CAMBIAR: Coordenadas de Google Maps
        },
        capacity: {
            min: 50,                              // ← CAMBIAR: Mínimo de personas
            max: 150,                             // ← CAMBIAR: Máximo de personas
            seated: 120,                          // ← CAMBIAR: Sentados
            standing: 180                         // ← CAMBIAR: De pie
        },
        price: {
            base: 800,                            // ← CAMBIAR: Precio base en soles
            perHour: 100,                         // ← CAMBIAR: Por hora adicional
            deposit: 300,                         // ← CAMBIAR: Depósito/adelanto
            currency: "PEN"
        },
        rating: 4.5,                              // Rating inicial (1-5)
        reviewsCount: 0,                          // Empezar en 0
        images: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
            "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800"
        ],
        icon: "🏛️",                              // Emoji del local
        description: "Describe aquí tu local con todos los detalles: ambiente, decoración, qué lo hace especial, servicios incluidos, etc. Esta descripción aparece en la página de detalle.",
        shortDescription: "Descripción corta para las tarjetas (máx 100 caracteres)",
        amenities: [
            // ← CAMBIAR: Solo incluir las que realmente tiene
            { icon: "fa-parking", name: "Estacionamiento", description: "20 espacios" },
            { icon: "fa-snowflake", name: "Aire Acondicionado", description: "Sistema central" },
            { icon: "fa-wifi", name: "WiFi", description: "Gratis para invitados" },
            { icon: "fa-music", name: "Equipo de Sonido", description: "Incluido" },
            { icon: "fa-restroom", name: "Baños", description: "Separados damas/caballeros" }
            // Otros: fa-utensils (cocina), fa-swimming-pool (piscina), fa-tree (jardín),
            // fa-child (juegos infantiles), fa-fire (parrilla), fa-video (proyector)
        ],
        eventTypes: ["cumpleanos", "matrimonio", "quinceanos", "corporativo", "bautizo"],
        availability: {
            monday: { available: false, hours: "" },     // ← CAMBIAR: Días que atiende
            tuesday: { available: true, hours: "16:00-23:00" },
            wednesday: { available: true, hours: "16:00-23:00" },
            thursday: { available: true, hours: "16:00-23:00" },
            friday: { available: true, hours: "16:00-02:00" },
            saturday: { available: true, hours: "10:00-02:00" },
            sunday: { available: true, hours: "10:00-22:00" }
        },
        blockedDates: [],                         // Fechas ya reservadas: ["2025-01-15", "2025-02-14"]
        policies: {
            cancellation: "Cancelación con 7 días de anticipación",
            deposit: "50% al reservar, 50% una semana antes del evento",
            rules: ["No fumar en interiores", "Horario máximo según disponibilidad"]
        },
        contact: {
            phone: null,                          // Oculto - contacto via plataforma
            whatsapp: null,                       // Oculto - contacto via plataforma
            email: null                           // Oculto - contacto via plataforma
        },
        verified: false,                          // true cuando verificas al proveedor
        featured: true,                           // true para destacarlo en home
        badges: [],                               // Agregar: "Verificado", "Nuevo", "Popular"
        createdAt: "2025-01-01",
        owner: {
            id: 1,
            name: "Nombre del Propietario",       // ← CAMBIAR: Nombre real
            avatar: "NP",                         // ← CAMBIAR: Iniciales
            responseRate: 90,
            responseTime: "< 2 horas"
        }
    },
    // ============================================
    // FIN DEL EJEMPLO - Los siguientes son demos
    // ============================================
    {
        id: 1,
        name: "Salón Los Jardines Premium",
        slug: "salon-los-jardines-premium",
        category: "salon",
        location: {
            address: "Av. José de Lama 450",
            district: "Sullana",
            city: "Piura",
            coordinates: { lat: -4.9034, lng: -80.6879 }
        },
        capacity: {
            min: 80,
            max: 200,
            seated: 180,
            standing: 250
        },
        price: {
            base: 1200,
            perHour: 200,
            deposit: 500,
            currency: "PEN"
        },
        rating: 4.8,
        reviewsCount: 45,
        images: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
            "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800"
        ],
        icon: "🏛️",
        description: "Elegante salón con jardines amplios, ideal para matrimonios y eventos grandes. Ambiente sofisticado con decoración clásica y moderna.",
        shortDescription: "Elegante salón con jardines amplios para eventos grandes",
        amenities: [
            { icon: "fa-parking", name: "Estacionamiento", description: "50 espacios gratuitos" },
            { icon: "fa-snowflake", name: "Aire Acondicionado", description: "Sistema central" },
            { icon: "fa-wifi", name: "WiFi", description: "Alta velocidad gratuito" },
            { icon: "fa-utensils", name: "Cocina Industrial", description: "Equipada completamente" },
            { icon: "fa-restroom", name: "Baños VIP", description: "4 baños para damas y caballeros" },
            { icon: "fa-tree", name: "Jardín", description: "500m² de áreas verdes" }
        ],
        eventTypes: ["matrimonio", "quinceanos", "corporativo", "graduacion"],
        availability: {
            monday: { available: true, hours: "10:00-23:00" },
            tuesday: { available: true, hours: "10:00-23:00" },
            wednesday: { available: true, hours: "10:00-23:00" },
            thursday: { available: true, hours: "10:00-23:00" },
            friday: { available: true, hours: "10:00-02:00" },
            saturday: { available: true, hours: "10:00-02:00" },
            sunday: { available: true, hours: "10:00-22:00" }
        },
        blockedDates: ["2025-01-01", "2025-12-25", "2025-12-31"],
        policies: {
            cancellation: "Cancelación gratuita hasta 7 días antes del evento",
            deposit: "50% al reservar, 50% una semana antes",
            rules: ["No se permite fumar en interiores", "Mascotas no permitidas", "Horario máximo: 2am"]
        },
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Top Rated", "Respuesta Rapida"],
        createdAt: "2024-01-15",
        reviews: [
            {
                id: 1,
                userName: "Carmen Lucia Vega",
                userAvatar: "CV",
                rating: 5,
                comment: "Celebramos el matrimonio de mi hija aqui y fue magico. El jardin es precioso y todo el personal muy atento. Totalmente recomendado.",
                date: "2024-12-20",
                eventType: "Matrimonio",
                verified: true,
                helpful: 28
            },
            {
                id: 2,
                userName: "Roberto Mendoza",
                userAvatar: "RM",
                rating: 5,
                comment: "Excelente local para eventos corporativos. Amplio, elegante y con todas las comodidades. La atencion de Maria Elena es de primera.",
                date: "2024-11-15",
                eventType: "Corporativo",
                verified: true,
                helpful: 15
            },
            {
                id: 3,
                userName: "Patricia Sanchez",
                userAvatar: "PS",
                rating: 4,
                comment: "Muy buen local para los XV de mi hija. El unico detalle fue el aire acondicionado que tardo en enfriar, pero todo lo demas perfecto.",
                date: "2024-10-28",
                eventType: "XV Anos",
                verified: true,
                helpful: 8
            }
        ],
        owner: {
            id: 101,
            name: "Maria Elena Rodriguez",
            avatar: "ME",
            responseRate: 98,
            responseTime: "< 1 hora"
        }
    },
    {
        id: 2,
        name: "Quinta El Paraiso",
        slug: "quinta-el-paraiso",
        category: "quinta",
        location: {
            address: "Urb. San Martín Mz. C Lt. 15",
            district: "Sullana",
            city: "Piura",
            coordinates: { lat: -4.8965, lng: -80.6823 }
        },
        capacity: {
            min: 50,
            max: 150,
            seated: 130,
            standing: 180
        },
        price: {
            base: 900,
            perHour: 150,
            deposit: 400,
            currency: "PEN"
        },
        rating: 4.6,
        reviewsCount: 32,
        images: [
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
            "https://images.unsplash.com/photo-1529543544277-8a168fc5d93a?w=800"
        ],
        icon: "🌳",
        description: "Hermosa quinta campestre con áreas verdes y piscina. Perfecta para eventos al aire libre y reuniones familiares en un ambiente natural y relajado.",
        shortDescription: "Quinta campestre con piscina y amplias áreas verdes",
        amenities: [
            { icon: "fa-swimming-pool", name: "Piscina", description: "Piscina grande con área infantil" },
            { icon: "fa-fire", name: "Parrillas", description: "3 estaciones de parrilla" },
            { icon: "fa-child", name: "Juegos Infantiles", description: "Área de juegos segura" },
            { icon: "fa-parking", name: "Estacionamiento", description: "30 espacios" },
            { icon: "fa-utensils", name: "Zona BBQ", description: "Área techada para cocina" }
        ],
        eventTypes: ["cumpleanos", "familiar", "bautizo", "baby-shower"],
        availability: {
            monday: { available: false, hours: null },
            tuesday: { available: false, hours: null },
            wednesday: { available: true, hours: "12:00-22:00" },
            thursday: { available: true, hours: "12:00-22:00" },
            friday: { available: true, hours: "12:00-00:00" },
            saturday: { available: true, hours: "10:00-00:00" },
            sunday: { available: true, hours: "10:00-22:00" }
        },
        blockedDates: ["2025-01-01"],
        policies: {
            cancellation: "Cancelación gratuita hasta 5 días antes",
            deposit: "40% al reservar",
            rules: ["Piscina supervisada", "No mascotas", "Máximo 150 personas"]
        },
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Familiar"],
        createdAt: "2024-02-20",
        reviews: [
            {
                id: 1,
                userName: "Ana Maria Torres",
                userAvatar: "AT",
                rating: 5,
                comment: "Celebramos el cumple de mi hijo aqui y los ninos la pasaron increible. La piscina y los juegos fueron un exito. Carlos siempre atento a todo.",
                date: "2024-12-10",
                eventType: "Cumpleanos",
                verified: true,
                helpful: 22
            },
            {
                id: 2,
                userName: "Luis Fernando Zapata",
                userAvatar: "LZ",
                rating: 4,
                comment: "Muy bonita quinta para eventos familiares. El unico detalle es que el estacionamiento es algo pequeno para eventos grandes.",
                date: "2024-11-05",
                eventType: "Familiar",
                verified: true,
                helpful: 10
            },
            {
                id: 3,
                userName: "Gabriela Ruiz",
                userAvatar: "GR",
                rating: 5,
                comment: "Hicimos el baby shower de mi hermana y quedo perfecto. El ambiente campestre le da un toque muy especial. 100% recomendado.",
                date: "2024-10-20",
                eventType: "Baby Shower",
                verified: true,
                helpful: 18
            }
        ],
        owner: {
            id: 102,
            name: "Carlos Mendoza",
            avatar: "CM",
            responseRate: 95,
            responseTime: "< 2 horas"
        }
    },
    {
        id: 3,
        name: "Centro de Eventos La Mansión",
        slug: "centro-eventos-la-mansion",
        category: "centro-eventos",
        location: {
            address: "Calle San Martín 450",
            district: "Sullana Centro",
            city: "Piura",
            coordinates: { lat: -4.9012, lng: -80.6901 }
        },
        capacity: {
            min: 100,
            max: 300,
            seated: 280,
            standing: 400
        },
        price: {
            base: 1800,
            perHour: 300,
            deposit: 800,
            currency: "PEN"
        },
        rating: 4.9,
        reviewsCount: 67,
        images: [
            "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800",
            "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800",
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
            "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800"
        ],
        icon: "🏰",
        description: "El local más exclusivo de Sullana. Decoración de lujo, servicio premium y tecnología de punta para eventos inolvidables. Incluye coordinador de eventos.",
        shortDescription: "El local más exclusivo de Sullana con servicio premium",
        amenities: [
            { icon: "fa-magic", name: "Decoración Incluida", description: "Decoración de lujo" },
            { icon: "fa-shield-alt", name: "Seguridad 24/7", description: "Personal de seguridad" },
            { icon: "fa-concierge-bell", name: "Catering Gourmet", description: "Servicio opcional" },
            { icon: "fa-car", name: "Valet Parking", description: "Servicio incluido" },
            { icon: "fa-bed", name: "Suite Novios", description: "Habitación privada" },
            { icon: "fa-music", name: "Sistema de Audio", description: "Sonido profesional" }
        ],
        eventTypes: ["matrimonio", "quinceanos", "corporativo", "graduacion"],
        availability: {
            monday: { available: true, hours: "09:00-23:00" },
            tuesday: { available: true, hours: "09:00-23:00" },
            wednesday: { available: true, hours: "09:00-23:00" },
            thursday: { available: true, hours: "09:00-23:00" },
            friday: { available: true, hours: "09:00-03:00" },
            saturday: { available: true, hours: "09:00-03:00" },
            sunday: { available: true, hours: "09:00-23:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelación con 50% devolución hasta 14 días antes",
            deposit: "60% al reservar",
            rules: ["Dress code semi-formal", "Coordinador asignado", "Incluye limpieza"]
        },
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Premium", "Top Rated", "Coordinador Incluido"],
        createdAt: "2023-11-10",
        reviews: [
            {
                id: 1,
                userName: "Jorge Alejandro Medina",
                userAvatar: "JM",
                rating: 5,
                comment: "El mejor local de Sullana sin duda. El matrimonio de mi hija fue un cuento de hadas. El coordinador incluido vale cada sol. Perfecto.",
                date: "2024-12-28",
                eventType: "Matrimonio",
                verified: true,
                helpful: 45
            },
            {
                id: 2,
                userName: "Empresa Agroexport Norte SAC",
                userAvatar: "AN",
                rating: 5,
                comment: "Realizamos nuestra cena de fin de ano empresarial aqui. Instalaciones de lujo, servicio impecable. El valet parking fue un plus para nuestros ejecutivos.",
                date: "2024-12-18",
                eventType: "Corporativo",
                verified: true,
                helpful: 32
            },
            {
                id: 3,
                userName: "Rosa Elena Cordova",
                userAvatar: "RC",
                rating: 5,
                comment: "Los quince de mi sobrina quedaron espectaculares. La decoracion incluida es hermosa. Vale la pena invertir en este local.",
                date: "2024-11-22",
                eventType: "XV Anos",
                verified: true,
                helpful: 28
            },
            {
                id: 4,
                userName: "Fernando Castillo",
                userAvatar: "FC",
                rating: 4,
                comment: "Excelente local premium. El unico detalle es que se llena rapido, hay que reservar con meses de anticipacion.",
                date: "2024-10-15",
                eventType: "Matrimonio",
                verified: true,
                helpful: 19
            }
        ],
        owner: {
            id: 103,
            name: "Grupo Eventos Premium SAC",
            avatar: "EP",
            responseRate: 100,
            responseTime: "< 30 min"
        }
    },
    {
        id: 4,
        name: "Salón Fiesta Alegre",
        slug: "salon-fiesta-alegre",
        category: "salon",
        location: {
            address: "Jr. Bolognesi 230",
            district: "Sullana",
            city: "Piura",
            coordinates: { lat: -4.9045, lng: -80.6856 }
        },
        capacity: {
            min: 30,
            max: 100,
            seated: 90,
            standing: 120
        },
        price: {
            base: 600,
            perHour: 100,
            deposit: 250,
            currency: "PEN"
        },
        rating: 4.4,
        reviewsCount: 28,
        images: [
            "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=800",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"
        ],
        icon: "🎊",
        description: "Salón acogedor y económico, perfecto para cumpleaños y reuniones pequeñas. Excelente relación calidad-precio para eventos íntimos.",
        shortDescription: "Salón económico ideal para eventos pequeños",
        amenities: [
            { icon: "fa-volume-up", name: "Sonido Básico", description: "Equipo de audio" },
            { icon: "fa-chair", name: "Mesas y Sillas", description: "100 personas" },
            { icon: "fa-paint-brush", name: "Decoración", description: "Opcional" },
            { icon: "fa-utensils", name: "Cocina", description: "Cocina básica" }
        ],
        eventTypes: ["cumpleanos", "familiar", "baby-shower", "reunion"],
        availability: {
            monday: { available: false, hours: null },
            tuesday: { available: false, hours: null },
            wednesday: { available: false, hours: null },
            thursday: { available: true, hours: "14:00-22:00" },
            friday: { available: true, hours: "14:00-00:00" },
            saturday: { available: true, hours: "10:00-00:00" },
            sunday: { available: true, hours: "10:00-20:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelación gratuita hasta 3 días antes",
            deposit: "30% al reservar",
            rules: ["Decoración propia permitida", "Máximo hasta medianoche"]
        },
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: false,
        badges: ["Verificado", "Económico"],
        createdAt: "2024-03-05",
        reviews: [
            {
                id: 1,
                userName: "Mirtha Coloma",
                userAvatar: "MC",
                rating: 5,
                comment: "Excelente opcion economica! Celebre el cumple de mi esposo y no nos falto nada. Rosa es muy amable y flexible con la decoracion.",
                date: "2024-12-08",
                eventType: "Cumpleanos",
                verified: true,
                helpful: 14
            },
            {
                id: 2,
                userName: "Javier Palacios",
                userAvatar: "JP",
                rating: 4,
                comment: "Buen salon para eventos pequenos. Precio justo para lo que ofrece. El equipo de sonido es basico pero cumple.",
                date: "2024-11-15",
                eventType: "Reunion",
                verified: true,
                helpful: 8
            },
            {
                id: 3,
                userName: "Luciana Chavez",
                userAvatar: "LC",
                rating: 4,
                comment: "Hicimos una reunion familiar y estuvo bien. El local es sencillo pero limpio y bien mantenido.",
                date: "2024-09-20",
                eventType: "Familiar",
                verified: true,
                helpful: 6
            }
        ],
        owner: {
            id: 104,
            name: "Rosa Sánchez",
            avatar: "RS",
            responseRate: 90,
            responseTime: "< 4 horas"
        }
    },
    {
        id: 5,
        name: "Club Campestre El Bosque",
        slug: "club-campestre-el-bosque",
        category: "club",
        location: {
            address: "Carretera Sullana-Piura Km 3",
            district: "Sullana",
            city: "Piura",
            coordinates: { lat: -4.8876, lng: -80.6734 }
        },
        capacity: {
            min: 80,
            max: 250,
            seated: 220,
            standing: 300
        },
        price: {
            base: 1500,
            perHour: 250,
            deposit: 600,
            currency: "PEN"
        },
        rating: 4.7,
        reviewsCount: 41,
        images: [
            "https://images.unsplash.com/photo-1529543544277-8a168fc5d93a?w=800",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800"
        ],
        icon: "⚽",
        description: "Club deportivo con amplios espacios verdes. Ideal para eventos empresariales y familiares. Incluye áreas recreativas y deportivas.",
        shortDescription: "Club deportivo con amplios espacios y áreas recreativas",
        amenities: [
            { icon: "fa-futbol", name: "Canchas Deportivas", description: "Fútbol, vóley, básquet" },
            { icon: "fa-swimming-pool", name: "Piscina Olímpica", description: "25 metros" },
            { icon: "fa-utensils", name: "Restaurante", description: "Capacidad 100 personas" },
            { icon: "fa-parking", name: "Estacionamiento", description: "100 espacios" },
            { icon: "fa-child", name: "Zona Kids", description: "Área de juegos" }
        ],
        eventTypes: ["corporativo", "familiar", "team-building", "graduacion"],
        availability: {
            monday: { available: true, hours: "08:00-22:00" },
            tuesday: { available: true, hours: "08:00-22:00" },
            wednesday: { available: true, hours: "08:00-22:00" },
            thursday: { available: true, hours: "08:00-22:00" },
            friday: { available: true, hours: "08:00-00:00" },
            saturday: { available: true, hours: "08:00-00:00" },
            sunday: { available: true, hours: "08:00-20:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelación con 70% devolución hasta 10 días antes",
            deposit: "50% al reservar",
            rules: ["Uso de instalaciones deportivas incluido", "Guardavidas disponible", "Eventos corporativos con descuento"]
        },
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Corporativo", "Deportivo"],
        createdAt: "2024-01-08",
        reviews: [
            {
                id: 1,
                userName: "Banco del Norte - RRHH",
                userAvatar: "BN",
                rating: 5,
                comment: "Organizamos nuestro team building anual aqui. Las instalaciones deportivas son excelentes. Los empleados quedaron encantados. Muy recomendado para empresas.",
                date: "2024-12-05",
                eventType: "Team Building",
                verified: true,
                helpful: 35
            },
            {
                id: 2,
                userName: "Maria del Carmen Flores",
                userAvatar: "MF",
                rating: 5,
                comment: "Celebramos la graduacion de mi hijo con sus companeros. El restaurante tiene buena comida y los chicos disfrutaron las canchas y piscina.",
                date: "2024-11-28",
                eventType: "Graduacion",
                verified: true,
                helpful: 21
            },
            {
                id: 3,
                userName: "Roberto Guerrero",
                userAvatar: "RG",
                rating: 4,
                comment: "Muy buen club para eventos familiares grandes. El espacio es amplio y los ninos tienen donde jugar. El precio es justo.",
                date: "2024-10-12",
                eventType: "Familiar",
                verified: true,
                helpful: 15
            }
        ],
        owner: {
            id: 105,
            name: "Club El Bosque SAC",
            avatar: "CB",
            responseRate: 96,
            responseTime: "< 1 hora"
        }
    },
    {
        id: 6,
        name: "Terraza Vista Hermosa",
        slug: "terraza-vista-hermosa",
        category: "terraza",
        location: {
            address: "Urb. Los Jardines Mz. A Lt. 1",
            district: "Sullana",
            city: "Piura",
            coordinates: { lat: -4.9078, lng: -80.6912 }
        },
        capacity: {
            min: 30,
            max: 80,
            seated: 70,
            standing: 100
        },
        price: {
            base: 700,
            perHour: 120,
            deposit: 300,
            currency: "PEN"
        },
        rating: 4.5,
        reviewsCount: 19,
        images: [
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
            "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800"
        ],
        icon: "🌅",
        description: "Terraza moderna con vista panorámica de Sullana. Perfecta para eventos íntimos y celebraciones especiales al atardecer.",
        shortDescription: "Terraza con vista panorámica para eventos íntimos",
        amenities: [
            { icon: "fa-eye", name: "Vista Panorámica", description: "Vista 360° de la ciudad" },
            { icon: "fa-glass-martini-alt", name: "Bar Incluido", description: "Barra de bar equipada" },
            { icon: "fa-umbrella", name: "Terraza Techada", description: "Protección solar" },
            { icon: "fa-lightbulb", name: "Iluminación LED", description: "Ambiente personalizable" }
        ],
        eventTypes: ["cumpleanos", "aniversario", "pedida", "reunion"],
        availability: {
            monday: { available: false, hours: null },
            tuesday: { available: false, hours: null },
            wednesday: { available: true, hours: "17:00-23:00" },
            thursday: { available: true, hours: "17:00-23:00" },
            friday: { available: true, hours: "17:00-01:00" },
            saturday: { available: true, hours: "16:00-01:00" },
            sunday: { available: true, hours: "16:00-22:00" }
        },
        blockedDates: [],
        policies: {
            cancellation: "Cancelación gratuita hasta 4 días antes",
            deposit: "40% al reservar",
            rules: ["Ideal para atardeceres", "Música ambiente incluida", "Máximo 80 personas"]
        },
        contact: {
            phone: null,
            whatsapp: null,
            email: null
        },
        verified: true,
        featured: false,
        badges: ["Verificado", "Romántico"],
        createdAt: "2024-04-12",
        reviews: [
            {
                id: 1,
                userName: "Carlos y Mariana",
                userAvatar: "CM",
                rating: 5,
                comment: "Mi esposo me pidio matrimonio aqui al atardecer. La vista es impresionante y Patricia nos ayudo a organizar todo. Momento inolvidable.",
                date: "2024-12-15",
                eventType: "Pedida de Mano",
                verified: true,
                helpful: 28
            },
            {
                id: 2,
                userName: "Sandra Vilchez",
                userAvatar: "SV",
                rating: 5,
                comment: "Celebramos nuestro aniversario de 25 anos con vista a la ciudad. Romantico y perfecto para eventos intimos. El bar incluido es un plus.",
                date: "2024-11-10",
                eventType: "Aniversario",
                verified: true,
                helpful: 19
            },
            {
                id: 3,
                userName: "Diego Alvarado",
                userAvatar: "DA",
                rating: 4,
                comment: "Linda terraza para cumpleanos intimos. Los atardeceres son espectaculares. Solo que el aforo es limitado, no es para eventos muy grandes.",
                date: "2024-10-05",
                eventType: "Cumpleanos",
                verified: true,
                helpful: 12
            }
        ],
        owner: {
            id: 106,
            name: "Patricia Vargas",
            avatar: "PV",
            responseRate: 92,
            responseTime: "< 3 horas"
        }
    }
];

// Categories mapping
const LOCALE_CATEGORIES = {
    salon: { name: "Salón de Eventos", icon: "🏛️" },
    quinta: { name: "Quinta / Casa de Campo", icon: "🌳" },
    "centro-eventos": { name: "Centro de Eventos", icon: "🏰" },
    club: { name: "Club / Centro Recreativo", icon: "⚽" },
    terraza: { name: "Terraza / Rooftop", icon: "🌅" },
    restaurante: { name: "Restaurante", icon: "🍽️" },
    hotel: { name: "Hotel / Salón de Hotel", icon: "🏨" }
};

// Event types mapping
const EVENT_TYPES = {
    cumpleanos: { name: "Cumpleaños", icon: "🎂" },
    matrimonio: { name: "Matrimonio", icon: "💒" },
    quinceanos: { name: "XV Años", icon: "👸" },
    corporativo: { name: "Corporativo", icon: "🏢" },
    bautizo: { name: "Bautizo", icon: "⛪" },
    graduacion: { name: "Graduación", icon: "🎓" },
    "baby-shower": { name: "Baby Shower", icon: "👶" },
    familiar: { name: "Reunión Familiar", icon: "👨‍👩‍👧‍👦" },
    aniversario: { name: "Aniversario", icon: "💕" },
    "team-building": { name: "Team Building", icon: "🤝" },
    reunion: { name: "Reunión Social", icon: "🎉" },
    pedida: { name: "Pedida de Mano", icon: "💍" }
};

// Helper functions
function getLocaleById(id) {
    return LOCALES_DATA.find(locale => locale.id === id);
}

function getLocaleBySlug(slug) {
    return LOCALES_DATA.find(locale => locale.slug === slug);
}

function getFeaturedLocales(limit = 6) {
    return LOCALES_DATA.filter(locale => locale.featured).slice(0, limit);
}

function filterLocales(filters) {
    let filtered = [...LOCALES_DATA];

    if (filters.eventType) {
        filtered = filtered.filter(locale =>
            locale.eventTypes.includes(filters.eventType)
        );
    }

    if (filters.capacity) {
        const [min, max] = filters.capacity.split('-').map(n => parseInt(n) || 0);
        filtered = filtered.filter(locale => {
            if (max) {
                return locale.capacity.max >= min && locale.capacity.min <= max;
            }
            return locale.capacity.max >= min;
        });
    }

    if (filters.priceMin) {
        filtered = filtered.filter(locale => locale.price.base >= filters.priceMin);
    }

    if (filters.priceMax) {
        filtered = filtered.filter(locale => locale.price.base <= filters.priceMax);
    }

    if (filters.category) {
        filtered = filtered.filter(locale => locale.category === filters.category);
    }

    if (filters.verified) {
        filtered = filtered.filter(locale => locale.verified);
    }

    // Sort
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price.base - b.price.base);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price.base - a.price.base);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'reviews':
                filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
                break;
            case 'capacity':
                filtered.sort((a, b) => b.capacity.max - a.capacity.max);
                break;
        }
    }

    return filtered;
}

function searchLocales(query) {
    const searchTerm = query.toLowerCase();
    return LOCALES_DATA.filter(locale =>
        locale.name.toLowerCase().includes(searchTerm) ||
        locale.description.toLowerCase().includes(searchTerm) ||
        locale.location.district.toLowerCase().includes(searchTerm) ||
        locale.location.address.toLowerCase().includes(searchTerm)
    );
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LOCALES_DATA,
        LOCALE_CATEGORIES,
        EVENT_TYPES,
        getLocaleById,
        getLocaleBySlug,
        getFeaturedLocales,
        filterLocales,
        searchLocales
    };
}
