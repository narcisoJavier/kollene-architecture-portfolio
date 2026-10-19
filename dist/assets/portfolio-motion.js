(() => {
  'use strict';
  const preference = window.portfolioMotion;
  const ease = 'cubic-bezier(.16,1,.3,1)';
  const timings = {
    spatial: { duration: 740, stagger: 85 },
    drafting: { duration: 620, stagger: 75 },
    rise: { duration: 720, stagger: 90 }
  };
  const active = new Set();
  const owners = new WeakMap();
  const groups = [];
  let observer;

  function cancelElement(element) {
    (owners.get(element) || []).forEach(animation => { animation.cancel(); active.delete(animation); });
    owners.delete(element);
    element.style.removeProperty('opacity');
  }

  function animate(element, frames, options) {
    const animation = element.animate(frames, { easing: ease, fill: 'both', ...options });
    active.add(animation);
    const owned = owners.get(element) || [];
    owned.push(animation); owners.set(element, owned);
    animation.finished.then(() => {
      animation.cancel(); active.delete(animation);
      const remaining = (owners.get(element) || []).filter(item => item !== animation);
      if (remaining.length) owners.set(element, remaining); else owners.delete(element);
    }).catch(() => {});
    if (document.hidden) animation.pause();
    return animation;
  }

  function frames(style, index, image) {
    const transform = style === 'spatial'
      ? image ? 'perspective(850px) translateX(18px) scale(.985) rotateY(-2deg)' : `translate(${index % 2 ? 18 : -18}px,14px) scale(.985)`
      : style === 'drafting' ? image ? 'translateX(20px) scale(1.02)' : 'translateX(-24px)'
      : image ? 'scale(1.025)' : 'translateY(18px)';
    return [{ opacity: 0, transform }, { opacity: 1, transform: 'none' }];
  }

  function drawingRule(parent) {
    if (!parent) return null;
    const rule = document.createElement('span');
    rule.className = 'motion-rule'; rule.setAttribute('aria-hidden', 'true');
    parent.appendChild(rule);
    return rule;
  }

  function play(group) {
    if (document.hidden) return false;
    group.items.forEach(cancelElement);
    group.done = true;
    if (preference.matches || !Element.prototype.animate) return true;
    const timing = timings[group.style];
    group.items.forEach((element, index) => {
      element.style.removeProperty('opacity');
      animate(element, element.classList.contains('motion-rule') ? [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }] : frames(group.style, index, element.matches('img,figure,.workbench-stage')), { duration: timing.duration, delay: index * timing.stagger });
    });
    const end = timing.duration + Math.max(0, group.items.length - 1) * timing.stagger;
    const emphasis = group.root.querySelector('.motion-emphasis') || (group.kind === 'hero' ? group.root.querySelector('.hero-actions .button > span') : null);
    if (emphasis) {
      cancelElement(emphasis);
      animate(emphasis, emphasis.classList.contains('motion-emphasis')
        ? [{ opacity: 0 }, { opacity: .8, offset: .45 }, { opacity: 0 }]
        : [{ transform: 'none' }, { transform: 'translateX(3px)', offset: .5 }, { transform: 'none' }], { duration: 650, delay: end + 180 });
    }
    return true;
  }

  function addGroup(root, items, style, kind) {
    const group = { root, items: [...items].filter(Boolean), style, kind, done: false };
    if (!group.items.length) return;
    root.dataset.motionStyle = style;
    group.items.forEach(element => { element.dataset.motionDuration = timings[style].duration; });
    groups.push(group);
  }

  const hero = document.querySelector('.hero');
  if (hero) addGroup(hero, [hero.querySelector('.hero-role'), ...hero.querySelectorAll('.reveal-line'), hero.querySelector('.hero-intro'), hero.querySelector('.hero-skills'), hero.querySelector('.hero-actions'), hero.querySelector('.manor-backdrop-stack'), hero.querySelector('#portrait-toggle'), hero.querySelector('.hero-portrait figcaption')], 'spatial', 'hero');
  const logo = document.querySelector('.brand-logo');
  if (logo) addGroup(logo, logo.querySelectorAll('.logo-line'), 'spatial', 'logo');
  document.querySelectorAll('.section-heading,.making-heading,.contact-heading,.featured-study-heading').forEach(root => addGroup(root, root.children, 'spatial', 'heading'));
  const aboutTitle = document.querySelector('.about-copy h2');
  if (aboutTitle) addGroup(aboutTitle, [aboutTitle], 'spatial', 'heading');
  document.querySelectorAll('.project-card,.archive-card').forEach(root => {
    const image = root.querySelector('.project-image,.archive-thumb');
    const copy = root.querySelector('.project-info,.archive-body');
    if (copy && !copy.parentElement.classList.contains('motion-mask')) {
      const mask = document.createElement('div'); mask.className = 'motion-mask';
      copy.before(mask); mask.appendChild(copy);
    }
    if (image && !image.querySelector('.motion-emphasis')) {
      const overlay = document.createElement('span');
      overlay.className = 'motion-emphasis'; overlay.setAttribute('aria-hidden', 'true'); image.appendChild(overlay);
    }
    addGroup(root, [root.querySelector('.project-image > img,.archive-thumb > img'), copy, drawingRule(image)], 'drafting', 'card');
  });
  const workbench = document.querySelector('#studio-workbench');
  if (workbench) addGroup(workbench, [workbench.querySelector('.workbench-stage'), workbench.querySelector('.workbench-meta'), drawingRule(workbench.querySelector('.workbench-stage'))], 'rise', 'museum');

  function observe() {
    observer?.disconnect();
    groups.forEach(group => group.items.forEach(cancelElement));
    if (preference.matches || !Element.prototype.animate || !window.IntersectionObserver) return;
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const group = groups.find(item => item.root === entry.target);
      if (group && !group.root.hidden && !group.done && play(group)) observer.unobserve(entry.target);
    }), { threshold: .12 });
    groups.forEach(group => {
      if (group.done || group.root.hidden) return;
      group.items.forEach(element => { element.style.opacity = '0'; });
      observer.observe(group.root);
    });
  }

  document.addEventListener('portfolio:filter-change', () => {
    groups.filter(group => group.kind === 'card').forEach(group => {
      group.items.forEach(cancelElement);
      const emphasis = group.root.querySelector('.motion-emphasis');
      if (emphasis) cancelElement(emphasis);
      observer?.unobserve(group.root);
      if (group.root.hidden) return;
      const rect = group.root.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) play(group);
      else { group.done = false; if (!preference.matches) { group.items.forEach(element => { element.style.opacity = '0'; }); observer?.observe(group.root); } }
    });
  });
  document.addEventListener('portfolio:study-change', () => {
    const group = groups.find(item => item.kind === 'museum');
    if (group) play(group);
  });

  // The outer figure owns its entrance; only the two inner images crossfade.
  const portrait = document.querySelector('#portrait-toggle');
  function showPortrait(alternate) {
    if (!portrait) return;
    portrait.dataset.alternate = String(alternate);
    portrait.setAttribute('aria-pressed', String(alternate));
    portrait.setAttribute('aria-label', alternate ? 'Show everyday portrait and warm light' : 'Show hard-hat portrait and midday light');
    const normal = portrait.querySelector('.portrait-normal');
    const hardhat = portrait.querySelector('.portrait-hardhat');
    normal.setAttribute('aria-hidden', String(alternate));
    hardhat.setAttribute('aria-hidden', String(!alternate));
    normal.alt = alternate ? '' : 'Kollene Aika Leyson';
    hardhat.alt = alternate ? 'Kollene Aika Leyson wearing a white hard hat' : '';
    document.dispatchEvent(new CustomEvent('portfolio:portrait-state', { detail: { alternate } }));
  }
  portrait?.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') showPortrait(true); });
  portrait?.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') showPortrait(false); });
  portrait?.addEventListener('click', () => showPortrait(portrait.dataset.alternate !== 'true'));
  showPortrait(false);

  const archIntro = document.querySelector('#arch-intro');
  const archFrame = document.querySelector('#arch-intro-frame');
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) return false;
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  async function hideArchIntro() {
    if (!archIntro || archIntro.hidden) return;
    if (canTransitionDisplay()) {
      archIntro.hidden = true;
    } else {
      archIntro.setAttribute('data-closing', '');
    }
    const anims = archIntro.getAnimations();
    if (anims.length > 0) {
      await Promise.race([
        Promise.allSettled(anims.map(a => a.finished)),
        new Promise(r => setTimeout(r, 800))
      ]);
    }
    if (archIntro.hasAttribute('data-closing')) {
      archIntro.removeAttribute('data-closing');
      archIntro.hidden = true;
    }
  }

  function playArchIntro() {
    if (!archIntro || !archFrame) return;
    if (preference.matches || !Element.prototype.animate) {
      archIntro.hidden = true;
      return;
    }
    archIntro.removeAttribute('data-closing');
    archIntro.hidden = false;
    archFrame.getAnimations().forEach(a => a.cancel());

    // 1. Trace arch frame and door panel strokes
    const strokes = archIntro.querySelectorAll('.arch-intro-stroke');
    strokes.forEach((stroke, idx) => {
      stroke.getAnimations().forEach(a => a.cancel());
      const drawAnim = stroke.animate(
        [{ strokeDashoffset: 900 }, { strokeDashoffset: 0 }],
        { duration: 760, delay: idx * 55, easing: ease, fill: 'forwards' }
      );
      active.add(drawAnim);
    });

    // Subtle door leaf surface fill appears once strokes settle
    const fills = archIntro.querySelectorAll('.arch-door-fill');
    fills.forEach(fill => {
      fill.getAnimations().forEach(a => a.cancel());
      const fillAnim = fill.animate(
        [{ opacity: 0 }, { opacity: 0.72 }],
        { duration: 420, delay: 420, easing: ease, fill: 'forwards' }
      );
      active.add(fillAnim);
    });

    // 2. Trace each letter of "Kollene Aika Leyson." below the portal
    const nameTrace = archIntro.querySelector('.arch-name-trace');
    const nameSvg = archIntro.querySelector('#arch-name-svg');
    if (nameTrace) {
      nameTrace.getAnimations().forEach(a => a.cancel());
      const traceAnim = nameTrace.animate(
        [
          { strokeDashoffset: 620, fill: 'rgba(40,56,45,0)' },
          { strokeDashoffset: 0, fill: 'rgba(40,56,45,0)', offset: 0.68 },
          { strokeDashoffset: 0, fill: 'rgba(40,56,45,1)' }
        ],
        { duration: 1080, delay: 140, easing: ease, fill: 'forwards' }
      );
      active.add(traceAnim);
    }

    // 3. Swing both arched doors open in 3D space
    const leftDoor = archIntro.querySelector('#arch-door-left');
    const rightDoor = archIntro.querySelector('#arch-door-right');
    if (leftDoor && rightDoor) {
      leftDoor.getAnimations().forEach(a => a.cancel());
      rightDoor.getAnimations().forEach(a => a.cancel());
      const openLeft = leftDoor.animate(
        [
          { transform: 'rotateY(0deg)' },
          { transform: 'rotateY(-108deg)' }
        ],
        { duration: 820, delay: 860, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
      );
      const openRight = rightDoor.animate(
        [
          { transform: 'rotateY(0deg)' },
          { transform: 'rotateY(108deg)' }
        ],
        { duration: 820, delay: 860, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
      );
      active.add(openLeft);
      active.add(openRight);
    }

    // Fade and glide the traced name downward as the camera steps into the open doorway
    if (nameSvg) {
      nameSvg.getAnimations().forEach(a => a.cancel());
      const nameExit = nameSvg.animate(
        [
          { opacity: 1, transform: 'translateY(0) scale(1)' },
          { opacity: 0, transform: 'translateY(22px) scale(1.08)' }
        ],
        { duration: 480, delay: 1120, easing: ease, fill: 'forwards' }
      );
      active.add(nameExit);
    }

    // 4. Camera enters through the open portal doors into the hero section
    const flyThrough = archFrame.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.06)', opacity: 1, offset: 0.56 },
        { transform: 'scale(16)', opacity: 0 }
      ],
      { duration: 1920, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
    );
    active.add(flyThrough);

    setTimeout(() => {
      groups.filter(group => group.kind === 'hero' || group.kind === 'logo').forEach(play);
      hideArchIntro();
    }, 1340);
  }

  document.querySelector('.wordmark')?.addEventListener('click', () => {
    playArchIntro();
  });

  preference.addEventListener('change', () => {
    active.forEach(animation => animation.cancel()); active.clear();
    if (preference.matches && archIntro) archIntro.hidden = true;
    groups.forEach(group => { group.items.forEach(cancelElement); group.done = false; });
    observe();
  });
  document.addEventListener('visibilitychange', () => {
    active.forEach(animation => document.hidden ? animation.pause() : animation.play());
    if (!document.hidden && !preference.matches) groups.filter(group => !group.done && !group.root.hidden).forEach(group => {
      observer?.unobserve(group.root); observer?.observe(group.root);
    });
  });
  window.addEventListener('pagehide', () => { active.forEach(animation => animation.cancel()); active.clear(); });
  observe();
  playArchIntro();
})();
