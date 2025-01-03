
    // Data store
    const dataStore = { users: [], categories: [], suppliers: [], products: [], transactions: [] };

    // Helper function to generate ID
    function generateId(prefix) {
        return `${prefix}-${Date.now()}`;
    }

    // Display sections
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        if (sectionId === 'products') populateProductForm();
        if (sectionId === 'transactions') populateTransactionProducts();
    }

    // Pengguna
    function addUser() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        if (!name || !email) return alert('Nama dan Email wajib diisi!');
        dataStore.users.push({ id: generateId('USER'), name, email });
        displayUsers();
        document.getElementById('userForm').reset();
    }
    function displayUsers() {
        document.getElementById('userList').innerHTML = dataStore.users.map(user =>
            `<div>${user.id} - ${user.name} (${user.email})</div>`).join('');
    }

    // Kategori
    function addCategory() {
        const name = document.getElementById('categoryName').value.trim();
        if (!name) return alert('Nama Kategori wajib diisi!');
        dataStore.categories.push({ id: generateId('CAT'), name });
        displayCategories();
        document.getElementById('categoryForm').reset();
    }
    function displayCategories() {
        document.getElementById('categoryList').innerHTML = dataStore.categories.map(cat =>
            `<div>${cat.id} - ${cat.name}</div>`).join('');
    }

    // Supplier
    function addSupplier() {
        const name = document.getElementById('supplierName').value.trim();
        const company = document.getElementById('supplierCompany').value.trim();
        const phone = document.getElementById('supplierPhone').value.trim();
        const address = document.getElementById('supplierAddress').value.trim();
        if (!name || !company || !phone || !address) return alert('Semua field wajib diisi!');
        dataStore.suppliers.push({ id: generateId('SUP'), name, company, phone, address });
        displaySuppliers();
        document.getElementById('supplierForm').reset();
    }
    function displaySuppliers() {
        document.getElementById('supplierList').innerHTML = dataStore.suppliers.map(sup =>
            `<div>${sup.id} - ${sup.name} (${sup.company})</div>`).join('');
    }

    // Produk
    function addProduct() {
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const category = document.getElementById('productCategory').value;
        const supplier = document.getElementById('productSupplier').value;
        if (!name || !price || !stock || !category || !supplier) return alert('Semua field wajib diisi!');
        dataStore.products.push({ id: generateId('PROD'), name, price, stock, category, supplier });
        displayProducts();
        document.getElementById('productForm').reset();
    }
    function displayProducts() {
        document.getElementById('productList').innerHTML = dataStore.products.map(prod =>
            `<div>${prod.id} - ${prod.name} (Rp${prod.price}) | Stok: ${prod.stock}</div>`).join('');
    }
    function populateProductForm() {
        const categorySelect = document.getElementById('productCategory');
        const supplierSelect = document.getElementById('productSupplier');
        categorySelect.innerHTML = '<option value="" disabled selected>Pilih Kategori</option>';
        supplierSelect.innerHTML = '<option value="" disabled selected>Pilih Supplier</option>';
        dataStore.categories.forEach(cat => categorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`);
        dataStore.suppliers.forEach(sup => supplierSelect.innerHTML += `<option value="${sup.name}">${sup.name}</option>`);
    }





    // Transaksi
function addTransaction() {
    const productId = document.getElementById('transactionProduct').value;
    const quantity = parseInt(document.getElementById('transactionQuantity').value);
    const discount = parseFloat(document.getElementById('transactionDiscount').value) || 0;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const payment = parseFloat(document.getElementById('transactionPayment').value);

    const product = dataStore.products.find(p => p.id === productId);
    if (!product) return alert('Produk tidak valid!');
    if (quantity > product.stock) return alert('Stok tidak mencukupi!');

    // Hitung total harga dengan diskon
    const subtotal = product.price * quantity;
    const totalDiscount = discount * quantity;
    const totalPrice = subtotal - totalDiscount;

    // Kurangi stok produk
    product.stock -= quantity;

    // Tentukan status dan kembalian
    const status = payment >= totalPrice ? 'Lunas' : 'Belum Lunas';
    const change = payment > totalPrice ? payment - totalPrice : 0;

    // Simpan transaksi
    dataStore.transactions.push({
        id: generateId('TRANS'),
        product: product.name,
        quantity,
        price: product.price,
        subtotal,
        discount: totalDiscount,
        total: totalPrice,
        paymentMethod,
        payment,
        change,
        status
    });

    // Tampilkan transaksi dan perbarui stok
    displayTransactions();
    populateTransactionProducts();
    document.getElementById('transactionForm').reset();
}



function displayTransactions() {
    document.getElementById('transactionList').innerHTML = dataStore.transactions.map(trans =>
        `<div class="border p-2 rounded mb-2">
            <p><strong>Produk:</strong> ${trans.product}</p>
            <p><strong>Jumlah:</strong> ${trans.quantity}</p>
            <p><strong>Harga:</strong> Rp${trans.price}</p>
            <p><strong>Subtotal:</strong> Rp${trans.subtotal}</p>
            <p><strong>Diskon:</strong> Rp${trans.discount}</p>
            <p><strong>Total:</strong> Rp${trans.total}</p>
            <p><strong>Metode Pembayaran:</strong> ${trans.paymentMethod}</p>
            <p><strong>Jumlah Pembayaran:</strong> Rp${trans.payment}</p>
            <p><strong>Kembalian:</strong> Rp${trans.change}</p>
            <p><strong>Status:</strong> ${trans.status}</p>
        </div>`).join('');
}


function populateTransactionProducts() {
    const productSelect = document.getElementById('transactionProduct');
    productSelect.innerHTML = '<option value="" disabled selected>Pilih Produk</option>';
    dataStore.products.filter(prod => prod.stock > 0).forEach(prod =>
        productSelect.innerHTML += `<option value="${prod.id}">${prod.name}</option>`);
}





    // Laporan
    function generateReport() {
        const filter = document.getElementById('reportFilter').value;
        let filteredTransactions = dataStore.transactions;
        if (filter === 'category') {
            filteredTransactions = dataStore.transactions.map(trans => {
                const prod = dataStore.products.find(p => p.name === trans.product);
                return { ...trans, category: prod ? prod.category : 'Tidak Diketahui' };
            });
        } else if (filter === 'supplier') {
            filteredTransactions = dataStore.transactions.map(trans => {
                const prod = dataStore.products.find(p => p.name === trans.product);
                return { ...trans, supplier: prod ? prod.supplier : 'Tidak Diketahui' };
            });
        }
        document.getElementById('reportList').innerHTML = filteredTransactions.map(trans =>
            `<div>${trans.id} - ${trans.product} | Total: Rp${trans.total}</div>`).join('');
        const total = filteredTransactions.reduce((sum, trans) => sum + trans.total, 0);
        document.getElementById('totalRevenue').textContent = `Total Pendapatan: Rp${total}`;
    }
    document.getElementById('reportFilter').addEventListener('change', generateReport);
