document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.getElementById('registerStatus');
  const messages = document.documentElement.lang === 'en'
    ? {
        sending: 'Sending registration...',
        success: 'Registration completed.',
        error: 'Registration failed.',
        network: 'Could not connect to the registration service.'
      }
    : {
        sending: 'Registrierung wird gesendet...',
        success: 'Registrierung erfolgreich.',
        error: 'Registrierung fehlgeschlagen.',
        network: 'Der Registrierungsdienst ist nicht erreichbar.'
      };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    status.textContent = messages.sending;

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        status.textContent = result.error || messages.error;
        return;
      }

      status.textContent = result.message || messages.success;
      form.reset();
    } catch {
      status.textContent = messages.network;
    } finally {
      submitButton.disabled = false;
    }
  });
});
