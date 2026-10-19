// Run: node check.cjs [http://127.0.0.1:4173]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/UZNIR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const baseURL = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const output = path.join(__dirname, 'tmp');
const errors = [];
let assertions = 0;
function check(value, message) { assertions++; assert.ok(value, message); }
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const cache = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
  const cachedShell = fs.readdirSync(cache).filter(name => name.startsWith('chromium_headless_shell-')).sort().reverse()[0];
  const executablePath = fs.existsSync(chromium.executablePath()) ? undefined : path.join(cache, cachedShell, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.locator('.project-card').first().waitFor();
    check((await page.title()).includes('Kollene Aika Leyson'), 'Portfolio title identifies Kollene');
    const dist = path.join(__dirname, 'dist');
    const assets = files(dist);
    for (const file of assets) {
      const relative = path.relative(dist, file).split(path.sep).map(encodeURIComponent).join('/');
      const response = await context.request.get(`${baseURL}/${relative}`);
      check(response.ok(), `Asset responds successfully: ${relative}`);
      check((await response.body()).length > 0, `Asset is nonempty: ${relative}`);
    }
    await page.locator('img').evaluateAll(async images => {
      await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
    });
    check(await page.locator('img').evaluateAll(images => images.every(image => image.naturalWidth > 0)), 'All initial images decode');

    const expectedFilters = { all: 6, residential: 1, hospitality: 1, 'mixed-use': 1, public: 2, transportation: 1 };
    for (const [filter, count] of Object.entries(expectedFilters)) {
      const button = page.locator(`.filter[data-filter="${filter}"]`);
      await button.click();
      check(await page.locator('.project-card:visible').count() === count, `${filter} filter shows ${count} cards`);
      check(await button.getAttribute('aria-pressed') === 'true', `${filter} exposes selected state`);
      check(await page.locator('.filter[aria-pressed="true"]').count() === 1, 'Exactly one filter selected');
      check((await page.locator('#filter-status').textContent()).startsWith(String(count)), `${filter} announces its count`);
    }
    await page.locator('.filter[data-filter="all"]').click();

    const expectedProjects = {
      casa: ['Casa Adinerado', 6], manor: ['Siete Lagos Manor', 9], sunbeam: ['The Sunbeam Gallery', 11],
      sanyata: ['Sanyata', 12], cityhall: ['New Manila City Hall', 15], airport: ['Amianan', 16]
    };
    for (const [key, [title, board]] of Object.entries(expectedProjects)) {
      const opener = page.locator(`.project-card [data-project="${key}"]`).first();
      await opener.click();
      check(await page.locator('#project-dialog').isVisible(), `${title} opens its dialog`);
      check(await page.locator('#project-title').textContent() === title, `${title} dialog title is correct`);
      check(await page.locator('#project-dialog').evaluate(dialog => dialog.contains(document.activeElement)), `${title} takes keyboard focus`);
      await page.keyboard.press('Tab');
      check(await page.locator('#project-dialog').evaluate(dialog => dialog.contains(document.activeElement)), `${title} retains keyboard focus within dialog`);
      await page.keyboard.press('Escape');
      check(!(await page.locator('#project-dialog').isVisible()), `${title} closes with Escape`);
      check(await opener.evaluate(element => element === document.activeElement), `${title} returns focus to opener`);
      await opener.click();
      await page.locator('#project-dialog [data-board]').click();
      check(!(await page.locator('#project-dialog').isVisible()), `${title} closes before opening board viewer`);
      check(await page.locator('#portfolio-dialog').isVisible(), `${title} opens portfolio viewer`);
      check(await page.locator('#board-select').inputValue() === String(board), `${title} maps to original board ${board}`);
      check((await page.locator('#board-image').getAttribute('src')).endsWith(`page-${String(board).padStart(2, '0')}.webp`), `${title} board image matches selection`);
      await page.locator('#board-image').evaluate(image => image.decode());
      check(await page.locator('#board-image').evaluate(image => image.naturalWidth > 0), `${title} original board decodes`);
      await page.keyboard.press('Escape');
      check(!(await page.locator('#portfolio-dialog').isVisible()), `${title} board viewer closes with Escape`);
    }

    await page.locator('.archive-cta [data-board]').click();
    check(await page.locator('#board-select option').count() === 20, 'Archive offers all 20 original boards');
    check(await page.locator('#previous-board').isDisabled(), 'Previous is disabled at page 1');
    await page.locator('#portfolio-dialog .close-dialog').focus();
    await page.keyboard.press('ArrowLeft');
    check(await page.locator('#board-select').inputValue() === '1', 'Left arrow clamps at page 1');
    await page.locator('#next-board').click();
    check(await page.locator('#board-select').inputValue() === '2', 'Next advances to page 2');
    await page.locator('#previous-board').click();
    check(await page.locator('#board-select').inputValue() === '1', 'Previous returns to page 1');
    await page.locator('#board-select').selectOption('20');
    check(await page.locator('#next-board').isDisabled(), 'Next is disabled at page 20');
    await page.locator('#portfolio-dialog .close-dialog').focus();
    await page.keyboard.press('ArrowRight');
    check(await page.locator('#board-select').inputValue() === '20', 'Right arrow clamps at page 20');
    await page.locator('#previous-board').click();
    check(await page.locator('#board-select').inputValue() === '19', 'Previous returns from page 20');
    await page.locator('#next-board').click();
    check(await page.locator('#board-select').inputValue() === '20', 'Next advances to page 20');
    await page.keyboard.press('Escape');

    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo(0, 0));
      check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal overflow at ${width}px`);
      if (width === 375) {
        const menu = page.locator('.menu-toggle');
        await menu.click();
        check(await menu.getAttribute('aria-expanded') === 'true', 'Mobile menu announces open state');
        check(await page.locator('#navigation').isVisible(), 'Mobile navigation is visible when open');
        await page.locator('#navigation a[href="#work"]').click();
        check(await menu.getAttribute('aria-expanded') === 'false', 'Mobile menu closes after section navigation');
        check(!(await page.locator('#navigation').isVisible()), 'Mobile navigation hides after selection');
        await menu.click();
        await page.keyboard.press('Escape');
        check(await menu.getAttribute('aria-expanded') === 'false', 'Escape closes mobile menu');
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      await page.screenshot({ path: path.join(output, width === 1440 ? 'qa-desktop.png' : 'qa-mobile.png'), fullPage: true });
    }
    check(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'Reduced motion preference is enabled');
    check(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto'), 'Reduced motion disables smooth scrolling');
    check(await page.locator('.hero-image').evaluate(image => getComputedStyle(image).animationName === 'none'), 'Reduced motion disables hero animation');
    check(fs.readFileSync(path.join(dist, 'styles.css'), 'utf8').includes('prefers-reduced-motion'), 'Reduced motion rule remains in stylesheet');
    check(errors.length === 0, `No browser errors or failed requests: ${errors.join('; ')}`);
    console.log(`PASS: ${assertions} assertions; ${assets.length} local files; 6 filters; 6 project dialogs; 20 boards; 1440px/375px layouts.`);
    console.log(`Screenshots: ${path.join(output, 'qa-desktop.png')} and ${path.join(output, 'qa-mobile.png')}`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
