import puppeteer from 'puppeteer';

const groupName = 'Test Group';
const contactNames = ['Alice', 'Bob', 'Charlie'];

(async (groupName, contactNames) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  try {
    await page.goto('https://web.whatsapp.com', { waitUntil: 'load', timeout: 100000 });
    await page.setViewport({width: 1080, height: 1024});

    
    await page.waitForSelector('.item[data-icon="menu"]', { timeout: 100000 });
    await page.click('.item[data-icon="menu"]');

    await page.waitForSelector('div[title="New group"]', { timeout: 100000 });
    await page.click('div[title="New group"]');

    await page.waitForSelector('input[title="Search contacts"]', { timeout: 100000 });

    for (let i = 1; i < contactNames.length; i++) {
      await page.type('input[title="Search contacts"]', contactNames[i]);
      await page.waitForSelector('.matched-text', { timeout: 100000 });
      await page.click('.matched-text');
      await page.keyboard.press('Enter');
      await page.type('input[title="Search contacts"]', '');
    }

    await page.waitForSelector('span[data-icon="forward-arrow"]', { timeout: 100000 });
    await page.click('span[data-icon="forward-arrow"]');

    await page.waitForSelector('div[title="Enter group subject"]', { timeout: 100000 });
    await page.type('div[title="Enter group subject"]', groupName);

    await page.waitForSelector('span[data-icon="check"]', { timeout: 100000 });
    
    console.log('WhatsApp group created successfully!');

  } catch (error) {
    console.error('Error creating WhatsApp group:', error);
  }finally{
    await browser.close();
  }


})();