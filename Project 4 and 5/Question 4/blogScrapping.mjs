import puppeteer from 'puppeteer-core';
import ObjectsToCsv from 'objects-to-csv';

async function scrapeBlogsAndSaveToCSV() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
    });
    const page = await browser.newPage();
    await page.goto('https://blog.ankitsanghvi.in/');

    const blogs = await page.evaluate(() => {
        const blogPosts = document.querySelectorAll('article.post-card');

        const data = [];
        blogPosts.forEach((post) => {
            const title = post.querySelector('h2.post-card-title').textContent.trim();
            const tag = post.querySelector('div.post-card-primary-tag').textContent.trim();
            const imageUrl = post.querySelector('img.post-card-image').src;
            const date = post.querySelector('time').getAttribute('datetime');
            const readTime = post.querySelector('.post-card-byline-date').textContent.trim().split('•')[1].trim();
            const excerpt = post.querySelector('.post-card-excerpt').textContent.trim();

            data.push({
                title,
                tag,
                imageUrl,
                date,
                readTime,
                excerpt,
            });
        });

        return data;
    });

    // Convert the extracted data to CSV format
    const csv = new ObjectsToCsv(blogs);

    // Save the CSV file to disk
    await csv.toDisk('./blogPosts.csv', { append: false });

    console.log('Scraped blog data saved to blogPosts.csv');

    await browser.close();
}

scrapeBlogsAndSaveToCSV().catch((error) => console.error('Error scraping and saving blogs:', error));