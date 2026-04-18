// 1. Cấu hình Slider cho Không gian quán
const currentIndices = {
  'img-tang-1': 1,
  'img-tang-2': 1,
};

function changeImage(elementId, prefix, direction, total) {
  const imgElement = document.getElementById(elementId);
  if (!imgElement) return;

  // Tính toán chỉ số ảnh tiếp theo
  currentIndices[elementId] += direction;

  if (currentIndices[elementId] > total) {
    currentIndices[elementId] = 1;
  } else if (currentIndices[elementId] < 1) {
    currentIndices[elementId] = total;
  }

  // Hiệu ứng chuyển cảnh mượt mà
  imgElement.style.opacity = '0.3';

  setTimeout(() => {
    // Cập nhật đường dẫn ảnh mới
    imgElement.src = `/images/${prefix}${currentIndices[elementId]}.jpg`;
    imgElement.style.opacity = '1';
  }, 250);
}

// 2. Xử lý Hòm thư góp ý qua Google Sheets
document.addEventListener('DOMContentLoaded', () => {
  const scriptURL =
    'https://script.google.com/macros/s/AKfycbw-V71fGkumO2QQsQucdulmv6C5KxN_kEQLKK4DM6Wg7ktGaXl08i-DBPff0KpSZS-1/exec'; // Thay URL thật của bạn vào đây
  const feedbackForm = document.getElementById('feedbackForm');

  if (feedbackForm) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    const submitBtn = feedbackForm.querySelector('button');

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hiệu ứng nút bấm khi đang gửi
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerText = 'Đang gửi...';
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

      const formData = {
        message: feedbackMessage.value,
      };

      // Gửi dữ liệu tới Google Sheets
      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Chế độ bắt buộc cho Google Apps Script
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(() => {
          alert('Cảm ơn bạn! Đong Đưa đã nhận được lời nhắn của bạn.');
          feedbackForm.reset();
        })
        .catch((error) => {
          console.error('Lỗi gửi feedback:', error);
          alert('Rất tiếc, không gửi được góp ý. Bạn vui lòng thử lại sau nhé!');
        })
        .finally(() => {
          // Khôi phục trạng thái nút bấm ban đầu
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    });
  }
});
