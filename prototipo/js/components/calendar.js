/* ========================================
   CELÉBRALO PE - Calendar Component
   Calendario interactivo para seleccion de fechas
   ======================================== */

class EventCalendar {
    constructor(container, options = {}) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!this.container) {
            console.error('Calendar: Container not found');
            return;
        }

        this.options = {
            minDate: options.minDate || new Date(),
            maxDate: options.maxDate || this.addMonths(new Date(), 6),
            availability: options.availability || {},
            blockedDates: options.blockedDates || [],
            selectedDate: options.selectedDate || null,
            showLegend: options.showLegend !== false,
            onDateSelect: options.onDateSelect || null,
            onMonthChange: options.onMonthChange || null
        };

        this.currentMonth = new Date();
        this.currentMonth.setDate(1);
        this.selectedDate = this.options.selectedDate;

        this.init();
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        const html = `
            <div class="event-calendar">
                <div class="calendar-header">
                    <button class="calendar-nav prev" type="button" aria-label="Mes anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="calendar-month">${this.formatMonth(this.currentMonth)}</span>
                    <button class="calendar-nav next" type="button" aria-label="Mes siguiente">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="calendar-weekdays">
                    <span>Dom</span>
                    <span>Lun</span>
                    <span>Mar</span>
                    <span>Mie</span>
                    <span>Jue</span>
                    <span>Vie</span>
                    <span>Sab</span>
                </div>
                <div class="calendar-days">
                    ${this.renderDays()}
                </div>
                ${this.options.showLegend ? this.renderLegend() : ''}
            </div>
        `;

        this.container.innerHTML = html;
    }

    renderDays() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        let html = '';

        // Empty cells before first day
        for (let i = 0; i < startingDay; i++) {
            html += '<span class="calendar-day empty"></span>';
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDateISO(date);
            const dayOfWeek = date.getDay();
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayName = dayNames[dayOfWeek];

            let classes = ['calendar-day'];
            let status = 'available';
            let tooltip = '';

            // Check if date is in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                classes.push('past');
                status = 'past';
            }
            // Check if date is before minDate
            else if (date < this.options.minDate) {
                classes.push('disabled');
                status = 'disabled';
            }
            // Check if date is after maxDate
            else if (date > this.options.maxDate) {
                classes.push('disabled');
                status = 'disabled';
            }
            // Check if date is blocked
            else if (this.options.blockedDates.includes(dateStr)) {
                classes.push('blocked');
                status = 'blocked';
                tooltip = 'Fecha no disponible';
            }
            // Check availability based on day of week
            else if (this.options.availability[dayName]) {
                const avail = this.options.availability[dayName];
                if (!avail.available) {
                    classes.push('unavailable');
                    status = 'unavailable';
                    tooltip = 'No disponible este dia';
                } else {
                    classes.push('available');
                    tooltip = avail.hours || 'Disponible';
                }
            } else {
                classes.push('available');
            }

            // Check if selected
            if (this.selectedDate && this.formatDateISO(this.selectedDate) === dateStr) {
                classes.push('selected');
            }

            // Today
            if (this.formatDateISO(today) === dateStr) {
                classes.push('today');
            }

            html += `
                <span class="${classes.join(' ')}"
                      data-date="${dateStr}"
                      data-status="${status}"
                      ${tooltip ? `title="${tooltip}"` : ''}>
                    ${day}
                </span>
            `;
        }

        return html;
    }

    renderLegend() {
        return `
            <div class="calendar-legend">
                <div class="legend-item">
                    <span class="legend-dot available"></span>
                    <span>Disponible</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot blocked"></span>
                    <span>No disponible</span>
                </div>
                <div class="legend-item">
                    <span class="legend-dot selected"></span>
                    <span>Seleccionado</span>
                </div>
            </div>
        `;
    }

    attachEvents() {
        // Navigation
        const prevBtn = this.container.querySelector('.calendar-nav.prev');
        const nextBtn = this.container.querySelector('.calendar-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousMonth());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextMonth());
        }

        // Day selection
        this.container.addEventListener('click', (e) => {
            const day = e.target.closest('.calendar-day');
            if (day && !day.classList.contains('empty') &&
                !day.classList.contains('past') &&
                !day.classList.contains('disabled') &&
                !day.classList.contains('blocked') &&
                !day.classList.contains('unavailable')) {
                this.selectDate(day.dataset.date);
            }
        });
    }

    selectDate(dateStr) {
        this.selectedDate = new Date(dateStr + 'T00:00:00');

        // Update UI
        this.container.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
            if (day.dataset.date === dateStr) {
                day.classList.add('selected');
            }
        });

        // Callback
        if (this.options.onDateSelect) {
            this.options.onDateSelect(this.selectedDate, dateStr);
        }
    }

    previousMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.updateCalendar();

        if (this.options.onMonthChange) {
            this.options.onMonthChange(this.currentMonth);
        }
    }

    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.updateCalendar();

        if (this.options.onMonthChange) {
            this.options.onMonthChange(this.currentMonth);
        }
    }

    updateCalendar() {
        const monthSpan = this.container.querySelector('.calendar-month');
        const daysContainer = this.container.querySelector('.calendar-days');

        if (monthSpan) {
            monthSpan.textContent = this.formatMonth(this.currentMonth);
        }
        if (daysContainer) {
            daysContainer.innerHTML = this.renderDays();
        }
    }

    setAvailability(availability) {
        this.options.availability = availability;
        this.updateCalendar();
    }

    setBlockedDates(dates) {
        this.options.blockedDates = dates;
        this.updateCalendar();
    }

    addBlockedDate(date) {
        const dateStr = typeof date === 'string' ? date : this.formatDateISO(date);
        if (!this.options.blockedDates.includes(dateStr)) {
            this.options.blockedDates.push(dateStr);
            this.updateCalendar();
        }
    }

    removeBlockedDate(date) {
        const dateStr = typeof date === 'string' ? date : this.formatDateISO(date);
        const index = this.options.blockedDates.indexOf(dateStr);
        if (index > -1) {
            this.options.blockedDates.splice(index, 1);
            this.updateCalendar();
        }
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    clearSelection() {
        this.selectedDate = null;
        this.container.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
    }

    goToMonth(date) {
        this.currentMonth = new Date(date);
        this.currentMonth.setDate(1);
        this.updateCalendar();
    }

    // Utility methods
    formatMonth(date) {
        return date.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    }

    formatDateISO(date) {
        return date.toISOString().split('T')[0];
    }

    addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }

    isDateAvailable(date) {
        const dateStr = this.formatDateISO(date);
        const dayOfWeek = date.getDay();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];

        // Check blocked dates
        if (this.options.blockedDates.includes(dateStr)) {
            return false;
        }

        // Check availability
        if (this.options.availability[dayName] && !this.options.availability[dayName].available) {
            return false;
        }

        // Check date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today || date < this.options.minDate || date > this.options.maxDate) {
            return false;
        }

        return true;
    }
}

// CSS Styles for the calendar (injected if not present)
(function() {
    if (document.getElementById('event-calendar-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'event-calendar-styles';
    styles.textContent = `
        .event-calendar {
            background: var(--white, #fff);
            border-radius: var(--radius-xl, 16px);
            padding: var(--spacing-4, 16px);
            box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05));
            border: 1px solid var(--border-light, #e5e7eb);
        }

        .calendar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-4, 16px);
        }

        .calendar-month {
            font-weight: 600;
            font-size: 1.1rem;
            text-transform: capitalize;
            color: var(--text-primary, #111827);
        }

        .calendar-nav {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-full, 50%);
            border: 1px solid var(--border-color, #d1d5db);
            background: var(--white, #fff);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            color: var(--text-secondary, #6b7280);
        }

        .calendar-nav:hover {
            background: var(--primary-50, #fef2f2);
            border-color: var(--primary, #ff385c);
            color: var(--primary, #ff385c);
        }

        .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            margin-bottom: var(--spacing-2, 8px);
            gap: 4px;
        }

        .calendar-weekdays span {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-muted, #9ca3af);
            padding: 8px 0;
        }

        .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 4px;
        }

        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            border-radius: var(--radius-full, 50%);
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .calendar-day.empty {
            cursor: default;
        }

        .calendar-day.past,
        .calendar-day.disabled {
            color: var(--text-muted, #9ca3af);
            cursor: not-allowed;
        }

        .calendar-day.available {
            color: var(--text-primary, #111827);
            background: var(--success-50, #ecfdf5);
        }

        .calendar-day.available:hover {
            background: var(--success-100, #d1fae5);
            transform: scale(1.1);
        }

        .calendar-day.unavailable {
            color: var(--text-muted, #9ca3af);
            background: var(--gray-100, #f3f4f6);
            cursor: not-allowed;
        }

        .calendar-day.blocked {
            color: var(--error, #ef4444);
            background: var(--error-50, #fef2f2);
            cursor: not-allowed;
            text-decoration: line-through;
        }

        .calendar-day.selected {
            background: var(--primary, #ff385c) !important;
            color: var(--white, #fff) !important;
            font-weight: 600;
        }

        .calendar-day.today {
            font-weight: 700;
            border: 2px solid var(--primary, #ff385c);
        }

        .calendar-legend {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: var(--spacing-4, 16px);
            padding-top: var(--spacing-4, 16px);
            border-top: 1px solid var(--border-light, #e5e7eb);
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            color: var(--text-secondary, #6b7280);
        }

        .legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .legend-dot.available {
            background: var(--success-100, #d1fae5);
            border: 2px solid var(--success, #10b981);
        }

        .legend-dot.blocked {
            background: var(--error-50, #fef2f2);
            border: 2px solid var(--error, #ef4444);
        }

        .legend-dot.selected {
            background: var(--primary, #ff385c);
        }

        @media (max-width: 480px) {
            .event-calendar {
                padding: var(--spacing-3, 12px);
            }

            .calendar-day {
                font-size: 0.8rem;
            }

            .calendar-legend {
                flex-wrap: wrap;
                gap: 8px;
            }
        }
    `;

    document.head.appendChild(styles);
})();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventCalendar;
}
