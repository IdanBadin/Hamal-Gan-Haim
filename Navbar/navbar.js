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

    // Apply initial styles with a short delay
    setTimeout(function () {
        applyInitialStyles();
        applyTransitionEffect();
    }, 1000); // Adjust the delay as needed
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
        }
    });
}

// Function to apply transition effect
function applyTransitionEffect() {
    const currentPage = window.location.href;
    const navbarButtons = document.querySelectorAll('.navbar-button');

    navbarButtons.forEach(button => {
        const buttonLink = button.querySelector('a').href;
        if (currentPage.includes(buttonLink)) {
            button.querySelector('.highlight').style.width = '100%';
        }
    });
}