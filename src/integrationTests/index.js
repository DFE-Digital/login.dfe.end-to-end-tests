const puppeteer = require('puppeteer');
const oidcLogin = require('./oidcLogin');

const run = async () => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();

    await oidcLogin(page);
  } finally {
    await browser.close();
  }
};

run().then(() => {
  console.log('Completed successfully');
}).catch((e) => {
  if (e.isStepFailure) {
    console.error('Did not complete successfully. See above details.');
  } else {
    console.error(e);
  }
  process.exit(-1);
});
