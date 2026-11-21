const ingredientsData = {
  categories: [
    { name: "Молочные продукты", items: ["Молоко", "Сыр", "Масло"] },
    { name: "Мясо", items: ["Курица", "Говядина"] },
    { name: "Овощи", items: ["Картофель", "Лук", "Помидор"] },
    { name: "Специи", items: ["Соль", "Перец"] }
  ]
};

const select = document.getElementById('ingredientSelect');
if (select) {
  ingredientsData.categories.forEach(c => {
    const grp = document.createElement('optgroup'); grp.label = c.name;
    c.items.forEach(i => { const o = document.createElement('option'); o.value = i; o.textContent = i; grp.appendChild(o); });
    select.appendChild(grp);
  });
}

const params = new URLSearchParams(location.search);
const recipeId = Number(params.get('id'));
let recipes = []; try { recipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (e) {}
let session = null; try { session = JSON.parse(localStorage.getItem('recipe_session')); } catch (e) {}
const recipe = recipes.find(r => r.id === recipeId);

if (!recipe || !session || String(session.id) !== String(recipe.user_id)) {
  alert('Нет доступа!'); window.location.replace('index.html');
}

document.getElementById('edTitle').value = recipe.title;
document.getElementById('edCategory').value = recipe.category;
document.getElementById('edDescription').value = recipe.description;
document.getElementById('edSteps').value = recipe.steps;

let chosen = recipe.ingredients || [];
document.getElementById('addIngredient')?.addEventListener('click', () => {
  const n = document.getElementById('ingredientSelect').value;
  const a = document.getElementById('ingredientAmount').value.trim();
  if (!n) return;
  chosen.push({ name: n, amount: a });
  document.getElementById('ingredientAmount').value = '';
  document.getElementById('ingredientSelect').value = '';
  renderIngredients();
});

function renderIngredients() {
  const ul = document.getElementById('ingredientsList');
  ul.innerHTML = chosen.map((ing, i) => `<li><span>${ing.name} ${ing.amount ? '— ' + ing.amount : ''}</span><button type="button" data-i="${i}">✕</button></li>`).join('');
  ul.querySelectorAll('button').forEach(b => b.onclick = () => { chosen.splice(b.dataset.i, 1); renderIngredients(); });
}
renderIngredients();

document.getElementById('editForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const form = new FormData(e.target);
  const file = document.getElementById('imageFile').files[0];

  const save = (img) => {
    recipe.title = form.get('title');
    recipe.category = form.get('category');
    recipe.description = form.get('description');
    recipe.steps = form.get('steps');
    recipe.ingredients = chosen;
    if (img) recipe.image = img;

    const idx = recipes.findIndex(r => r.id === recipeId);
    recipes[idx] = recipe;
    localStorage.setItem('recipe_recipes', JSON.stringify(recipes));
    setTimeout(() => location.href = `recipe.html?id=${recipeId}`, 500);
  };

  if (file) { const r = new FileReader(); r.onload = ev => save(ev.target.result); r.readAsDataURL(file); }
  else save(null);
});