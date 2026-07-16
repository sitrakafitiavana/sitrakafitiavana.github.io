let lunrIndex, posts;

async function initSearch() {
  const res  = await fetch('/search.json');
  posts = await res.json();

  lunrIndex = lunr(function () {
    this.field('title',   { boost: 10 });
    this.field('excerpt', { boost: 5 });
    this.field('categories');
    this.ref('url');
    posts.forEach(p => this.add(p));
  });
}

function renderResults(query) {
  const resultsEl = document.getElementById('search-results');
  const emptyEl   = document.getElementById('search-empty');

  if (!query.trim()) { resultsEl.innerHTML = ''; emptyEl.style.display = 'none'; return; }

  const results = lunrIndex.search(query + '~1');

  if (results.length === 0) {
    resultsEl.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  resultsEl.innerHTML = results.map(r => {
    const p = posts.find(post => post.url === r.ref);
    return `
      <article class="search-result-item">
        <div class="post-list-meta">
          <time>${p.date}</time>
          ${p.categories ? `<span class="tag">${p.categories}</span>` : ''}
        </div>
        <h2><a href="${p.url}">${p.title}</a></h2>
        <p>${p.excerpt}</p>
        <a href="${p.url}" class="read-more">Lire la suite →</a>
      </article>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  await initSearch();
  const input = document.getElementById('search-input');
  let debounce;
  input?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => renderResults(input.value), 250);
  });
});
