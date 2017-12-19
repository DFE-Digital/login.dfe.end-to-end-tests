const { pass, fail, newScenario } = require('./logger');
const config = require('./../config');
const puppeteer = require('puppeteer');

const doStep = async (name, fn) => {
  try {
    await fn();
    pass(name);
  } catch (e) {
    fail(name, e.message);

    const failError = new Error(e);
    failError.isStepFailure = true;
    throw failError;
  }
};

const oidcLogin = async (page) => {
  try {
    newScenario('OIDC Login');

    await doStep('navigate to portal', async () => {
      await page.goto(config.portal.url);
    });

    await doStep('enter email address', async () => {
      await page.type('#username', config.credentials.username);
    });

    await doStep('enter password', async () => {
      await page.type('#password', config.credentials.password);
    });

    await doStep('click sign-in', async () => {
      await page.click('.button');
      await page.waitForNavigation();
    });

    await doStep('check back at portal logged in', async () => {
      const url = page.url();
      if (!url.startsWith(config.portal.url)) {
        throw new Error(`Expected ${url} to start with portal url (${config.portal.url})`);
      }

      const signedInAs = await page.$eval('p.signed-in-as', e => e.innerText);
      if (signedInAs !== `You are signed in as ${config.credentials.displayName}`) {
        throw new Error(`Expected ${signedInAs} to be 'You are signed in as ${config.credentials.displayName}'`);
      }
    });
  } finally {
    console.log('  ');
  }
};

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
