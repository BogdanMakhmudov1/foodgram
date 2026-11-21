const params = new URLSearchParams(location.search);
const cat = params.get('cat') || 'desserts';

const titles = {
  desserts: 'Десерты', drinks: 'Напитки', hot: 'Горячие блюда',
  soups: 'Супы', salads: 'Салаты', bakery: 'Выпечка',
  snacks: 'Закуски', breakfast: 'Завтраки'
};

const catTitle = document.getElementById('catTitle');
if (catTitle) catTitle.textContent = titles[cat] || 'Рецепты';

document.querySelectorAll('#catNav .cat-btn').forEach(btn => {
  if (btn.dataset.cat === cat) btn.classList.add('active');
  btn.addEventListener('click', () => {
    if (btn.dataset.cat !== cat) {
      window.location.href = `category.html?cat=${btn.dataset.cat}&no_intro=1`;
    }
  });
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

function loadCategoryRecipes() {
  const box = document.getElementById('recipes');
  if (!box) return;

  let allRecipes = [];
  try { allRecipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (err) {}
  let allUsers = [];
  try { allUsers = JSON.parse(localStorage.getItem('recipe_users')) || []; } catch (err) {}

  const filtered = allRecipes.filter(r => r.category === cat).reverse();

  if (filtered.length === 0) {
    box.innerHTML = '<p>В этой категории пока нет рецептов.</p>';
    return;
  }

  box.innerHTML = filtered.map(r => {
    const activeFav = isSaved(r.id) ? 'active' : '';
    const activeLike = isLiked(r.id) ? 'active' : '';
    
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
            
            <!-- Блок автора -->
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

loadCategoryRecipes();