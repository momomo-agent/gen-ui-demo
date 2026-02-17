const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('https://momomo-agent.github.io/gen-ui-demo/', { waitUntil: 'networkidle' });
  
  // Type and submit
  await page.fill('input', '点个拿铁');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  
  // Check what's on page
  const text = await page.textContent('body');
  console.log('=== PAGE TEXT ===');
  console.log(text);
  console.log('=== ERRORS ===');
  errors.forEach(e => console.log(e));
  
  await page.screenshot({ path: '/Users/kenefe/clawd/dbb-shots/debug.png', fullPage: true });
  await browser.close();
})();
