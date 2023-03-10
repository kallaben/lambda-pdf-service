const chromium = require("chrome-aws-lambda");
const fs = require("fs");

async function lambdaHandler(event, context) {
  console.log("Started");

  // Create a new browser instance using Puppeteer
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    dumpio: true, // pass chrome logs to output, helps a lot if launch fails
    args: chromium.args,
  });

  console.log("Launched browser");

  // Create a new page in the browser
  const page = await browser.newPage();
  console.log("Started new page");

  const html = fs.readFileSync(`${__dirname}/index.html`, "utf8");

  // Set the HTML content of the page to the Pug template that you want to use to generate the PDF
  await page.setContent(event.html || html);
  await page.emulateMediaType("screen");
  console.log("Set content");

  // Generate the PDF from the page
  const pdf = await page.pdf({
    // path: `${__dirname}/output/${new Date().toISOString()}.pdf`,
    format: "A4",
    printBackground: true,
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
  });

  console.log("Generated PDF");

  // Close the browser instance
  await browser.close();
  console.log("Closed browser");

  const base64String = pdf.toString("base64");

  console.log(`Length of base64string ${base64String.length}`);
  console.log(`base64string: ${base64String}`);

  return base64String;
}

module.exports = { handler: lambdaHandler };
