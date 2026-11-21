// === ПРОВЕРКА АВТОРИЗАЦИИ ===
let sessionCheck = null;
try {
  sessionCheck = JSON.parse(localStorage.getItem('recipe_session'));
} catch (e) {}

if (!sessionCheck) {
  // Если не вошел — перекидываем на вход
  window.location.replace('login.html');
}

// 1. ИНГРЕДИЕНТЫ
const ingredientsData = {
  "categories": [
    { "name": "Молочные продукты", "items": ["Молоко", "Сливки", "Сметана", "Кефир", "Йогурт", "Творог", "Сыр", "Масло", "Макароны"] },
    { "name": "Мясо и птица", "items": ["Курица", "Говядина", "Свинина", "Индейка", "Фарш", "Бекон"] },
    { "name": "Овощи", "items": ["Картофель", "Морковь", "Лук", "Чеснок", "Помидор", "Огурец", "Перец", "Капуста"] },
    { "name": "Фрукты", "items": ["Яблоко", "Банан", "Апельсин", "Лимон", "Клубника"] },
    { "name": "Специи", "items": ["Соль", "Перец", "Сахар", "Корица"] }
  ]
};

const select = document.getElementById('ingredientSelect');
if (select) {
  select.innerHTML = '<option value="">— Выберите ингредиент —</option>';
  ingredientsData.categories.forEach(cat => {
    const group = document.createElement('optgroup');
    group.label = cat.name;
    cat.items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });
}

// 2. ДОБАВЛЕНИЕ ИНГРЕДИЕНТОВ В СПИСОК
const chosen = [];
const addBtn = document.getElementById('addIngredient');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    const name = document.getElementById('ingredientSelect').value;
    const amount = document.getElementById('ingredientAmount').value.trim();
    if (!name) return;
    
    chosen.push({ name, amount });
    document.getElementById('ingredientAmount').value = '';
    document.getElementById('ingredientSelect').value = '';
    renderIngredients();
  });
}

function renderIngredients() {
  const ul = document.getElementById('ingredientsList');
  if (!ul) return;

  ul.innerHTML = chosen.map((ing, i) => `
    <li>
      <span>${ing.name}${ing.amount ? ' — ' + ing.amount : ''}</span>
      <button type="button" data-i="${i}">✕</button>
    </li>
  `).join('');

  ul.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      chosen.splice(+btn.dataset.i, 1);
      renderIngredients();
    });
  });
}

// 3. СОХРАНЕНИЕ РЕЦЕПТА
const recipeForm = document.getElementById('recipeForm');
if (recipeForm) {
  recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg');

    if (!chosen.length) {
      msg.textContent = 'Добавьте хотя бы один ингредиент';
      msg.style.color = '#d32f2f';
      return;
    }

    // Используем проверенную ранее сессию
    let session = sessionCheck;

    const formData = new FormData(recipeForm);
    const fileInput = document.getElementById('imageFile');
    const file = fileInput ? fileInput.files[0] : null;

    function saveRecipeToStorage(imageData) {
      const newRecipe = {
        id: Date.now(),
        user_id: session.id,
        author: session.username, // <-- Сохраняем автора
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        ingredients: chosen,
        steps: formData.get('steps'),
        image: imageData || 'https://via.placeholder.com/400x300?text=Recipe'
      };

      let allRecipes = [];
      try { allRecipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (err) {}
      
      allRecipes.push(newRecipe);
      localStorage.setItem('recipe_recipes', JSON.stringify(allRecipes));

      msg.textContent = 'Рецепт успешно опубликован!';
      msg.style.color = '#2e7d32';
      
      setTimeout(() => {
        location.href = 'acaunt.html';
      }, 1000);
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        saveRecipeToStorage(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      saveRecipeToStorage(null);
    }
  });
}