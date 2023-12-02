// navbar.js
document.addEventListener("DOMContentLoaded", function () {
    // Create the navigation bar HTML
    const navbarHtml = `
        <div id="bottom-navbar">
            <div id="HamalTableButton">
                <a href="./index.html"><img style="height: 40px" id="HamalLogo" src="./Images/HamalLogo.png" alt="חמ״ל"></a>
            </div>
            <div id="GateTableButton">
                <a href="./gate.html"><img style="height: 40px" id="GateLogo" src="./Images/GateLogo.png" alt="שער"></a>
            </div>
        </div>
    `;

    // Insert the navigation bar HTML into the body
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);
});