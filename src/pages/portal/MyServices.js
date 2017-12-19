const PageObject = require('./../PageObject');

class MyServices extends PageObject {
  constructor(page) {
    super(page);
  }

  async signedInAs() {
    const signedInAsText = await this.page.$eval('p.signed-in-as', e => e.innerText);
    if (signedInAsText.startsWith('You are signed in as ')) {
      return signedInAsText.substr(21);
    }
    return signedInAsText;
  }
}

module.exports = MyServices;
