document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation mobile ──
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => links.classList.toggle('open'));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        links.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Formulaire Web3Forms ──
  const form      = document.getElementById('contact-form');
  const result    = document.getElementById('form-result');
  const btnText   = document.getElementById('btn-text');
  const btnSpin   = document.getElementById('btn-spinner');
  const submitBtn = document.getElementById('submit-btn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    btnText.style.display  = 'none';
    btnSpin.style.display  = 'inline';

    const data = new FormData(form);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();

      result.style.display = 'block';
      if (json.success) {
        result.className  = 'form-result success';
        result.innerHTML  = '✅ Merci ! Votre message a bien été envoyé.';
        form.reset();
      } else {
        result.className = 'form-result error';
        result.innerHTML = '❌ Une erreur est survenue. Veuillez réessayer.';
      }
    } catch {
      result.style.display = 'block';
      result.className     = 'form-result error';
      result.innerHTML     = '❌ Erreur réseau. Veuillez réessayer.';
    } finally {
      submitBtn.disabled     = false;
      btnText.style.display  = 'inline';
      btnSpin.style.display  = 'none';
      setTimeout(() => { result.style.display = 'none'; }, 6000);
    }
  });

});
