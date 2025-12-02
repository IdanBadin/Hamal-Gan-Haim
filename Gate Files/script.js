// Gate Page Logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize TableManager for Gate
  const gateManager = new TableManager({
    collectionName: 'gateTables',
    docId: 'GateTablesData',
    dataKey: 'gateTablesData',
    containerId: 'gateTablesContainer',
    columns: [
      { label: 'שעות', defaultValue: (i) => getHourRange(i) },
      { label: 'חמוש', defaultValue: () => '' },
      { label: 'הערות', defaultValue: () => '' }
    ],
    defaultCellData: () => Array(36).fill('') // 12 rows * 3 cols
  });

  // Add Table Button
  document.getElementById('addTableBtn').addEventListener('click', () => {
    const nextDate = getNextDate(gateManager.data);
    gateManager.addTable(nextDate);
  });
});

// Helper to generate hour ranges (Gate specific logic)
function getHourRange(index) {
  const startHour = (index * 2 + 2) % 24;
  const endHour = (index * 2) % 24;
  const format = (h) => h.toString().padStart(2, '0') + ':00';
  return `${format(startHour)} - ${format(endHour)}`;
}

// Helper to get next date (Shared logic, could be moved to utility)
function getNextDate(currentData) {
  if (!currentData || currentData.length === 0) {
    return getCurrentHebrewDate();
  }
  const lastTitle = currentData[currentData.length - 1].title;
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