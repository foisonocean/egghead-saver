const { createWriteStream, existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')

const http = require('http')

function download (lessonInfo, videoUrl) {
  if (!existsSync(resolve(__dirname, '../downloads'))) {
    mkdirSync(resolve(__dirname, '../downloads'))
  }
  const file = createWriteStream(resolve(__dirname, `../downloads/No.${lessonInfo.index + 1} ${lessonInfo.title}.mp4`))
  http.get(videoUrl, response => {
    response.pipe(file)
  })
  return new Promise(resolve => {
    file.on('finish', () => {
      file.close()
      resolve()
    })
  })
}

module.exports = download
