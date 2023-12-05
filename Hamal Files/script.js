// Replace this with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJhvGJU2t7YVuPI6ibeJVfujywYPFRq-U",
    authDomain: "hamal-gan-haim-d7041.firebaseapp.com",
    projectId: "hamal-gan-haim-d7041",
    storageBucket: "hamal-gan-haim-d7041.appspot.com",
    messagingSenderId: "715588532208",
    appId: "1:715588532208:web:c7ef59540631c7c2ef8f35"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let tablesData = [];
let tablesContainer = document.getElementById("tablesContainer");
let addTableButton = document.getElementById("addTableButton");

// Function to Assign id to each table in tablesData array
function assignDateToId(tablesData) {
  tablesData.forEach(item => {
    let dateMatch = item.title.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    if (dateMatch) {
      item.id = dateMatch[0];
    }
  });

  return tablesData;
}

// Updated displayTables function
function displayTables() {
    tablesContainer.innerHTML = tablesData.map((table, index) => {
      const cellData = table.cellData || []; // Use the cellData property or an empty array if not present
      return `
        <div id="${table.id}" class="tableBlock">
          <table class="editableTable" style="font-size: 16px;width: 100%;direction: rtl; text-align: right">
            <thead>
              <tr>
                <th colspan="3" id="tableHeaderElement">
                  <div id="tableHeaderContainer" style="position: relative">
                    <div id="calendarIconDiv"><img style="width: 30px;height: 30px" src="./Images/calendar.png" alt="calendar""></div>
                    <div id="tableTitleTextDiv">${table.title}</div>
                    <div id="deleteTableBtnDiv"><img class="deleteTableBtn" src="./Images/delete.png" alt="Delete Button" onclick="deleteTable('${table.id}', ${index})"></div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="spaceUnder"><td id="hour">${cellData[0] || '02:00 - 00:00'}</td><td>${cellData[1] || ''}</td><td>${cellData[2] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[3] || '04:00 - 02:00'}</td><td>${cellData[4] || ''}</td><td>${cellData[5] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[6] || '06:00 - 04:00'}</td><td>${cellData[7] || ''}</td><td>${cellData[8] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[9] || '08:00 - 06:00'}</td><td>${cellData[10] || ''}</td><td>${cellData[11] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[12] || '10:00 - 08:00'}</td><td>${cellData[13] || ''}</td><td>${cellData[14] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[15] || '12:00 - 10:00'}</td><td>${cellData[16] || ''}</td><td>${cellData[17] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[18] || '14:00 - 12:00'}</td><td>${cellData[19] || ''}</td><td>${cellData[20] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[21] || '16:00 - 14:00'}</td><td>${cellData[22] || ''}</td><td>${cellData[23] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[24] || '18:00 - 16:00'}</td><td>${cellData[25] || ''}</td><td>${cellData[26] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[27] || '20:00 - 18:00'}</td><td>${cellData[28] || ''}</td><td>${cellData[29] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[30] || '22:00 - 20:00'}</td><td>${cellData[31] || ''}</td><td>${cellData[32] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[33] || '00:00 - 22:00'}</td><td>${cellData[34] || ''}</td><td>${cellData[35] || ''}</td></tr>
            </tbody>
          </table>
        </div>`;
    }).join("<br>");
}

// Function to save edited content to Firestore
async function saveToFirestore() {
    const tables = document.querySelectorAll('.editableTable');
    tables.forEach((table, index) => {
      const cells = table.getElementsByTagName('td');
      const data = [];
      Array.from(cells).forEach((cell) => {
        data.push(cell.innerHTML);
      });
      tablesData[index].cellData = data; // Update the cellData property in tablesData
    });
  
    try {
      // Update tablesData in Firestore
      await db.collection('tables').doc('tablesData').set({
        tablesData
      });
  
      console.log('Data saved to Firestore successfully.');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
}

// Function to fetch tablesData from Firestore
async function fetchFromFirestore() {
  const doc = await db.collection('tables').doc('tablesData').get();
  return doc.data()?.tablesData || [];
}

// Function to add table to Firestore
async function addTableToArray(table) {
    const newTable = {
      title: table.title,
      cellData: getDefaultCellData()
    };
    tablesData.push(newTable);
    tablesData = assignDateToId(tablesData);
    localStorage.setItem("tables", JSON.stringify(tablesData));
  
    // Save the new table to Firestore immediately
    await saveToFirestore();
  
    displayTables();
    makeTablesEditable();
}
  
// Function to get default cell data
  function getDefaultCellData() {
    return Array(36).fill(''); // Create an array with 36 empty strings for default cell data
}

// Updated deleteTable function
async function deleteTable(id, index) {
  try {
      const confirmDelete = window.confirm('האם בטוח שברצונך למחוק טבלה זו?\nמחיקת טבלה זו תביא לאובדן כלל הנתונים באותה טבלה ולא יהיה ניתן לשחזר נתונים אלו');

      if (confirmDelete) {
          const tableIndex = index;
          if (tableIndex > -1) {
              // Remove table data from Firestore
              await db.collection('tables').doc('tablesData').update({
                  tablesData: firebase.firestore.FieldValue.arrayRemove(tablesData[tableIndex])
              });

              // Remove table from the DOM
              const tableElement = document.getElementById(id);
              tableElement.parentNode.removeChild(tableElement);

              // Remove table data from tablesData array
              tablesData.splice(tableIndex, 1);

              console.log("Data saved to Firestore successfully.");

              // Check if tablesData is empty and clear local storage
              if (tablesData.length === 0) {
                  localStorage.clear();
              }
          }

          displayTables();
          makeTablesEditable();

          console.log("Updated tables array content after deletion:");
          console.log(tablesData);
      }
  } catch (error) {
      console.error('Error deleting table:', error);
  }
}

// Function to make tables editable
function makeTablesEditable() {
  const tables = document.querySelectorAll('.editableTable');

  tables.forEach((table, tableIndex) => {
      const cells = table.getElementsByTagName('td');
      Array.from(cells).forEach((cell, cellIndex) => {
          let tapCount = 0;
          let debounceTimer;

          cell.setAttribute('id', `cell${tableIndex + 1}_${cellIndex + 1}`);

          cell.addEventListener('mousedown', function (event) {
              event.preventDefault(); // Prevent default behavior to avoid selection of text
          });

          cell.addEventListener('click', function () {
              clearTimeout(debounceTimer);

              if (tapCount === 5 || this.innerHTML.trim() === '') {
                  this.contentEditable = "true";
                  this.focus();

                  this.addEventListener('keydown', (e) => {
                      if (e.key === 'Enter') {
                          e.preventDefault(); // Prevent default behavior of Enter key
                          this.contentEditable = "false";
                          handleCellEdit(this);
                          tapCount = 0; // Reset the tap count for the specific cell after successfully editing
                      }
                  });
              }
              if (this.innerHTML.trim() !== '') {
                  tapCount++;
                  if (tapCount === 5) {
                      this.style.border = "1px solid black";
                  }

                  // Reset the tap count after a short delay (e.g., 1 second)
                  debounceTimer = setTimeout(() => {
                      tapCount = 0;
                  }, 1000);
              }
          });
      });
  });

  // Function to handle cell edit (separate from the keydown event)
  function handleCellEdit(cell) {
    let editedData = cell.innerHTML.trim();
    editedData = (editedData === '<br>' || editedData === '<br/>') ? '' : editedData;
    cell.innerHTML = editedData;
    saveToFirestore();
  }
}

document.addEventListener('touchstart', function () {
  // Save the data to Firestore
  saveToFirestore();
});
  
// Call makeTablesEditable when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM content loaded. Fetching and displaying tables...');
    await fetchAndDisplayTables(); // Use await to make sure the data is fetched before proceeding
  
    // Introduce a slight delay before making tables editable
    setTimeout(() => {
      console.log('Tables fetched and displayed. Making tables editable...');
      makeTablesEditable();
      console.log('Tables are now editable.');
    }, 500); // Adjust the delay time as needed
});  

// Function to fetch and display tablesData from Firestore
async function fetchAndDisplayTables() {
  try {
      const tablesSnapshot = await db.collection('tables').doc('tablesData').get();
      const tablesDataFromFirestore = tablesSnapshot.data()?.tablesData;

      if (tablesDataFromFirestore) {
          // Update tablesData without affecting the original array reference
          tablesData.length = 0;
          tablesData.push(...tablesDataFromFirestore);
          displayTables();

          // Show the addTableButtonContainer div after displaying tables
          document.getElementById('addTableButtonContainer').style.display = 'block';
      } else {
          console.log('No data found in Firestore.');
      }
  } catch (error) {
      console.error('Error fetching data from Firestore:', error);
  }
}

addTableButton.addEventListener("click", function () {
  addTableToArray({ title: getNextDayAndDate(tablesData) });
});

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM content loaded. Fetching and displaying tables...');
    await fetchAndDisplayTables(); // Use await to make sure the data is fetched before proceeding
    console.log('Tables fetched and displayed. Making tables editable...');
    makeTablesEditable();
    console.log('Tables are now editable.');
});

// Function to generate next day and date to last item in tablesData array
function getNextDayAndDate(tablesData) {
  if (tablesData.length === 0) {
    return getCurrentHebrewDate();
  }

  const lastItem = tablesData[tablesData.length - 1];
  const lastDate = lastItem.title.match(/\d+\/\d+\/\d+/)[0];
  const [day, month, year] = lastDate.split("/").map(Number);
  const nextDate = new Date(year, month - 1, day + 1);

  const days = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
  const nextDay = days[nextDate.getDay()];

  const nextFormattedDate = `${nextDay} ${nextDate.getDate()}/${nextDate.getMonth() + 1}/${nextDate.getFullYear()}`;

  return nextFormattedDate;
}

// Function to get current date in the format of d/mm/yyyy | dd/mm/yyyy for the scroll to scroll function
function getCurrentDateFormatted() {
  const today = new Date();
  let day = today.getDate();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  if (day < 10) {
    day = String(day);
  }

  return `${day}/${month}/${year}`;
}

// Function to scroll to current date table on website
document.addEventListener('DOMContentLoaded', function () {
  var currentDate = getCurrentDateFormatted();
  console.log("The current date is: " + currentDate);

  // Function to scroll to the anchor
  function scrollToAnchor() {
    var anchor = document.getElementById(currentDate);

    if (anchor) {
      if ('scrollBehavior' in document.documentElement.style) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        anchor.scrollIntoView(true);
      }
    } else {
      console.log("Element with ID " + currentDate + " not found.");
    }
  }

  // Scroll after a short delay to allow time for the tables to load
  setTimeout(scrollToAnchor, 1500); // Adjust the delay as needed
});

function getCurrentHebrewDate() {
  const daysOfWeekHebrew = [
    "יום ראשון",
    "יום שני",
    "יום שלישי",
    "יום רביעי",
    "יום חמישי",
    "יום שישי",
    "יום שבת"
  ];
  const monthsHebrew = [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר"
  ];

  const date = new Date();
  const dayOfWeek = daysOfWeekHebrew[date.getDay()];
  const day = date.getDate();
  const month = monthsHebrew[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek} ${day}/${date.getMonth() + 1}/${year}`;
}