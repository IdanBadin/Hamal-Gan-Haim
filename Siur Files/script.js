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

let siurTablesData = [];
let tablesContainer = document.getElementById("tablesContainer");
let addTableButton = document.getElementById("addTableButton");

// Function to Assign id to each table in siurTablesData array
function assignDateToId(siurTablesData) {
  siurTablesData.forEach(item => {
      let dateMatch = item.title.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
      if (dateMatch) {
          item.id = dateMatch[0];
      }
  });

  return siurTablesData;
}

// Display tables function with fixed time slots from 20:00 to 08:00
function displayTables() {
tablesContainer.innerHTML = siurTablesData.map((table, index) => {
  const cellData = table.cellData || []; // Use the cellData property or an empty array if not present

  return `
    <div id="${table.id}" class="tableBlock">
      <table class="editableTable" style="font-size: 16px;width: 100%;direction: rtl; text-align: right">
        <thead>
          <tr>
            <th colspan="3" id="tableHeaderElement">
              <div id="tableHeaderContainer" style="position: relative">
                <div id="calendarIconDiv"><img style="width: 30px;height: 30px" src="./Images/calendar.png" alt="calendar"></div>
                <div id="tableTitleTextDiv">${table.title}</div>
                <div id="deleteTableBtnDiv"><img class="deleteTableBtn" src="./Images/delete.png" alt="Delete Button" onclick="deleteTable('${table.id}', ${index})"></div>
              </div>
            </th>
          </tr>
          <tr>
            <th></th>
            <th style="text-align: center; font-size: 20px">חמוש</th>
            <th style="text-align: center; font-size: 20px">לא חמוש </th>
          </tr>
        </thead>
        <tbody>
          <tr class="spaceUnder"><td id="hour">${cellData[0] || '20:00 - 21:00'}</td><td>${cellData[1] || ''}</td><td>${cellData[2] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[3] || '21:00 - 22:00'}</td><td>${cellData[4] || ''}</td><td>${cellData[5] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[6] || '22:00 - 23:00'}</td><td>${cellData[7] || ''}</td><td>${cellData[8] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[9] || '23:00 - 00:00'}</td><td>${cellData[10] || ''}</td><td>${cellData[11] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[12] || '00:00 - 01:00'}</td><td>${cellData[13] || ''}</td><td>${cellData[14] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[15] || '01:00 - 02:00'}</td><td>${cellData[16] || ''}</td><td>${cellData[17] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[18] || '02:00 - 03:00'}</td><td>${cellData[19] || ''}</td><td>${cellData[20] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[21] || '03:00 - 04:00'}</td><td>${cellData[22] || ''}</td><td>${cellData[23] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[24] || '04:00 - 05:00'}</td><td>${cellData[25] || ''}</td><td>${cellData[26] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[27] || '05:00 - 06:00'}</td><td>${cellData[28] || ''}</td><td>${cellData[29] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[30] || '06:00 - 07:00'}</td><td>${cellData[31] || ''}</td><td>${cellData[32] || ''}</td></tr>
          <tr class="spaceUnder"><td id="hour">${cellData[33] || '07:00 - 08:00'}</td><td>${cellData[34] || ''}</td><td>${cellData[35] || ''}</td></tr>
        </tbody>
      </table>
    </div>`;
}).join("<br>");

// Make tables editable again after saved changes
makeTablesEditable();
}

// Function to save edited content to Firestore
async function saveToFirestore() {
  const tables = document.querySelectorAll('.editableTable');

  try {
      await Promise.all(Array.from(tables).map(async (table, index) => {
          const cells = table.getElementsByTagName('td');
          const data = [];

          Array.from(cells).forEach((cell) => {
              let cellContent = cell.innerHTML.trim();
              cellContent = (cellContent === '<br>' || cellContent === '<br/>') ? '' : cellContent;
              data.push(cellContent);
          });

          const originalData = siurTablesData[index].cellData || [];

          if (!arraysAreEqual(data, originalData)) {
              siurTablesData[index].cellData = data;

              await db.collection('siurTables').doc('siurTablesData').set({
                  siurTablesData
              });

              console.log(`Saving Data to Firestore for table ${index + 1}...`);
          }
      }));

      console.log('All data saved to Firestore successfully.');
  } catch (error) {
      console.error('Error saving data to Firestore:', error);
      throw error;
  }
}

// Function to check if two arrays are equal
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
      return false;
  }

  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
          return false;
      }
  }

  return true;
}

// Function to fetch siurTablesData from Firestore
async function fetchFromFirestore() {
  const doc = await db.collection('siurTables').doc('siurTablesData').get();
  return doc.data()?.siurTablesData || [];
}

// Function to add table to Firestore
async function addTableToArray(table) {
  const newTable = {
      title: table.title,
      cellData: getDefaultCellData()
  };
  siurTablesData.push(newTable);
  siurTablesData = assignDateToId(siurTablesData);
  localStorage.setItem("siurTables", JSON.stringify(siurTablesData));

  await saveToFirestore();

  displayTables();
  makeTablesEditable();
}

// Function to get default cell data
function getDefaultCellData() {
  return Array(36).fill(''); // Create an array with 36 empty strings for default cell data
}

// Updated deleteTable function
let deleteTapCounts = {}; // Object to keep track of tap counts for each table

async function deleteTable(id, index) {
  if (!deleteTapCounts[id]) {
      deleteTapCounts[id] = 0;
  }

  deleteTapCounts[id]++;

  if (deleteTapCounts[id] === 10) {
      try {
          const confirmDelete = window.confirm('האם בטוח שברצונך למחוק טבלה זו?\nמחיקת טבלה זו תביא לאובדן כלל הנתונים באותה טבלה ולא יהיה ניתן לשחזר נתונים אלו');

          if (confirmDelete) {
              const tableIndex = index;

              if (tableIndex > -1) {
                  const tableElement = document.getElementById(id);
                  if (tableElement) {
                      tableElement.classList.add('fade-out');
                  }

                  setTimeout(() => {
                      if (tableElement && tableElement.parentNode) {
                          tableElement.parentNode.removeChild(tableElement);
                      }

                      db.collection('siurTables').doc('siurTablesData').update({
                          siurTablesData: firebase.firestore.FieldValue.arrayRemove(siurTablesData[tableIndex])
                      });

                      siurTablesData.splice(tableIndex, 1);

                      console.log("Data saved to Firestore successfully.");

                      if (siurTablesData.length === 0) {
                          localStorage.clear();
                      }

                      displayTables();
                      makeTablesEditable();

                      console.log("Updated siurTables array content after deletion:");
                      console.log(siurTablesData);
                  }, 500);
              }
          }

          delete deleteTapCounts[id];
      } catch (error) {
          console.error('Error deleting table:', error);
      }
  } else {
      console.log(`Tap count for table ${id}: ${deleteTapCounts[id]}`);
  }
}

// Function to make tables editable AND ALSO 5 taps on a cell that contains text in order to edit it again
function makeTablesEditable() {
  const tables = document.querySelectorAll('.editableTable');

  tables.forEach((table, tableIndex) => {
      const cells = table.getElementsByTagName('td');
      Array.from(cells).forEach((cell, cellIndex) => {
          let tapCount = 0;
          let debounceTimer;

          cell.setAttribute('id', `cell${tableIndex + 1}_${cellIndex + 1}`);

          cell.addEventListener('mousedown', function (event) {
              event.preventDefault();
          });

          cell.addEventListener('click', function () {
              clearTimeout(debounceTimer);

              if (tapCount === 5 || this.innerHTML.trim() === '') {
                  this.contentEditable = "true";
                  this.focus();
              }

              if (this.innerHTML.trim() !== '') {
                  tapCount++;
                  if (tapCount === 5) {
                      this.style.border = "1px solid black";
                  }

                  debounceTimer = setTimeout(() => {
                      tapCount = 0;
                  }, 1000);
              }
          });
      });
  });

  function handleCellEdit(cell) {
      let editedData = cell.innerHTML.trim();
      editedData = (editedData === '<br>' || editedData === '<br/>') ? '' : editedData;
      cell.innerHTML = editedData;
      saveToFirestore();
  }
}

// Fetch and display siurTablesData from Firestore live to all users
async function fetchAndDisplayTables() {
  try {
      const tablesSnapshot = await db.collection('siurTables').doc('siurTablesData');

      tablesSnapshot.onSnapshot((doc) => {
          const siurTablesDataFromFirestore = doc.data()?.siurTablesData;

          if (siurTablesDataFromFirestore) {
              siurTablesData.length = 0;
              siurTablesData.push(...siurTablesDataFromFirestore);
              displayTables();
              document.getElementById('addTableButtonContainer').style.display = 'block';
          } else {
              console.log('No data found in Firestore.');
          }
      });
  } catch (error) {
      console.error('Error fetching data from Firestore:', error);
  }
}

addTableButton.addEventListener("click", function () {
  addTableToArray({ title: getNextDayAndDate(siurTablesData) });
});

document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM content loaded. Fetching and displaying tables...');
  await fetchAndDisplayTables();
  console.log('Tables fetched and displayed. Making tables editable...');
  makeTablesEditable();
  console.log('Tables are now editable.');
});

// Generate next day and date to last item in tablesData array
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

// Get current date in the format of d/mm/yyyy | dd/mm/yyyy for the scroll to scroll function
function getCurrentDateFormatted() {
  const today = new Date();
  let day = today.getDate();
  const month = String(today.getMonth() + 1).padStart(1, '0');
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

  setTimeout(scrollToAnchor, 1700);
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
