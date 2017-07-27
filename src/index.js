const yargs = require('yargs')

const { exit, exitWithError } = require('./exit')
const getCourseInfo = require('./course-info-analyzer')
const getDownloadUrl = require('./download-analyzer')
const download = require('./downloader')

;(async function () {
  const argv = yargs
    .locale('en')
    .usage('Usage: $0 [COMMAND] [--OPTIONS] URL')
    .example('$0 \'https://egghead.io/lessons/abc\'')
    .alias('h', 'help')
    .help()
    .alias('v', 'version')
    .version()
    .argv

  if (argv._.length > 1) {
    console.error('\x1b[43m\x1b[41m%s\x1b[0m', 'Can only hava one url.')
    await exitWithError()
  } else if (argv._.length === 0) {
    console.error('\x1b[43m\x1b[41m%s\x1b[0m', 'Must have one url.')
    await exitWithError()
  }

  const lessonUrl = argv._[0]

  if (!/^(http:\/\/|https:\/\/)?egghead\.io\/lessons\/.+$/ig.test(lessonUrl)) {
    console.error('\x1b[43m\x1b[41m%s\x1b[0m', 'The url is invalid.')
    await exitWithError()
  }

  console.log('Fetching the course info...')
  const listOfCourseInfo = await getCourseInfo(lessonUrl)

  console.log('\nCourse analyze complete:')
  console.log('\x1b[36m%s\x1b[0m', listOfCourseInfo.map(info => info.title).join('\n'))
  console.log('\x1b[35m%s\x1b[0m', `Total ${listOfCourseInfo.length} lessons\n`)

  for (let i = 0; i < listOfCourseInfo.length; ++i) {
    const info = listOfCourseInfo[i]
    const name = `NO.${info.index + 1} ${info.title}`
    console.log(`Start ayalyze \`${name}\``)
    const url = await getDownloadUrl(info.url)
    if (url == null) {
      console.error('\x1b[31m%s\x1b[0m', `Can't get download url of ${name}, skip it...`)
    } else {
      console.log(`Url is \`${url}\``)
      console.log(`Start downloading \`${name}\``)
      await download(info, url)
      console.log(`Download complete: \`${name}\`\n`)
    }
  }
  console.log('👍 All completed.')
  await exit()
})()
