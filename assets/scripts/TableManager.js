class TableManager {
    constructor(config) {
        this.collectionName = config.collectionName;
        this.docId = config.docId;
        this.dataKey = config.dataKey;
        this.containerId = config.containerId;
        this.columns = config.columns; // Array of column definitions
        this.defaultCellData = config.defaultCellData; // Function to generate default data

        this.data = [];
        this.init();
    }

    async init() {
        // Show loading state
        const container = document.getElementById(this.containerId);
        container.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

        // Subscribe to data updates
        window.dataManager.subscribeToData(this.collectionName, this.docId, (data) => {
            if (data && data[this.dataKey]) {
                this.data = data[this.dataKey];
                this.render();
            } else {
                this.data = [];
                this.render();
            }
        });
    }

    render() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = '';

        if (this.data.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: white; margin-top: 50px;">אין נתונים להצגה</div>';
            return;
        }

        this.data.forEach((table, tableIndex) => {
            const card = document.createElement('div');
            card.className = 'glass-card';

            // Header
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '16px';
            header.style.borderBottom = '1px solid var(--glass-border)';
            header.style.paddingBottom = '8px';

            const title = document.createElement('h3');
            title.textContent = table.title;
            title.style.margin = '0';
            title.style.color = 'var(--text-primary)';

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<img src="./Images/delete.png" style="width: 20px; filter: opacity(0.5);">';
            deleteBtn.style.background = 'none';
            deleteBtn.style.border = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.onclick = () => this.deleteTable(tableIndex);

            header.appendChild(title);
            header.appendChild(deleteBtn);
            card.appendChild(header);

            // Table Content
            const tableEl = document.createElement('table');
            tableEl.style.width = '100%';
            tableEl.style.borderCollapse = 'collapse';

            // Table Head
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            this.columns.forEach(col => {
                const th = document.createElement('th');
                th.textContent = col.label;
                th.style.textAlign = 'center';
                th.style.padding = '8px';
                th.style.color = 'var(--text-secondary)';
                th.style.fontSize = '0.9rem';
                headerRow.appendChild(th);
            });
            tableEl.appendChild(thead);

            // Table Body
            const tbody = document.createElement('tbody');
            const cellData = table.cellData || [];

            // Calculate number of rows based on default data length and columns
            const numRows = this.defaultCellData().length / this.columns.length;

            for (let i = 0; i < numRows; i++) {
                const row = document.createElement('tr');
                row.style.borderBottom = '1px solid rgba(255,255,255,0.1)'; // Light border for dark mode

                this.columns.forEach((col, colIndex) => {
                    const cellIndex = i * this.columns.length + colIndex;
                    const td = document.createElement('td');
                    td.style.padding = '12px 8px';
                    td.style.textAlign = 'center';
                    // Add vertical borders for separation
                    if (colIndex < this.columns.length - 1) {
                        td.style.borderLeft = '1px solid rgba(255,255,255,0.1)';
                    }

                    // First column is usually time, read-only or special styling
                    if (colIndex === 0) {
                        // Strip HTML from time column too just in case
                        const rawContent = cellData[cellIndex] || col.defaultValue(i);
                        td.textContent = this.stripHtml(rawContent);
                        td.style.fontWeight = '600';
                        td.style.color = 'var(--text-secondary)';
                        td.style.background = 'rgba(255,255,255,0.05)'; // Slight background for time column
                    } else {
                        const rawVal = cellData[cellIndex] || '';
                        const cleanVal = this.stripHtml(rawVal);
                        td.textContent = cleanVal;
                        td.style.cursor = 'pointer';
                        td.onclick = () => this.editCell(tableIndex, cellIndex, cleanVal);

                        if (cleanVal) {
                            td.style.color = 'var(--text-primary)';
                            td.style.fontWeight = '500';
                        }
                    }

                    row.appendChild(td);
                });
                tbody.appendChild(row);
            }
            tableEl.appendChild(tbody);
            card.appendChild(tableEl);
            container.appendChild(card);
        });
    }

    // Helper to strip HTML tags
    stripHtml(html) {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    editCell(tableIndex, cellIndex, currentValue) {
        const commonNames = [
            'גיא בלום', 'אילן כץ', 'עופר גובר', 'רז גרוסמן', 'שלומי טבת',
            'יוסי שמר', 'יהודה אשכנזי', 'בועז פאר', 'יוסי סופר', 'רוני מרץ',
            'גל פאר', 'רן ראובני', 'ערן אבנון', 'אלון מאור', 'מושיק ברזילי',
            'אלי דפס', 'דני להב', 'ערן אבידור', 'עמוס קורן', 'נבות מרזל',
            'משה שרביט', 'אתגר מרדכי', 'אמיר אבידור', 'יובל קרנר', 'זיו ליטמן',
            'אורן טאוב', 'דורון אבן', 'עמית קליינמן', 'ישראל שדה', 'עופר מורשטיין', 'אבי חן', 'אייל וייסבורד', 'ישראל חן'
        ];

        window.uiManager.showEditModal(currentValue, (newValue) => {
            this.saveCell(tableIndex, cellIndex, newValue);
        }, commonNames);
    }

    async saveCell(tableIndex, cellIndex, newValue) {
        // Update local data first for immediate feedback
        if (!this.data[tableIndex].cellData) {
            this.data[tableIndex].cellData = this.defaultCellData();
        }
        this.data[tableIndex].cellData[cellIndex] = newValue;
        this.render(); // Re-render to show changes

        // Save to Firestore
        try {
            await window.dataManager.saveData(this.collectionName, this.docId, {
                [this.dataKey]: this.data
            });
            window.uiManager.showToast('השינויים נשמרו בהצלחה', 'success');
        } catch (error) {
            window.uiManager.showToast('שגיאה בשמירה', 'error');
            // Revert local change on error?
        }
    }

    async deleteTable(index) {
        if (confirm('האם אתה בטוח שברצונך למחוק טבלה זו?')) {
            const itemToRemove = this.data[index];
            try {
                await window.dataManager.deleteTableFromList(this.collectionName, this.docId, this.dataKey, itemToRemove);
                window.uiManager.showToast('הטבלה נמחקה', 'success');
            } catch (error) {
                window.uiManager.showToast('שגיאה במחיקה', 'error');
            }
        }
    }

    async addTable(title) {
        const newTable = {
            title: title,
            cellData: this.defaultCellData()
        };

        // Add to local data immediately
        this.data.push(newTable);

        try {
            await window.dataManager.saveData(this.collectionName, this.docId, {
                [this.dataKey]: this.data
            });
            window.uiManager.showToast('טבלה חדשה נוספה', 'success');
        } catch (error) {
            window.uiManager.showToast('שגיאה בהוספה', 'error');
        }
    }
}

// Export class
window.TableManager = TableManager;
