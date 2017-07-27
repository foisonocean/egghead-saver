const { exitChrome } = require('./chrome-launcher')

async function exit () {
  await exitChrome()
  process.exit(0)
}

async function exitWithError () {
  await exitChrome()
  process.exit(1)
}

module.exports = {
  exit,
  exitWithError
}
