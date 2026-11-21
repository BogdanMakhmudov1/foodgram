let session = null;
try { session = JSON.parse(localStorage.getItem('recipe_session')); } catch (e) {}
if (!session) window.location.replace('login.html');

const viewMode = document.getElementById('viewMode');
const editMode = document.getElementById('editMode');

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function fillView() {
  document.getElementById('viewUsername').textContent = session.username;
  document.getElementById('viewEmail').textContent = session.email;
  document.getElementById('viewPhone').textContent = session.phone || 'Нет';
  document.getElementById('viewBirthdate').textContent = session.birthdate || 'Нет';
  if (session.avatar) document.getElementById('viewAvatar').src = session.avatar;
}
fillView();

document.getElementById('editBtn').onclick = () => { viewMode.style.display = 'none'; editMode.style.display = 'block'; };
document.getElementById('cancelBtn').onclick = () => { editMode.style.display = 'none'; viewMode.style.display = 'block'; };

document.getElementById('editMode').onsubmit = (e) => {
  e.preventDefault();
  const file = document.getElementById('avatarFile').files[0];
  
  const save = (img) => {
    session.username = document.getElementById('profUsername').value.trim();
    session.email = document.getElementById('profEmail').value.trim().toLowerCase();
    session.phone = document.getElementById('profPhone').value.trim();
    session.birthdate = document.getElementById('profBirthdate').value;
    if (img) session.avatar = img;

    localStorage.setItem('recipe_session', JSON.stringify(session));
    let users = []; try { users = JSON.parse(localStorage.getItem('recipe_users')) || []; } catch (e) {}
    const idx = users.findIndex(u => u.id === session.id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...session }; localStorage.setItem('recipe_users', JSON.stringify(users)); }

    fillView();
    editMode.style.display = 'none'; viewMode.style.display = 'block';
    showToast('Профиль обновлён!');
  };

  if (file) { const r = new FileReader(); r.onload = ev => save(ev.target.result); r.readAsDataURL(file); }
  else save(null);
};

if (document.getElementById("profBirthdate")) {
  flatpickr("#profBirthdate", { dateFormat: "Y-m-d", locale: "ru", altInput: true, altFormat: "d.m.Y", disableMobile: true, monthSelectorType: "static" });
}