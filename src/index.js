const getCourseInfo = require('./course-info-analyzer')
const getDownloadUrl = require('./download-analyzer')
const download = require('./downloader')

const lessonUrl = 'https://egghead.io/lessons/abc'

;(async function () {
  const listOfCourseInfo = await getCourseInfo(lessonUrl)

  console.log('Course analyze complete.')
  console.log(listOfCourseInfo.map(info => info.title).join('\n'))
  console.log(`Total ${listOfCourseInfo.length} lessons`)

  for (let i = 0; i < listOfCourseInfo.length; ++i) {
    const info = listOfCourseInfo[i]
    const name = `NO.${info.index + 1} ${info.title}`
    console.log(`Start ayalyze \`${name}\``)
    const url = await getDownloadUrl(info.url)
    console.log(`Url is \`${url}\``)
    console.log(`Start downloading \`${name}\``)
    await download(info, url)
    console.log(`Download complete: \`${name}\``)
  }
  console.log('👍 All completed.')
})()
