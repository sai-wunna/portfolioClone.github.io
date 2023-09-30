document.addEventListener('DOMContentLoaded', function () {
  const getNode = (node) => document.querySelector(node)
  const container_box = getNode('.container_box')
  const prevBtn = getNode('#prevBtn')
  const nextBtn = getNode('#nextBtn')

  let currentIndex = 0
  // preload
  prevBtn.style.display = 'none'

  const showBox = (index) => {
    container_box.style.marginTop = `-${index * 100}vh`
  }
  const hideButton = (currentIndex) => {
    nextBtn.style.display = 'block'
    prevBtn.style.display = 'block'
    if (currentIndex === 0) prevBtn.style.display = 'none'
    else if (currentIndex === 4) nextBtn.style.display = 'none'
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0)
    hideButton(currentIndex)
    showBox(currentIndex)
  })

  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, 4)
    hideButton(currentIndex)
    showBox(currentIndex)
  })
})
