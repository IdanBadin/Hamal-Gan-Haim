// Hamal Page Logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize TableManager for Hamal
  const hamalManager = new TableManager({
    collectionName: 'tables',
    docId: 'TablesData',
    dataKey: 'tablesData',
    containerId: 'hamalTablesContainer',
    columns: [
      { label: 'שעות', defaultValue: (i) => getHourRange(i) },
      { label: 'חמ״ליסט', defaultValue: () => '' },
      { label: 'טלפנית', defaultValue: () => '' }
    ],
    defaultCellData: () => Array(33).fill('') // 11 rows * 3 cols
  });

  // Add Table Button
  document.getElementById('addTableBtn').addEventListener('click', () => {
    const nextDate = getNextDate(hamalManager.data);
    hamalManager.addTable(nextDate);
  });
});

// Helper to generate hour ranges
function getHourRange(index) {
  const startHour = (index * 2 + 2) % 24;
  const endHour = (index * 2) % 24;
  const format = (h) => h.toString().padStart(2, '0') + ':00';
  return `${format(startHour)} - ${format(endHour)}`;
}

// Helper to get next date
function getNextDate(currentData) {
  if (!currentData || currentData.length === 0) {
    return getCurrentHebrewDate();
  }
  const lastTitle = currentData[currentData.length - 1].title;
  // Parse date from title (assuming format "Day DD/MM/YYYY")
  const dateMatch = lastTitle.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
  if (!dateMatch) return getCurrentHebrewDate();

  const [day, month, year] = dateMatch[0].split('/').map(Number);
  const date = new Date(year, month - 1, day + 1);

  const days = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
  return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getCurrentHebrewDate() {
  const days = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
  const date = new Date();
  return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}