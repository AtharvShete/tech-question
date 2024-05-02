import puppeteer from "puppeteer-core";
import fs from "fs";
import ObjectToCSV from "objects-to-csv";

const blogScrapping = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to the blog website
        await page.goto('https://blog.ankitsanghvi.in/');

        // Wait for the blog post titles to load
        await page.waitForSelector('.post-title');

        // Extract blog titles and URLs
        const blogData = await page.evaluate(() => {
            const titles = Array.from(document.querySelectorAll('.post-title'));
            return titles.map(titleElement => {
                const title = titleElement.innerText.trim();
                const url = titleElement.querySelector('a').href;
                return { title, url };
            });
        });

        // Write data to CSV file
        const csvFilePath = 'blogs.csv';
        const csv = new ObjectsToCsv(blogData);
        await csv.toDisk(csvFilePath);
        console.log(`Blogs scraped successfully. Data saved to ${csvFilePath}`);
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        await browser.close();
    }
}