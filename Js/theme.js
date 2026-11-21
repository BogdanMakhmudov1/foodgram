(function () {
  // Применяем сохранённую тему ДО отрисовки
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    updateIcon(btn, document.documentElement.getAttribute('data-theme'));

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(btn, next);
    });
  });

  function updateIcon(btn, theme) {
    if (theme === 'dark') {
      btn.textContent = '☀️';
      btn.title = 'Светлая тема';
    } else {
      btn.textContent = '🌙';
      btn.title = 'Тёмная тема';
    }
  }

  // === ЛОГИКА ЗАСТАВКИ ===
  window.addEventListener('load', () => {
    const intro = document.getElementById('introScreen');
    if (!intro) return; // Если на странице нет заставки

    const urlParams = new URLSearchParams(window.location.search);
    const skipIntro = urlParams.get('no_intro');

    // Если в URL есть no_intro=1, моментально удаляем заставку
    if (skipIntro) {
      intro.remove();
    } else {
      // Иначе показываем на 4.7 секунды
      setTimeout(() => {
        intro.classList.add('hidden');
        setTimeout(() => {
          intro.remove(); 
        }, 500);
      }, 4700); 
    }
  });
})();