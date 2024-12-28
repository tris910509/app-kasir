// Helper Function
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}


const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const generateId = (prefix) => `${prefix}-${Date.now()}`;
const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('d-none'));
    document.getElementById(sectionId).classList.remove('d-none');
};





// CRUD Functions
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

function addCustomer() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const id = generateId('CUST');

    if (!name || !phone || !address || !email) {
        alert('Semua field wajib diisi!');
        return;
    }

    if (!/^\d+$/.test(phone)) {
        alert('Nomor Handphone harus berupa angka!');
        return;
    }

    const customers = getFromLocalStorage('customers');
    customers.push({ id, name, phone, address, email });
    saveToLocalStorage('customers', customers);
    displayCustomers();
    document.getElementById('customerForm').reset();
}

function displayCustomers(customers = getFromLocalStorage('customers')) {
    const list = document.getElementById('customerList');
    list.innerHTML = customers.map(c => `
        <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
            <span>${c.id} - ${c.name} (${c.phone}, ${c.email}, ${c.address})</span>
            <div>
                <button class="btn btn-sm btn-warning me-1" onclick="editCustomer('${c.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${c.id}')">Hapus</button>
            </div>
        </div>
    `).join('');
}

function searchCustomer() {
    const query = document.getElementById('searchCustomer').value.toLowerCase();
    const customers = getFromLocalStorage('customers');
    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query)
    );
    displayCustomers(filtered);
}

function editCustomer(id) {
    const customers = getFromLocalStorage('customers');
    const customer = customers.find(c => c.id === id);

    if (!customer) return alert('Pelanggan tidak ditemukan!');

    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerAddress').value = customer.address;
    document.getElementById('customerEmail').value = customer.email;

    document.getElementById('customerForm').onsubmit = function (e) {
        e.preventDefault();
        customer.name = document.getElementById('customerName').value;
        customer.phone = document.getElementById('customerPhone').value;
        customer.address = document.getElementById('customerAddress').value;
        customer.email = document.getElementById('customerEmail').value;

        saveToLocalStorage('customers', customers);
        displayCustomers();
        document.getElementById('customerForm').reset();
        document.getElementById('customerForm').onsubmit = addCustomer;
    };
}

function deleteCustomer(id) {
    const customers = getFromLocalStorage('customers');
    const updatedCustomers = customers.filter(c => c.id !== id);
    saveToLocalStorage('customers', updatedCustomers);
    displayCustomers();
}




// Add Product
function addProduct() {
    const id = document.getElementById('productId').value.trim();
    const name = document.getElementById('productName').value.trim();
    const notes = document.getElementById('productNotes').value.trim();

    if (!id || !name) {
        alert("ID dan Nama Produk wajib diisi!");
        return;
    }

    const products = getFromLocalStorage('products');
    products.push({ id, name, notes });
    saveToLocalStorage('products', products);
    displayProducts();
    document.getElementById('productForm').reset();
}

// Add Transaction
function addTransaction() {
    const id = document.getElementById('transactionId').value.trim();
    const customerId = document.getElementById('customerForTransaction').value.trim();
    const productId = document.getElementById('productForTransaction').value.trim();

    if (!id || !customerId || !productId) {
        alert("Semua field wajib diisi!");
        return;
    }

    const transactions = getFromLocalStorage('transactions');
    transactions.push({ id, customerId, productId });
    saveToLocalStorage('transactions', transactions);
    displayTransactions();
    document.getElementById('transactionForm').reset();
}

// Display Data
function displayCustomers() {
    const customers = getFromLocalStorage('customers');
    const list = document.getElementById('customerList');
    list.innerHTML = customers.map(c => `<p>${c.id} - ${c.name} (${c.notes || 'Tidak ada keterangan'})</p>`).join('');
}

function displayProducts() {
    const products = getFromLocalStorage('products');
    const list = document.getElementById('productList');
    list.innerHTML = products.map(p => `<p>${p.id} - ${p.name} (${p.notes || 'Tidak ada keterangan'})</p>`).join('');
}

function displayTransactions() {
    const transactions = getFromLocalStorage('transactions');
    const list = document.getElementById('transactionList');
    list.innerHTML = transactions.map(t => `<p>${t.id} - Pelanggan ${t.customerId} membeli produk ${t.productId}</p>`).join('');
}

// Generate Report
function generateReport() {
    const transactions = getFromLocalStorage('transactions');
    const customers = getFromLocalStorage('customers');
    const products = getFromLocalStorage('products');

    const report = transactions.map(t => {
        const customer = customers.find(c => c.id === t.customerId) || { name: 'Tidak ditemukan' };
        const product = products.find(p => p.id === t.productId) || { name: 'Tidak ditemukan' };
        return `<p>Transaksi ${t.id}: ${customer.name} membeli ${product.name}</p>`;
    });

    const list = document.getElementById('reportList');
    list.innerHTML = report.join('');
}

// Initialize
showSection('customers');
displayCustomers();
displayProducts();
displayTransactions();
