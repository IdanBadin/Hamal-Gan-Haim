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
  
  // Display tables function
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
                    <div id="calendarIconDiv"><img style="width: 30px;height: 30px" src="./Images/calendar.png" alt="calendar""></div>
                    <div id="tableTitleTextDiv">${table.title}</div>
                    <div id="deleteTableBtnDiv"><img class="deleteTableBtn" src="./Images/delete.png" alt="Delete Button" onclick="deleteTable('${table.id}', ${index})"></div>
                  </div>
                </th>
              </tr>
              <tr>
                <th></th>
                <th style="text-align: center; font-size: 20px">סייר 1</th>
                <th style="text-align: center; font-size: 20px">סייר 2</th>
              </tr>
            </thead>
            <tbody>
              <tr class="spaceUnder"><td id="hour">${cellData[0] || '02:00 - 00:01'}</td><td>${cellData[1] || ''}</td><td>${cellData[2] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[3] || '04:00 - 02:00'}</td><td>${cellData[4] || ''}</td><td>${cellData[5] || ''}</td></tr>
              <tr class="spaceUnder"><td id="hour">${cellData[6] || '06:00 - 04:00'}</td><td>${cellData[7] || ''}</td><td>${cellData[8] || ''}</td></tr>
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
      // Use Promise.all to wait for all promises (saves) to complete
      await Promise.all(Array.from(tables).map(async (table, index) => {
        const cells = table.getElementsByTagName('td');
        const data = [];
  
        Array.from(cells).forEach((cell) => {
          let cellContent = cell.innerHTML.trim();
          cellContent = (cellContent === '<br>' || cellContent === '<br/>') ? '' : cellContent;
          data.push(cellContent);
        });
  
        const originalData = siurTablesData[index].cellData || [];
  
        // Check if the data has changed before updating Firestore
        if (!arraysAreEqual(data, originalData)) {
          siurTablesData[index].cellData = data; // Update the cellData property in siurTablesData
  
          // Update siurTablesData in Firestore
          await db.collection('siurTables').doc('siurTablesData').set({
            siurTablesData
          });
  
          console.log(`Saving Data to Firestore for table ${index + 1}...`);
        }
      }));
  
      // If all updates are successful, log a success message
      console.log('All data saved to Firestore successfully.');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
      // Throw the error again to propagate it to the calling code
      throw error;
    }
  }
  
  // Function to check if two arrays are equal (Used in the saveToFirestore function to improve performance and speed of data saving to firestore database)
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
  let deleteTapCounts = {}; // Object to keep track of tap counts for each table
  
  async function deleteTable(id, index) {
    // Initialize tap count for the table if not already done
    if (!deleteTapCounts[id]) {
      deleteTapCounts[id] = 0;
    }
  
    // Increment the tap count
    deleteTapCounts[id]++;
  
    // Check if the tap count has reached 10
    if (deleteTapCounts[id] === 10) {
      try {
        const confirmDelete = window.confirm('האם בטוח שברצונך למחוק טבלה זו?\nמחיקת טבלה זו תביא לאובדן כלל הנתונים באותה טבלה ולא יהיה ניתן לשחזר נתונים אלו');
  
        if (confirmDelete) {
          const tableIndex = index;
  
          if (tableIndex > -1) {
            // Add the fade-out class to the table element
            const tableElement = document.getElementById(id);
            if (tableElement) {
              tableElement.classList.add('fade-out');
            }
  
            // Wait for the fade-out animation to complete (use setTimeout or transitionend event)
            // Then remove the table from the DOM
            setTimeout(() => {
              if (tableElement && tableElement.parentNode) {
                tableElement.parentNode.removeChild(tableElement);
              }
  
              // Remove table data from Firestore
              db.collection('siurTables').doc('siurTablesData').update({
                siurTablesData: firebase.firestore.FieldValue.arrayRemove(siurTablesData[tableIndex])
              });
  
              // Remove table data from siurTablesData array
              siurTablesData.splice(tableIndex, 1);
  
              console.log("Data saved to Firestore successfully.");
  
              // Check if siurTablesData is empty and clear local storage
              if (siurTablesData.length === 0) {
                localStorage.clear();
              }
  
              displayTables();
              makeTablesEditable();
  
              console.log("Updated siurTables array content after deletion:");
              console.log(siurTablesData);
            }, 500); // Adjust the delay to match the duration of the CSS transition
          }
        }
  
        // Reset the tap count after attempting deletion
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
          event.preventDefault(); // Prevent default behavior to avoid selection of text
        });
  
        cell.addEventListener('click', function () {
          clearTimeout(debounceTimer);
          
          // The function for the tap count on a cell that contains text in order to re-edit it
          if (tapCount === 5 || this.innerHTML.trim() === '') {
            this.contentEditable = "true";
            this.focus();
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
  
  // Function to fetch and display siurTablesData from Firestore live to all users
  async function fetchAndDisplayTables() {
    try {
      const tablesSnapshot = await db.collection('siurTables').doc('siurTablesData');
      
      // Use onSnapshot to listen for real-time updates
      tablesSnapshot.onSnapshot((doc) => {
        const siurTablesDataFromFirestore = doc.data()?.siurTablesData;
  
        if (siurTablesDataFromFirestore) {
          // Update siurTablesData without affecting the original array reference
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
    const month = String(today.getMonth() + 1).padStart(1, '0'); // Pad  start is the number of characters for the month
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
    setTimeout(scrollToAnchor, 1700); // Adjust the delay as needed
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