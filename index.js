const puppeteer = require('puppeteer');

// This is the AWS Lambda handler function that will be called when the Lambda function is invoked
exports.handler = async (event) => {
    // Create a new browser instance using Puppeteer
    const browser = await puppeteer.launch();

    // Create a new page in the browser
    const page = await browser.newPage();

    // Add a <style> tag to the page that defines the new font
    await page.addStyleTag({
        content: `
      @font-face {
        font-family: 'YourFont';
        src: url('fonts/your-font-file.ttf');
      }
    `,
    });

    // Set the HTML content of the page to the Pug template that you want to use to generate the PDF
    await page.setContent(`
    doctype html
    html
      head
        title 我的 Pug 模板
      body
        h1 这是一个 Pug 模板
        p 这是一些文字在 Pug 模板中
        p
          font-family='YourFont'
          这是一些文字在自定义字体中
  `);

    // Generate the PDF from the page
    const pdf = await page.pdf();

    // Close the browser instance
    await browser.close();

    // Return the PDF as the result of the Lambda function, along with the correct HTTP headers
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/pdf',
        },
        body: pdf.toString('base64'),
        isBase64Encoded: true,
    };
};