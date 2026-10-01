// login.js
// Handles login modal logic for the website

document.addEventListener('DOMContentLoaded', () => { // async hier entfernt, da innen gelöst
  const loginModal = document.getElementById('loginModal');
  const closeLogin = document.getElementById('closeLogin');
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');

  if (loginBtn && loginModal) {
    loginBtn.onclick = () => loginModal.classList.remove('hidden');
  }
  if (closeLogin && loginModal) {
    closeLogin.onclick = () => loginModal.classList.add('hidden');
  }

  // WICHTIG: Wir warten auf das Absenden des Formulars!
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      // 1. Verhindert, dass die Seite nach dem Absenden neu lädt
      event.preventDefault(); 

      // 2. Werte erst JETZT auslesen, nachdem der User sie eingetippt hat
      const emailValue = document.getElementById('loginUser').value;
      const passValue = document.getElementById('loginPass').value;

      try {
        // Sende die echten Login-Daten an deinen Cloudflare Worker
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: emailValue, 
            password: passValue 
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert('Erfolgreich eingeloggt! Token: ' + result.token);
          loginModal.classList.add('hidden'); // Modal nach Erfolg schließen
        } else {
          alert('Login fehlgeschlagen: ' + result.error);
        }
      } catch (error) {
        console.error('Netzwerkfehler:', error);
      }
    });
  }
});
