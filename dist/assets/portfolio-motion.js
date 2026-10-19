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
  document.querySelector('.wordmark')?.addEventListener('click', () => {
    groups.filter(group => group.kind === 'hero' || group.kind === 'logo').forEach(play);
  });
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

  preference.addEventListener('change', () => {
    active.forEach(animation => animation.cancel()); active.clear();
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
})();
