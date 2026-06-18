document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
  });

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
});
