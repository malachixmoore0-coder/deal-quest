// Usage: start a server for dist/, then run: node tests/smoke.cjs http://localhost:4173/
const { chromium } = require('playwright');

(async () => {
  const base = process.argv[2] || 'http://localhost:4173/';
  const browser = await chromium.launch();
  const errors = [];
  const shots = process.env.SHOTS;

  for (const [width, height, scale, label] of [[1280, 850, 1, 'desktop'], [390, 800, 3, 'phone'], [1200, 800, 2, 'large']]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(`${label}: ${e.message}`));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(`${label}: ${r.status()} ${r.url()}`); });
    await page.goto(base);
    await page.waitForTimeout(1200);
    const video = await page.locator('.map video').evaluate((v) => ({ src: v.getAttribute('src'), ready: v.readyState, time: v.currentTime, error: v.error && v.error.message }));
    const fonts = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px Silkscreen') && document.fonts.check('600 16px Nunito'); });
    console.log(label, JSON.stringify(video), 'fonts', fonts);
    if (shots) await page.screenshot({ path: `${shots}/${label}-home.png` });

    for (const hash of ['c-3', 'l-3-2', 't-0', 'arcade', 'walk', 'swipe', 'more', 'file', 'tools', 'numbers', 'terms', 'cards', 'sources']) {
      await page.evaluate((h) => { location.hash = h; }, hash);
      await page.waitForTimeout(120);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 0) errors.push(`${label}: ${hash} overflows by ${overflow}px`);
    }

    await page.evaluate(() => { location.hash = 't-0'; });
    await page.waitForTimeout(100);
    for (let i = 0; i < 8; i += 1) {
      const question = await page.locator('.pr').innerText();
      const answer = await page.evaluate((q) => COURSE[0].test.find((x) => x.q === q).o[0], question);
      await page.locator('.opt', { hasText: answer }).first().click();
      await page.click('#nx');
    }
    console.log(label, 'boss:', await page.locator('h1').innerText());

    await page.evaluate(() => { location.hash = 'walk'; });
    await page.waitForTimeout(100);
    for (let i = 0; i < 3; i += 1) await page.locator(`.hot[data-i="${i}"]`).click();
    await page.click('[data-c="Negotiate"]');
    await page.evaluate(() => { location.hash = 'swipe'; });
    await page.waitForTimeout(100);
    for (let i = 0; i < 6; i += 1) await page.click('#of');
    console.log(label, 'swipe:', await page.locator('h1').innerText());

    await page.reload();
    await page.waitForTimeout(300);
    console.log(label, 'saved XP:', await page.evaluate(() => xp()));
    await context.close();
  }

  await browser.close();
  console.log('errors', errors);
  process.exitCode = errors.length ? 1 : 0;
})();
