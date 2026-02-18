const { chromium } = require('playwright');
const path = require('path');
const { mkdirSync } = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 700 } });
  const out = '/Users/kenefe/clawd/dbb-shots';
  mkdirSync(out, { recursive: true });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(out, '01-landing.png') });
  console.log('01 landing');

  const intents = [
    { text: '点个拿铁', file: '02-latte.png', wait: 8000 },
    { text: '帮我订外卖', file: '03-food.png', wait: 8000 },
    { text: '明天天气怎么样', file: '04-weather.png', wait: 8000 },
    { text: '帮我订个会议室', file: '05-meeting.png', wait: 8000 },
  ];

  for (const { text, file, wait } of intents) {
    await page.fill('input[type="text"], input:not([type="radio"])', text);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(wait);
    await page.screenshot({ path: path.join(out, file), fullPage: true });
    console.log(file);
  }

  if (errors.length) { console.log('ERRORS:', errors); }
  else { console.log('no errors'); }
  await browser.close();
})();
