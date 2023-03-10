const { handler } = require("./index");
const fs = require("fs");

async function executeHandler() {
  const pdfData = await handler({});
  const buffer = Buffer.from(pdfData.body, "base64");
  await fs.promises.writeFile("test.pdf", buffer);
}

executeHandler().then(() => process.exit());
