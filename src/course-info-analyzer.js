const { resolve: pathResolve } = require('path')
const { readFileSync } = require('fs')

const chromeLauncher = require('./chrome-launcher')

async function getCourseInfo (lessonUrl) {
  const client = await chromeLauncher()
  const { Page, Runtime } = client

  await Page.navigate({
    url: lessonUrl
  })

  return new Promise(resolve => {
    Page.loadEventFired(async () => {
      const getCourseInfoScript = readFileSync(pathResolve(__dirname, '../scripts/get-course-info.js'), 'utf-8')
      const messageFormChrome = await Runtime.evaluate({
        expression: getCourseInfoScript
      })
      const info = JSON.parse(messageFormChrome.result.value)

      client.close()
      resolve(info)
    })
  })
}

module.exports = getCourseInfo
