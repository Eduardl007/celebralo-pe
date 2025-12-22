/* ========================================
   CELÉBRALO PE - Home Page Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHomePage();
});

function initHomePage() {
    // Initialize search tabs
    initSearchTabs();

    // Initialize search form
    initSearchForm();

    // Load featured locales
    loadFeaturedLocales();

    // Load featured services
    loadFeaturedServices();

    // Initialize stat counters animation
    initStatCounters();

    // Initialize testimonials slider (if needed)
    initTestimonialsSlider();

    // Set minimum date for event date picker
    setMinEventDate();
}

// Search Tabs
function initSearchTabs() {
    const tabs = document.querySelectorAll('.search-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');

            // Update search form based on tab
            const tabType = tab.dataset.tab;
            updateSearchFormForTab(tabType);
        });
    });
}

function updateSearchFormForTab(tabType) {
    const searchBtn = document.querySelector('.search-btn');

    switch (tabType) {
        case 'locales':
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar Locales';
            break;
        case 'servicios':
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar Servicios';
            break;
        case 'paquetes':
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Ver Paquetes';
            break;
    }
}

// Search Form
function initSearchForm() {
    const form = document.getElementById('searchForm');

    if (form) {
        form.addEventListener('submit', handleSearch);
    }
}

function handleSearch(e) {
    e.preventDefault();

    const activeTab = document.querySelector('.search-tab.active');
    const tabType = activeTab?.dataset.tab || 'locales';

    const eventType = document.getElementById('eventType').value;
    const eventDate = document.getElementById('eventDate').value;
    const guestCount = document.getElementById('guestCount').value;

    // Registrar búsqueda en Google Sheets
    if (typeof sendToGoogleSheets === 'function') {
        sendToGoogleSheets('Busquedas', {
            id: 'BUSQ-' + Date.now(),
            tipo_evento: eventType,
            fecha_evento: eventDate,
            invitados: guestCount,
            categoria: tabType,
            fecha: new Date().toLocaleDateString('es-PE'),
            hora: new Date().toLocaleTimeString('es-PE'),
            timestamp: new Date().toISOString()
        });
    }
    if (window.analytics) {
        analytics.trackSearch(`${eventType} - ${guestCount}`, tabType);
    }

    // Build query params
    const params = new URLSearchParams();
    if (eventType) params.set('evento', eventType);
    if (eventDate) params.set('fecha', eventDate);
    if (guestCount) params.set('capacidad', guestCount);

    // Navigate to appropriate page
    let targetPage = 'pages/locales.html';
    if (tabType === 'servicios') targetPage = 'pages/servicios.html';
    if (tabType === 'paquetes') targetPage = 'pages/paquetes.html';

    const queryString = params.toString();
    window.location.href = queryString ? `${targetPage}?${queryString}` : targetPage;
}

function setMinEventDate() {
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
}

// Load Featured Locales
function loadFeaturedLocales() {
    const grid = document.getElementById('localesGrid');
    if (!grid) return;

    // Show skeleton first
    renderLocalesGrid(grid, [], true);

    // Simulate loading delay
    setTimeout(() => {
        const featuredLocales = getFeaturedLocales(3);
        renderLocalesGrid(grid, featuredLocales);

        // Check favorites after render
        checkFavorites();
    }, 500);
}

// Load Featured Services
function loadFeaturedServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    // Simulate loading
    setTimeout(() => {
        const featuredServices = getFeaturedServices(4);
        renderServicesGrid(grid, featuredServices, true);
    }, 700);
}

// Stat Counters Animation
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');

    // Use Intersection Observer for animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseFloat(stat.dataset.count);

                animateCounter(stat, target);
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Testimonials Slider
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const dotsContainer = document.querySelector('.testimonials-dots');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (!slider) return;

    const cards = slider.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalSlides = cards.length;

    // Create dots
    if (dotsContainer && totalSlides > 1) {
        for (let i = 0; i < Math.ceil(totalSlides / 3); i++) {
            const dot = document.createElement('span');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });
    }

    function goToSlide(index) {
        currentIndex = index * 3;
        updateSlider();
    }

    function updateSlider() {
        // For mobile, scroll to the current card
        if (window.innerWidth <= 1024) {
            const scrollAmount = currentIndex * (cards[0].offsetWidth + 24);
            slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }

        // Update dots
        const dots = dotsContainer?.querySelectorAll('.dot');
        dots?.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentIndex / 3));
        });
    }

    // Auto-play (optional)
    // setInterval(() => {
    //     currentIndex = (currentIndex + 1) % totalSlides;
    //     updateSlider();
    // }, 5000);
}

// Category filter click handler (from HTML onclick)
function filterByCategory(category) {
    window.location.href = `pages/locales.html?categoria=${category}`;
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 72;
        const top = section.offsetTop - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// Intersection Observer for animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .card, .step-card, .package-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// Call scroll animations
initScrollAnimations();
