// Contacts Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const contactsList = document.getElementById('contactsList');
    const searchInput = document.getElementById('searchInput');
    let allContacts = [];

    // Initial Fetch
    window.dataManager.db.collection("contactsTable").doc("contactsData").collection("contacts")
        .orderBy('contactId')
        .onSnapshot((snapshot) => {
            allContacts = [];
            snapshot.forEach(doc => {
                allContacts.push({ ...doc.data(), docId: doc.id });
            });
            renderContacts(allContacts);
        });

    // Search
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allContacts.filter(c =>
            (c.firstName && c.firstName.includes(term)) ||
            (c.lastName && c.lastName.includes(term))
        );
        renderContacts(filtered);
    });

    // Add Contact
    document.getElementById('addContactBtn').addEventListener('click', async () => {
        const newId = allContacts.length > 0 ? Math.max(...allContacts.map(c => c.contactId)) + 1 : 1;
        try {
            await window.dataManager.db.collection("contactsTable").doc("contactsData").collection("contacts").doc(newId.toString()).set({
                firstName: '',
                lastName: '',
                phone: '',
                contactId: newId
            });
            window.uiManager.showToast('איש קשר נוסף', 'success');
        } catch (error) {
            window.uiManager.showToast('שגיאה בהוספה', 'error');
        }
    });

    function renderContacts(contacts) {
        contactsList.innerHTML = '';
        if (contacts.length === 0) {
            contactsList.innerHTML = '<div style="text-align: center; color: white;">אין אנשי קשר</div>';
            return;
        }

        contacts.forEach(contact => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.justifyContent = 'space-between';

            const info = document.createElement('div');
            info.style.flex = '1';

            const name = document.createElement('div');
            name.style.fontWeight = 'bold';
            name.style.fontSize = '1.1rem';
            name.style.marginBottom = '4px';
            name.textContent = `${contact.firstName} ${contact.lastName}`;
            name.onclick = () => editContact(contact, 'name');

            const phone = document.createElement('div');
            phone.style.color = 'var(--text-secondary)';
            phone.textContent = contact.phone || 'אין טלפון';
            phone.onclick = () => editContact(contact, 'phone');

            info.appendChild(name);
            info.appendChild(phone);

            const actions = document.createElement('div');
            const callBtn = document.createElement('a');
            callBtn.href = `tel:${contact.phone}`;
            callBtn.innerHTML = '📞';
            callBtn.style.fontSize = '1.5rem';
            callBtn.style.marginLeft = '16px';
            callBtn.style.textDecoration = 'none';

            if (!contact.phone) callBtn.style.display = 'none';

            actions.appendChild(callBtn);
            card.appendChild(info);
            card.appendChild(actions);

            contactsList.appendChild(card);
        });
    }

    function editContact(contact, field) {
        let currentVal = field === 'name' ? `${contact.firstName} ${contact.lastName}` : contact.phone;

        window.uiManager.showEditModal(currentVal, async (newVal) => {
            let updates = {};
            if (field === 'name') {
                const parts = newVal.split(' ');
                updates.firstName = parts[0] || '';
                updates.lastName = parts.slice(1).join(' ') || '';
            } else {
                updates.phone = newVal;
            }

            try {
                await window.dataManager.db.collection("contactsTable").doc("contactsData").collection("contacts").doc(contact.docId).update(updates);
                window.uiManager.showToast('עודכן בהצלחה', 'success');
            } catch (error) {
                window.uiManager.showToast('שגיאה בעדכון', 'error');
            }
        });
    }
});
