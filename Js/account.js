// === ЗАГРУЗКА ДАННЫХ АККАУНТА ===
function loadAccount() {
  let session = null;
  try { session = JSON.parse(localStorage.getItem('recipe_session')); } catch (err) {}

  // Если не вошли — на страницу входа
  if (!session) {
    location.href = 'login.html';
    return;
  }

  // Ставим имя пользователя
  const accountName = document.getElementById('accountName');
  if (accountName) accountName.textContent = session.username;

  // Достаем все рецепты
  let allRecipes = [];
  try {
    allRecipes = JSON.parse(localStorage.getItem('recipe_recipes')) || [];
  } catch (err) {}

  // Оставляем рецепты только этого пользователя (переворачиваем, чтобы новые были сверху)
  const myRecipes = allRecipes.filter(r => r.user_id === session.id).reverse();

  const box = document.getElementById('myRecipes');
  if (box) {
    if (myRecipes.length === 0) {
      box.innerHTML = '<p>Вы ещё не создали ни одного рецепта.</p>';
    } else {
      // Отрисовываем карточки с тегом <a> для перехода
      box.innerHTML = myRecipes.map(r => `
        <a href="recipe.html?id=${r.id}" style="text-decoration:none; color:inherit; display:block;">
          <div class="card">
            <img src="${r.image || 'https://via.placeholder.com/400x300?text=Recipe'}" alt="${r.title}">
            <div class="card-body">
              <h3>${r.title}</h3>
              <p>${r.description || ''}</p>
            </div>
          </div>
        </a>
      `).join('');
    }
  }

  // Обновляем статистику
  const statTotal = document.getElementById('statTotal');
  if (statTotal) statTotal.textContent = myRecipes.length;
  
  const statSaved = document.getElementById('statSaved');
  if (statSaved) statSaved.textContent = 0; // Пока ставим 0 (сохраненные мы пока не делали)
}

loadAccount();

// === ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Снимаем активность со всех кнопок
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    
    // Показываем нужную
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) target.style.display = 'block';
  });
});