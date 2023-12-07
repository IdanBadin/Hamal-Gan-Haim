document.addEventListener("DOMContentLoaded", function () {
    // Create the navigation bar HTML
    const navbarHtml = `
        <div id="bottom-navbar">
            <div class="SaveChangesButtonDiv">
                <img id="saveChangesButton" style="height: 55px" src="./Images/yes.png" alt="שמור שינויים">
            </div>
            <div class="navbar-button" id="HamalTableButtonLogoDiv">
                <div style="margin-top: -13px;padding-top: 3px" class="highlight"></div>
                <a style="text-decoration: none;color: black" href="./index.html">
                    <div style="align-items: center;justify-content: center;display: flex">
                        <img style="height: 35px" id="HamalLogo" src="./Images/HamalLogo.png" alt="חמ״ל">
                    </div>
                    <div style="text-align: center;margin-bottom: -4px">חמ״ל</div>
                </a>
            </div>
            <div class="navbar-button" id="GateTableButtonLogoDiv">
                <div style="margin-top: -13px;padding-top: 3px" class="highlight"></div>
                <a style="text-decoration: none;color: black" href="./gate.html">
                    <div style="align-items: center;justify-content: center;display: flex">
                        <img style="height: 35px" id="GateLogo" src="./Images/GateLogo.png" alt="שער">
                    </div>
                    <div style="text-align: center;margin-bottom: -4px">שער</div>
                </a>
            </div>
            <div class="navbar-button" id="ContactsTableButtonLogoDiv">
                <div style="margin-top: -13px;padding-top: 3px" class="highlight"></div>
                <a style="text-decoration: none;color: black" href="./contacts.html">
                    <div style="align-items: center;justify-content: center;display: flex">
                        <img style="height: 35px" id="GateLogo" src="./Images/ContactsLogo.png" alt="אנשי קשר">
                    </div>
                    <div style="text-align: center;margin-bottom: -4px">אנשי קשר</div>
                </a>
            </div>
        </div>
    `;

    // Insert the navigation bar HTML into the body
    document.body.insertAdjacentHTML('afterbegin', navbarHtml);

    const currentPage = window.location.href;

    // Check if the user is on the contacts.html page and hide the SaveChangesButtonDiv
    if (currentPage.includes('contacts.html')) {
        const saveChangesButton = document.querySelector('.SaveChangesButtonDiv');
        saveChangesButton.style.display = 'none';
    } else {
        // Update the active button based on the current page with a delay
        setTimeout(function () {
            const navbarButtons = document.querySelectorAll('.navbar-button');
            navbarButtons.forEach(button => {
                const buttonLink = button.querySelector('a').href;
                if (currentPage.includes(buttonLink)) {
                    button.classList.add('active');
                    button.querySelector('.highlight').style.width = '100%';
                }
            });
        }, 1000); // Adjust the delay as needed
    }

    // Add event listener for the save changes rounded button
    const saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.addEventListener('click', async function () {
        try {
            // Run saveToFirestore and wait for it to complete
            await saveToFirestore();
            
            // Display the pop-up with "!השינויים נשמרו בהצלחה" message
            alert('השינויים נשמרו בהצלחה!');
        } catch (error) {
            // Handle the error appropriately (e.g., display an error message)
            console.error('Error saving changes:', error);
        }
    });
});