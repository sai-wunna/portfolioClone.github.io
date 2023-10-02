document.addEventListener('DOMContentLoaded', function () {
  const getNode = (node) => document.querySelector(node)
  const container_box = getNode('.container_box')
  const prevBtn = getNode('#prevBtn')
  const nextBtn = getNode('#nextBtn')
  const BtnBox = getNode('.button_box')
  const openGameConsole = getNode('#game_start_modal_btn')
  const closeGameConsole = getNode('#close_modal')
  const gameConsole = getNode('.modal_container')

  let currentIndex = 0
  let reloadWindow = true
  // preload

  const showBox = (index) => {
    container_box.style.marginTop = `-${index * 100}vh`
  }
  const hideButton = (currentIndex) => {
    nextBtn.style.display = 'block'
    reloadWindow = false
    if (currentIndex === 0) reloadWindow = true
    else if (currentIndex === 4) nextBtn.style.display = 'none'
  }

  prevBtn.addEventListener('click', () => {
    if (reloadWindow) {
      window.location.reload()
      return
    }
    currentIndex = Math.max(currentIndex - 1, 0)
    hideButton(currentIndex)
    showBox(currentIndex)
  })

  nextBtn.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, 4)
    hideButton(currentIndex)
    showBox(currentIndex)
  })

  openGameConsole.addEventListener('click', () => {
    BtnBox.style.display = 'none'
    gameConsole.style.display = 'flex'
  })
  closeGameConsole.addEventListener('click', () => {
    BtnBox.style.display = 'block'
    gameConsole.style.display = 'none'
  })

  // tic_tac_toe start
  const learningLevel = getNode('#learningLevel')
  const boxWrapper = getNode('#game_key_wrapper')
  const winnerBox = getNode('.winnerBox')
  const restartGameBtn = getNode('#restart_game')
  const keyHolder = {
    game_key_1: false,
    game_key_2: false,
    game_key_3: false,
    game_key_4: false,
    game_key_5: false,
    game_key_6: false,
    game_key_7: false,
    game_key_8: false,
    game_key_9: false,
  }
  const userMoves = []
  const computerMoves = []
  let gameOver = false
  let winner
  const wonPatternsToCheckWinner = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ]
  const learningPatterns = []
  // to remove the hover effect for the taken ones
  const nextTurnShowMaker = () => {
    for (key in keyHolder) {
      if (keyHolder[key]) {
        getNode(`#${key}`).classList.remove(`next_one`)
      }
    }
  }

  const computerMove = () => {
    const availableMoves = Object.keys(keyHolder).filter(
      (one) => !keyHolder[one]
    )
    const smartKeys = [1, 3, 7, 9]
    if (!gameOver) {
      let winningKey
      let key
      for (let pattern of learningPatterns) {
        const [a, b, c] = pattern
        if (
          computerMoves.includes(a) &&
          computerMoves.includes(b) &&
          availableMoves.includes(`game_key_${c}`)
        ) {
          key = c
          winningKey = c
        } else if (
          computerMoves.includes(b) &&
          computerMoves.includes(c) &&
          availableMoves.includes(`game_key_${a}`)
        ) {
          key = a
          winningKey = a
        } else if (
          computerMoves.includes(a) &&
          computerMoves.includes(c) &&
          availableMoves.includes(`game_key_${b}`)
        ) {
          key = b
          winningKey = b
        } else if (
          userMoves.includes(a) &&
          userMoves.includes(b) &&
          availableMoves.includes(`game_key_${c}`)
        ) {
          key = c
        } else if (
          userMoves.includes(b) &&
          userMoves.includes(c) &&
          availableMoves.includes(`game_key_${a}`)
        ) {
          key = a
        } else if (
          userMoves.includes(a) &&
          userMoves.includes(c) &&
          availableMoves.includes(`game_key_${b}`)
        ) {
          key = b
        }
      }
      if (winningKey) {
        key = winningKey
      }
      if (!key && userMoves.length === 1) {
        key = userMoves[0] === 5 ? 1 : 5
      }
      if (!key && userMoves.length === 2) {
        if (userMoves.includes(2) && userMoves.includes(4)) {
          key = 1
        } else if (userMoves.includes(6) && userMoves.includes(8)) {
          key = 9
        } else if (userMoves.includes(1) && userMoves.includes(9)) {
          key = 2
        } else if (userMoves.includes(3) && userMoves.includes(7)) {
          key = 8
        } else if (userMoves.includes(4) && userMoves.includes(8)) {
          key = 7
        } else if (userMoves.includes(1) && userMoves.includes(8)) {
          key = 7
        } else if (userMoves.includes(3) && userMoves.includes(8)) {
          key = 7
        } else if (userMoves.includes(2) && userMoves.includes(6)) {
          key = 3
        } else if (userMoves.includes(2) && userMoves.includes(9)) {
          key = 3
        } else if (userMoves.includes(2) && userMoves.includes(7)) {
          key = 1
        }
      }
      if (!key) {
        for (let smKey of smartKeys) {
          if (availableMoves.includes(`game_key_${smKey}`)) {
            key = smKey
          }
        }
      }
      // this take place when all conditions are not met / when no corner so
      //  average after 6 moves and once a match mostly maybe ever
      if (!key) {
        const randomNumber = Math.floor(Math.random() * availableMoves.length)
        key = parseInt(availableMoves[randomNumber].split('_')[2])
      }
      computerMoves.push(key)
      keyHolder[`game_key_${key}`] = 2
      getNode(`#game_key_${key}`).classList.add(`active_2`)
    }
    nextTurnShowMaker()
  }

  const isPatternLearned = (pattern) => {
    for (const learningPattern of learningPatterns) {
      if (arraysEqual(pattern, learningPattern)) {
        return true
      }
    }
    return false
  }
  const arraysEqual = (newPattern, patterns) => {
    if (newPattern.length !== patterns.length) return false
    for (let i = 0; i < newPattern.length; i++) {
      if (newPattern[i] !== patterns[i]) return false
    }
    return true
  }

  const endGameChecker = (moves) => {
    for (const pattern of wonPatternsToCheckWinner) {
      const [a, b, c] = pattern
      if (moves.includes(a) && moves.includes(b) && moves.includes(c)) {
        winner = userMoves.includes(a) ? 'You' : 'Me, '
        gameOver = true
        if (!isPatternLearned(pattern)) {
          learningPatterns.push(pattern)
        }
        learningLevel.value = learningPatterns.length
        learningLevel.style.background = `rgb(255, ${
          255 - learningPatterns.length * 25
        }, ${255 - learningPatterns.length * 25})`
        for (key in pattern) {
          getNode(`#game_key_${pattern[key]}`).classList.add('bingo')
        }
      }
    }
  }

  boxWrapper.addEventListener('click', (e) => {
    if (gameOver) return
    const key = e.target
    if (!Object.keys(keyHolder).some((one) => one.toString() === key.id)) return
    if (keyHolder[key.id]) return
    userMoves.push(parseInt(key.id.split('_')[2]))
    keyHolder[key.id] = 1
    getNode(`#${key.id}`).classList.add(`active_1`)
    endGameChecker(userMoves)
    if (gameOver) {
      winnerBox.textContent = `${winner} win`
    }
    if (userMoves.length === 5 && !gameOver) {
      winnerBox.textContent = `Draw`
      gameOver = true
      return
    }
    computerMove()
    endGameChecker(computerMoves)
    if (gameOver) {
      winnerBox.textContent = `${winner} win`
    }
  })

  restartGameBtn.addEventListener('click', () => {
    if (!gameOver) return
    for (key in keyHolder) {
      keyHolder[key] = false
      getNode(`#${key}`).classList.remove(`active_1`)
      getNode(`#${key}`).classList.remove(`active_2`)
      getNode(`#${key}`).classList.add(`next_one`)
      getNode(`#${key}`).classList.remove(`bingo`)
    }
    userMoves.splice(0)
    computerMoves.splice(0)
    gameOver = false
    winner = ''
    winnerBox.textContent = '. . . .'
  })
  // tic tac toe end
})
