const params = new URLSearchParams(location.search);
const recipeId = Number(params.get('id'));

let recipes = []; try { recipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (e) {}
let session = null; try { session = JSON.parse(localStorage.getItem('recipe_session')); } catch (e) {}

const recipe = recipes.find(r => r.id === recipeId);
const container = document.getElementById('recipeContainer');

if (!recipe) {
  container.innerHTML = '<h2 class="title">Не найдено</h2><p style="text-align:center"><a href="index.html">На главную</a></p>';
} else {
  let authorName = recipe.author || 'Пользователь';
  let authorAvatar = '';
  try {
    const users = JSON.parse(localStorage.getItem('recipe_users')) || [];
    const u = users.find(x => String(x.id) === String(recipe.user_id));
    if (u) { authorName = u.username; if (u.avatar) authorAvatar = u.avatar; }
  } catch (e) {}
  
  const avaUrl = authorAvatar || 'https://via.placeholder.com/40/cccccc/ffffff?text=U';
  const dateStr = new Date(recipe.id).toLocaleDateString('ru-RU');

  let actionsHTML = '';
  if (session && String(session.id) === String(recipe.user_id)) {
    actionsHTML = `
      <div class="action-btns" style="margin-top:20px;">
        <a href="edit.html?id=${recipe.id}" class="cat-btn" style="text-decoration:none;">Редактировать</a>
        <button id="deleteBtn" class="cat-btn" style="background:#e53935;">Удалить</button>
      </div>
    `;
  }

  let ingHTML = '<ul>';
  if (recipe.ingredients && recipe.ingredients.length) recipe.ingredients.forEach(i => ingHTML += `<li>${i.name} ${i.amount ? '— '+i.amount : ''}</li>`);
  else ingHTML += '<li>Нет ингредиентов</li>';
  ingHTML += '</ul>';

  container.innerHTML = `
    <div class="recipe-detail" style="background:var(--bg-card); padding:30px; border-radius:16px; box-shadow:0 4px 12px var(--shadow);">
      <img src="${recipe.image || 'https://via.placeholder.com/800x400'}" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
      <h1 style="color:var(--accent);">${recipe.title}</h1>
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px; color:var(--text-muted);">
        <img src="${avaUrl}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
        <b style="color:var(--text);">${authorName}</b> • ${dateStr} • ${recipe.category}
      </div>
      <p>${recipe.description || 'Без описания.'}</p>
      <h3 style="color:var(--accent); margin:20px 0 10px;">Ингредиенты:</h3>
      ${ingHTML}
      <h3 style="color:var(--accent); margin:20px 0 10px;">Шаги:</h3>
      <p style="white-space:pre-wrap;">${recipe.steps}</p>
      ${actionsHTML}
    </div>
  `;

  document.getElementById('deleteBtn')?.addEventListener('click', () => {
    if (confirm('Удалить?')) {
      const upd = recipes.filter(r => r.id !== recipeId);
      localStorage.setItem('recipe_recipes', JSON.stringify(upd));
      location.href = 'index.html';
    }
  });
}