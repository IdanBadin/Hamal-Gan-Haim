class UIManager {
    constructor() {
        this.createToastContainer();
        this.createModalContainer();
    }

    createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    }

    createModalContainer() {
        if (!document.querySelector('.modal-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = '<div class="modal-content"></div>';
            document.body.appendChild(overlay);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeModal();
            });
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✓' : '⚠'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showModal(content) {
        const overlay = document.querySelector('.modal-overlay');
        const modalContent = overlay.querySelector('.modal-content');
        modalContent.innerHTML = '';
        modalContent.appendChild(content);
        overlay.classList.add('active');
    }

    closeModal() {
        const overlay = document.querySelector('.modal-overlay');
        overlay.classList.remove('active');
    }

    showEditModal(currentValue, onSave, options = []) {
        const container = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = 'ערוך משמרת';
        title.style.marginBottom = '16px';
        container.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.className = 'input-premium';
        input.placeholder = 'הכנס שם...';
        input.style.background = 'rgba(255,255,255,0.05)';
        input.style.color = 'white';
        input.style.border = '1px solid rgba(255,255,255,0.1)';
        container.appendChild(input);

        if (options.length > 0) {
            const chipsContainer = document.createElement('div');
            chipsContainer.style.display = 'flex';
            chipsContainer.style.flexWrap = 'wrap';
            chipsContainer.style.gap = '8px';
            chipsContainer.style.marginTop = '16px';

            options.forEach(opt => {
                const chip = document.createElement('button');
                chip.textContent = opt;
                chip.className = 'btn-premium';
                chip.style.background = 'rgba(255,255,255,0.1)';
                chip.style.color = 'var(--text-primary)';
                chip.style.border = '1px solid rgba(255,255,255,0.1)';
                chip.style.fontSize = '0.9rem';
                chip.style.padding = '4px 12px';

                chip.onclick = () => {
                    input.value = opt;
                };
                chipsContainer.appendChild(chip);
            });
            container.appendChild(chipsContainer);
        }

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'flex-end';
        actions.style.gap = '12px';
        actions.style.marginTop = '24px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'ביטול';
        cancelBtn.className = 'btn-premium';
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.color = 'var(--text-secondary)';
        cancelBtn.style.boxShadow = 'none';
        cancelBtn.onclick = () => this.closeModal();

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'שמור';
        saveBtn.className = 'btn-premium';
        saveBtn.onclick = () => {
            onSave(input.value);
            this.closeModal();
        };

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        container.appendChild(actions);

        this.showModal(container);
        input.focus();
    }
}

// Export a singleton instance
window.uiManager = new UIManager();
