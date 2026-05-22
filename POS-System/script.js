// ==========================================
// 🚨 SIDEBAR ROLE-BASED ACCESS CONTROL
// ==========================================

// Global variable declare karna taa ke line 33 ya baqi poori file mein kahin bhi error na aaye
const currentUserRole = localStorage.getItem('currentUserRole') || 'worker'; 

window.addEventListener('DOMContentLoaded', () => {
    const inventoryLink = document.querySelector('.nav-inventory');
    const salesReportsLink = document.querySelector('.nav-sales');
    const settingsLink = document.querySelector('.nav-setting');

    // Agar login user worker hai toh links hide karo
    if (currentUserRole === 'worker') {
        if (inventoryLink) inventoryLink.style.display = 'none';
        if (salesReportsLink) salesReportsLink.style.display = 'none';
        if (settingsLink) settingsLink.style.display = 'none';
    }
});

function logoutUser() {
    localStorage.removeItem('currentUserRole');
    window.location.replace("Login_Page/login.html");
}


// 2. Sidebar elements ko select karna (Pehle wala same code)
const inventoryLink = document.querySelector('.nav-inventory');
const salesReportsLink = document.querySelector('.nav-sales');
const settingsLink = document.querySelector('.nav-setting');

if (currentUserRole === 'worker') {
    if(inventoryLink) inventoryLink.style.display = 'none';
    if(salesReportsLink) salesReportsLink.style.display = 'none';
    if(settingsLink) settingsLink.style.display = 'none';
}


// Cart data store krny k liy aray
let cart = [];

// HTML Element ko select krnay k liy
const cartItemsContainer = document.querySelector(".cart-item");
const subtotalElement = document.querySelector(
  ".bill-summary .summary-row:nth-child(1) span:nth-child(2)",
);
const totalElement = document.querySelector(".font-bold span:nth-child(2)");
const productCards = document.querySelectorAll(".product-card");
const checkoutBtn = document.querySelector('.checkout-btn');
const searchInput = document.querySelector('.top-bar input');

// Product card click listener
productCards.forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.querySelector("h3").innerText;
    const price = parseInt(
      card.querySelector(".price").innerText.replace("Rs. ", ""),
    );
    addToCart(name, price);
  });
});
// add product to card
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1,
    });
  }

  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="color: #888; text-align: center; margin-top:20px;">Cart is empty</p>';
    subtotalElement.innerText = "Rs. 0";
    totalElement.innerText = 'Rs. 0';
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartitemHTML = `
        <div style="display: flex; justify-content: space-between; align-item: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9;">
        <div>
        <h4 style="font-size: 15px; color: #1e293b; margin-bottom: 5px;">${item.name}</h4>
        <small style="color: #64748b;">Rs. ${item.price} x ${item.quantity}</small>
        </div>

        <div style="display: flex; align-item: center; gap:10px;">
        <button onclick="changeQuantity(${index}, -1)" style="background: #e2e8f0; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
        <span style="font-weight: 600; font-size: 14px;">${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)" style="background: #e2e8f0; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>

        <button onclick="deleteItem(${index})" style="background: #fee2e2; color: #ef4444; border: none; padding: 2px 6px; boeder-radius: 4px; cursor: pointer; margin-left: 5px; font-size: 12px;">Delete</button>
        </div>

        <div style="font-weight: 600; color: #0284c7; min-width: 70px; text-align: right;">
        Rs. ${itemTotal}
        </div>
        </div>
        `;
    cartItemsContainer.innerHTML += cartitemHTML;
  });
  subtotalElement.innerText = `Rs. ${subtotal}`;
  totalElement.innerText = `Rs. ${subtotal}`;
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        deleteItem(index);
    }
    else {
        updateCartUI();
    }
}
function deleteItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your Cart is Empty. Please Add Any Item First And then Checkout...");
        return
    }
    let finalTotal = totalElement.innerText;
    alert(`Invoice Generated Successfully!\nTotal Amount Paid: ${finalTotal}\n\nThank you for shopping!`);
        cart = [];
        updateCartUI();
});



searchInput.addEventListener('input', (e) => {
    const searchTerm =e.target.value.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').innerText.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        }
        else {
            card.style.display = 'none';
        }
    });
});

// ==========================================
// 🚪 LOGOUT SYSTEM LOGIC
// ==========================================
function logoutUser() {
    // 1. LocalStorage se user ka role delete kar do
    localStorage.removeItem('currentUserRole'); 
    
    // 2. User ko wapas bhej do login screen par
    window.location.href = "Login_Page/login.html"; 
}

// ==========================================
// 🔍 CORE BARCODE SCANNER ENGINE & TOAST
// ==========================================
let barcodeBuffer = ""; 
let lastKeyTime = Date.now(); 

// Global keydown reader event loop
window.addEventListener('keydown', (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastKeyTime;
    lastKeyTime = currentTime;

    // Barcode scanner speed differentiation filter (<30ms threshold)
    if (timeDiff > 30) {
        barcodeBuffer = "";
    }

    // Trigger processing logic node execution on Enter keypress
    if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) {
            handleScannedBarcode(barcodeBuffer);
            barcodeBuffer = ""; 
        }
        return;
    }

    // Push inputs to active memory buffers strings lines
    if (e.key.length === 1) {
        barcodeBuffer += e.key;
    }
});

// Toast display processor engine
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    
    if (!toast || !toastMsg) return;

    // Data transfer to UI layout nodes
    toastMsg.innerText = message;

    // Sliding inside view trigger class toggle push action
    toast.classList.add('show');

    // ⏱️ AUTOMATIC DISMISSAL: 2.5 seconds counter timeout reset handler
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Data output action dispatcher
// function handleScannedBarcode(barcode) {
//     console.log("🎯 Successfully Scanned Barcode: " + barcode);
//     showToast(`🎉 Barcode Scanned: ${barcode}`);
// }

// ==========================================
// 🛒 LIVE LOCALSTORAGE BARCODE TO CART ENGINE
// ==========================================

function handleScannedBarcode(barcode) {
    console.log("🎯 Scanning Barcode from Live Storage: " + barcode);
    
    // 1. LocalStorage se fresh products database uthain (jo inventory page se save kiya tha)
    const liveProductsDatabase = JSON.parse(localStorage.getItem('pos_products')) || [];

    // 2. Scan huye barcode ko database ke andar dhoondain
    const matchedProduct = liveProductsDatabase.find(product => product.barcode === barcode);

    if (matchedProduct) {
        // 3. Agar product mil gaya, toh aap ke sales cart array wale function ko trigger karein
        // Yeh function automatic item ko right panel wale cart mein phenk dega aur bill total karega
        addItemToCart(matchedProduct.name, matchedProduct.price);
        
        // Screen par automatic popup confirmation dikhain
        showToast(`🛒 Added: ${matchedProduct.name} (Rs. ${matchedProduct.price})`);
    } else {
        // 4. Agar barcode data storage mein nahi mila (Khasosat: Agar product inventory mein add na ho)
        showToast(`❌ Not Found in Inventory: ${barcode}`);
    }
}