/* ========================================
   EVENTIFY - Servicios Data
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
            "assets/images/servicios/catering-1.jpg",
            "assets/images/servicios/catering-2.jpg"
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
            operatingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        },
        contact: {
            phone: "+51 999 100 200",
            whatsapp: "+51 999 100 200",
            email: "pedidos@sabornorteno.pe"
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Top Rated", "Más Pedido"],
        owner: {
            id: 201,
            name: "Chef Miguel Ángel Ramos",
            avatar: "MR",
            responseRate: 99,
            responseTime: "< 1 hora"
        }
    },
    {
        id: 102,
        name: "DJ Profesional 'Mix Master'",
        slug: "dj-mix-master",
        category: "musica",
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
            "assets/images/servicios/dj-1.jpg",
            "assets/images/servicios/dj-2.jpg"
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
            advanceBooking: "5 días",
            operatingDays: ["Jueves", "Viernes", "Sábado", "Domingo"]
        },
        contact: {
            phone: "+51 999 200 300",
            whatsapp: "+51 999 200 300",
            email: "djmixmaster@gmail.com"
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
        name: "Fotografía y Video 'Momentos'",
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
            "assets/images/servicios/foto-1.jpg",
            "assets/images/servicios/foto-2.jpg"
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
            advanceBooking: "10 días",
            operatingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        },
        contact: {
            phone: "+51 999 300 400",
            whatsapp: "+51 999 300 400",
            email: "contacto@momentosfoto.pe"
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
        name: "Decoración Temática 'Eventos Mágicos'",
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
            "assets/images/servicios/decoracion-1.jpg",
            "assets/images/servicios/decoracion-2.jpg"
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
            advanceBooking: "7 días",
            operatingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        },
        contact: {
            phone: "+51 999 400 500",
            whatsapp: "+51 999 400 500",
            email: "eventosmagicos@gmail.com"
        },
        verified: true,
        featured: true,
        badges: ["Verificado", "Creativo"],
        owner: {
            id: 204,
            name: "Ana Lucía Fernández",
            avatar: "AF",
            responseRate: 95,
            responseTime: "< 3 horas"
        }
    },
    {
        id: 105,
        name: "Animación Infantil 'Fiesta Kids'",
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
            "assets/images/servicios/animacion-1.jpg"
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
            advanceBooking: "3 días",
            operatingDays: ["Viernes", "Sábado", "Domingo"]
        },
        contact: {
            phone: "+51 999 500 600",
            whatsapp: "+51 999 500 600",
            email: "fiestakids@gmail.com"
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
        name: "Tortas y Bocaditos 'Dulce Tentación'",
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
            "assets/images/servicios/tortas-1.jpg",
            "assets/images/servicios/tortas-2.jpg"
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
            advanceBooking: "5 días",
            operatingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        },
        contact: {
            phone: "+51 999 600 700",
            whatsapp: "+51 999 600 700",
            email: "dulcetentacion@gmail.com"
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
            "assets/images/servicios/mobiliario-1.jpg"
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
            advanceBooking: "3 días",
            operatingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        },
        contact: {
            phone: "+51 999 700 800",
            whatsapp: "+51 999 700 800",
            email: "eventrental@gmail.com"
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
        category: "musica",
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
            "assets/images/servicios/grupo-1.jpg"
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
            advanceBooking: "15 días",
            operatingDays: ["Viernes", "Sábado", "Domingo"]
        },
        contact: {
            phone: "+51 999 800 900",
            whatsapp: "+51 999 800 900",
            email: "lossullaneros@gmail.com"
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

// Service categories
const SERVICE_CATEGORIES = {
    catering: { name: "Catering", icon: "🍽️", color: "#FF6B35" },
    musica: { name: "Música y DJ", icon: "🎵", color: "#8B5CF6" },
    fotografia: { name: "Fotografía y Video", icon: "📸", color: "#3B82F6" },
    decoracion: { name: "Decoración", icon: "🎈", color: "#EC4899" },
    animacion: { name: "Animación", icon: "🤹", color: "#F59E0B" },
    pasteleria: { name: "Pastelería", icon: "🎂", color: "#EF4444" },
    mobiliario: { name: "Mobiliario", icon: "🪑", color: "#10B981" },
    transporte: { name: "Transporte", icon: "🚗", color: "#6366F1" }
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
