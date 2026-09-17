const stripeCheckoutButton = document.getElementById('checkoutForm');

if (stripeCheckoutButton) {
  stripeCheckoutButton.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Connexion à Stripe…';

    try {
      const formData = new FormData(form);
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
          customer: { email: formData.get('email') }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || 'Erreur de paiement');
      window.location.href = data.url;
    } catch (error) {
      alert('Le paiement n’est pas encore disponible. Vérifie que le site est déployé sur Netlify et que la clé Stripe est configurée côté serveur.');
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }, true);
}
