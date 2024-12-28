const dataStore = {
    users: [],
    categories: [],
    suppliers: [],
    transactions: [],
};

const generateId = (prefix) => `${prefix}-${Date.now()}`;
const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('d-none'));
    document.getElementById(sectionId).classList.remove('d-none');
};

// Pengguna
function addUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const id = generateId('USER');

    dataStore.users.push({ id, name, email });
    displayUsers();
    document.getElementById('userForm').reset();
}

function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = dataStore.users.map(user => `<div>${user.id} - ${user.name} (${user.email})</div>`).join('');
}

// Kategori
function addCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const id = generateId('CAT');

    dataStore.categories.push({ id, name });
    displayCategories();
    document.getElementById('categoryForm').reset();
}

function displayCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = dataStore.categories.map(category => `<div>${category.id} - ${category.name}</div>`).join('');
}

// Supplier
function addSupplier() {
    const name = document.getElementById('supplierName').value.trim();
    const company = document.getElementById('supplierCompany').value.trim();
    const phone = document.getElementById('supplierPhone').value.trim();
    const address = document.getElementById('supplierAddress').value.trim();
    const id = generateId('SUP');

    dataStore.suppliers.push({ id, name, company, phone, address });
    displaySuppliers();
    document.getElementById('supplierForm').reset();
}

function displaySuppliers() {
    const supplierList = document.getElementById('supplierList');
    supplierList.innerHTML = dataStore.suppliers.map(supplier => `<div>${supplier.id} - ${supplier.name}, ${supplier.company}, ${supplier.phone}, ${supplier.address}</div>`).join('');
}

// Transaksi
function addTransaction() {
    const product = document.getElementById('transactionProduct').value.trim();
    const price = parseFloat(document.getElementById('transactionPrice').value);
    const quantity = parseInt(document.getElementById('transactionQuantity').value);
    const total = price * quantity;
    const id = generateId('TRANS');

    dataStore.transactions.push({ id, product, price, quantity, total });
    displayTransactions();
    document.getElementById('transactionForm').reset();
}

function displayTransactions() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = dataStore.transactions.map(transaction => `
        <div>${transaction.id} - ${transaction.product}, ${transaction.quantity} x ${transaction.price}, Total: ${transaction.total}</div>
    `).join('');
}

// Laporan
function generateReport() {
    const totalRevenue = dataStore.transactions.reduce((sum, t) => sum + t.total, 0);
    const reportList = document.getElementById('reportList');
    reportList.innerHTML = dataStore.transactions.map(t => `
        <div>${t.id} - ${t.product} - ${t.total}</div>
    `).join('');
    document.getElementById('totalRevenue').textContent = `Total Pendapatan: Rp ${totalRevenue}`;
}
