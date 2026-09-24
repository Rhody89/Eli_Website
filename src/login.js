// login.js
// Handles login modal logic for the website

document.addEventListener('DOMContentLoaded', function() {
  const loginModal = document.getElementById('loginModal');
  const closeLogin = document.getElementById('closeLogin');
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');
  const loginBtn = document.getElementById('loginBtn');

  if (loginBtn) {
    loginBtn.onclick = () => loginModal.classList.remove('hidden');
  }
  if (closeLogin) {
    closeLogin.onclick = () => loginModal.classList.add('hidden');
  }
  if (loginForm) {
    loginForm.onsubmit = e => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value;
      const pass = document.getElementById('loginPass').value;
      if (user === 'admin' && pass === 'demo') {
        loginMsg.textContent = 'Login erfolgreich!';
        loginMsg.classList.remove('hidden');
        loginMsg.classList.add('text-green-600');
        setTimeout(() => loginModal.classList.add('hidden'), 1000);
      } else {
        loginMsg.textContent = 'Falsche Daten';
        loginMsg.classList.remove('hidden');
        loginMsg.classList.add('text-red-500');
      }
    };
  }
});
