/* ========================================
   CELÉBRALO PE - Reservations Component
   Sistema de gestion de reservas
   ======================================== */

class ReservationManager {
    constructor() {
        this.STORAGE_KEY = 'celebralo_reservations';
        this.reservations = [];
        this.statusConfig = {
            'pendiente': {
                label: 'Pendiente',
                color: 'warning',
                icon: 'clock',
                description: 'Esperando confirmacion del proveedor'
            },
            'confirmada': {
                label: 'Confirmada',
                color: 'success',
                icon: 'check-circle',
                description: 'Tu reserva esta confirmada'
            },
            'completada': {
                label: 'Completada',
                color: 'info',
                icon: 'flag-checkered',
                description: 'Evento realizado exitosamente'
            },
            'cancelada': {
                label: 'Cancelada',
                color: 'error',
                icon: 'times-circle',
                description: 'Reserva cancelada'
            }
        };

        this.init();
    }

    init() {
        this.loadReservations();
    }

    loadReservations() {
        this.reservations = storage.get(this.STORAGE_KEY) || [];
        return this.reservations;
    }

    saveReservations() {
        storage.set(this.STORAGE_KEY, this.reservations);
    }

    // ========================================
    // CRUD OPERATIONS
    // ========================================

    createReservation(data) {
        const reservation = {
            id: data.id || this.generateId(),
            tipo: data.tipo || 'local', // 'local' or 'servicio'
            providerId: data.providerId,
            providerName: data.providerName || data.local || data.servicio,
            providerSlug: data.providerSlug,
            providerIcon: data.providerIcon || '🎉',

            // Event details
            fechaEvento: data.fechaEvento,
            tipoEvento: data.tipoEvento,
            invitados: data.invitados || 0,
            horaInicio: data.horaInicio || null,
            horaFin: data.horaFin || null,

            // Package/pricing
            paquete: data.paquete || null,
            precioBase: data.precioBase || 0,
            precioExtra: data.precioExtra || 0,
            deposito: data.deposito || 0,
            comision: data.comision || 0,
            precioEstimado: data.precioEstimado || 0,

            // Customer info
            clienteNombre: data.clienteNombre || data.nombre,
            clienteEmail: data.clienteEmail || data.email || data.contacto,
            clienteTelefono: data.clienteTelefono || data.telefono,
            clienteMensaje: data.clienteMensaje || data.mensaje || '',

            // Status
            estado: data.estado || 'pendiente',
            estadoHistorial: [{
                estado: 'pendiente',
                fecha: new Date().toISOString(),
                nota: 'Reserva creada'
            }],

            // Metadata
            origen: data.origen || 'web',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.reservations.unshift(reservation);
        this.saveReservations();

        // Track event
        if (window.analytics) {
            analytics.trackReservation(reservation);
        }

        return reservation;
    }

    getReservation(id) {
        return this.reservations.find(r => r.id === id);
    }

    updateReservation(id, data) {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index === -1) return null;

        // Track status change
        if (data.estado && data.estado !== this.reservations[index].estado) {
            if (!this.reservations[index].estadoHistorial) {
                this.reservations[index].estadoHistorial = [];
            }
            this.reservations[index].estadoHistorial.push({
                estado: data.estado,
                fecha: new Date().toISOString(),
                nota: data.nota || `Estado cambiado a ${data.estado}`
            });
        }

        this.reservations[index] = {
            ...this.reservations[index],
            ...data,
            updatedAt: new Date().toISOString()
        };

        this.saveReservations();
        return this.reservations[index];
    }

    cancelReservation(id, motivo = '') {
        return this.updateReservation(id, {
            estado: 'cancelada',
            motivoCancelacion: motivo,
            cancelledAt: new Date().toISOString(),
            nota: `Cancelada por el cliente: ${motivo || 'Sin motivo especificado'}`
        });
    }

    deleteReservation(id) {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index === -1) return false;

        this.reservations.splice(index, 1);
        this.saveReservations();
        return true;
    }

    // ========================================
    // QUERIES
    // ========================================

    getAllReservations() {
        return this.reservations;
    }

    getReservationsByStatus(estado) {
        return this.reservations.filter(r => r.estado === estado);
    }

    getReservationsByProvider(providerId) {
        return this.reservations.filter(r => r.providerId === providerId);
    }

    getUpcomingReservations() {
        const now = new Date();
        return this.reservations.filter(r => {
            if (r.estado === 'cancelada' || r.estado === 'completada') return false;
            const eventDate = new Date(r.fechaEvento);
            return eventDate >= now;
        }).sort((a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento));
    }

    getPastReservations() {
        const now = new Date();
        return this.reservations.filter(r => {
            const eventDate = new Date(r.fechaEvento);
            return eventDate < now || r.estado === 'completada' || r.estado === 'cancelada';
        }).sort((a, b) => new Date(b.fechaEvento) - new Date(a.fechaEvento));
    }

    getReservationsForDate(date) {
        const dateStr = typeof date === 'string' ? date : this.formatDateISO(date);
        return this.reservations.filter(r => r.fechaEvento === dateStr);
    }

    getReservationsCount() {
        return {
            total: this.reservations.length,
            pendiente: this.getReservationsByStatus('pendiente').length,
            confirmada: this.getReservationsByStatus('confirmada').length,
            completada: this.getReservationsByStatus('completada').length,
            cancelada: this.getReservationsByStatus('cancelada').length,
            upcoming: this.getUpcomingReservations().length
        };
    }

    // ========================================
    // AVAILABILITY
    // ========================================

    isDateBlocked(providerId, date) {
        const dateStr = typeof date === 'string' ? date : this.formatDateISO(date);
        const reservations = this.getReservationsForDate(dateStr);

        // Check if there's any confirmed reservation for this provider on this date
        return reservations.some(r =>
            r.providerId === providerId &&
            (r.estado === 'confirmada' || r.estado === 'pendiente')
        );
    }

    getBlockedDatesForProvider(providerId, tipo = null) {
        return this.reservations
            .filter(r =>
                r.providerId === providerId &&
                (tipo ? r.tipo === tipo : true) &&
                (r.estado === 'confirmada' || r.estado === 'pendiente')
            )
            .map(r => r.fechaEvento);
    }

    // ========================================
    // CALCULATIONS
    // ========================================

    calculateTotal(basePrice, options = {}) {
        let total = basePrice;

        // Add extras
        if (options.extras) {
            total += options.extras;
        }

        // Add per-person cost
        if (options.perPerson && options.guests) {
            total += options.perPerson * options.guests;
        }

        // Add deposit
        const deposit = options.deposit || 0;

        // Add commission (Celebralo pe fee)
        const commissionRate = options.commissionRate || 0.12;
        const commission = basePrice * commissionRate;

        return {
            basePrice,
            extras: options.extras || 0,
            perPerson: options.perPerson || 0,
            guests: options.guests || 0,
            deposit,
            commission,
            subtotal: total,
            total: total + deposit + commission
        };
    }

    getDaysUntilEvent(fechaEvento) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const eventDate = new Date(fechaEvento);
        eventDate.setHours(0, 0, 0, 0);

        const diffTime = eventDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    // ========================================
    // RENDERING HELPERS
    // ========================================

    getStatusConfig(estado) {
        return this.statusConfig[estado] || this.statusConfig['pendiente'];
    }

    renderStatusBadge(estado) {
        const config = this.getStatusConfig(estado);
        return `
            <span class="reservation-status ${estado}">
                <i class="fas fa-${config.icon}"></i>
                ${config.label}
            </span>
        `;
    }

    renderReservationCard(reservation) {
        const daysUntil = this.getDaysUntilEvent(reservation.fechaEvento);
        const config = this.getStatusConfig(reservation.estado);

        return `
            <div class="reservation-card ${reservation.estado}" data-id="${reservation.id}">
                <div class="reservation-header">
                    <div class="reservation-provider">
                        <span class="provider-icon">${reservation.providerIcon}</span>
                        <div>
                            <h3 class="reservation-title">${reservation.providerName}</h3>
                            <span class="reservation-id">${reservation.id}</span>
                        </div>
                    </div>
                    ${this.renderStatusBadge(reservation.estado)}
                </div>

                <div class="reservation-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(reservation.fechaEvento)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${reservation.invitados} invitados</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tag"></i>
                        <span>${reservation.tipoEvento}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-money-bill"></i>
                        <span>S/ ${reservation.precioEstimado?.toLocaleString() || '0'}</span>
                    </div>
                </div>

                ${daysUntil !== null && reservation.estado !== 'cancelada' && reservation.estado !== 'completada' ? `
                    <div class="reservation-countdown">
                        <i class="fas fa-hourglass-half"></i>
                        ${daysUntil > 0 ? `Faltan ${daysUntil} dias` : daysUntil === 0 ? 'Es hoy!' : 'Ya paso'}
                    </div>
                ` : ''}

                <div class="reservation-actions">
                    <button class="btn btn-outline btn-sm" onclick="reservationManager.showDetails('${reservation.id}')">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    ${reservation.estado === 'pendiente' || reservation.estado === 'confirmada' ? `
                        <button class="btn btn-ghost btn-sm" onclick="reservationManager.promptCancel('${reservation.id}')" style="color: var(--error);">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ========================================
    // UI INTERACTIONS
    // ========================================

    showDetails(id) {
        const reservation = this.getReservation(id);
        if (!reservation) return;

        // Create modal content
        const content = `
            <div class="reservation-detail-modal">
                <div class="detail-section">
                    <h4>Informacion del Evento</h4>
                    <p><strong>Local/Servicio:</strong> ${reservation.providerName}</p>
                    <p><strong>Fecha:</strong> ${this.formatDate(reservation.fechaEvento)}</p>
                    <p><strong>Tipo:</strong> ${reservation.tipoEvento}</p>
                    <p><strong>Invitados:</strong> ${reservation.invitados}</p>
                </div>

                <div class="detail-section">
                    <h4>Informacion de Pago</h4>
                    <p><strong>Total Estimado:</strong> S/ ${reservation.precioEstimado?.toLocaleString()}</p>
                    <p><strong>Estado:</strong> ${this.getStatusConfig(reservation.estado).label}</p>
                </div>

                <div class="detail-section">
                    <h4>Datos de Contacto</h4>
                    <p><strong>Nombre:</strong> ${reservation.clienteNombre}</p>
                    <p><strong>Email:</strong> ${reservation.clienteEmail}</p>
                    <p><strong>Telefono:</strong> ${reservation.clienteTelefono}</p>
                </div>

                ${reservation.clienteMensaje ? `
                    <div class="detail-section">
                        <h4>Mensaje Adicional</h4>
                        <p>${reservation.clienteMensaje}</p>
                    </div>
                ` : ''}
            </div>
        `;

        alert(`Detalles de Reserva ${reservation.id}\n\n` +
              `Proveedor: ${reservation.providerName}\n` +
              `Fecha: ${this.formatDate(reservation.fechaEvento)}\n` +
              `Invitados: ${reservation.invitados}\n` +
              `Total: S/ ${reservation.precioEstimado}\n` +
              `Estado: ${this.getStatusConfig(reservation.estado).label}`);
    }

    promptCancel(id) {
        const reservation = this.getReservation(id);
        if (!reservation) return;

        if (confirm(`¿Estas seguro de cancelar la reserva para "${reservation.providerName}"?\n\nEsta accion no se puede deshacer.`)) {
            const motivo = prompt('Por favor, indicanos el motivo de la cancelacion (opcional):');
            this.cancelReservation(id, motivo || '');

            if (typeof showToast === 'function') {
                showToast('info', 'Reserva cancelada', 'Tu reserva ha sido cancelada');
            }

            // Refresh UI if on mi-cuenta page
            if (window.miCuenta) {
                window.miCuenta.loadReservations();
            }
        }
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    generateId() {
        return 'RES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    formatDateISO(date) {
        return date.toISOString().split('T')[0];
    }

    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // ========================================
    // GOOGLE SHEETS INTEGRATION
    // ========================================

    async syncToGoogleSheets(reservation) {
        if (typeof sendToGoogleSheets !== 'function') return;

        try {
            await sendToGoogleSheets('Reservas', {
                id: reservation.id,
                tipo: reservation.tipo,
                local: reservation.providerName,
                proveedor: reservation.providerName,
                fechaEvento: reservation.fechaEvento,
                tipoEvento: reservation.tipoEvento,
                invitados: reservation.invitados,
                precioEstimado: reservation.precioEstimado,
                nombre: reservation.clienteNombre,
                contacto: reservation.clienteEmail,
                telefono: reservation.clienteTelefono,
                mensaje: reservation.clienteMensaje,
                estado: reservation.estado,
                origen: reservation.origen,
                fecha: new Date().toLocaleDateString('es-PE'),
                hora: new Date().toLocaleTimeString('es-PE')
            });
            console.log('Reserva sincronizada con Google Sheets');
        } catch (error) {
            console.error('Error al sincronizar con Google Sheets:', error);
        }
    }
}

// Create global instance
window.reservationManager = new ReservationManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReservationManager;
}
