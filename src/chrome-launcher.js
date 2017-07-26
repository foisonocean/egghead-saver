const launcher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')

let chrome = null

async function getChrome () {
  if (chrome == null) {
    chrome = await launcher.launch({
      chromeFlags: ['--headless', '--disable-gpu']
    })
  }
  return chrome
}

async function chromeLauncher () {
  const chrome = await getChrome()
  const { port } = chrome

  return new Promise((resolve, reject) => {
    CDP.New(
      { port },
      (err, target) => {
        if (err) {
          reject(err)
        } else {
          CDP(
            {
              port,
              target
            },
            async client => {
              const { Network, Page } = client
              await Promise.all([
                Network.enable(),
                Page.enable()
              ])

              resolve(client)
            }
          )
        }
      }
    )
  })
}

module.exports = chromeLauncher
