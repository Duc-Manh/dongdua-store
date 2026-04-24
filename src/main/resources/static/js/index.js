// --- 1. Cấu hình Slider cho Không gian quán ---
const currentIndices = {
  'img-tang-1': 1,
  'img-tang-2': 1,
};

function changeImage(elementId, prefix, direction, total) {
  const imgElement = document.getElementById(elementId);
  if (!imgElement) return;

  currentIndices[elementId] += direction;
  if (currentIndices[elementId] > total) currentIndices[elementId] = 1;
  else if (currentIndices[elementId] < 1) currentIndices[elementId] = total;

  imgElement.style.opacity = '0.3';
  setTimeout(() => {
    imgElement.src = `/images/${prefix}${currentIndices[elementId]}.jpg`;
    imgElement.style.opacity = '1';
  }, 250);
}

// --- 2. Xử lý Hòm thư góp ý ---
document.addEventListener('DOMContentLoaded', () => {
  const scriptURL =
    'https://script.google.com/macros/s/AKfycbw-V71fGkumO2QQsQucdulmv6C5KxN_kEQLKK4DM6Wg7ktGaXl08i-DBPff0KpSZS-1/exec';
  const feedbackForm = document.getElementById('feedbackForm');

  if (feedbackForm) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    const submitBtn = feedbackForm.querySelector('button');

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerText = 'Đang gửi...';
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedbackMessage.value }),
      })
        .then(() => {
          alert('Cảm ơn bạn! Đong Đưa đã nhận được lời nhắn của bạn.');
          feedbackForm.reset();
        })
        .catch(() => alert('Rất tiếc, không gửi được góp ý. Bạn vui lòng thử lại sau nhé!'))
        .finally(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    });
  }

  // Khởi tạo các sự kiện Sidebar sau khi DOM load
  initSidebars();

  // Khởi tạo Overlay Menu
  initMenuOverlay();

  // Khởi tạo hiệu ứng gõ chữ
  initTypingEffect();
});

// --- 3. Xử lý Firebase - Đếm lượt truy cập ---
const firebaseConfig = {
  apiKey: 'AIzaSyB5zh9Lv64cjukC8FBsYdiQ7s9anqLd6qU',
  authDomain: 'dong-dua-916d5.firebaseapp.com',
  databaseURL: 'https://dong-dua-916d5-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'dong-dua-916d5',
  storageBucket: 'dong-dua-916d5.appspot.com',
  messagingSenderId: '210843798211',
  appId: '1:210843798211:web:513924e422c898ad04b076',
};

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const database = firebase.database();

  // Lấy ngày hiện tại theo múi giờ Việt Nam (YYYY-MM-DD)
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA'); // Trả về định dạng YYYY-MM-DD chính xác

  const totalRef = database.ref('visitors/total');
  const todayRef = database.ref('visitors/daily/' + todayStr);

  // Tăng số lượt truy cập (Chỉ tăng 1 lần mỗi phiên làm việc để tránh spam)
  if (!sessionStorage.getItem('visited_dong_dua')) {
    totalRef.transaction((current) => (current || 0) + 1);
    todayRef.transaction((current) => (current || 0) + 1);
    sessionStorage.setItem('visited_dong_dua', 'true');
  }

  // Lắng nghe và cập nhật số liệu "Tổng lượt xem"
  totalRef.on('value', (snapshot) => {
    const val = snapshot.val() || 0;
    const el = document.getElementById('total-visitors');
    if (el) el.innerText = val.toLocaleString(); // Thêm dấu phẩy phân cách hàng nghìn cho đẹp
  });

  // Lắng nghe và cập nhật số liệu "Hôm nay"
  todayRef.on('value', (snapshot) => {
    const val = snapshot.val() || 0;
    const el = document.getElementById('today-visitors');
    if (el) el.innerText = val.toLocaleString();
  });
}

// --- 4. Hệ thống Sidebar (Hover hiện - Click ngoài đóng) ---
function openSidebar(id, direction) {
  const sidebar = document.getElementById(id);
  if (!sidebar) return;
  const contents = sidebar.querySelectorAll('.sidebar-content');

  // Xóa sạch TẤT CẢ class ẩn (kể cả bản mobile và bản desktop md:)
  sidebar.classList.remove(
    'translate-x-[-85%]',
    'translate-x-[-70%]',
    'translate-x-[85%]',
    'translate-x-[70%]',
    'md:translate-x-[-70%]',
    'md:translate-x-[70%]',
  );

  // Ép hiển thị bằng class 0
  sidebar.classList.add('translate-x-0');

  // Hiện nội dung con
  if (contents) {
    contents.forEach((el) => el.classList.remove('opacity-0'));
  }
}

function closeSidebar(id, direction) {
  const sidebar = document.getElementById(id);
  if (!sidebar) return;
  const contents = sidebar.querySelectorAll('.sidebar-content');

  // Xóa class mở
  sidebar.classList.remove('translate-x-0');

  // Thêm lại class ẩn gốc (phải có cả bản mobile và bản desktop md:)
  if (direction === 'left') {
    sidebar.classList.add('translate-x-[-85%]', 'md:translate-x-[-70%]');
  } else {
    sidebar.classList.add('translate-x-[85%]', 'md:translate-x-[70%]');
  }

  if (contents) contents.forEach((el) => el.classList.add('opacity-0'));
}

function initSidebars() {
  const leftBar = document.getElementById('visitor-sidebar');
  const rightBar = document.getElementById('social-sidebar');

  // --- LEFT SIDEBAR ---
  if (leftBar) {
    // Hover mở
    leftBar.addEventListener('mouseenter', () => openSidebar('visitor-sidebar', 'left'));

    // RỜI CHUỘT -> đóng (desktop)
    leftBar.addEventListener('mouseleave', () => closeSidebar('visitor-sidebar', 'left'));

    // Click (mobile)
    leftBar.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar('visitor-sidebar', 'left');
    });
  }

  // --- RIGHT SIDEBAR ---
  if (rightBar) {
    rightBar.addEventListener('mouseenter', () => openSidebar('social-sidebar', 'right'));

    rightBar.addEventListener('mouseleave', () => closeSidebar('social-sidebar', 'right'));

    rightBar.addEventListener('click', (e) => {
      e.stopPropagation();
      openSidebar('social-sidebar', 'right');
    });
  }

  // --- CLICK OUTSIDE -> CLOSE ---
  document.addEventListener('click', function (event) {
    if (leftBar && !leftBar.contains(event.target)) {
      closeSidebar('visitor-sidebar', 'left');
    }
    if (rightBar && !rightBar.contains(event.target)) {
      closeSidebar('social-sidebar', 'right');
    }
  });
}

// --- 5. Overlay Menu Modal ---
function initMenuOverlay() {
  const openBtn = document.getElementById('openMenuBtn');
  const closeBtn = document.getElementById('closeMenuBtn');
  const overlay = document.getElementById('menuOverlay');

  if (!openBtn || !closeBtn || !overlay) return;

  // Mở overlay
  openBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Ngăn scroll background
  });

  // Đóng overlay - nút X
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    document.body.style.overflow = ''; // Khôi phục scroll
  });

  // Đóng overlay - click bên ngoài
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Đóng overlay - phím ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

// --- 6. Hiệu ứng gõ chữ ---
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const text = el.getAttribute('data-text');
  if (!text) return;

  function startTyping() {
    let i = 0;

    function typeWriter() {
      if (i <= text.length) {
        const typed = text.substring(0, i);
        const untyped = text.substring(i);

        // Dùng opacity-0 cho phần chữ chưa gõ để giữ đúng khung kích thước ban đầu
        const cursor = '<span class="animate-pulse border-r-2 border-coffee-100 h-full inline-block" style="margin-right: -2px;"></span>';

        el.innerHTML = typed + cursor + '<span class="opacity-0">' + untyped + '</span>';
        i++;
        setTimeout(typeWriter, 70);
      } else {
        // Đợi 1.5 giây để người đọc kịp nhìn chữ cuối, sau đó lặp lại
        setTimeout(startTyping, 6000);
      }
    }

    typeWriter();
  }

  // Bắt đầu ngay lúc truy cập trang
  startTyping();
}
