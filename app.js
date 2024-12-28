const dataStore = {
    users: [],
    categories: [],
    suppliers: [],
    products: [],
    transactions: [],
};


const generateId = (prefix) => `${prefix}-${Date.now()}`;
const showSection = (sectionId) => {
    document.querySelectorAll('.section').forEach(section => section.classList.add('d-none'));
    document.getElementById(sectionId).classList.remove('d-none');
};

// Pengguna
function addUser() {
    const nameField = document.getElementById('userName');
    const emailField = document.getElementById('userEmail');

    if (!validateInput([nameField, emailField])) return;

    const id = generateId('USER');
    dataStore.users.push({ id, name: nameField.value.trim(), email: emailField.value.trim() });
    displayUsers();
    document.getElementById('userForm').reset();
}

function displayUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = dataStore.users.map(user => `
        <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
            <span>${user.id} - ${user.name} (${user.email})</span>
            <div>
                <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Hapus</button>
            </div>
        </div>
    `).join('');
}

// Fungsi Edit Pengguna
function editUser(id) {
    const user = dataStore.users.find(u => u.id === id);
    if (!user) return;

    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;

    // Tombol Simpan Perubahan
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Simpan Perubahan';
    saveButton.className = 'btn btn-success';
    saveButton.onclick = function () {
        user.name = document.getElementById('userName').value.trim();
        user.email = document.getElementById('userEmail').value.trim();
        displayUsers();
        document.getElementById('userForm').reset();
        saveButton.remove();
    };

    document.getElementById('userForm').appendChild(saveButton);
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


// Tambahkan Produk
function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const category = document.getElementById('productCategory').value;
    const supplier = document.getElementById('productSupplier').value;
    const id = generateId('PROD');

    if (!name || !price || !stock || !category || !supplier) {
        alert('Semua field wajib diisi!');
        return;
    }

    dataStore.products.push({ id, name, price, stock, category, supplier });
    displayProducts();
    document.getElementById('productForm').reset();
}

// Tampilkan Produk
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = dataStore.products.map(product => `
        <div class="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
            <span>${product.id} - ${product.name} | Harga: Rp${product.price} | Stok: ${product.stock} | Kategori: ${product.category} | Supplier: ${product.supplier}</span>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">Hapus</button>
        </div>
    `).join('');
}

// Hapus Produk
function deleteProduct(id) {
    dataStore.products = dataStore.products.filter(product => product.id !== id);
    displayProducts();
}

// Inisialisasi Pilihan Kategori dan Supplier
function populateProductForm() {
    const categorySelect = document.getElementById('productCategory');
    const supplierSelect = document.getElementById('productSupplier');

    categorySelect.innerHTML = '<option value="" disabled selected>Pilih Kategori</option>';
    supplierSelect.innerHTML = '<option value="" disabled selected>Pilih Supplier</option>';

    dataStore.categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
    });

    dataStore.suppliers.forEach(supplier => {
        supplierSelect.innerHTML += `<option value="${supplier.name}">${supplier.name}</option>`;
    });
}




// Transaksi
function addTransaction() {
    const productId = document.getElementById('transactionProduct').value;
    const quantity = parseInt(document.getElementById('transactionQuantity').value);
    const product = dataStore.products.find(p => p.id === productId);

    if (!productId || !quantity || quantity > product.stock) {
        alert('Produk tidak valid atau stok tidak mencukupi!');
        return;
    }

    const total = product.price * quantity;
    const id = generateId('TRANS');

    // Kurangi stok produk
    product.stock -= quantity;

    dataStore.transactions.push({ id, product: product.name, price: product.price, quantity, total });
    displayTransactions();
    populateTransactionProducts(); // Perbarui stok di dropdown transaksi
    document.getElementById('transactionForm').reset();
}


function populateTransactionProducts() {
    const transactionProduct = document.getElementById('transactionProduct');
    transactionProduct.innerHTML = '<option value="" disabled selected>Pilih Produk</option>';

    dataStore.products.forEach(product => {
        transactionProduct.innerHTML += `<option value="${product.id}">${product.name}</option>`;
    });
}


// Laporan


function generateReport() {
    const filter = document.getElementById('reportFilter').value;
    const reportList = document.getElementById('reportList');
    const totalRevenue = document.getElementById('totalRevenue');

    let filteredTransactions = dataStore.transactions;

    if (filter === 'category') {
        filteredTransactions = dataStore.transactions.map(t => {
            const product = dataStore.products.find(p => p.name === t.product);
            return { ...t, category: product ? product.category : 'Tidak Diketahui' };
        });

        reportList.innerHTML = filteredTransactions.map(t => `
            <div>${t.id} - ${t.product} (${t.category}) - Rp${t.total}</div>
        `).join('');
    } else if (filter === 'supplier') {
        filteredTransactions = dataStore.transactions.map(t => {
            const product = dataStore.products.find(p => p.name === t.product);
            return { ...t, supplier: product ? product.supplier : 'Tidak Diketahui' };
        });

        reportList.innerHTML = filteredTransactions.map(t => `
            <div>${t.id} - ${t.product} (${t.supplier}) - Rp${t.total}</div>
        `).join('');
    } else if (filter === 'product') {
        reportList.innerHTML = dataStore.transactions.map(t => `
            <div>${t.id} - ${t.product} - Rp${t.total}</div>
        `).join('');
    } else {
        reportList.innerHTML = dataStore.transactions.map(t => `
            <div>${t.id} - ${t.product} - Rp${t.total}</div>
        `).join('');
    }

    const total = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    totalRevenue.textContent = `Total Pendapatan: Rp${total}`;
}

document.getElementById('reportFilter').addEventListener('change', generateReport);

