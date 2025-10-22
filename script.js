document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".carousel-container");
  const track = document.querySelector(".carousel-track");
  const progressBar = document.querySelector(".carousel-progress-bar");

  if (!container || !track || !progressBar) return;

  const updateProgress = () => {
    const cards = track.querySelectorAll(".carousel-card");
    if (!cards.length) return;

    // Правая граница последней карточки относительно контейнера
    const lastCard = cards[cards.length - 1];
    const trackRect = track.getBoundingClientRect();
    const lastRect = lastCard.getBoundingClientRect();

    const visibleWidth = container.clientWidth;
    const totalScrollable =
      lastRect.right - trackRect.left - visibleWidth;

    const scrolled =
      container.scrollLeft > totalScrollable
        ? totalScrollable
        : container.scrollLeft;

    const percent =
      totalScrollable > 0 ? (scrolled / totalScrollable) * 100 : 0;

    progressBar.style.width = `${Math.min(percent, 100)}%`;
  };

  container.addEventListener("scroll", () => {
    requestAnimationFrame(updateProgress);
  }, { passive: true });

  window.addEventListener("resize", updateProgress);

  updateProgress();
});

// ====== 📞 Автоформат номера телефона ======
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '');

  // Убираем префикс 375, если он введён
  if (digits.startsWith('375')) digits = digits.slice(3);
  // Обрезаем до 9 цифр (XX XXX XX XX)
  if (digits.length > 9) digits = digits.slice(0, 9);

  // Формируем красиво
  let formatted = '+375';
  if (digits.length > 0) formatted += ' ' + digits.slice(0, 2);
  if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
  if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
  if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);

  phoneInput.value = formatted;
});


// ====== 🧾 Обработка отправки формы ======
const form = document.getElementById('driverForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Очистка старых сообщений об ошибках
  form.querySelectorAll('.error-message').forEach(el => el.textContent = '');

  let isValid = true;
  const formData = new FormData(form);

  // Извлекаем и чистим введённые данные
  const name = formData.get('Имя')?.trim() || '';
  const phoneDigits = formData.get('Телефон')?.replace(/\D/g, '').replace(/^375/, '').trim() || '';
  const license = formData.get('Номер прав')?.trim() || '';

  // Проверка обязательных полей
  if (!name) {
    showError('Имя', 'Пожалуйста, заполните это поле');
    isValid = false;
  }

  if (phoneDigits.length !== 9) {
    showError('Телефон', 'Введите корректный номер в формате +375 XX XXX XX XX');
    isValid = false;
  }

  if (!license) {
    showError('Номер прав', 'Пожалуйста, заполните это поле');
    isValid = false;
  }

  if (!isValid) return;

  // Собираем форму красиво в сообщение
  const getValue = (fieldName) => formData.get(fieldName)?.trim() || '—';
  const phoneDisplay = `+375 ${phoneDigits.slice(0,2)} ${phoneDigits.slice(2,5)} ${phoneDigits.slice(5,7)} ${phoneDigits.slice(7,9)}`;

  const message =
`Заявка %0A
Имя: ${getValue('Имя')}%0A
Фамилия: ${getValue('Фамилия')}%0A
Отчество: ${getValue('Отчество')}%0A
Телефон: ${phoneDisplay}%0A
Номер водительского удостоверения: ${getValue('Номер прав')}`;

  // Открываем Telegram с готовым текстом
  window.open(`https://t.me/AlenRich?text=${message}`, '_blank');
});


// ====== ⚠️ Функция показа ошибок ======
function showError(field, msg) {
  const input = [...form.elements].find(el => el.name === field);
  const err = input?.parentElement?.querySelector('.error-message');
  if (err) err.textContent = msg;
}


// ====== 🚫 Убираем автопрокрутку при открытии ======
window.addEventListener('load', () => {
  if (window.location.hash === '#application') {
    window.history.replaceState(null, '', window.location.pathname);
  }
});


// ====== 🌊 Плавная прокрутка по клику на “Оставить заявку” ======
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.startsWith('#') && targetId.length > 1) {
      e.preventDefault();
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});