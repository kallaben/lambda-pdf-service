const puppeteer = require("puppeteer");
const fs = require("fs");

async function lambdaHandler(event, context) {
  console.log("Started");

  // Create a new browser instance using Puppeteer
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    headless: true,
    dumpio: true, // pass chrome logs to output, helps a lot if launch fails
    args: [
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--disk-cache-size=33554432',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
      '--single-process',
    ],
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
