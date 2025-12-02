document.addEventListener("DOMContentLoaded", function () {
    // Create the navigation bar HTML
    const navbarHtml = `
        <div id="bottom-navbar" class="glass-navbar">
            <a href="./index.html" class="navbar-item ${isActive('index.html')}">
                <div class="icon">🏠</div>
                <span>חמ״ל</span>
            </a>
            <a href="./gate.html" class="navbar-item ${isActive('gate.html')}">
                <div class="icon">🚧</div>
                <span>שער</span>
            </a>
            <a href="./siur.html" class="navbar-item ${isActive('siur.html')}">
                <div class="icon">🚓</div>
                <span>סיור</span>
            </a>
            <a href="./contacts.html" class="navbar-item ${isActive('contacts.html')}">
                <div class="icon">👥</div>
                <span>אנשי קשר</span>
            </a>
        </div>
    `;

    // Insert the navbar into the body
    document.body.insertAdjacentHTML('beforeend', navbarHtml);
});

function isActive(page) {
    const path = window.location.pathname;
    const pageName = path.split("/").pop();
    return (pageName === page || (page === 'index.html' && pageName === '')) ? 'active' : '';
}
