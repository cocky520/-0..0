// 取得彈窗與清單
const cartModal    = document.getElementById('cartModal'); // 使用 ID 選擇器
const cartList     = document.getElementById('cartList');
const closeCartBtn = document.getElementById('closeCartBtn'); // 使用 ID 選擇器
const clearCartBtn = document.getElementById('clearCartBtn'); // 使用 ID 選擇器

// 取得總計元素
const totalItems = document.getElementById('totalItems');
const totalPrice = document.getElementById('totalPrice');
const viewCartBtn  = document.getElementById('viewCartBtn'); // 使用 ID 選擇器
const checkoutBtn  = document.getElementById('checkoutBtn'); // 使用 ID 選擇器

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
renderCart(); // 確保頁面載入時更新購物車總計

// 更新購物車總計
function updateCartSummary() {
  const itemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const priceTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  totalItems.textContent = itemsCount;
  totalPrice.textContent = priceTotal;
}

// 渲染購物車清單
function renderCart() {
  cartList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} — 單價 NT$${item.price} × 數量 ${item.qty}`;
    cartList.appendChild(li);
  });
  updateCartSummary();
  localStorage.setItem('shoppingCart', JSON.stringify(cart)); // 儲存購物車到 localStorage
}

// 顯示購物車彈窗
viewCartBtn.addEventListener('click', () => {
  cartModal.style.display = 'flex';
});

// 關閉彈窗
closeCartBtn.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

// 清空購物車
clearCartBtn.addEventListener('click', () => {
  cart = [];
  renderCart();
  cartModal.style.display = 'none';
  alert('已清空購物車');

  document.querySelectorAll('.addVideoBtn.selected').forEach(btn => {
    btn.classList.remove('selected');
    btn.textContent = '加購本人激戰影片';
    btn.style.backgroundColor = '';
  });
});

// 結帳按鈕功能
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('購物車中沒有商品，請先加入商品！');
    return;
  }
  window.location.href = 'checkout.html';
});

// 每個商品區塊綁定事件
document.querySelectorAll('.product-page').forEach(productEl => {
  const minusBtn     = productEl.querySelector('.minusBtn');
  const plusBtn      = productEl.querySelector('.plusBtn');
  const qtyInput     = productEl.querySelector('.quantityInput');
  const addToCartBtn = productEl.querySelector('.addToCartBtn');
  const addVideoBtn  = productEl.querySelector('.addVideoBtn');

  function updateQuantity(newQty) {
    qtyInput.value = newQty < 1 ? 1 : newQty;
  }

  minusBtn.addEventListener('click', () => {
    updateQuantity(parseInt(qtyInput.value, 10) - 1);
  });

  plusBtn.addEventListener('click', () => {
    updateQuantity(parseInt(qtyInput.value, 10) + 1);
  });

  if (addVideoBtn) {
    addVideoBtn.addEventListener('click', () => {
      addVideoBtn.classList.toggle('selected');
      if (addVideoBtn.classList.contains('selected')) {
        addVideoBtn.textContent = 'NT$9000';
        addVideoBtn.style.backgroundColor = 'pink';
      } else {
        addVideoBtn.textContent = '加購本人激戰影片';
        addVideoBtn.style.backgroundColor = ''; // Reset to default
      }
    });
  }

  addToCartBtn.addEventListener('click', () => {
    const name      = productEl.querySelector('.product-name').innerText;
    const priceText = productEl.querySelector('.price').innerText;
    const priceMatch= priceText.match(/\d+/);
    let price     = priceMatch ? parseInt(priceMatch[0], 10) : 0;
    const qty       = parseInt(qtyInput.value, 10);

    let finalName = name;
    if (addVideoBtn && addVideoBtn.classList.contains('selected')) {
      finalName += ' (含加購本人激戰影片)';
      price += 9000;
    }

    const existing = cart.find(i => i.name === finalName);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name: finalName, price, qty });
    }

    renderCart();
    alert(`已將 ${qty} 個 ${finalName} 加入購物車！`);
  });
});