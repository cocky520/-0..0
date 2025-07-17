document.addEventListener('DOMContentLoaded', () => {
  const ageVerificationModal = document.getElementById('ageVerificationModal');
  const ageYesBtn = document.getElementById('ageYesBtn');
  const ageNoBtn = document.getElementById('ageNoBtn');
  const enterStoreBtn = document.querySelector('.intro-container button');

  // 輪播圖相關元素
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselImages = document.querySelectorAll('.carousel-image');
  const carouselDots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  const slideInterval = 2500; // 2.5 秒

  // 預設隱藏賣場進入按鈕
  enterStoreBtn.style.display = 'none';

  // 顯示年齡驗證彈窗
  ageVerificationModal.style.display = 'flex';

  ageYesBtn.addEventListener('click', () => {
    ageVerificationModal.style.display = 'none'; // 隱藏彈窗
    enterStoreBtn.style.display = 'block'; // 顯示進入賣場按鈕
    startCarousel(); // 開始輪播
  });

  ageNoBtn.addEventListener('click', () => {
    alert('您未滿 18 歲，無法進入本網站。');
    window.location.href = 'about:blank'; // 跳轉到空白頁面，模擬離開網站
  });

  // 輪播圖功能
  function updateCarousel() {
    carouselTrack.style.transform = `translateX(${-currentSlide * 100}%)`;
    carouselDots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % carouselImages.length;
    updateCarousel();
  }

  let carouselTimer;
  function startCarousel() {
    carouselTimer = setInterval(nextSlide, slideInterval);
  }

  // 點擊導航點切換圖片
  carouselDots.forEach(dot => {
    dot.addEventListener('click', (event) => {
      currentSlide = parseInt(event.target.dataset.slide);
      updateCarousel();
      clearInterval(carouselTimer); // 點擊後重置計時器
      startCarousel();
    });
  });

  // 初始化輪播圖
  updateCarousel();
});