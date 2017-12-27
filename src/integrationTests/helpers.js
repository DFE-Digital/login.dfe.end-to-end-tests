const { pass, fail } = require('./logger');

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

module.exports = {
  doStep,
};
