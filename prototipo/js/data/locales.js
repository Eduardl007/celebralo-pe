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
            "assets/images/locales/ejemplo-1.jpg",  // ← CAMBIAR: Agregar fotos reales
            "assets/images/locales/ejemplo-2.jpg",
            "assets/images/locales/ejemplo-3.jpg"
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
            phone: "+51 900 000 000",             // ← CAMBIAR: Teléfono real del proveedor
            whatsapp: "+51 900 000 000",          // ← CAMBIAR: WhatsApp real (importante!)
            email: "contacto@ejemplo.com"         // ← CAMBIAR: Email real
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
            "assets/images/locales/jardines-1.jpg",
            "assets/images/locales/jardines-2.jpg",
            "assets/images/locales/jardines-3.jpg"
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
            phone: "+51 999 111 222",
            whatsapp: "+51 999 111 222",
            email: "reservas@losjardines.pe"
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Top Rated", "Respuesta Rápida"],
        createdAt: "2024-01-15",
        owner: {
            id: 101,
            name: "María Elena Rodríguez",
            avatar: "ME",
            responseRate: 98,
            responseTime: "< 1 hora"
        }
    },
    {
        id: 2,
        name: "Quinta El Paraíso",
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
            "assets/images/locales/paraiso-1.jpg",
            "assets/images/locales/paraiso-2.jpg"
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
            phone: "+51 999 222 333",
            whatsapp: "+51 999 222 333",
            email: "contacto@quintaparaiso.pe"
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Familiar"],
        createdAt: "2024-02-20",
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
            "assets/images/locales/mansion-1.jpg",
            "assets/images/locales/mansion-2.jpg",
            "assets/images/locales/mansion-3.jpg",
            "assets/images/locales/mansion-4.jpg"
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
            phone: "+51 999 333 444",
            whatsapp: "+51 999 333 444",
            email: "eventos@lamansion.pe"
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Premium", "Top Rated", "Coordinador Incluido"],
        createdAt: "2023-11-10",
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
            "assets/images/locales/fiesta-1.jpg",
            "assets/images/locales/fiesta-2.jpg"
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
            phone: "+51 999 444 555",
            whatsapp: "+51 999 444 555",
            email: "fiestaalegre@gmail.com"
        },
        verified: true,
        featured: false,
        badges: ["Verificado", "Económico"],
        createdAt: "2024-03-05",
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
            "assets/images/locales/bosque-1.jpg",
            "assets/images/locales/bosque-2.jpg",
            "assets/images/locales/bosque-3.jpg"
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
            phone: "+51 999 555 666",
            whatsapp: "+51 999 555 666",
            email: "reservas@clubelbosque.pe"
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Corporativo", "Deportivo"],
        createdAt: "2024-01-08",
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
            "assets/images/locales/terraza-1.jpg",
            "assets/images/locales/terraza-2.jpg"
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
            phone: "+51 999 666 777",
            whatsapp: "+51 999 666 777",
            email: "vistahermosa@gmail.com"
        },
        verified: true,
        featured: false,
        badges: ["Verificado", "Romántico"],
        createdAt: "2024-04-12",
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
