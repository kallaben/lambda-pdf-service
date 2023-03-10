const puppeteer = require('puppeteer');

async function lambdaHandler(event, context) {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        headless: true,
        dumpio: true, // pass chrome logs to output, helps a lot if launch fails
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();
    let extractedText = '';
    try {
        await page.goto(event.url, {
            waitUntil: 'networkidle0',
            timeout: 10 * 1000,
        });
        extractedText = await page.$eval('*', (el) => el.innerText);
    } finally {
        await page.close();
        await browser.close();
    }
    return extractedText;
}

module.exports = { handler: lambdaHandler };