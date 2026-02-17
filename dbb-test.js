const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  const url = 'https://momomo-agent.github.io/gen-ui-demo/';
  const out = '/Users/kenefe/clawd/dbb-shots';

  const { mkdirSync } = require('fs');
  mkdirSync(out, { recursive: true });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(out, '01-landing.png') });
  console.log('01 landing done');

  const intents = [
    { text: '点个拿铁', file: '02-latte.png' },
    { text: '点外卖', file: '03-food.png' },
    { text: '明天天气怎么样', file: '04-weather.png' },
    { text: '帮我订个会议室', file: '05-meeting.png' },
  ];

  for (const { text, file } of intents) {
    await page.fill('input', text);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(out, file), fullPage: true });
    console.log(`${file} done`);
  }

  await browser.close();
  console.log('all done');
})();
