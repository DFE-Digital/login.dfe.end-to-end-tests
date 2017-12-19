const { pass, fail, newScenario } = require('./logger');
const config = require('./../config');
const puppeteer = require('puppeteer');

const UsernamePassword = require('./../pages/interactions/UsernamePassword');
const MyServices = require('./../pages/portal/MyServices');

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

    const usernamePassword = new UsernamePassword(page);

    await doStep('enter email address', async () => {
      await usernamePassword.enterUsername(config.credentials.username);
    });

    await doStep('enter password', async () => {
      await usernamePassword.enterPassword(config.credentials.password);
    });

    await doStep('click sign-in', async () => {
      await usernamePassword.clickSignIn();
      await page.waitForNavigation();
    });

    const myServices = new MyServices(page);

    await doStep('check back at portal logged in', async () => {
      if (!page.url().startsWith(config.portal.url)) {
        throw new Error(`Expected ${page.url()} to start with portal url (${config.portal.url})`);
      }

      const signedInAs = await myServices.signedInAs();
      if (signedInAs !== config.credentials.displayName) {
        throw new Error(`Expected to be signed in as ${config.credentials.displayName} but was signed in as ${signedInAs}`);
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
