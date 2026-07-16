document.addEventListener('DOMContentLoaded', () => {

  // ── Splash screen ──
  const splash = document.getElementById('splash');
  if (splash) {
    window.addEventListener('load', () => {
      splash.classList.add('hide');
      setTimeout(() => splash.remove(), 600);
    });
    setTimeout(() => { splash.classList.add('hide'); setTimeout(() => splash.remove(), 600); }, 2500);
  }

  // ── Cookie banner ──
  const banner     = document.getElementById('cookie-banner');
  const btnAccept  = document.getElementById('cookie-accept');
  const btnDecline = document.getElementById('cookie-decline');
  if (banner) {
    if (localStorage.getItem('cookie_consent')) {
      banner.remove();
    } else {
      setTimeout(() => banner.classList.add('visible'), 1000);
    }
  }
  btnAccept?.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  });
  btnDecline?.addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'declined');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
    // Désactiver GA si refus
    window['ga-disable-G-890LZFRR6D'] = true;
  });

  // ── Bouton retour en haut ──
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Barre de progression lecture ──
  const progress = document.getElementById('read-progress');
  if (progress) {
    const update = () => {
      const body   = document.getElementById('post-body');
      if (!body) return;
      const total  = body.offsetHeight;
      const scroll = window.scrollY - body.offsetTop + window.innerHeight * 0.5;
      progress.style.width = Math.min(100, Math.max(0, (scroll / total) * 100)) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
  }

  // ── Animations au scroll (Intersection Observer) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('visible');
        const fill = entry.target.querySelector('.language-fill');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }, i * 80);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .timeline-item, .skill-card, .language-item, .interest-card, .post-list-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // ── Compteurs animés ──
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 40);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObs.observe(el));

  // ── Navigation mobile ──
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links.classList.toggle('open'));

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        links?.classList.remove('open');
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Formulaire Web3Forms + confirmation email ──
  const form      = document.getElementById('contact-form');
  const result    = document.getElementById('form-result');
  const btnText   = document.getElementById('btn-text');
  const btnSpin   = document.getElementById('btn-spinner');
  const submitBtn = document.getElementById('submit-btn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled      = true;
    btnText.style.display   = 'none';
    btnSpin.style.display   = 'inline';

    const data = new FormData(form);
    // Activer l'autoréponse Web3Forms
    data.append('from_name', 'Sitraka Nomena');
    data.append('replyto',   data.get('email'));

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const json = await res.json();
      result.style.display = 'block';
      if (json.success) {
        result.className = 'form-result success';
        result.innerHTML = `✅ Merci <strong>${data.get('name')}</strong> ! Votre message a bien été envoyé. Une confirmation vous a été envoyée à <strong>${data.get('email')}</strong>.`;
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
      submitBtn.disabled    = false;
      btnText.style.display = 'inline';
      btnSpin.style.display = 'none';
      setTimeout(() => { result.style.display = 'none'; }, 8000);
    }
  });

});
