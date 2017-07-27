const { resolve: pathResolve } = require('path')
const { readFileSync } = require('fs')

const { chromeLauncher } = require('./chrome-launcher')

const MAX_RETRIED_TIMES = 3
const DELAY_SECONDS_BY_RETRY = {
  1: 500,
  2: 2000,
  3: 5000
}

async function getDownloadUrl (lessonUrl, retriedTimes = 1) {
  if (retriedTimes > MAX_RETRIED_TIMES) {
    return undefined
  }
  const client = await chromeLauncher()
  const { Page, Runtime } = client

  // Use `tubeninja.net` to analyze download url
  await Page.navigate({
    url: `https://www.tubeninja.net/?url=${encodeURIComponent(lessonUrl)}`
  })

  return new Promise((resolve, reject) => {
    Page.loadEventFired(() => {
      const getDownloadUrlScript = readFileSync(pathResolve(__dirname, '../scripts/get-download-url.js'), 'utf-8')

      // NOTE: Use magic delay seconds to make sure the ayalyze is done.
      const delaySeconds = DELAY_SECONDS_BY_RETRY[retriedTimes]
      if (delaySeconds == null) {
        reject(new Error(`Invalid delay seconds. Retried times is ${retriedTimes}, but got ${delaySeconds} in \`DELAY_SECONDS_BY_RETRY\``), 'download-analyzer.js')
      }
      setTimeout(async () => {
        const messageFormChrome = await Runtime.evaluate({
          expression: getDownloadUrlScript
        })

        client.close()
        if (messageFormChrome.result.value != null) {
          resolve(messageFormChrome.result.value)
        } else {
          try {
            const downloadUrl = await getDownloadUrl(lessonUrl, retriedTimes + 1)
            resolve(downloadUrl)
          } catch (err) {
            reject(err)
          }
        }
      }, delaySeconds)
    })
  })
}

module.exports = getDownloadUrl
