# Expense Tracker

This Expense Tracker web application allows users to track their income and expenses, view a financial overview via a pie chart, and manage transactions efficiently. It includes features for adding, editing, deleting transactions, filtering by category, and importing/exporting transaction data.

## Features

- **View Balance**: Displays current balance, total income, and total expenses.
- **Add New Transactions**: Users can add income or expense transactions with a description, amount, and category.
- **Edit and Delete Transactions**: Users can edit or delete any existing transactions.
- **Filter by Category**: Users can filter transactions by category.
- **Financial Overview**: Displays a pie chart representing the balance, income, and expenses.
- **Data Import and Export**: Users can export transactions data to a JSON file and import transactions from JSON, Excel, PDF, or Word files.

## Usage

1. **View Current Balance and Transactions**:
   - The current balance, total income, and total expenses are displayed at the top.
   - The history of transactions is displayed in a list format.

2. **Add a New Transaction**:
   - Fill in the description in the "Text" field.
   - Enter the amount in the "Amount" field (use negative values for expenses).
   - Enter the category in the "Category" field.
   - Click the "Add Transaction" button to save the transaction.

3. **Edit or Delete a Transaction**:
   - To edit, click the "edit" button next to the transaction, update the details in the form, and save.
   - To delete, click the "x" button next to the transaction.

4. **Filter Transactions by Category**:
   - Enter the category in the "Filter by Category" input field to filter the displayed transactions.

5. **View Financial Overview**:
   - The pie chart below the balance section displays the distribution of the balance, income, and expenses.

6. **Export and Import Data**:
   - Click "Export Data" to download transactions as a JSON file.
   - Use the file input to select a file for uploading and click "Upload Data" to import transactions. Supported formats include JSON, Excel, PDF, and Word.

## Technologies Used

- HTML, CSS, JavaScript for the frontend.
- [Chart.js](https://www.chartjs.org/) for rendering the pie chart.
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) for file operations.
- [JSZip](https://stuk.github.io/jszip/) for handling Word document files.
- [pdfjsLib](https://mozilla.github.io/pdf.js/) for parsing PDF files.
- [XLSX](https://github.com/SheetJS/sheetjs) for reading Excel files.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jagadish2003-hub/Expense-Tracker.git
   cd Expense-Tracker
