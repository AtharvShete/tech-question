import puppeteer from 'puppeteer';

const groupName = 'Test Group';
const contactNames = 'Arjun Arvind BE22 IITM';

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      slowMo: 25
    });

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();

    await page.goto('https://web.whatsapp.com', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('div[title="Menu"]', { timeout: 100000 });

    await page.click('div[title="Menu"]');

    await page.waitForSelector('div[aria-label="New group"]', { timeout: 30000 });
    await page.click('div[aria-label="New group"]');

    await page.waitForSelector('input[placeholder="Search name or number"]', { timeout: 30000 });
    await page.type('input[placeholder="Search name or number"]', contactNames);

    await page.waitForSelector(`span[title="${contactNames}"]`, { timeout: 30000 });
    await page.click(`span[title="${contactNames}"]`);

    await page.keyboard.press('Enter');

    await page.waitForSelector('div[contenteditable="true"]', { timeout: 10000 });
    await page.type('div[contenteditable="true"]', groupName);

    await page.keyboard.press('Enter');

    console.log('WhatsApp group created successfully!');

    // Close the browser after completion
    await browser.close();
  } catch (error) {
    console.error('Error creating WhatsApp group:', error);
    process.exit(1); // Exit with non-zero code to indicate failure
  }
})();
