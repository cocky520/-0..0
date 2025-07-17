// 假設的台幣兌美元匯率
const TWD_TO_USD_RATE = 32; // 您可以根據實際情況調整此匯率

// 冷錢包地址 (請替換為您的實際地址)
const COLD_WALLET_ADDRESSES = {
  usdt: 'YOUR_USDT_COLD_WALLET_ADDRESS_HERE', // <-- 請填入您的 USDT 冷錢包地址
  usdc: 'YOUR_USDC_COLD_WALLET_ADDRESS_HERE', // <-- 請填入您的 USDC 冷錢包地址
  btc:  'YOUR_BTC_COLD_WALLET_ADDRESS_HERE'   // <-- 請填入您的 BTC 冷錢包地址
};

// 宣告變數，但不在這裡賦值，確保在 DOMContentLoaded 後才獲取元素
let usdtPriceEl, usdcPriceEl, btcPriceEl;
let payUsdtEl, payUsdcEl, payBtcEl;
let totalNtdEl, totalUsdEl;
let paymentModal, confirmPaymentBtn, cancelPaymentBtn, coldWalletAddressEl, selectedCryptoTypeEl;

let currentCryptoType = ''; // 用於儲存當前選擇的加密貨幣類型

// 獲取加密貨幣價格並顯示
async function fetchCryptoPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,bitcoin&vs_currencies=usd');
    const data = await response.json();

    const usdtPrice = data.tether.usd;
    const usdcPrice = data['usd-coin'].usd;
    const btcPrice  = data.bitcoin.usd;

    if (usdtPriceEl) usdtPriceEl.textContent = `$${usdtPrice.toFixed(4)}`;
    if (usdcPriceEl) usdcPriceEl.textContent = `$${usdcPrice.toFixed(4)}`;
    if (btcPriceEl) btcPriceEl.textContent  = `$${btcPrice.toFixed(2)}`;

    // 計算購物車總金額
    const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const totalNtd = shoppingCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalUsd = totalNtd / TWD_TO_USD_RATE;

    if (totalNtdEl) totalNtdEl.textContent = totalNtd.toFixed(2);
    if (totalUsdEl) totalUsdEl.textContent = totalUsd.toFixed(2);

    // 計算所需加密貨幣數量
    if (payUsdtEl) payUsdtEl.textContent = `${(totalUsd / usdtPrice).toFixed(6)} USDT`;
    if (payUsdcEl) payUsdcEl.textContent = `${(totalUsd / usdcPrice).toFixed(6)} USDC`;
    if (payBtcEl) payBtcEl.textContent  = `${(totalUsd / btcPrice).toFixed(8)} BTC`;

  } catch (error) {
    console.error('獲取加密貨幣價格失敗:', error);
    if (usdtPriceEl) usdtPriceEl.textContent = '載入失敗';
    if (usdcPriceEl) usdcPriceEl.textContent = '載入失敗';
    if (btcPriceEl) btcPriceEl.textContent  = '載入失敗';
    if (payUsdtEl) payUsdtEl.textContent = '計算失敗';
    if (payUsdcEl) usdcPriceEl.textContent = '計算失敗';
    if (payBtcEl) payBtcEl.textContent  = '計算失敗';
  }
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
  // 在 DOMContentLoaded 事件中獲取所有 DOM 元素
  usdtPriceEl = document.getElementById('usdt-price');
  usdcPriceEl = document.getElementById('usdc-price');
  btcPriceEl  = document.getElementById('btc-price');

  payUsdtEl = document.getElementById('pay-usdt');
  payUsdcEl = document.getElementById('pay-usdc');
  payBtcEl  = document.getElementById('pay-btc');

  totalNtdEl = document.getElementById('total-ntd');
  totalUsdEl = document.getElementById('total-usd');

  paymentModal = document.getElementById('paymentModal');
  confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
  coldWalletAddressEl = document.getElementById('coldWalletAddress');
  selectedCryptoTypeEl = document.getElementById('selectedCryptoType');

  // 檢查購物車是否為空，如果為空則導回主頁
  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  if (shoppingCart.length === 0) {
    alert('購物車中沒有商品，無法進入結帳頁面！');
    window.location.href = 'index.html';
    return; // 阻止後續程式碼執行
  }

  console.log('checkout.js DOMContentLoaded 載入成功。');
  console.log('paymentModal 元素:', paymentModal);
  console.log('selectedCryptoTypeEl 元素:', selectedCryptoTypeEl);
  console.log('去繳費按鈕元素:', document.querySelectorAll('.pay-btn'));

  fetchCryptoPrices(); // 獲取並顯示價格

  // 處理「去繳費」按鈕點擊事件
  document.querySelectorAll('.pay-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      console.log('去繳費按鈕被點擊！', event.target.dataset.crypto);
      currentCryptoType = event.target.dataset.crypto; // 儲存當前選擇的加密貨幣類型

      if (selectedCryptoTypeEl) {
        selectedCryptoTypeEl.textContent = currentCryptoType.toUpperCase();
      } else {
        console.error('錯誤：selectedCryptoTypeEl 為 null，無法設定文字內容。');
      }

      if (coldWalletAddressEl) {
        coldWalletAddressEl.textContent = COLD_WALLET_ADDRESSES[currentCryptoType];
      } else {
        console.error('錯誤：coldWalletAddressEl 為 null，無法設定文字內容。');
      }

      if (paymentModal) {
        paymentModal.style.display = 'flex'; // 顯示彈窗
      } else {
        console.error('錯誤：paymentModal 為 null，無法顯示彈窗。');
      }
    });
  });

  // 處理彈窗內的按鈕事件
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const postalCode = document.getElementById('postalCode').value;
  const gmail = document.getElementById('gmail').value;

  if (!name || !phone || !address || !postalCode || !gmail) {
    alert('請填寫所有必填資訊！');
    return;
  }

  alert(`支付資訊已提交！
姓名: ${name}
電話: ${phone}
地址: ${address}
郵遞區號: ${postalCode}
Gmail: ${gmail}
請將 ${selectedCryptoTypeEl.textContent} 匯款至：${coldWalletAddressEl.textContent}`);
      if (paymentModal) paymentModal.style.display = 'none'; // 隱藏彈窗
      // 在這裡可以添加將這些資訊發送到後端的邏輯
    });
  }

  if (cancelPaymentBtn) {
    cancelPaymentBtn.addEventListener('click', () => {
      if (paymentModal) paymentModal.style.display = 'none'; // 隱藏彈窗
    });
  }
});

// 每 30 秒更新一次價格 (這個可以保持在 DOMContentLoaded 外部)
setInterval(fetchCryptoPrices, 30000);
