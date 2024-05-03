import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function scrapeBlogsAndSaveToCSV() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    });
    const page = await browser.newPage();
    await page.goto('https://blog.ankitsanghvi.in/');

    const blogs = await page.evaluate(() => {
        const blogPosts = Array.from(document.querySelectorAll('article.post-card'));

        return blogPosts.map(post => {
            const titleElement = post.querySelector('h2.post-card-title');
            const tagElement = post.querySelector('div.post-card-primary-tag');
            const imageElement = post.querySelector('img.post-card-image');
            const dateElement = post.querySelector('time');
            const readTimeElement = post.querySelector('.post-card-byline-date');
            const excerptElement = post.querySelector('.post-card-excerpt');

            return {
                title: titleElement ? titleElement.textContent.trim() : '',
                tag: tagElement ? tagElement.textContent.trim() : '',
                imageUrl: imageElement ? imageElement.src : '',
                date: dateElement ? dateElement.getAttribute('datetime') : '',
                readTime: readTimeElement ? readTimeElement.textContent.trim().split('•')[1].trim() : '',
                excerpt: excerptElement ? excerptElement.textContent.trim() : '',
            };
        });
    });

    await browser.close();

    // Convert the extracted data to CSV format
    const csvData = blogs.map(blog => `${blog.title},${blog.tag},${blog.imageUrl},${blog.date},${blog.readTime},${blog.excerpt}`).join('\n');

    // Save the CSV data to a file
    fs.writeFileSync('./blogPosts.csv', 'Title,Tag,ImageUrl,Date,ReadTime,Excerpt\n' + csvData);

    console.log('Scraped blog data saved to blogPosts.csv');
}

scrapeBlogsAndSaveToCSV().catch((error) => console.error('Error scraping and saving blogs:', error));
