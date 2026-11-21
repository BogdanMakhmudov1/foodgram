// ============================================================
// АВТОРИЗАЦИЯ И ОБЩИЕ ЭЛЕМЕНТЫ (localStorage)
// ============================================================

const USERS_KEY   = 'recipe_users';
const SESSION_KEY = 'recipe_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}
function setSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const ch = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  return 'h' + Math.abs(hash).toString(36);
}

// === РЕГИСТРАЦИЯ ===
const regForm = document.getElementById('registerForm');
if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = regForm.username.value.trim();
    const email    = regForm.email.value.trim().toLowerCase();
    const password = regForm.password.value;
    const msg      = document.getElementById('msg');

    if (!username || !email || password.length < 6) {
      msg.textContent = 'Заполните все поля (пароль ≥ 6 символов)';
      msg.style.color = '#d32f2f';
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      msg.textContent = 'Email уже занят';
      msg.style.color = '#d32f2f';
      return;
    }

    const newUser = {
      id: Date.now(),
      username: username,
      email: email,
      password_hash: hashPassword(password),
      phone: '',
      birthdate: '',
      avatar: ''
    };
    users.push(newUser);
    saveUsers(users);

    msg.textContent = 'Регистрация успешна! Переходим ко входу...';
    msg.style.color = '#2e7d32';
    setTimeout(() => location.href = 'login.html', 900);
  });
}

// === ВХОД ===
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email    = loginForm.email.value.trim().toLowerCase();
    const password = loginForm.password.value;
    const msg      = document.getElementById('msg');

    const users = getUsers();
    const user  = users.find(u => u.email === email);

    if (!user || user.password_hash !== hashPassword(password)) {
      msg.textContent = 'Неверный email или пароль';
      msg.style.color = '#d32f2f';
      return;
    }

    setSession({ 
      id: user.id, 
      username: user.username, 
      email: user.email,
      phone: user.phone || '',
      birthdate: user.birthdate || '',
      avatar: user.avatar || ''
    });
    
    msg.textContent = 'Вход выполнен! Перенаправление...';
    msg.style.color = '#2e7d32';
    
    setTimeout(() => {
      window.location.replace('index.html');
    }, 500);
  });
}

// === ПРОВЕРКА АВТОРИЗАЦИИ И ВЫВОД АВАТАРКИ ===
function checkAuth() {
  const userMenu  = document.getElementById('userMenu');
  const authBlock = document.getElementById('authBlock');
  const userBtn   = document.getElementById('userMenuBtn');
  const session   = getSession();

  if (session) {
    if (userMenu)  userMenu.style.display  = 'flex';
    if (authBlock) authBlock.style.display = 'none';
    
    let avatarHTML = '';
    if (session.avatar) {
      avatarHTML = `<img src="${session.avatar}" alt="avatar">`;
    } else {
      avatarHTML = `<span style="font-size: 1.2rem; margin-right: 2px;">👤</span>`;
    }
    
    if (userBtn) {
      userBtn.innerHTML = `
        ${avatarHTML}
        <span id="userName">${session.username}</span>
        <span class="arrow">▼</span>
      `;
    }
  } else {
    if (userMenu)  userMenu.style.display  = 'none';
    if (authBlock) authBlock.style.display = 'inline';
  }
}
checkAuth();

// === ВЫПАДАЮЩЕЕ МЕНЮ, ВЫХОД И ПОИСК ===
document.addEventListener('DOMContentLoaded', () => {
  const userMenu  = document.getElementById('userMenu');
  const userBtn   = document.getElementById('userMenuBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (userBtn) {
    userBtn.addEventListener('click', e => {
      e.stopPropagation();
      userMenu.classList.toggle('open');
    });
  }

  document.addEventListener('click', e => {
    if (userMenu && !userMenu.contains(e.target)) {
      userMenu.classList.remove('open');
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      clearSession();
      window.location.replace('index.html');
    });
  }

  // === ЖИВОЙ ПОИСК ===
  const searchBtn   = document.getElementById('searchToggle');
  const searchInput = document.getElementById('searchInput');
  const suggestions = document.getElementById('searchSuggestions');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.classList.toggle('open');
      if (searchInput.classList.contains('open')) {
        searchInput.focus();
      } else {
        if (suggestions) suggestions.classList.remove('open');
      }
    });

    if (suggestions) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
          suggestions.classList.remove('open');
          suggestions.innerHTML = '';
          return;
        }

        let allRecipes = [];
        try { allRecipes = JSON.parse(localStorage.getItem('recipe_recipes')) || []; } catch (err) {}

        const matches = allRecipes.filter(r => r.title.toLowerCase().includes(query));

        if (matches.length === 0) {
          suggestions.innerHTML = '<div style="padding: 10px; color: var(--text-muted);">Ничего не найдено</div>';
        } else {
          // Жесткие инлайн-стили для идеального выравнивания
          suggestions.innerHTML = matches.map(r => `
            <a href="recipe.html?id=${r.id}&no_intro=1" 
               style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; text-decoration: none; color: var(--text); border-bottom: 1px solid var(--border); transition: background 0.2s;"
               onmouseover="this.style.background='var(--btn)'; this.style.color='#fff';"
               onmouseout="this.style.background='transparent'; this.style.color='var(--text)';">
              
              <img src="${r.image || 'https://via.placeholder.com/40'}" 
                   alt="${r.title}" 
                   style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; flex-shrink: 0; margin: 0;">
              
              <span style="font-weight: 500; font-size: 0.95rem; margin: 0; line-height: 1.2;">${r.title}</span>
            </a>
          `).join('');
        }
        suggestions.classList.add('open');
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const first = suggestions.querySelector('a');
          if (first) window.location.href = first.href;
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && e.target !== searchBtn && !searchBtn.contains(e.target)) {
        searchInput.classList.remove('open');
        if (suggestions) suggestions.classList.remove('open');
      }
    });
  }
});