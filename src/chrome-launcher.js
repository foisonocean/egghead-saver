const launcher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')

async function chromeLauncher () {
  const chrome = await launcher.launch({
    chromeFlags: ['--headless', '--disable-gpu']
  })
  const { port } = chrome

  return new Promise(resolve => {
    CDP(
      { port },
      async client => {
        const { Network, Page } = client
        await Promise.all([
          Network.enable(),
          Page.enable()
        ])

        resolve(client)
      }
    )
  })
}

module.exports = chromeLauncher
