const { newScenario } = require('./logger');
const config = require('./../config');
const { doStep } = require('./helpers');

const MyServices = require('./../pages/portal/MyServices');

const oidcLogout = async (page) => {
  try {
    newScenario('OIDC Logout');

    const myServices = new MyServices(page);

    await doStep('click sign out', async () => {
      await myServices.signout();

      await page.waitForNavigation();
    });


    await doStep('check signed out', async () => {
      if (!page.url().startsWith(`${config.portal.url}/signout/complete`)) {
        throw new Error(`Expected ${page.url()} to start with portal url (${config.portal.url}/signout/complete)`);
      }
    });
  } finally {
    console.log('  ');
  }
};

module.exports = oidcLogout;
