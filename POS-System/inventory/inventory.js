// ==========================================
// 💾 DEDICATED INVENTORY STORAGE ENGINE
// ==========================================

// 1. Permanent LocalStorage global pointer linkage
let productsDatabase = JSON.parse(localStorage.getItem('pos_products')) || [];

window.addEventListener('DOMContentLoaded', () => {
    updateInventoryTable();
});

// 2. Submit Entry Form Processor 
const productForm = document.getElementById('productForm');
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const barcode = document.getElementById('prodBarcode').value.trim();
        const name = document.getElementById('prodName').value.trim();
        const price = parseFloat(document.getElementById('prodPrice').value);

        // Duplicate Barcode check protection
        const duplicate = productsDatabase.find(p => p.barcode === barcode);
        if (duplicate) {
            showToast("❌ Barcode already exists!");
            return;
        }

        // Push structural item properties object to database node
        productsDatabase.push({ barcode, name, price });
        localStorage.setItem('pos_products', JSON.stringify(productsDatabase));

        productForm.reset();
        updateInventoryTable();
        showToast(`💾 Saved: ${name}`);
    });
}

// 3. UI Table Mapper Dynamic Render Loop
function updateInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = "";

    productsDatabase.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${product.barcode}</strong></td>
            <td>${product.name}</td>
            <td>Rs. ${product.price}</td>
            <td><button class="btn-delete" onclick="deleteProduct(${index})">🗑️ Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// 4. Data Splice Delete Action Array Handler
function deleteProduct(index) {
    const targetName = productsDatabase[index].name;
    productsDatabase.splice(index, 1);
    localStorage.setItem('pos_products', JSON.stringify(productsDatabase));
    updateInventoryTable();
    showToast(`🗑️ Removed: ${targetName}`);
}

// 5. Shared Local Toast Animation Alert
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;
    toastMsg.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
}

function logoutUser() {
    localStorage.removeItem('currentUserRole');
    window.location.replace("../login.html");
}