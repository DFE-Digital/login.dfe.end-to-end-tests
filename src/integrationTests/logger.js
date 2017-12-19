const Green = 'green';
const Red = 'red';

const writeStatus = (label, color, message) => {
  let labelColor;
  let messageColor;
  if (color === Red) {
    labelColor = '\x1b[41m\x1b[30m';
    messageColor = '\x1b[31m';
  } else {
    labelColor = '\x1b[42m\x1b[30m';
    messageColor = '\x1b[32m';
  }

  console.log(`  ${labelColor} ${label} \x1b[49m\x1b[39m ${messageColor} ${message}\x1b[39m`);
  // process.stdout.write(`  ${labelColor} ${label} \x1b[49m\x1b[39m`);
  // process.stdout.write(`${messageColor} ${message}\x1b[39m\x1b[0m\n`);
};


const pass = (step) => {
  writeStatus('PASS', Green, step);
};

const fail = (step, reason) => {
  writeStatus('FAIL', Red, step);
  if (reason) {
    console.log(`  \x1b[31m${reason}\x1b[39m`);
  }
};

const newScenario = (scenario) => {
  console.log(`\x1b[1m\x1b[34m${scenario}\x1b[22m\x1b[39m`);
};

module.exports = {
  pass,
  fail,
  newScenario,
};
