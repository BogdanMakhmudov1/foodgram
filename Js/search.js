// ============================================================
// СТРАНИЦА РЕЗУЛЬТАТОВ ПОИСКА
// ============================================================
const params = new URLSearchParams(location.search);
const q      = (params.get('q') || '').trim();

document.getElementById('qLabel').textContent = q || '(пусто)';

async function doSearch() {
  const box = document.getElementById('searchResults');

  if (!q) {
    box.innerHTML = '<p>Введите слово в поле поиска в шапке.</p>';
    return;
  }

  try {
    const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    if (!data.length) {
      box.innerHTML = `<p>По запросу «${q}» ничего не найдено.</p>`;
      return;
    }

    box.innerHTML = data.map(r => `
      <div class="card">
        <img src="${r.image || 'https://via.placeholder.com/400x300?text=Recipe'}"
             alt="${r.title}">
        <div class="card-body">
          <h3>${r.title}</h3>
          <p>${r.description || ''}</p>
        </div>
      </div>`).join('');
  } catch (e) {
    box.innerHTML = '<p>Ошибка загрузки. Проверьте соединение с сервером.</p>';
    console.error(e);
  }
}
doSearch();