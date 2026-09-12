const dialog = document.getElementById('applicationDialog');
const form = document.getElementById('applicationForm');
const toast = document.getElementById('toast');
const menu = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');

document.querySelectorAll('[data-open-form]').forEach(btn => {
  btn.addEventListener('click', () => dialog.showModal());
});

menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  const saved = JSON.parse(localStorage.getItem('phoenix-demo-applications') || '[]');
  saved.push({...data, createdAt: new Date().toISOString()});
  localStorage.setItem('phoenix-demo-applications', JSON.stringify(saved));

  dialog.close();
  form.reset();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
});

const search = document.getElementById('dictionarySearch');
const category = document.getElementById('dictionaryCategory');
const cards = [...document.querySelectorAll('.word-card')];
const empty = document.getElementById('emptyState');

function filterDictionary() {
  const q = search.value.trim().toLowerCase();
  const c = category.value;
  let visible = 0;

  cards.forEach(card => {
    const matchesText = card.dataset.word.includes(q);
    const matchesCategory = c === 'all' || card.dataset.category === c;
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) visible++;
  });

  empty.hidden = visible !== 0;
}

search.addEventListener('input', filterDictionary);
category.addEventListener('change', filterDictionary);

document.getElementById('year').textContent = new Date().getFullYear();
