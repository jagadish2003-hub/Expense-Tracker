const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const filter = document.getElementById("filter");
const fileInput = document.getElementById("fileInput");

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

let pieChart;

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || category.value.trim() === '') {
    alert('Please add text, amount, and category');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      category: category.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updatePieChart();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
    category.value = '';
  }
}

function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    <button class="edit-btn" onclick="editTransaction(${transaction.id})">edit</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
}

function editTransaction(id) {
  const transaction = transactions.find(transaction => transaction.id === id);
  text.value = transaction.text;
  amount.value = transaction.amount;
  category.value = transaction.category;
  removeTransaction(id);
}

function filterByCategory() {
  const filterValue = filter.value.toLowerCase();
  const filteredTransactions = transactions.filter(transaction => transaction.category.toLowerCase().includes(filterValue));

  list.innerHTML = '';
  filteredTransactions.forEach(addTransactionDOM);
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function exportData() {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.json';
  a.click();
}

function uploadData() {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension === 'json') {
        const importedTransactions = JSON.parse(e.target.result);
        transactions = importedTransactions;
        updateLocalStorage();
        Init();
      } else if (extension === 'xlsx' || extension === 'xls') {
        importExcelData(e.target.result);
      } else if (extension === 'pdf') {
        importPDFData(e.target.result);
      } else if (extension === 'doc' || extension === 'docx') {
        importWordData(e.target.result);
      } else {
        alert('Unsupported file type');
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

function importExcelData(arrayBuffer) {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  transactions = rows.map(row => ({
    id: generateID(),
    text: row[0],
    amount: +row[1],
    category: row[2]
  }));
  updateLocalStorage();
  Init();
}

function importPDFData(arrayBuffer) {
  pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(pdf => {
    pdf.getPage(1).then(page => {
      page.getTextContent().then(textContent => {
        const textItems = textContent.items.map(item => item.str);
        const text = textItems.join(' ');
        const importedTransactions = extractTransactionsFromText(text);
        transactions = importedTransactions;
        updateLocalStorage();
        Init();
      });
    });
  });
}

function importWordData(arrayBuffer) {
  const zip = new JSZip();
  zip.loadAsync(arrayBuffer).then(zip => {
    zip.file('word/document.xml').async('string').then(content => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'application/xml');
      const paragraphs = Array.from(xmlDoc.getElementsByTagName('w:t')).map(el => el.textContent);
      const text = paragraphs.join(' ');
      const importedTransactions = extractTransactionsFromText(text);
      transactions = importedTransactions;
      updateLocalStorage();
      Init();
    });
  });
}

function extractTransactionsFromText(text) {
  const lines = text.split('\n');
  return lines.map(line => {
    const [text, amount, category] = line.split(',').map(item => item.trim());
    return {
      id: generateID(),
      text,
      amount: +amount,
      category
    };
  });
}

function Init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
  updatePieChart();
}

function updatePieChart() {
  const total = parseFloat(balance.innerText.replace('$', ''));
  const income = parseFloat(money_plus.innerText.replace('+$', ''));
  const expense = parseFloat(money_minus.innerText.replace('-$', ''));

  const pieData = {
    labels: ['Balance', 'Income', 'Expense'],
    datasets: [{
      data: [total, income, expense],
      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
    }]
  };

  const pieChartConfig = {
    type: 'pie',
    data: pieData,
    options: {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  };

  if (pieChart) {
    pieChart.destroy();
  }

  const ctx = document.getElementById('pie-chart').getContext('2d');
  pieChart = new Chart(ctx, pieChartConfig);
}

form.addEventListener('submit', addTransaction);
filter.addEventListener('input', filterByCategory);

Init();
