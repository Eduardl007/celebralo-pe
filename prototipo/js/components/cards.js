/* ========================================
   CELÉBRALO PE - Cards Component
   ======================================== */

// Generate locale card HTML
function createLocaleCard(locale) {
    const priceFormatted = formatPrice(locale.price.base);
    const starsHtml = generateStars(locale.rating);
    const imageUrl = locale.images && locale.images[0] ? locale.images[0] : null;

    return `
        <article class="card locale-card" data-id="${locale.id}" onclick="goToLocaleDetail('${locale.slug}')">
            <div class="card-image">
                ${imageUrl
                    ? `<img src="${imageUrl}" alt="${locale.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="card-image-placeholder" style="display:none;">${locale.icon}</div>`
                    : `<div class="card-image-placeholder">${locale.icon}</div>`
                }
                ${locale.verified ? '<span class="card-badge"><i class="fas fa-check-circle"></i> Verificado</span>' : ''}
                <button class="card-favorite" onclick="event.stopPropagation(); toggleFavorite('locale', ${locale.id}, this)" aria-label="Agregar a favoritos">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <span class="card-category">${LOCALE_CATEGORIES[locale.category]?.name || locale.category}</span>
                <h3 class="card-title">${locale.name}</h3>
                <p class="card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${locale.location.address}, ${locale.location.district}
                </p>
                <div class="card-meta">
                    <span><i class="fas fa-users"></i> ${locale.capacity.min}-${locale.capacity.max} personas</span>
                </div>
                <div class="card-rating">
                    <span class="rating">${starsHtml}</span>
                    <span>${locale.rating}</span>
                    <span class="reviews">(${locale.reviewsCount} reseñas)</span>
                </div>
                <div class="card-footer">
                    <div class="card-price">
                        <span class="amount">${priceFormatted}</span>
                        <span class="note">por evento</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); quickReserve(${locale.id})">
                        Reservar
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Generate service card HTML
function createServiceCard(service) {
    const basePrice = service.pricing.basePrice ||
        (service.pricing.packages && service.pricing.packages[0].price) || 0;
    const priceFormatted = formatPrice(basePrice);
    const priceNote = service.pricing.type === 'per-person' ? 'por persona' :
        service.pricing.type === 'per-event' ? 'por evento' : 'desde';

    const starsHtml = generateStars(service.rating);
    const categoryInfo = SERVICE_CATEGORIES[service.category] || { name: service.category, icon: '🎉' };
    const imageUrl = service.images && service.images[0] ? service.images[0] : null;

    return `
        <article class="card service-card" data-id="${service.id}" onclick="goToServiceDetail('${service.slug}')">
            <div class="card-image">
                ${imageUrl
                    ? `<img src="${imageUrl}" alt="${service.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div class="card-image-placeholder" style="display:none; background: linear-gradient(135deg, ${categoryInfo.color || 'var(--primary)'} 0%, ${categoryInfo.color || 'var(--primary-dark)'}99 100%);">${categoryInfo.icon}</div>`
                    : `<div class="card-image-placeholder" style="background: linear-gradient(135deg, ${categoryInfo.color || 'var(--primary)'} 0%, ${categoryInfo.color || 'var(--primary-dark)'}99 100%);">${categoryInfo.icon}</div>`
                }
                ${service.verified ? '<span class="card-badge"><i class="fas fa-check-circle"></i> Verificado</span>' : ''}
                <button class="card-favorite" onclick="event.stopPropagation(); toggleFavorite('service', ${service.id}, this)" aria-label="Agregar a favoritos">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <span class="card-category">${categoryInfo.name}</span>
                <h3 class="card-title">${service.name}</h3>
                <p class="card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${service.location.district}, ${service.location.city}
                </p>
                <div class="card-rating">
                    <span class="rating">${starsHtml}</span>
                    <span>${service.rating}</span>
                    <span class="reviews">(${service.reviewsCount} reseñas)</span>
                </div>
                <div class="card-footer">
                    <div class="card-price">
                        <span class="amount">${priceFormatted}</span>
                        <span class="note">${priceNote}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); requestQuote(${service.id})">
                        Cotizar
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Create service mini card for homepage
function createServiceMiniCard(service) {
    const basePrice = service.pricing.basePrice ||
        (service.pricing.packages && service.pricing.packages[0].price) || 0;
    const categoryInfo = SERVICE_CATEGORIES[service.category] || { name: service.category, icon: '🎉', color: '#FF6B35' };

    return `
        <div class="service-card" onclick="goToServiceDetail('${service.slug}')">
            <div class="service-icon" style="background: linear-gradient(135deg, ${categoryInfo.color} 0%, ${categoryInfo.color}cc 100%);">
                ${categoryInfo.icon}
            </div>
            <h3>${service.name}</h3>
            <p>${service.shortDescription}</p>
            <span class="price">Desde ${formatPrice(basePrice)}</span>
        </div>
    `;
}

// Skeleton card for loading state
function createSkeletonCard() {
    return `
        <div class="card">
            <div class="card-image skeleton skeleton-image"></div>
            <div class="card-content">
                <div class="skeleton skeleton-text" style="width: 40%;"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text" style="width: 80%;"></div>
                <div class="skeleton skeleton-text" style="width: 60%;"></div>
                <div class="card-footer" style="margin-top: 1rem;">
                    <div class="skeleton skeleton-text" style="width: 30%;"></div>
                    <div class="skeleton" style="width: 80px; height: 32px;"></div>
                </div>
            </div>
        </div>
    `;
}

// Render locales grid
function renderLocalesGrid(container, locales, showSkeleton = false) {
    if (!container) return;

    if (showSkeleton) {
        container.innerHTML = Array(6).fill(createSkeletonCard()).join('');
        return;
    }

    if (locales.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🏛️</div>
                <h3 class="empty-state-title">No encontramos locales</h3>
                <p class="empty-state-text">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    container.innerHTML = locales.map(locale => createLocaleCard(locale)).join('');
}

// Render services grid
function renderServicesGrid(container, services, mini = false, showSkeleton = false) {
    if (!container) return;

    if (showSkeleton) {
        container.innerHTML = Array(4).fill(createSkeletonCard()).join('');
        return;
    }

    if (services.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🎉</div>
                <h3 class="empty-state-title">No encontramos servicios</h3>
                <p class="empty-state-text">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }

    container.innerHTML = services.map(service =>
        mini ? createServiceMiniCard(service) : createServiceCard(service)
    ).join('');
}

// Navigate to locale detail page
function goToLocaleDetail(slug) {
    window.location.href = `pages/local.html?slug=${slug}`;
}

// Navigate to service detail page
function goToServiceDetail(slug) {
    window.location.href = `pages/servicio.html?slug=${slug}`;
}

// Toggle favorite
function toggleFavorite(type, id, button) {
    const icon = button.querySelector('i');
    const isFavorite = icon.classList.contains('fas');

    // Get current favorites from storage
    const key = `celebralope_favorites_${type}s`;
    let favorites = storage.get(key, []);

    if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(fav => fav !== id);
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
        showToast('info', 'Eliminado', 'Eliminado de favoritos');
    } else {
        // Add to favorites
        if (!favorites.includes(id)) {
            favorites.push(id);
        }
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('active');
        showToast('success', 'Guardado', 'Agregado a favoritos');
    }

    storage.set(key, favorites);
}

// Quick reserve action
function quickReserve(localeId) {
    const locale = getLocaleById(localeId);
    if (!locale) return;

    // Check if user is logged in
    if (!window.auth?.isLoggedIn()) {
        showToast('info', 'Inicia sesión', 'Debes iniciar sesión para reservar');
        openAuthModal('login');
        return;
    }

    // Navigate to reservation page
    window.location.href = `pages/reservar.html?local=${locale.slug}`;
}

// Request quote for service
function requestQuote(serviceId) {
    const service = getServiceById(serviceId);
    if (!service) return;

    // Show quote modal or navigate to quote page
    showToast('info', 'Cotización', `Solicitando cotización para ${service.name}`);

    // In a full implementation, this would open a modal or navigate to a page
    setTimeout(() => {
        window.location.href = `pages/cotizar.html?servicio=${service.slug}`;
    }, 500);
}

// Check and mark favorites on load
function checkFavorites() {
    const localesFavorites = storage.get('celebralope_favorites_locales', []);
    const servicesFavorites = storage.get('celebralope_favorites_services', []);

    // Mark locale cards
    document.querySelectorAll('.locale-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        if (localesFavorites.includes(id)) {
            const btn = card.querySelector('.card-favorite');
            if (btn) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
    });

    // Mark service cards
    document.querySelectorAll('.service-card[data-id]').forEach(card => {
        const id = parseInt(card.dataset.id);
        if (servicesFavorites.includes(id)) {
            const btn = card.querySelector('.card-favorite');
            if (btn) {
                btn.classList.add('active');
                const icon = btn.querySelector('i');
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
    });
}
