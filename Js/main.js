// === ЖДЕМ ЗАГРУЗКИ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', () => {
  
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      window.location.href = `category.html?cat=${cat}&no_intro=1`;
    });
  });

  loadPopular();
});

function getUserId() {
  try {
    const session = JSON.parse(localStorage.getItem('recipe_session'));
    return session ? session.id : null;
  } catch (e) { return null; }
}

function isSaved(id) {
  const userId = getUserId();
  if (!userId) return false;
  let allSaved = {};
  try { allSaved = JSON.parse(localStorage.getItem('saved_recipes')) || {}; } catch (e) {}
  if (Array.isArray(allSaved)) return false;
  const userSaved = allSaved[userId] || [];
  return userSaved.includes(id);
}

function toggleFavorite(id, btnElement, event) {
  event.preventDefault(); event.stopPropagation();
  const userId = getUserId();
  if (!userId) { alert('Войдите в аккаунт!'); return; }
  let allSaved = {};
  try { allSaved = JSON.parse(localStorage.getItem('saved_recipes')) || {}; } catch (e) {}
  if (Array.isArray(allSaved)) allSaved = {};
  let userSaved = allSaved[userId] || [];
  if (userSaved.includes(id)) {
    userSaved = userSaved.filter(recipeId => recipeId !== id);
    btnElement.classList.remove('active');
  } else {
    userSaved.push(id);
    btnElement.classList.add('active');
  }
  allSaved[userId] = userSaved;
  localStorage.setItem('saved_recipes', JSON.stringify(allSaved));
}

function isLiked(id) {
  const userId = getUserId();
  if (!userId) return false;
  let allLiked = {};
  try { allLiked = JSON.parse(localStorage.getItem('liked_recipes')) || {}; } catch (e) {}
  if (Array.isArray(allLiked)) return false;
  const userLiked = allLiked[userId] || [];
  return userLiked.includes(id);
}

function toggleLike(id, btnElement, event) {
  event.preventDefault(); event.stopPropagation();
  const userId = getUserId();
  if (!userId) { alert('Войдите в аккаунт!'); return; }
  let allLiked = {};
  try { allLiked = JSON.parse(localStorage.getItem('liked_recipes')) || {}; } catch (e) {}
  if (Array.isArray(allLiked)) allLiked = {}; 
  let userLiked = allLiked[userId] || [];
  if (userLiked.includes(id)) {
    userLiked = userLiked.filter(recipeId => recipeId !== id);
    btnElement.classList.remove('active');
  } else {
    userLiked.push(id);
    btnElement.classList.add('active');
  }
  allLiked[userId] = userLiked;
  localStorage.setItem('liked_recipes', JSON.stringify(allLiked));
}

// === ЗАГРУЗКА РЕЦЕПТОВ ===
function loadPopular() {
  const box = document.getElementById('popularCards');
  if (!box) return;

  let allRecipes = [];
  try { allRecipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (err) {}
  
  // Получаем всех пользователей, чтобы найти аватарки
  let allUsers = [];
  try { allUsers = JSON.parse(localStorage.getItem('recipe_users')) || []; } catch (err) {}

  if (allRecipes.length === 0) {
    box.innerHTML = '<p>Пока нет рецептов. Создайте первый!</p>';
    return;
  }

  const latest = allRecipes.slice(-6).reverse();

  box.innerHTML = latest.map(r => {
    const activeFav = isSaved(r.id) ? 'active' : '';
    const activeLike = isLiked(r.id) ? 'active' : '';
    
    // Ищем автора в базе пользователей
    const authorUser = allUsers.find(u => String(u.id) === String(r.user_id));
    const authorName = (authorUser ? authorUser.username : r.author) || 'Пользователь';
    const authorAvatar = authorUser && authorUser.avatar ? authorUser.avatar : 'https://via.placeholder.com/30/cccccc/ffffff?text=U';
    
    return `
      <a href="recipe.html?id=${r.id}&no_intro=1" style="text-decoration:none; color:inherit; display:block;">
        <div class="card">
          <img src="${r.image || 'https://via.placeholder.com/400x300?text=Recipe'}" alt="${r.title}">
          <div class="card-body">
            <div class="card-header">
              <h3>${r.title}</h3>
              <div class="card-actions">
                <button class="like-btn ${activeLike}" onclick="toggleLike(${r.id}, this, event)">❤</button>
                <button class="fav-btn ${activeFav}" onclick="toggleFavorite(${r.id}, this, event)">★</button>
              </div>
            </div>
            
            <!-- Блок автора в карточке -->
            <div class="card-author">
              <img src="${authorAvatar}" alt="${authorName}">
              <span>${authorName}</span>
            </div>

            <p>${r.description || ''}</p>
          </div>
        </div>
      </a>
    `;
  }).join('');
}