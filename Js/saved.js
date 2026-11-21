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
  const userSaved = allSaved[userId] || [];
  return userSaved.includes(id);
}

function isLiked(id) {
  const userId = getUserId();
  if (!userId) return false;
  let allLiked = {};
  try { allLiked = JSON.parse(localStorage.getItem('liked_recipes')) || {}; } catch (e) {}
  const userLiked = allLiked[userId] || [];
  return userLiked.includes(id);
}

function toggleFavorite(id, btnElement, event) {
  event.preventDefault(); event.stopPropagation();
  const userId = getUserId();
  if (!userId) return;
  let allSaved = {};
  try { allSaved = JSON.parse(localStorage.getItem('saved_recipes')) || {}; } catch (e) {}
  let userSaved = allSaved[userId] || [];
  if (userSaved.includes(id)) {
    userSaved = userSaved.filter(recipeId => recipeId !== id);
    btnElement.classList.remove('active');
    const cardWrapper = btnElement.closest('a');
    if (cardWrapper) cardWrapper.remove();
  } else {
    userSaved.push(id);
    btnElement.classList.add('active');
  }
  allSaved[userId] = userSaved;
  localStorage.setItem('saved_recipes', JSON.stringify(allSaved));
}

function toggleLike(id, btnElement, event) {
  event.preventDefault(); event.stopPropagation();
  const userId = getUserId();
  if (!userId) return;
  let allLiked = {};
  try { allLiked = JSON.parse(localStorage.getItem('liked_recipes')) || {}; } catch (e) {}
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

function loadSaved() {
  const box = document.getElementById('savedCards');
  if (!box) return;

  const userId = getUserId();
  if (!userId) {
    box.innerHTML = '<p>Войдите в аккаунт, чтобы увидеть избранные рецепты.</p>';
    return;
  }

  let allSaved = {};
  try { allSaved = JSON.parse(localStorage.getItem('saved_recipes')) || {}; } catch (e) {}
  const savedIds = allSaved[userId] || [];

  let allRecipes = [];
  try { allRecipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (e) {}
  const savedRecipes = allRecipes.filter(r => savedIds.includes(r.id)).reverse();

  if (savedRecipes.length === 0) {
    box.innerHTML = '<p>Вы пока ничего не добавили в избранное.</p>';
    return;
  }

  box.innerHTML = savedRecipes.map(r => {
    const activeFav = isSaved(r.id) ? 'active' : '';
    const activeLike = isLiked(r.id) ? 'active' : '';

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
            <p>${r.description || ''}</p>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

loadSaved();