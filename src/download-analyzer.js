const { resolve: pathResolve } = require('path')
const { readFileSync } = require('fs')

const chromeLauncher = require('./chrome-launcher')

async function getDownloadUrl (lessonUrl) {
  const client = await chromeLauncher()
  const { Page, Runtime } = client

  // Use `tubeninja.net` to analyze download url
  await Page.navigate({
    url: `https://www.tubeninja.net/?url=${encodeURIComponent(lessonUrl)}`
  })

  return new Promise(resolve => {
    Page.loadEventFired(() => {
      const getDownloadUrlScript = readFileSync(pathResolve(__dirname, '../scripts/get-download-url.js'), 'utf-8')

      // NOTE: Use magic delay seconds to make sure the ayalyze is done.
      setTimeout(async () => {
        const messageFormChrome = await Runtime.evaluate({
          expression: getDownloadUrlScript
        })

        client.close()
        resolve(messageFormChrome.result.value)
      }, 3000)
    })
  })
}

module.exports = getDownloadUrl
