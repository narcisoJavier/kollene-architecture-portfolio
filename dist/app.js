const projects = {
  casa: {
    title: 'Casa Adinerado', category: 'Residential', location: 'Urdaneta City, Pangasinan',
    type: 'Proposed two-storey residence', image: 'casa', page: 6,
    tagline: 'A contemporary sanctuary for everyday family life.',
    question: 'How can a contemporary home feel open and connected while protecting the privacy and comfort of family life?',
    response: 'The study prioritizes natural light, ventilation, and spatial fluidity. Clean architectural lines and carefully chosen materials bring a modern, lasting character to a home conceived as both a personal sanctuary and an expression of aspiration.',
    work: 'An academic exploration of residential design, communicated through an exterior visualization and floor plans. The study brings openness, privacy, and everyday comfort into one architectural proposal.',
    credit: 'From the academic portfolio of Kollene Aika Leyson, BS Architecture, Mapúa University.',
    deliverables: 'Exterior visualization · Floor plans'
  },
  manor: {
    title: 'Siete Lagos Manor', category: 'Hospitality', location: 'San Pablo, Laguna',
    type: 'Proposed boutique hotel', image: 'manor', page: 9,
    tagline: 'Classical elegance, through a local lens.',
    question: 'How can a boutique hotel offer a serene haven on an active urban corner while expressing the identity of San Pablo, the City of Seven Lakes?',
    response: 'The urban manor pairs classical architectural elements with layered spaces. A grand entrance arch creates a ceremonial gateway; a landscaped roof deck is imagined as a contemporary “seventh lake,” opening the hotel to panoramic views.',
    work: 'An academic pair collaboration with Pauline Claire Alaban, bringing together a shared boutique hotel concept and exterior visualization.',
    credit: 'Kollene Aika Leyson and Pauline Claire Alaban. Pair project, as credited in the original portfolio.',
    deliverables: 'Hotel concept · Exterior visualization'
  },
  sunbeam: {
    title: 'The Sunbeam Gallery', category: 'Mixed-use', location: 'Binondo, Manila',
    type: 'Proposed four-storey shophouse', image: 'sunbeam', page: 11,
    tagline: 'A conversation between heritage and contemporary life.',
    question: 'How can the traditional shophouse support contemporary commerce and art while maintaining a meaningful connection to Binondo’s heritage?',
    response: 'Retail and gallery spaces share a cultural-commercial hub. Historic motifs meet modern detailing, exploring continuity between the district’s architectural identity and the needs of a present-day community.',
    work: 'An academic exploration of the contemporary shophouse. The facade visualization and written concept investigate the relationship between historical memory and modern use.',
    credit: 'From the academic portfolio of Kollene Aika Leyson, BS Architecture, Mapúa University.',
    deliverables: 'Facade visualization · Design narrative'
  },
  sanyata: {
    title: 'Sanyata', category: 'Health & wellness', location: 'Reserva, Baler, Aurora',
    type: 'Proposed health & wellness center', image: 'sanyata', page: 12,
    tagline: 'Wellness with a sense of belonging.',
    question: 'How can a health and wellness center communicate a sense of place and community identity?',
    response: 'Sanyata explores wellness through a locally rooted identity. The portfolio describes the name through ideas of radiance and serenity; aerial and exterior perspectives place the proposed center within its surrounding landscape.',
    work: 'An academic health and wellness design study, presented through aerial and exterior visualizations that explore place, identity, and the center’s landscape setting.',
    credit: 'From the academic portfolio of Kollene Aika Leyson, BS Architecture, Mapúa University.',
    deliverables: 'Aerial perspective · Exterior visualizations'
  },
  cityhall: {
    title: 'New Manila City Hall', category: 'Civic', location: 'Ermita, Manila',
    type: 'Civic & institutional design proposal', image: 'cityhall', page: 15,
    tagline: 'Connected spaces for a connected community.',
    question: 'How can the form of a civic building express growth, connection, and community while bringing public functions together?',
    response: 'Inspired by the branching form of the Nilad plant, connected building volumes organize the proposal’s civic functions. Aerial visualization and floor plans communicate the relationship between the building’s geometry, circulation, and planted grounds.',
    work: 'An academic exploration of civic architecture. An aerial perspective and grouped floor plans translate the branching concept into the form and organization of a proposed civic complex.',
    credit: 'From the academic portfolio of Kollene Aika Leyson, BS Architecture, Mapúa University.',
    deliverables: 'Civic concept · Aerial view · Floor plans'
  },
  airport: {
    title: 'Amianan', category: 'Transportation', location: 'Binalonan, Pangasinan',
    type: 'Proposed domestic airport terminal', image: 'airport', page: 16,
    tagline: 'A regional gateway, grounded in local identity.',
    question: 'How can a domestic terminal support intuitive passenger movement while becoming a cultural gateway to its region?',
    response: 'Wing-inspired rooflines, open spaces, and local materials and motifs shape the proposal. Natural ventilation, shading, and landscaped buffers are explored alongside functional terminal planning and regional connectivity.',
    work: 'An academic group collaboration exploring terminal planning and regional identity through a shared airport concept and architectural visualizations.',
    credit: 'Kollene Aika Leyson with Pauline Claire A. Alaban, Ma. Jeremy Grace C. Gumatay, Alexa Caira S. Santos, and Michaella Concepcion A. Tugano.',
    deliverables: 'Terminal concept · Exterior visualizations'
  }
};

const boardTitles = ['About Kollene', 'Education & portfolio focus', 'Portfolio introduction & contents', 'Contents continued', 'Bungalow House', 'Casa Adinerado', 'Barn House', 'Bo’s Coffee', 'Siete Lagos Manor', 'Azamara', 'The Sunbeam Gallery', 'Sanyata', 'Sorelle', 'Siglang Kampeon', 'New Manila City Hall', 'Amianan', 'Scale models', 'Manual plates: pencil, pen & ink', 'Manual plates: color & rendering', 'Contact'];
const projectDialog = document.querySelector('#project-dialog');
const portfolioDialog = document.querySelector('#portfolio-dialog');
const boardSelect = document.querySelector('#board-select');
const boardImage = document.querySelector('#board-image');
let currentBoard = 1;

boardTitles.forEach((title, index) => boardSelect.add(new Option(`${String(index + 1).padStart(2, '0')} / 20 — ${title}`, index + 1)));

function openProject(key) {
  const project = projects[key];
  if (!project) return;
  // This template interpolates only the fixed, source-verified content above.
  document.querySelector('#project-content').innerHTML = `
    <div class="dialog-project-heading"><p class="eyebrow">${project.category.toUpperCase()} / ${project.location.toUpperCase()}</p><h2 id="project-title">${project.title}</h2><p>${project.tagline}</p></div>
    <img class="detail-image" src="assets/${project.image}.webp" alt="${project.title} academic architectural visualization">
    <div class="detail-meta"><div><span>PROJECT TYPE</span>${project.type}</div><div><span>CONTEXT</span>Academic design proposal</div><div><span>PRESENTED THROUGH</span>${project.deliverables}</div></div>
    <div class="detail-text"><div><h3>The design question.</h3><p>${project.question}</p></div><div><h3>The proposed response.</h3><p>${project.response}</p></div><div><h3>The work behind it.</h3><p>${project.work}</p></div></div>
    <div class="detail-credit"><p class="eyebrow">PROJECT CREDIT</p><p>${project.credit}</p></div>
    <div class="detail-footer"><button class="button" data-board="${project.page}">View original presentation board <span aria-hidden="true">↗</span></button><p>Source: original portfolio, page ${project.page} of 20.</p></div>`;
  projectDialog.showModal();
  projectDialog.scrollTop = 0;
}

function showBoard(page) {
  currentBoard = Math.max(1, Math.min(boardTitles.length, Number(page) || 1));
  boardSelect.value = currentBoard;
  boardImage.src = `assets/boards/page-${String(currentBoard).padStart(2, '0')}.webp`;
  boardImage.alt = `Original portfolio page ${currentBoard} of 20: ${boardTitles[currentBoard - 1]}`;
  document.querySelector('#previous-board').disabled = currentBoard === 1;
  document.querySelector('#next-board').disabled = currentBoard === boardTitles.length;
}

document.addEventListener('click', event => {
  const projectButton = event.target.closest('[data-project]');
  if (projectButton) openProject(projectButton.dataset.project);
  const boardButton = event.target.closest('[data-board]');
  if (boardButton) {
    if (projectDialog.open) projectDialog.close();
    showBoard(boardButton.dataset.board);
    portfolioDialog.showModal();
    portfolioDialog.scrollTop = 0;
  }
  const closeButton = event.target.closest('.close-dialog');
  if (closeButton) closeButton.closest('dialog').close();
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'study' : 'studies'} shown.`;
}));

boardSelect.addEventListener('change', () => showBoard(boardSelect.value));
document.querySelector('#previous-board').addEventListener('click', () => showBoard(currentBoard - 1));
document.querySelector('#next-board').addEventListener('click', () => showBoard(currentBoard + 1));
portfolioDialog.addEventListener('keydown', event => {
  if (event.target === boardSelect) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showBoard(currentBoard + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('kolleneaikaleyson@gmail.com');
    status.textContent = 'Email address copied. Say hello whenever you’re ready.';
  } catch {
    status.textContent = 'Copy unavailable. Use the email link to open your mail app.';
  }
});
