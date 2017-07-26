;(function () {
  const listOfLessonsTag = Array.from(document.querySelectorAll('.scroller.list a'))
  const listOfLessonTitles = listOfLessonsTag.map(a => a.querySelector('.base').innerText)
  const listOfLessonUrls = listOfLessonsTag.map(a => a.href)

  return JSON.stringify(listOfLessonsTag.map((_, index) => ({
    title: listOfLessonTitles[index],
    url: listOfLessonUrls[index],
    index
  })))
})()
