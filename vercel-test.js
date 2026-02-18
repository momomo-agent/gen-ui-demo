const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('https://intentos-genui-demo.vercel.app', { waitUntil: 'networkidle' });
  console.log('=== LANDING ===');
  console.log(await page.textContent('body'));
  
  // Test input
  await page.fill('input', '点个拿铁');
  await page.click('button[type="submit"]');
  
  // Wait for response
  await page.waitForTimeout(5000);
  
  console.log('\n=== AFTER SUBMIT ===');
  console.log(await page.textContent('body'));
  
  console.log('\n=== ERRORS ===');
  errors.forEach(e => console.log(e));
  
  await page.screenshot({ path: '/Users/kenefe/clawd/dbb-shots/vercel-test.png', fullPage: true });
  await browser.close();
})();
