const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    proxy: { server: 'http://127.0.0.1:7890' },
  });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  console.log('navigating...');
  await page.goto('https://intentos-genui-demo.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('page loaded');

  // Submit intent
  await page.fill('input', '点个拿铁');
  await page.click('button[type="submit"]');
  console.log('submitted, waiting for LLM...');
  
  // Wait for OS response (loading disappears or new content appears)
  await page.waitForTimeout(8000);
  
  const text = await page.textContent('body');
  // Extract just the visible UI text
  const clean = text.replace(/self\.__next_f.*$/s, '').trim();
  console.log('\n=== PAGE ===');
  console.log(clean);
  
  console.log('\n=== ERRORS ===');
  errors.forEach(e => console.log(e));
  
  await page.screenshot({ path: '/Users/kenefe/clawd/dbb-shots/vercel-proxy.png', fullPage: true });
  console.log('\nscreenshot saved');
  await browser.close();
})();
