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

const boardTitles = [
  'About Kollene', 'Education & portfolio focus', 'Portfolio introduction & contents', 'Contents continued',
  'Bungalow House', 'Casa Adinerado', 'Barn House', 'Bo’s Coffee', 'Siete Lagos Manor', 'Azamara',
  'The Sunbeam Gallery', 'Sanyata', 'Sorelle', 'Siglang Kampeon', 'New Manila City Hall', 'Amianan',
  'Scale models', 'Manual plates: pencil, pen & ink', 'Manual plates: color & rendering', 'Contact'
];

const motionPreferenceQuery = window.portfolioMotion;
const prefersReducedMotion = () => motionPreferenceQuery.matches;

const projectDialog = document.querySelector('#project-dialog');
const portfolioDialog = document.querySelector('#portfolio-dialog');
const boardSelect = document.querySelector('#board-select');
const boardImage = document.querySelector('#board-image');
const boardStage = document.querySelector('#board-stage');
const boardFilmstrip = document.querySelector('#board-filmstrip');
const boardZoomToggle = document.querySelector('#board-zoom-toggle');
let currentBoard = 1;
const dialogOpeners = new WeakMap();
let boardAnimation = null;

// Populate board select and 20-page filmstrip
boardTitles.forEach((title, index) => {
  const pageNum = index + 1;
  const padded = String(pageNum).padStart(2, '0');
  boardSelect.add(new Option(`${padded} / 20 : ${title}`, pageNum));
  if (boardFilmstrip) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `filmstrip-dot${pageNum === 1 ? ' active' : ''}`;
    dot.dataset.filmstripPage = String(pageNum);
    dot.title = `${padded}: ${title}`;
    dot.setAttribute('aria-label', `Page ${pageNum}: ${title}`);
    dot.textContent = padded;
    boardFilmstrip.appendChild(dot);
  }
});

// Top-layer discrete display transition probe (modern-web-guidance: animate-to-from-top-layer)
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
}

async function closeTopLayer(dialog) {
  if (!dialog || !dialog.open) return;
  if (!prefersReducedMotion() && !supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map(a => a.finished)),
        new Promise(r => setTimeout(r, 260))
      ]);
    }
  }
  dialog.close();
  dialog.removeAttribute('data-closing');

}

function openProject(key, opener) {
  const project = projects[key];
  if (!project) return;
  if (opener) dialogOpeners.set(projectDialog, opener);
  // This template interpolates only the fixed, source-verified content above.
  document.querySelector('#project-content').innerHTML = `
    <div class="dialog-project-heading"><p class="eyebrow">${project.category.toUpperCase()} / ${project.location.toUpperCase()}</p><h2 id="project-title">${project.title}</h2><p>${project.tagline}</p></div>
    <img class="detail-image" src="assets/${project.image}.webp${project.image === 'manor' ? '?v=restored' : ''}" alt="${project.title} academic architectural visualization">
    <div class="detail-meta"><div><span>PROJECT TYPE</span>${project.type}</div><div><span>CONTEXT</span>Academic design proposal</div><div><span>PRESENTED THROUGH</span>${project.deliverables}</div></div>
    <p class="detail-summary">${project.response}</p>
    <details class="detail-notes"><summary>Design notes</summary><div class="detail-text"><div><h3>The design question.</h3><p>${project.question}</p></div><div><h3>The work behind it.</h3><p>${project.work}</p></div></div></details>
    <div class="detail-credit"><p class="eyebrow">PROJECT CREDIT</p><p>${project.credit}</p></div>
    <div class="detail-footer"><button class="button" data-board="${project.page}">View original presentation board <span aria-hidden="true">↗</span></button><p>Source: original portfolio, page ${project.page} of 20.</p></div>`;
  projectDialog.showModal();
  projectDialog.scrollTop = 0;
  window.portfolioLenis?.stop();
}

function setBoardZoom(zoomed) {
  if (!boardStage || !boardZoomToggle) return;
  boardStage.classList.toggle('zoomed', zoomed);
  boardZoomToggle.setAttribute('aria-pressed', String(zoomed));
  boardZoomToggle.textContent = zoomed ? 'Fit 1×' : 'Inspect 2×';
}

function showBoard(page) {
  const prevBoard = currentBoard;
  currentBoard = Math.max(1, Math.min(boardTitles.length, Number(page) || 1));
  const direction = currentBoard >= prevBoard ? 1 : -1;
  boardSelect.value = currentBoard;
  const boardSrc = `assets/boards/page-${String(currentBoard).padStart(2, '0')}.webp`;
  boardImage.src = boardSrc;
  boardImage.alt = `Original portfolio page ${currentBoard} of 20: ${boardTitles[currentBoard - 1]}`;
  const openLink = document.querySelector('#board-open-link');
  if (openLink) openLink.href = boardSrc;
  document.querySelector('#previous-board').disabled = currentBoard === 1;
  document.querySelector('#next-board').disabled = currentBoard === boardTitles.length;

  if (boardFilmstrip) {
    boardFilmstrip.querySelectorAll('.filmstrip-dot').forEach(dot => {
      const isCurrent = Number(dot.dataset.filmstripPage) === currentBoard;
      dot.classList.toggle('active', isCurrent);
    });
  }

  boardAnimation?.cancel();
  if (!prefersReducedMotion() && prevBoard !== currentBoard && boardImage.animate) {
    boardAnimation = boardImage.animate(
      [
        { opacity: 0.35, transform: `translateX(${direction * 6}px)` },
        { opacity: 1, transform: 'translateX(0) scale(1)' }
      ],
      { duration: 220, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  }
}

document.addEventListener('click', event => {
  const projectButton = event.target.closest('[data-project]');
  if (projectButton) {
    openProject(projectButton.dataset.project, projectButton);
  }
  const boardButton = event.target.closest('[data-board]');
  if (boardButton) {
    const returnTarget = projectDialog.open ? dialogOpeners.get(projectDialog) : boardButton;
    if (projectDialog.open) {
      projectDialog.dataset.handoff = 'true';
      projectDialog.close();
    }
    dialogOpeners.set(portfolioDialog, returnTarget || boardButton);
    setBoardZoom(false);
    showBoard(boardButton.dataset.board);
    portfolioDialog.showModal();
    portfolioDialog.scrollTop = 0;
    window.portfolioLenis?.stop();
  }
  const filmstripBtn = event.target.closest('[data-filmstrip-page]');
  if (filmstripBtn) {
    showBoard(filmstripBtn.dataset.filmstripPage);
  }
  const closeButton = event.target.closest('.close-dialog');
  if (closeButton) {
    const dlg = closeButton.closest('dialog');
    if (prefersReducedMotion()) {
      dlg.close();
    } else {
      closeTopLayer(dlg);
    }
  }
});

if (boardZoomToggle && boardStage) {
  boardZoomToggle.addEventListener('click', () => {
    const isZoomed = boardZoomToggle.getAttribute('aria-pressed') === 'true';
    setBoardZoom(!isZoomed);
  });
  let isPanning = false;
  let startX = 0, startY = 0, scrollL = 0, scrollT = 0;
  boardStage.addEventListener('pointerdown', e => {
    if (!boardStage.classList.contains('zoomed')) return;
    isPanning = true;
    startX = e.clientX;
    startY = e.clientY;
    scrollL = boardStage.scrollLeft;
    scrollT = boardStage.scrollTop;
  });
  window.addEventListener('pointermove', e => {
    if (!isPanning) return;
    boardStage.scrollLeft = scrollL - (e.clientX - startX);
    boardStage.scrollTop = scrollT - (e.clientY - startY);
  });
  window.addEventListener('pointerup', () => { isPanning = false; });
}

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    if (!projectDialog.open && !portfolioDialog.open) window.portfolioLenis?.start();
    if (dialog.dataset.handoff) { delete dialog.dataset.handoff; return; }
    const opener = dialogOpeners.get(dialog);
    if (opener?.isConnected && !opener.closest('dialog:not([open])')) opener.focus();
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });
});

// Filters own the card layout; image/text entrances own separate child transforms.
const filterAnimations = new Set();
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  filterAnimations.forEach(animation => animation.cancel());
  filterAnimations.clear();
  const cards = [...document.querySelectorAll('.project-card')];
  const previous = new Map();
  if (!prefersReducedMotion()) cards.filter(card => !card.hidden).forEach(card => previous.set(card, card.getBoundingClientRect()));
  document.querySelectorAll('.filter').forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  const visible = card => button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
  cards.forEach(card => { card.hidden = !visible(card); });
  const archive = [...document.querySelectorAll('.archive-card')];
  archive.forEach(card => { card.hidden = !visible(card); });
  const archiveSection = document.querySelector('#archive-section');
  if (archiveSection) archiveSection.hidden = !archive.some(card => !card.hidden);
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = `${count} featured ${count === 1 ? 'study' : 'studies'} shown.`;
  if (!prefersReducedMotion()) cards.forEach(card => {
    if (card.hidden || !card.animate || !previous.has(card)) return;
    const before = previous.get(card), after = card.getBoundingClientRect();
    const dx = before.left - after.left, dy = before.top - after.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    const animation = card.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
    filterAnimations.add(animation);
    animation.finished.then(() => { animation.cancel(); filterAnimations.delete(animation); }).catch(() => {});
  });
  document.dispatchEvent(new Event('portfolio:filter-change'));
}));
motionPreferenceQuery.addEventListener('change', () => {
  if (prefersReducedMotion()) { filterAnimations.forEach(animation => animation.cancel()); filterAnimations.clear(); boardAnimation?.cancel(); }
});
document.addEventListener('visibilitychange', () => {
  filterAnimations.forEach(animation => document.hidden ? animation.pause() : animation.play());
  if (boardAnimation?.playState === 'running' && document.hidden) boardAnimation.pause();
  else if (boardAnimation?.playState === 'paused' && !document.hidden) boardAnimation.play();
});

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

// ============================================================================
// LENIS SMOOTH SCROLL & SCROLL PROGRESS
// ============================================================================
(function initLenisAndProgress() {
  const ruler = document.querySelector('#scroll-ruler-fill');
  let frame = null;
  function updateProgress(currentScroll) {
    frame = null;
    const y = typeof currentScroll === 'number' ? currentScroll : window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (ruler) ruler.style.transform = `scaleX(${Math.min(1, Math.max(0, y / maxScroll))})`;
  }
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => updateProgress()); }, { passive: true });
  updateProgress();

  let lenisInstance = null;
  function setupLenis() {
    if (typeof window.Lenis !== 'function') return;
    if (prefersReducedMotion()) {
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
        window.portfolioLenis = null;
      }
      return;
    }
    if (lenisInstance) return;

    lenisInstance = new window.Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      infinite: false,
      autoRaf: true
    });
    lenisInstance.on('scroll', e => updateProgress(e.scroll));
    window.portfolioLenis = lenisInstance;
  }

  setupLenis();
  motionPreferenceQuery.addEventListener('change', setupLenis);

  // In-page smooth scroll anchor links
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;
    const target = document.querySelector(href);
    if (!target) return;
    if (lenisInstance && !prefersReducedMotion()) {
      event.preventDefault();
      lenisInstance.scrollTo(target, { offset: 0, duration: 1.15 });
    }
  });
})();

// ============================================================================
// THREE.JS / WEBGL HELIODON SUN-PATH SHADER & 3D STRUCTURAL STUDIO
// ============================================================================
(function initArchitecturalThreeStudio() {
  const THREE = window.THREE;
  const sunSlider = document.querySelector('#sun-slider');
  const heliodonTime = document.querySelector('#heliodon-time');
  const heliodonModeBtn = document.querySelector('#heliodon-mode');
  const heroHeliodonCanvas = document.querySelector('#hero-heliodon');
  const heroSourceImage = document.querySelector('#hero-source-image');
  const heroStage = document.querySelector('#hero-stage');

  let sunProgress = 0.72; // 0..1 (06:00 Dawn -> 18:30 Dusk)
  let elevationMode = false;
  let pointerSunX = 0.72;
  let pointerSunY = 0.35;

  function formatSolarTime(val) {
    const minutesTotal = Math.round(6 * 60 + val * (12.5 * 60)); // 06:00 to 18:30
    const hrs = Math.floor(minutesTotal / 60);
    const mins = minutesTotal % 60;
    let phase = 'MORNING LIGHT';
    if (val < 0.2) phase = 'DAWN AZIMUTH';
    else if (val >= 0.38 && val <= 0.62) phase = 'SOLAR ZENITH';
    else if (val > 0.62 && val <= 0.85) phase = 'GOLDEN HOUR';
    else if (val > 0.85) phase = 'BLUE HOUR DUSK';
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} · ${phase}`;
  }

  function canUseWebGL() {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      return Boolean(gl);
    } catch {
      return false;
    }
  }

  // 1. Hero Heliodon Shader (Three.js WebGLRenderer with 2D fallback)
  let requestHeliodonRender = () => {};
  let stopHeliodonRender = () => {};
  let lightingStudyActive = false;
  if (heroHeliodonCanvas && heroSourceImage) {
    const useWebGL = THREE && canUseWebGL();

    const setupHeliodon = () => {
      if (useWebGL) {
        try {
          const renderer = new THREE.WebGLRenderer({
            canvas: heroHeliodonCanvas,
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance'
          });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          const scene = new THREE.Scene();
          const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

          const texture = new THREE.Texture(heroSourceImage);
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const uniforms = {
            uTexture: { value: texture },
            uImageResolution: { value: new THREE.Vector2(heroSourceImage.naturalWidth, heroSourceImage.naturalHeight) },
            uStudyActive: { value: 0 },
            uSun: { value: new THREE.Vector2(pointerSunX, pointerSunY) },
            uSunProgress: { value: sunProgress },
            uElevation: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(heroHeliodonCanvas.clientWidth || 700, heroHeliodonCanvas.clientHeight || 550) }
          };

          const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              precision mediump float;
              varying vec2 vUv;
              uniform sampler2D uTexture;
              uniform vec2 uImageResolution;
              uniform float uStudyActive;
              uniform vec2 uSun;
              uniform float uSunProgress;
              uniform float uElevation;
              uniform vec2 uResolution;

              float luma(vec3 c) {
                return dot(c, vec3(0.299, 0.587, 0.114));
              }

              void main() {
                // Match object-fit:cover instead of stretching architectural proportions.
                vec2 coverUv = vUv;
                float imageAspect = uImageResolution.x / uImageResolution.y;
                float frameAspect = uResolution.x / uResolution.y;
                if (frameAspect > imageAspect) coverUv.y = (vUv.y - .5) * imageAspect / frameAspect + .5;
                else coverUv.x = (vUv.x - .5) * frameAspect / imageAspect + .5;
                vec2 texel = 1.5 / max(uImageResolution, vec2(400.0));
                vec3 base = texture2D(uTexture, coverUv).rgb;

                // Architectural surface relief normals from luminance gradients
                float lL = luma(texture2D(uTexture, coverUv + vec2(-texel.x, 0.0)).rgb);
                float lR = luma(texture2D(uTexture, coverUv + vec2(texel.x, 0.0)).rgb);
                float lD = luma(texture2D(uTexture, coverUv + vec2(0.0, -texel.y)).rgb);
                float lU = luma(texture2D(uTexture, coverUv + vec2(0.0, texel.y)).rgb);

                vec3 normal = normalize(vec3((lL - lR) * 2.6, (lD - lU) * 2.6, 1.0));
                vec3 lightDir = normalize(vec3((uSun.x - vUv.x) * 1.6, (1.0 - uSun.y - vUv.y) * 1.4, 0.65));
                float diff = clamp(dot(normal, lightDir), 0.0, 1.0);

                // Solar palette across the day (Dawn -> Noon -> Golden Hour -> Dusk)
                vec3 dawnTint = vec3(1.04, 0.95, 0.90);
                vec3 noonTint = vec3(1.02, 1.02, 0.99);
                vec3 goldTint = vec3(1.12, 0.93, 0.76);
                vec3 duskTint = vec3(0.82, 0.89, 1.02);

                vec3 solarTint = mix(dawnTint, noonTint, smoothstep(0.0, 0.45, uSunProgress));
                solarTint = mix(solarTint, goldTint, smoothstep(0.45, 0.78, uSunProgress));
                solarTint = mix(solarTint, duskTint, smoothstep(0.78, 1.0, uSunProgress));

                // Subtle architectural colonnade sun-ray sweep
                float rayCoord = (vUv.x - uSun.x) * 6.5 + (vUv.y - 0.5) * 2.2;
                float sunBeam = 0.5 + 0.5 * cos(rayCoord);
                float distToSun = length(vUv - vec2(uSun.x, 1.0 - uSun.y));
                float warmGlow = exp(-distToSun * 2.2) * 0.16;

                vec3 litColor = base * solarTint * (0.86 + 0.28 * diff + 0.05 * sunBeam) + warmGlow * vec3(1.0, 0.84, 0.62);

                // Sobel Architectural Elevation Line Pass (ink on vellum #f5f4ee)
                float edge = clamp(length(vec2(lL - lR, lD - lU)) * 4.8, 0.0, 1.0);
                vec3 paper = vec3(0.961, 0.957, 0.933);
                vec3 ink = vec3(0.157, 0.220, 0.176);
                vec3 oliveWash = vec3(0.86, 0.88, 0.82);
                vec3 blueprint = mix(mix(oliveWash, paper, luma(base)), ink, smoothstep(0.08, 0.42, edge));

                vec3 finalColor = mix(mix(base, litColor, uStudyActive * .42), blueprint, uElevation);
                gl_FragColor = vec4(finalColor, 1.0);
              }
            `
          });

          const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
          scene.add(quad);

          let targetElevation = 0;
          let currentElevation = 0;
          let targetSunX = pointerSunX;
          let targetSunY = pointerSunY;
          let animFrame = null;

          const resizeHeliodon = () => {
            const w = heroStage.clientWidth || 700;
            const h = heroStage.clientHeight || 555;
            renderer.setSize(w, h, false);
            uniforms.uResolution.value.set(w, h);
          };
          resizeHeliodon();
          window.addEventListener('resize', () => { resizeHeliodon(); requestHeliodonRender(); });

          const renderLoop = () => {
            animFrame = null;
            const mix = prefersReducedMotion() ? 1 : .18;
            currentElevation += (targetElevation - currentElevation) * mix;
            uniforms.uElevation.value = currentElevation;
            uniforms.uSun.value.x += (targetSunX - uniforms.uSun.value.x) * mix;
            uniforms.uSun.value.y += (targetSunY - uniforms.uSun.value.y) * mix;
            uniforms.uSunProgress.value = sunProgress;
            uniforms.uStudyActive.value = lightingStudyActive ? 1 : 0;
            renderer.render(scene, camera);

            if (
              Math.abs(targetElevation - currentElevation) > 0.005 ||
              Math.abs(targetSunX - uniforms.uSun.value.x) > 0.004 ||
              Math.abs(targetSunY - uniforms.uSun.value.y) > 0.004
            ) {
              animFrame = requestAnimationFrame(renderLoop);
            }
          };

          stopHeliodonRender = () => { if (animFrame) cancelAnimationFrame(animFrame); animFrame = null; };
          requestHeliodonRender = (instant = false) => {
            targetElevation = elevationMode ? 1 : 0;
            targetSunX = pointerSunX; targetSunY = pointerSunY;
            if (document.hidden) { stopHeliodonRender(); return; }
            if (instant || prefersReducedMotion()) {
              stopHeliodonRender();
              currentElevation = targetElevation;
              uniforms.uSun.value.set(targetSunX, targetSunY);
              renderLoop();
            } else if (!animFrame) animFrame = requestAnimationFrame(renderLoop);
          };

          heroHeliodonCanvas.classList.add('ready');
          requestHeliodonRender();
          return;
        } catch {
          // Fall through to 2D filter fallback if WebGL fails
        }
      }

      // Photo-preserving fallback: only static-color overlay opacity changes.
      const warmTone = document.createElement('span');
      const coolTone = document.createElement('span');
      warmTone.className = 'heliodon-tone heliodon-tone-warm';
      coolTone.className = 'heliodon-tone heliodon-tone-cool';
      [warmTone, coolTone].forEach(tone => { tone.setAttribute('aria-hidden', 'true'); heroStage.appendChild(tone); });
      requestHeliodonRender = () => {
        const playing = lightingStudyActive && !elevationMode;
        warmTone.style.opacity = playing ? String(.025 + .07 * Math.sin(sunProgress * Math.PI)) : '0';
        coolTone.style.opacity = playing ? String(.07 * Math.pow(Math.abs(sunProgress - .5) * 2, 2)) : '0';
        if (elevationMode) {
          heroSourceImage.style.filter = 'grayscale(1) contrast(1.45) sepia(0.25) brightness(1.04)';
        } else {
          heroSourceImage.style.filter = 'none';
        }
      };
      requestHeliodonRender();
    };

    if (heroSourceImage.complete && heroSourceImage.naturalWidth > 0) {
      setupHeliodon();
    } else {
      heroSourceImage.addEventListener('load', setupHeliodon, { once: true });
    }
  }

  if (sunSlider) {
    sunSlider.addEventListener('input', () => {
      lightingStudyActive = true;
      sunProgress = Number(sunSlider.value) / 100;
      pointerSunX = 0.12 + sunProgress * 0.78;
      pointerSunY = 0.18 + Math.pow(sunProgress - 0.5, 2) * 1.1;
      if (heliodonTime) heliodonTime.textContent = formatSolarTime(sunProgress);
      requestHeliodonRender();
    });
  }

  if (heliodonModeBtn) {
    heliodonModeBtn.addEventListener('click', () => {
      elevationMode = !elevationMode;
      heliodonModeBtn.setAttribute('aria-pressed', String(elevationMode));
      heliodonModeBtn.textContent = elevationMode ? 'Rendered daylight' : 'Elevation lines';
      const meta = document.querySelector('#hero-study-meta');
      if (meta) meta.textContent = elevationMode ? '01 / 06 · ELEVATION LINE PASS' : '01 / 06 · HELIODON ACTIVE';
      requestHeliodonRender();
      syncDaylight();
    });
  }

  // The portrait sets midday light; its resting backdrop follows a slow daylight loop.
  let portraitActive = document.querySelector('#portrait-toggle')?.dataset.alternate === 'true';
  let daylightVisible = false, daylightPaused = false, daylightFrame = null, previousDaylightTime = null;
  let daylightPhase = Math.acos(1 - 2 * sunProgress) / (Math.PI * 2), lastDaylightRender = 0;
  const daylightPause = document.querySelector('#heliodon-pause');
  function stopDaylight() {
    if (daylightFrame) cancelAnimationFrame(daylightFrame);
    daylightFrame = null; previousDaylightTime = null;
  }
  function canPlayDaylight() { return daylightVisible && !portraitActive && !elevationMode && !daylightPaused && !prefersReducedMotion() && !document.hidden; }
  function daylightTick(now) {
    daylightFrame = null;
    if (!canPlayDaylight()) return;
    if (previousDaylightTime !== null) daylightPhase += Math.min(100, now - previousDaylightTime) / 48000;
    previousDaylightTime = now;
    if (now - lastDaylightRender >= 1000 / 24) {
      lastDaylightRender = now;
      sunProgress = .5 - .5 * Math.cos(daylightPhase * Math.PI * 2);
      pointerSunX = .12 + sunProgress * .78;
      pointerSunY = .18 + Math.pow(sunProgress - .5, 2) * 1.1;
      lightingStudyActive = true;
      if (sunSlider) sunSlider.value = String(Math.round(sunProgress * 100));
      const readout = formatSolarTime(sunProgress);
      if (heliodonTime && heliodonTime.textContent !== readout) heliodonTime.textContent = readout;
      if (heroStage) heroStage.dataset.daylightState = 'playing';
      requestHeliodonRender(true);
    }
    daylightFrame = requestAnimationFrame(daylightTick);
  }
  function syncDaylight() {
    stopDaylight();
    const meta = document.querySelector('#hero-study-meta');
    if (meta) meta.textContent = `Siete Lagos Manor · ${elevationMode ? 'ELEVATION LINES' : portraitActive ? 'MIDDAY LIGHT' : prefersReducedMotion() ? 'STILL DAYLIGHT' : daylightPaused ? 'DAYLIGHT PAUSED' : 'DAYLIGHT LOOP'}`;
    if (daylightPause) {
      daylightPause.disabled = prefersReducedMotion();
      daylightPause.textContent = prefersReducedMotion() ? 'Still daylight' : daylightPaused ? 'Play daylight' : 'Pause daylight';
      daylightPause.title = prefersReducedMotion() ? 'Automatic playback is off. Change the Motion setting to On to animate.' : '';
      daylightPause.setAttribute('aria-pressed', String(daylightPaused));
    }
    if (prefersReducedMotion()) { lightingStudyActive = false; requestHeliodonRender(true); }
    if (canPlayDaylight()) daylightFrame = requestAnimationFrame(daylightTick);
    else if (heroStage) heroStage.dataset.daylightState = prefersReducedMotion() ? 'reduced-motion' : portraitActive ? 'portrait-midday' : elevationMode ? 'elevation' : daylightPaused ? 'paused' : 'offscreen';
  }
  daylightPause?.addEventListener('click', () => { daylightPaused = !daylightPaused; syncDaylight(); });
  document.addEventListener('portfolio:portrait-state', event => {
    portraitActive = Boolean(event.detail.alternate);
    elevationMode = false;
    heliodonModeBtn?.setAttribute('aria-pressed', 'false');
    if (heliodonModeBtn) heliodonModeBtn.textContent = 'Elevation lines';
    sunProgress = portraitActive ? .46 : .74;
    daylightPhase = Math.acos(1 - 2 * sunProgress) / (Math.PI * 2);
    pointerSunX = .12 + sunProgress * .78;
    pointerSunY = .18 + Math.pow(sunProgress - .5, 2) * 1.1;
    if (heliodonTime) heliodonTime.textContent = formatSolarTime(sunProgress);
    heroStage.dataset.sunState = portraitActive ? 'midday' : 'warm';
    syncDaylight();
    lightingStudyActive = true;
    requestHeliodonRender();
  });
  if (heroStage && window.IntersectionObserver) new IntersectionObserver(entries => {
    daylightVisible = entries[0].isIntersecting; syncDaylight();
  }, { threshold: .12 }).observe(heroStage);
  motionPreferenceQuery.addEventListener('change', syncDaylight);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopHeliodonRender(); syncDaylight(); });
  window.addEventListener('pagehide', () => { stopDaylight(); stopHeliodonRender(); });

  // 2. Hero Ambient 3D Axonometric Architectural Grid (#hero-axon-canvas)
  const axonCanvas = document.querySelector('#hero-axon-canvas');
  if (axonCanvas && THREE) {
    const ctx = axonCanvas.getContext('2d');
    const camera = new THREE.PerspectiveCamera(34, 1.6, 0.1, 100);
    let mouseNx = 0, mouseNy = 0;

    const resizeAxon = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = axonCanvas.clientWidth || 1200;
      const h = axonCanvas.clientHeight || 620;
      axonCanvas.width = w * dpr;
      axonCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };

    const projectPt = (x, y, z, w, h) => {
      const v = new THREE.Vector3(x, y, z).project(camera);
      return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h };
    };

    const drawAxon = () => {
      const w = axonCanvas.clientWidth || 1200;
      const h = axonCanvas.clientHeight || 620;
      ctx.clearRect(0, 0, w, h);

      const scrollShift = prefersReducedMotion() ? 0 : Math.min(1.5, window.scrollY / 600);
      camera.position.set(6.5 + (prefersReducedMotion() ? 0 : mouseNx * 0.8), 5.2 - scrollShift * 0.9 + (prefersReducedMotion() ? 0 : mouseNy * 0.5), 8.5);
      camera.lookAt(0.5, 0.2, 0);
      camera.updateMatrixWorld();

      ctx.strokeStyle = 'rgba(114, 124, 85, 0.13)';
      ctx.lineWidth = 1;

      // Ground architectural datum grid
      const span = 6;
      for (let i = -span; i <= span; i++) {
        const a = projectPt(i, -1.6, -span, w, h);
        const b = projectPt(i, -1.6, span, w, h);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

        const c = projectPt(-span, -1.6, i, w, h);
        const d = projectPt(span, -1.6, i, w, h);
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.stroke();
      }

      // Subtle rising massing frames
      const boxes = [
        { x: -3.2, z: -1.8, w: 1.8, d: 1.5, h: 2.3 },
        { x: -1.1, z: -2.4, w: 2.2, d: 1.8, h: 3.1 },
        { x: 1.6, z: -1.2, w: 1.6, d: 2.1, h: 1.9 }
      ];
      ctx.strokeStyle = 'rgba(52, 75, 60, 0.16)';
      boxes.forEach(b => {
        const y0 = -1.6, y1 = -1.6 + b.h;
        const corners = [
          projectPt(b.x, y0, b.z, w, h),
          projectPt(b.x + b.w, y0, b.z, w, h),
          projectPt(b.x + b.w, y0, b.z + b.d, w, h),
          projectPt(b.x, y0, b.z + b.d, w, h),
          projectPt(b.x, y1, b.z, w, h),
          projectPt(b.x + b.w, y1, b.z, w, h),
          projectPt(b.x + b.w, y1, b.z + b.d, w, h),
          projectPt(b.x, y1, b.z + b.d, w, h)
        ];
        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(corners[i].x, corners[i].y);
          ctx.lineTo(corners[j].x, corners[j].y);
          ctx.stroke();
        });
      });
    };

    resizeAxon();
    drawAxon();
    window.addEventListener('resize', () => { resizeAxon(); drawAxon(); });
    motionPreferenceQuery.addEventListener('change', drawAxon);
    {
      window.addEventListener('scroll', () => {
        if (!prefersReducedMotion() && !document.hidden && window.scrollY < 900) requestAnimationFrame(drawAxon);
      }, { passive: true });
      window.addEventListener('pointermove', e => {
        if (prefersReducedMotion() || document.hidden || window.scrollY > 900) return;
        mouseNx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseNy = (e.clientY / window.innerHeight - 0.5) * 2;
        requestAnimationFrame(drawAxon);
      }, { passive: true });
    }
  }

  // 3. Process Section 3D Mini-Diagrams (.process-canvas)
  document.querySelectorAll('.process-canvas').forEach(canvas => {
    if (!THREE) return;
    const ctx = canvas.getContext('2d');
    const type = canvas.dataset.processModel;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 76 * dpr;
    canvas.height = 76 * dpr;
    ctx.scale(dpr, dpr);
    canvas.classList.add('ready');

    let angle = 0.5;
    let isHovered = false;
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 20);

    const drawMini = () => {
      ctx.clearRect(0, 0, 76, 76);
      cam.position.set(Math.cos(angle) * 4.2, 2.5, Math.sin(angle) * 4.2);
      cam.lookAt(0, 0, 0);
      cam.updateMatrixWorld();

      const proj = (x, y, z) => {
        const v = new THREE.Vector3(x, y, z).project(cam);
        return { x: (v.x * 0.5 + 0.5) * 76, y: (-v.y * 0.5 + 0.5) * 76 };
      };

      ctx.strokeStyle = '#344b3c';
      ctx.lineWidth = 1.15;

      if (type === 'site') {
        // 01 / Site contours + sun orbit ring
        [-0.45, 0, 0.45].forEach((y, idx) => {
          const s = 1.05 - idx * 0.22;
          const pts = [proj(-s, y, -s), proj(s, y, -s), proj(s, y, s), proj(-s, y, s)];
          ctx.beginPath();
          pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.closePath();
          ctx.stroke();
        });
        ctx.strokeStyle = '#727c55';
        ctx.beginPath();
        for (let a = 0; a <= 24; a++) {
          const t = (a / 24) * Math.PI * 2;
          const p = proj(Math.cos(t) * 1.25, Math.sin(t) * 0.55, Math.sin(t) * 1.25);
          if (a === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      } else if (type === 'form') {
        // 02 / Interlocking architectural massing volumes
        const drawCube = (ox, oy, oz, sx, sy, sz, color) => {
          ctx.strokeStyle = color;
          const v = [
            proj(ox-sx, oy-sy, oz-sz), proj(ox+sx, oy-sy, oz-sz), proj(ox+sx, oy-sy, oz+sz), proj(ox-sx, oy-sy, oz+sz),
            proj(ox-sx, oy+sy, oz-sz), proj(ox+sx, oy+sy, oz-sz), proj(ox+sx, oy+sy, oz+sz), proj(ox-sx, oy+sy, oz+sz)
          ];
          [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([i,j]) => {
            ctx.beginPath(); ctx.moveTo(v[i].x, v[i].y); ctx.lineTo(v[j].x, v[j].y); ctx.stroke();
          });
        };
        drawCube(-0.25, -0.1, -0.15, 0.65, 0.75, 0.55, '#344b3c');
        drawCube(0.35, 0.2, 0.25, 0.55, 0.45, 0.65, '#727c55');
      } else {
        // 03 / Gabled elevation & section cut planes
        const pts = [
          proj(-0.9, -0.7, -0.7), proj(0.9, -0.7, -0.7), proj(0.9, 0.2, -0.7), proj(0, 0.95, -0.7), proj(-0.9, 0.2, -0.7),
          proj(-0.9, -0.7, 0.7), proj(0.9, -0.7, 0.7), proj(0.9, 0.2, 0.7), proj(0, 0.95, 0.7), proj(-0.9, 0.2, 0.7)
        ];
        const edges = [[0,1],[1,2],[2,3],[3,4],[4,0],[5,6],[6,7],[7,8],[8,9],[9,5],[0,5],[1,6],[2,7],[3,8],[4,9]];
        edges.forEach(([i, j], idx) => {
          ctx.strokeStyle = idx >= 10 ? '#727c55' : '#344b3c';
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        });
      }
    };

    drawMini();
    const article = canvas.closest('article');
    if (article) {
      const tick = () => {
        if (!isHovered || prefersReducedMotion() || document.hidden) return;
        angle += 0.035;
        drawMini();
        requestAnimationFrame(tick);
      };
      article.addEventListener('pointerenter', () => { isHovered = true; requestAnimationFrame(tick); });
      article.addEventListener('pointerleave', () => { isHovered = false; });
    }
  });

  // 4. Centerpiece Interactive Three.js 3D Structural Workbench (#structural-3d-canvas)
  const wbCanvas = document.querySelector('#structural-3d-canvas');
  const wbStage = document.querySelector('#workbench-stage');
  if (!wbCanvas || !wbStage || !THREE) return;

  const ctx = wbCanvas.getContext('2d');
  const camera = new THREE.PerspectiveCamera(34, 1.5, 0.1, 100);

  const studyMetadata = {
    tensegrity: {
      principle: 'Isolated compression struts within a continuous tension network',
      material: 'Tensegrity scale model exploring tension, compression & structural balance (Board 17)',
      badge: 'MODEL 01 · TENSEGRITY (BOARD 17)',
      source: { file: 'source-tensegrity.webp', width: 418, height: 337, title: 'Tensegrity' }
    },
    thinshell: {
      principle: 'Curved surface load distribution & axial membrane behavior',
      material: 'Thin Shell Structure scale model exploring curved geometry & shell action (Board 17)',
      badge: 'MODEL 02 · THIN SHELL STRUCTURE (BOARD 17)',
      source: { file: 'source-thinshell.webp', width: 436, height: 303, title: 'Thin Shell Structure' }
    },
    origami: {
      principle: 'Folded surface geometry increasing stiffness via ridge & valley creases',
      material: 'Paper Folding scale study exploring geometry, planes & form-making (Board 17)',
      badge: 'MODEL 03 · PAPER FOLDING (BOARD 17)',
      source: { file: 'source-origami.webp', width: 490, height: 344, title: 'Paper Folding' }
    },
    pavilion: {
      principle: 'Hierarchical tiered eaves, proportion & spatial relationships',
      material: 'Kinkakuji / The Golden Pavilion scale model exploring proportion & roof form (Board 17)',
      badge: 'MODEL 04 · KINKAKUJI / THE GOLDEN PAVILION (BOARD 17)',
      source: { file: 'source-pavilion.webp', width: 442, height: 413, title: 'Kinkakuji / The Golden Pavilion' }
    },
    bridge: {
      principle: 'Triangulated truss span, axial member load transfer & tension-compression chords',
      material: 'Bamboo Stick Bridge scale model exploring span, structure & load distribution (Board 17)',
      badge: 'MODEL 05 · BAMBOO STICK BRIDGE (BOARD 17)',
      source: { file: 'source-bridge.webp', width: 451, height: 339, title: 'Bamboo Stick Bridge' }
    },
    museum: {
      principle: 'Radial roof arrangement, connected exhibition spaces and curved extensions',
      material: 'Illustrative reconstruction from portfolio photographs. Unseen geometry and dimensions are approximate.',
      badge: 'MODEL 06 · INTERCONNECTED MUSEUM (BOARD 17)',
      source: { file: 'museum-oblique.webp', width: 615, height: 447, title: 'Interconnected Museum' }
    }
  };

  let activeStudy = 'tensegrity';
  let showForceVectors = true;
  let camYaw = 0.72, camPitch = 0.46, camDist = 7.2;
  let targetYaw = 0.72, targetPitch = 0.46, targetDist = 7.2;
  let isDragging = false, lastX = 0, lastY = 0;
  let isInViewport = false;
  let wbAnimId = null;
  let currentCameraView = 'axon';

  // Build 3D Structural Geometries (grounded in all 6 Board 17 scale models)
  function buildStudyGeometry(studyKey) {
    const verts = [];
    const edges = []; // { a, b, role: 'compression' | 'tension' | 'primary' | 'secondary' }
    const faces = []; // { indices: [i,j,k], color }
    const labels = []; // { pos: [x,y,z], text }

    if (studyKey === 'tensegrity') {
      const r = 1.45, h = 1.35, twist = (5 * Math.PI) / 6;
      for (let i = 0; i < 3; i++) {
        const aBot = (i * 2 * Math.PI) / 3;
        verts.push(new THREE.Vector3(r * Math.cos(aBot), -h, r * Math.sin(aBot)));
      }
      for (let i = 0; i < 3; i++) {
        const aTop = (i * 2 * Math.PI) / 3 + twist;
        verts.push(new THREE.Vector3(r * 0.92 * Math.cos(aTop), h, r * 0.92 * Math.sin(aTop)));
      }
      edges.push({ a: 0, b: 3, role: 'compression' });
      edges.push({ a: 1, b: 4, role: 'compression' });
      edges.push({ a: 2, b: 5, role: 'compression' });
      for (let i = 0; i < 3; i++) {
        edges.push({ a: i, b: (i + 1) % 3, role: 'tension' });
        edges.push({ a: 3 + i, b: 3 + ((i + 1) % 3), role: 'tension' });
        edges.push({ a: i, b: 3 + ((i + 1) % 3), role: 'tension' });
        edges.push({ a: i, b: 3 + ((i + 2) % 3), role: 'secondary' });
      }
      labels.push({ pos: [verts[3].x, verts[3].y + 0.22, verts[3].z], text: 'TENSION RING NODE' });
      labels.push({ pos: [(verts[0].x + verts[3].x) * 0.5, 0, (verts[0].z + verts[3].z) * 0.5], text: 'COMPRESSION STRUT' });
    } else if (studyKey === 'thinshell') {
      const n = 9, span = 1.85, saddle = 0.85;
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= n; j++) {
          const u = (i / n) * 2 - 1;
          const v = (j / n) * 2 - 1;
          const y = (u * u - v * v) * saddle + 0.15;
          verts.push(new THREE.Vector3(u * span, y, v * span));
        }
      }
      const idx = (i, j) => i * (n + 1) + j;
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= n; j++) {
          if (i < n) edges.push({ a: idx(i, j), b: idx(i + 1, j), role: (j === 0 || j === n) ? 'compression' : 'tension' });
          if (j < n) edges.push({ a: idx(i, j), b: idx(i, j + 1), role: (i === 0 || i === n) ? 'compression' : 'tension' });
          if (i < n && j < n) {
            faces.push({ indices: [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)] });
          }
        }
      }
      const b0 = verts.length;
      verts.push(new THREE.Vector3(-span, -1.35, -span), new THREE.Vector3(span, -1.35, span));
      edges.push({ a: idx(0, 0), b: b0, role: 'compression' }, { a: idx(n, n), b: b0 + 1, role: 'compression' });
      labels.push({ pos: [0, 0.35, 0], text: 'CURVED SHELL MEMBRANE' });
      labels.push({ pos: [-span, -0.5, -span], text: 'SUPPORT ABUTMENT' });
    } else if (studyKey === 'origami') {
      const cols = 8, rows = 4;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const u = (c / cols) * 2 - 1;
          const v = (r / rows) * 2 - 1;
          const ridge = (c % 2 === 0 ? 0.42 : -0.32) * (1 - 0.25 * Math.abs(v));
          const arch = Math.cos(u * Math.PI * 0.45) * 0.55 - 0.15;
          verts.push(new THREE.Vector3(u * 2.15, ridge + arch, v * 1.45 + (c % 2 === 0 ? 0.12 : -0.12)));
        }
      }
      const idx = (r, c) => r * (cols + 1) + c;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (c < cols) edges.push({ a: idx(r, c), b: idx(r, c + 1), role: 'tension' });
          if (r < rows) edges.push({ a: idx(r, c), b: idx(r + 1, c), role: c % 2 === 0 ? 'compression' : 'tension' });
          if (r < rows && c < cols) {
            edges.push({ a: idx(r, c), b: idx(r + 1, c + 1), role: 'secondary' });
            faces.push({ indices: [idx(r, c), idx(r, c + 1), idx(r + 1, c + 1), idx(r + 1, c)] });
          }
        }
      }
      labels.push({ pos: [0, 0.92, 0], text: 'RIDGE CREASE (COMPRESSION)' });
      labels.push({ pos: [0.54, -0.1, 0.6], text: 'VALLEY FOLD (TENSION)' });
    } else if (studyKey === 'bridge') {
      // Model 05: Bamboo Stick Bridge — Triangulated arch-truss bridge span
      const bays = 6, spanX = 2.35, deckY = -0.35, halfW = 0.62;
      for (let i = 0; i <= bays; i++) {
        const u = (i / bays) * 2 - 1;
        const x = u * spanX;
        const archY = deckY + 0.52 + Math.cos(u * Math.PI * 0.5) * 0.95;
        // 0: deck front, 1: deck back, 2: top chord front, 3: top chord back
        verts.push(
          new THREE.Vector3(x, deckY, -halfW),
          new THREE.Vector3(x, deckY, halfW),
          new THREE.Vector3(x, archY, -halfW * 0.86),
          new THREE.Vector3(x, archY, halfW * 0.86)
        );
      }
      for (let i = 0; i <= bays; i++) {
        const b = i * 4;
        // Vertical posts & cross beams
        edges.push({ a: b, b: b + 2, role: 'compression' }, { a: b + 1, b: b + 3, role: 'compression' });
        edges.push({ a: b, b: b + 1, role: 'tension' }, { a: b + 2, b: b + 3, role: 'secondary' });
        if (i < bays) {
          const n = (i + 1) * 4;
          // Bottom tension deck chords
          edges.push({ a: b, b: n, role: 'tension' }, { a: b + 1, b: n + 1, role: 'tension' });
          // Top compression arch chords
          edges.push({ a: b + 2, b: n + 2, role: 'compression' }, { a: b + 3, b: n + 3, role: 'compression' });
          // Diagonal web bracing
          edges.push({ a: b, b: n + 2, role: 'secondary' }, { a: b + 2, b: n, role: 'secondary' });
          edges.push({ a: b + 1, b: n + 3, role: 'secondary' }, { a: b + 3, b: n + 1, role: 'secondary' });
          faces.push({ indices: [b, n, n + 1, b + 1] });
        }
      }
      labels.push({ pos: [0, 1.15, -halfW * 0.86], text: 'TOP ARCH CHORD (COMPRESSION)' });
      labels.push({ pos: [0.75, deckY, halfW], text: 'DECK STRINGER (TENSION)' });
    } else if (studyKey === 'museum') {
      return window.buildMuseumStudyGeometry(THREE);
    } else {
      // Model 04: Kinkakuji / The Golden Pavilion (3 tiered eaves + colonnade)
      const addTier = (yBot, yTop, wBot, dBot, wEave, dEave, apexH) => {
        const base = verts.length;
        [[-wBot,yBot,-dBot],[wBot,yBot,-dBot],[wBot,yBot,dBot],[-wBot,yBot,dBot],
         [-wBot,yTop,-dBot],[wBot,yTop,-dBot],[wBot,yTop,dBot],[-wBot,yTop,dBot]].forEach(p => verts.push(new THREE.Vector3(...p)));
        [[0,1],[1,2],[2,3],[3,0],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b]) => edges.push({ a: base+a, b: base+b, role: 'compression' }));
        [[-wEave,yTop,-dEave],[wEave,yTop,-dEave],[wEave,yTop,dEave],[-wEave,yTop,dEave],
         [-wEave*0.45,yTop+apexH,0],[wEave*0.45,yTop+apexH,0]].forEach(p => verts.push(new THREE.Vector3(...p)));
        [[8,9],[9,10],[10,11],[11,8],[12,13],[8,12],[11,12],[9,13],[10,13]].forEach(([a,b]) => edges.push({ a: base+a, b: base+b, role: 'tension' }));
        faces.push(
          { indices: [base+8, base+9, base+13, base+12] },
          { indices: [base+11, base+10, base+13, base+12] }
        );
      };
      addTier(-1.25, -0.45, 1.55, 1.15, 1.95, 1.48, 0.32);
      addTier(-0.13, 0.55, 1.18, 0.88, 1.58, 1.18, 0.34);
      addTier(0.89, 1.38, 0.78, 0.62, 1.12, 0.92, 0.42);
      labels.push({ pos: [0, 1.92, 0], text: 'TIERED PAVILION ROOF APEX' });
      labels.push({ pos: [1.95, -0.45, 1.48], text: 'PROPORTIONAL FLARED EAVE' });
    }

    return { verts, edges, faces, labels };
  }

  let currentGeom = buildStudyGeometry(activeStudy);

  function resizeWorkbench() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wbCanvas.clientWidth || 720;
    const h = wbCanvas.clientHeight || 420;
    wbCanvas.width = w * dpr;
    wbCanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function renderWorkbench() {
    wbAnimId = null;
    const w = wbCanvas.clientWidth || 720;
    const h = wbCanvas.clientHeight || 420;
    ctx.clearRect(0, 0, w, h);

    camYaw = targetYaw; camPitch = targetPitch; camDist = targetDist;
    const framingScale = Math.max(1, h / Math.max(1, w) * 1.12);
    const effDist = camDist * framingScale;
    const cx = Math.cos(camPitch) * Math.cos(camYaw) * effDist;
    const cy = Math.sin(camPitch) * effDist;
    const cz = Math.cos(camPitch) * Math.sin(camYaw) * effDist;
    camera.position.set(cx, cy, cz);
    camera.lookAt(...(currentGeom.meta?.recommendedCamera?.target || [0, .05, 0]));
    camera.updateMatrixWorld();

    const project = v3 => {
      const p = v3.clone().project(camera);
      return { x: (p.x * 0.5 + 0.5) * w, y: (-p.y * 0.5 + 0.5) * h, z: p.z };
    };

    // 1. Ground architectural datum grid & shadow projection
    const groundY = currentGeom.groundY ?? -1.42;
    ctx.strokeStyle = 'rgba(114, 124, 85, 0.2)';
    ctx.lineWidth = 0.8;
    for (let g = -3; g <= 3; g++) {
      const p1 = project(new THREE.Vector3(g * 0.85, groundY, -2.55));
      const p2 = project(new THREE.Vector3(g * 0.85, groundY, 2.55));
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();

      const p3 = project(new THREE.Vector3(-2.55, groundY, g * 0.85));
      const p4 = project(new THREE.Vector3(2.55, groundY, g * 0.85));
      ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
    }

    // Cast ground shadow of structural edges
    ctx.strokeStyle = 'rgba(40, 56, 45, 0.08)';
    ctx.lineWidth = 1.4;
    currentGeom.edges.forEach(e => {
      const va = currentGeom.verts[e.a];
      const vb = currentGeom.verts[e.b];
      const sa = project(new THREE.Vector3(va.x + (va.y - groundY) * 0.28, groundY, va.z + (va.y - groundY) * 0.22));
      const sb = project(new THREE.Vector3(vb.x + (vb.y - groundY) * 0.28, groundY, vb.z + (vb.y - groundY) * 0.22));
      ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y); ctx.stroke();
    });

    const projectedVerts = currentGeom.verts.map(project);

    // 2. Depth-sorted translucent architectural membrane facets
    const lightDir = new THREE.Vector3(0.55, 0.8, 0.45).normalize();
    const sortedFaces = currentGeom.faces.map(f => {
      const pts3 = f.indices.map(i => currentGeom.verts[i]);
      const center = pts3.reduce((acc, v) => acc.add(v.clone()), new THREE.Vector3()).divideScalar(pts3.length);
      const depth = center.distanceTo(camera.position);
      const u = pts3[1].clone().sub(pts3[0]);
      const v = pts3[2].clone().sub(pts3[0]);
      const normal = u.cross(v).normalize();
      const shade = Math.abs(normal.dot(lightDir));
      return { ...f, depth, shade };
    }).sort((a, b) => b.depth - a.depth);

    sortedFaces.forEach(f => {
      const pts = f.indices.map(i => projectedVerts[i]);
      const lum = Math.round(215 + f.shade * 26);
      ctx.fillStyle = f.color ? new THREE.Color(f.color).multiplyScalar(.85 + f.shade * .15).getStyle() : `rgba(${lum - 14}, ${lum - 8}, ${lum - 22}, 0.58)`;
      ctx.beginPath();
      pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.fill();
      if (f.color && f.stroke !== false) { ctx.strokeStyle = f.stroke || '#a28a5e'; ctx.lineWidth = f.width || .65; ctx.stroke(); }
    });

    // Photo-informed museum surfaces do not imply structural force paths.
    if (currentGeom.renderMode !== 'solid-illustration') currentGeom.edges.forEach(e => {
      const pa = projectedVerts[e.a];
      const pb = projectedVerts[e.b];
      ctx.beginPath();
      if (e.role === 'compression') {
        ctx.setLineDash([]);
        ctx.strokeStyle = '#28382d';
        ctx.lineWidth = showForceVectors ? 2.4 : 1.5;
      } else if (e.role === 'tension') {
        ctx.setLineDash(showForceVectors ? [4, 3] : []);
        ctx.strokeStyle = showForceVectors ? '#727c55' : '#344b3c';
        ctx.lineWidth = 1.25;
      } else {
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = 'rgba(114, 124, 85, 0.55)';
        ctx.lineWidth = 0.9;
      }
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 4. Structural Joints & Force Vector Callouts
    if (currentGeom.renderMode !== 'solid-illustration') projectedVerts.forEach(p => {
      ctx.fillStyle = '#344b3c';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (showForceVectors) {
      ctx.font = '600 12px "DM Sans", Arial, sans-serif';
      currentGeom.labels.forEach(lbl => {
        const pt = project(new THREE.Vector3(...lbl.pos));
        ctx.strokeStyle = '#727c55';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x + 16, pt.y - 14);
        ctx.lineTo(pt.x + 26, pt.y - 14);
        ctx.stroke();

        const textW = Math.min(w - 16, ctx.measureText(lbl.text).width + 12);
        const labelX = Math.max(8, Math.min(w - textW - 8, pt.x + 26));
        const labelY = Math.max(8, Math.min(h - 26, pt.y - 26));
        ctx.fillStyle = 'rgba(245, 244, 238, 0.92)';
        ctx.fillRect(labelX, labelY, textW, 22);
        ctx.strokeStyle = '#c5ccb9';
        ctx.strokeRect(labelX, labelY, textW, 22);
        ctx.fillStyle = '#28382d';
        ctx.fillText(lbl.text, labelX + 6, labelY + 15, textW - 12);
      });
    }

    wbCanvas.dataset.view = currentCameraView;
    wbCanvas.dataset.yaw = String(camYaw);
    wbCanvas.dataset.pitch = String(camPitch);
    wbCanvas.dataset.distance = String(camDist);
    wbCanvas.dataset.study = activeStudy;
  }

  function scheduleWorkbench() {
    if (document.hidden) return;
    if (prefersReducedMotion()) { if (wbAnimId) cancelAnimationFrame(wbAnimId); wbAnimId = null; renderWorkbench(); }
    else if (!wbAnimId) wbAnimId = requestAnimationFrame(renderWorkbench);
  }

  const sourceButton = document.querySelector('#wb-source-toggle');
  const sourcePanel = document.querySelector('#wb-source-panel');
  const comparison = document.querySelector('#workbench-comparison');
  function updateSourcePhoto() {
    const source = studyMetadata[activeStudy].source;
    const image = document.querySelector('#wb-source-image');
    image.width = source.width; image.height = source.height;
    image.alt = `Original ${source.title} physical model photograph from portfolio Board 17`;
    const nextSrc = `assets/${source.file}`;
    if (image.getAttribute('src') !== nextSrc) image.src = nextSrc;
    document.querySelector('#wb-source-title').textContent = source.title;
  }
  if (sourcePanel && !sourcePanel.hidden) updateSourcePhoto();
  resizeWorkbench();
  renderWorkbench();
  window.addEventListener('resize', () => { resizeWorkbench(); scheduleWorkbench(); });
  sourceButton.addEventListener('click', () => {
    const expanded = sourcePanel.hidden;
    if (expanded) updateSourcePhoto();
    sourcePanel.hidden = !expanded;
    sourceButton.setAttribute('aria-expanded', String(expanded));
    sourceButton.classList.toggle('active', expanded);
    comparison.classList.toggle('source-open', expanded);
    resizeWorkbench(); scheduleWorkbench();
  });

  // Pause 3D workbench when offscreen (Impeccable Overdrive performance rule)
  const wbObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      isInViewport = entry.isIntersecting;
      if (isInViewport) scheduleWorkbench();
    });
  }, { threshold: 0.05 });
  wbObserver.observe(wbStage);

  function updateCameraButtons() {
    document.querySelectorAll('[data-cam-view]').forEach(button => {
      const selected = button.dataset.camView === currentCameraView;
      button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected));
    });
  }
  function orbitModel(dx, dy) {
    currentCameraView = 'custom';
    targetYaw += dx * .011;
    targetPitch = Math.max(-.15, Math.min(Math.PI / 2 - .001, targetPitch + dy * .009));
    updateCameraButtons(); scheduleWorkbench();
  }
  function zoomModel(delta) { targetDist = Math.max(4.8, Math.min(14, targetDist + delta)); scheduleWorkbench(); }
  function setCamera(view) {
    currentCameraView = view;
    const recommended = currentGeom.meta?.recommendedCamera || { yaw: .72, pitch: .46, distance: 7.2 };
    targetYaw = view === 'axon' ? recommended.yaw : Math.PI / 2;
    targetPitch = view === 'plan' ? Math.PI / 2 - .001 : view === 'elevation' ? .02 : recommended.pitch;
    targetDist = recommended.distance;
    updateCameraButtons(); scheduleWorkbench();
  }
  let touchDrag = null;
  wbStage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target !== wbCanvas) return;
    touchDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, touch: event.pointerType === 'touch' };
    isDragging = !touchDrag.touch; lastX = event.clientX; lastY = event.clientY;
    wbCanvas.focus({ preventScroll: true });
    if (isDragging) wbStage.setPointerCapture?.(event.pointerId);
  });
  wbStage.addEventListener('pointermove', event => {
    if (!touchDrag || touchDrag.id !== event.pointerId) return;
    if (!isDragging && touchDrag.touch) {
      const dx = event.clientX - touchDrag.startX, dy = event.clientY - touchDrag.startY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) { touchDrag = null; return; }
      isDragging = true; wbStage.setPointerCapture?.(event.pointerId);
    }
    if (!isDragging) return;
    if (event.cancelable) event.preventDefault();
    orbitModel(event.clientX - lastX, touchDrag.touch ? 0 : event.clientY - lastY);
    lastX = event.clientX; lastY = event.clientY;
  }, { passive: false });
  function endDrag() { isDragging = false; touchDrag = null; }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => wbStage.addEventListener(type, endDrag));
  const keyboardActions = {
    ArrowLeft: () => orbitModel(-12, 0), ArrowRight: () => orbitModel(12, 0),
    ArrowUp: () => orbitModel(0, -12), ArrowDown: () => orbitModel(0, 12),
    '+': () => zoomModel(-.6), '=': () => zoomModel(-.6), '-': () => zoomModel(.6), Home: () => setCamera('axon')
  };
  wbCanvas.addEventListener('keydown', event => { if (keyboardActions[event.key]) { event.preventDefault(); keyboardActions[event.key](); } });
  const visibleActions = { 'wb-orbit-left': keyboardActions.ArrowLeft, 'wb-orbit-right': keyboardActions.ArrowRight, 'wb-orbit-up': keyboardActions.ArrowUp, 'wb-orbit-down': keyboardActions.ArrowDown, 'wb-zoom-in': keyboardActions['+'], 'wb-zoom-out': keyboardActions['-'], 'wb-reset': keyboardActions.Home };
  Object.entries(visibleActions).forEach(([id, action]) => document.getElementById(id)?.addEventListener('click', action));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (wbAnimId) cancelAnimationFrame(wbAnimId); wbAnimId = null; }
    else if (isInViewport) scheduleWorkbench();
  });
  motionPreferenceQuery.addEventListener('change', scheduleWorkbench);

  // Model selector tabs
  document.querySelectorAll('[data-model-study]').forEach(tab => {
    tab.addEventListener('click', () => {
      activeStudy = tab.dataset.modelStudy;
      document.querySelectorAll('[data-model-study]').forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', String(active));
      });
      const meta = studyMetadata[activeStudy];
      if (meta) {
        document.querySelector('#wb-principle').textContent = meta.principle;
        document.querySelector('#wb-material').textContent = meta.material;
        document.querySelector('#wb-badge').textContent = meta.badge;
      }
      if (!sourcePanel.hidden) updateSourcePhoto();
      currentGeom = buildStudyGeometry(activeStudy);
      const illustrative = activeStudy === 'museum';
      if (illustrative) showForceVectors = false;
      document.querySelector('#museum-interpretation-note').hidden = !illustrative;
      document.querySelector('#museum-source-reference').hidden = !illustrative;
      const labelButton = document.querySelector('#wb-vectors-toggle');
      if (labelButton) { labelButton.textContent = `Labels: ${showForceVectors ? 'On' : 'Off'}`; labelButton.setAttribute('aria-pressed', String(showForceVectors)); }
      setCamera('axon');
      document.dispatchEvent(new Event('portfolio:study-change'));
    });
  });

  // Presets remain stationary; only explicit input changes the camera.
  document.querySelectorAll('[data-cam-view]').forEach(button => button.addEventListener('click', () => setCamera(button.dataset.camView)));

  // Toggle force vectors & callouts
  const vecBtn = document.querySelector('#wb-vectors-toggle');
  if (vecBtn) {
    vecBtn.addEventListener('click', () => {
      showForceVectors = !showForceVectors;
      vecBtn.setAttribute('aria-pressed', String(showForceVectors));
      vecBtn.textContent = `Labels: ${showForceVectors ? 'On' : 'Off'}`;
      scheduleWorkbench();
    });
  }
})();
