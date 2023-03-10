const puppeteer = require("puppeteer");
const fs = require("fs");

async function lambdaHandler(event, context) {
  // Create a new browser instance using Puppeteer
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    headless: true,
    dumpio: true, // pass chrome logs to output, helps a lot if launch fails
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Create a new page in the browser
  const page = await browser.newPage();

  const html = fs.readFileSync(`${__dirname}/index.html`, "utf8");

  // Set the HTML content of the page to the Pug template that you want to use to generate the PDF
  await page.setContent(event.html || html);
  await page.emulateMediaType("screen");

  // Generate the PDF from the page
  const pdf = await page.pdf({
    path: `${__dirname}/output/${new Date().toISOString()}.pdf`,
    format: "A4",
    printBackground: true,
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
  });

  // Close the browser instance
  await browser.close();

  const base64String = pdf.toString("base64");

  console.log(`Length of base64string ${base64String.length}`);

  return base64String;
}

module.exports = { handler: lambdaHandler };
