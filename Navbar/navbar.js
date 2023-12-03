document.addEventListener("DOMContentLoaded", function () {
    // Create the navigation bar HTML
    const navbarHtml = `
        <div id="bottom-navbar">
            <div class="navbar-button" id="HamalTableButton">
                <a href="./index.html">
                    <img style="height: 40px" id="HamalLogo" src="./Images/HamalLogo.png" alt="חמ״ל">
                    <div class="highlight"></div>
                </a>
            </div>
            <div class="navbar-button" id="GateTableButton">
                <a href="./gate.html">
                    <img style="height: 40px" id="GateLogo" src="./Images/GateLogo.png" alt="שער">
                    <div class="highlight"></div>
                </a>
            </div>
        </div>
    `;

    // Insert the navigation bar HTML into the body
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);

    // Apply initial styles immediately
    applyInitialStyles();

    // Handle click events on links
    const navLinks = document.querySelectorAll('.navbar-button a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetPage = this.getAttribute('href');
            navigateTo(targetPage);
        });
    });
});

// Function to apply initial styles
function applyInitialStyles() {
    const currentPage = window.location.href;
    // Update the active button based on the current page
    const navbarButtons = document.querySelectorAll('.navbar-button');
    navbarButtons.forEach(button => {
        const buttonLink = button.querySelector('a').href;
        if (currentPage.includes(buttonLink)) {
            button.classList.add('active');
            button.querySelector('.highlight').style.width = '100%';
        }
    });
}

// Function to handle navigation
function navigateTo(targetPage) {
    // Remove 'active' class and reset highlight for all buttons
    const navbarButtons = document.querySelectorAll('.navbar-button');
    navbarButtons.forEach(button => {
        button.classList.remove('active');
        button.querySelector('.highlight').style.width = '0';
    });

    // Add 'active' class and update highlight for the clicked button
    const clickedButton = document.querySelector(`.navbar-button a[href="${targetPage}"]`).parentNode;
    clickedButton.classList.add('active');
    clickedButton.querySelector('.highlight').style.width = '100%';

    // Navigate to the target page
    window.location.href = targetPage;
}