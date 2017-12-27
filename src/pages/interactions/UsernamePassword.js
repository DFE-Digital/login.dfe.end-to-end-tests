const PageObject = require('./../PageObject');

class UsernamePassword extends PageObject {
  constructor(page) {
    super(page);
  }

  async enterUsername(username) {
    await this.page.type('#username', username);
  }

  async enterPassword(password) {
    await this.page.type('#password', password);
  }

  async clickSignIn() {
    await this.page.click('.button');
  }
}

module.exports = UsernamePassword;
