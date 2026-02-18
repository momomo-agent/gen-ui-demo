const { chromium } = require('playwright');
const path = require('path');
const { mkdirSync } = require('fs');

(async () => {
  const outDir = '/Users/kenefe/clawd/dbb-shots/video';
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 900, height: 700 },
    recordVideo: { dir: outDir, size: { width: 900, height: 700 } },
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);

  async function send(text, waitMs = 7000) {
    await page.fill('input[type="text"], input:not([type="radio"])', text);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(waitMs);
  }

  await send('点个拿铁');
  await send('帮我订外卖');
  await send('明天天气怎么样');
  await send('帮我订个会议室');

  await page.waitForTimeout(1000);
  await context.close();
  await browser.close();

  // Print where Playwright saved the video.
  const videos = context._videos || [];
  console.log('video dir:', outDir);
})();
