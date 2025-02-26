function moveRight () {
    if (getValueFromMaze(position_x + 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x + 1
        drawMaze()
    }
}
function shuffle (array: number[][]) {
    let shuffled_array: number[][] = []
    for (let index = 0; index <= array.length - 1; index++) {
        shuffled_array.push(array[index])
    }
    array = []
    while (shuffled_array.length > 0) {
        array.unshift(shuffled_array.removeAt(randint(0, shuffled_array.length - 1)))
    }
    return array
}
function moveUp () {
    if (getValueFromMaze(position_x, position_y - 1) == 0) {
        basic.pause(200)
        position_y = position_y - 1
        drawMaze()
    }
}
function setSize () {
    height = randint(5, 7) * difficulty
    width = randint(5, 7) * difficulty
    if (height % 2 == 0) {
        height += 1
    }
    if (width % 2 == 0) {
        width += 1
    }
}
function outputMazeToSerial () {
    for (let i = 0; i <= width - 1; i++) {
        mazeline = ""
        for (let j = 0; j <= height - 1; j++) {
            mazeline = "" + mazeline + maze[i][j]
        }
        serial.writeLine(mazeline)
    }
}
function getValueFromMaze (x: number, y: number) {
    if (maze[x] && maze[x][y] != undefined) {
        return maze[x][y]
    }
    return 1
}
input.onButtonPressed(Button.A, function () {
    if (!(playing) && last_score) {
        basic.showString("" + (last_score))
    }
})
function createMaze (w: number, h: number) {
    possible_directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
    ]
    maze = []
    for (let k = 0; k <= w - 1; k++) {
        maze[k] = []
        for (let l = 0; l <= h - 1; l++) {
            maze[k][l] = 1
        }
    }
    // Initialize the stack with the starting position
    stack = [[0, 0]]
    maze[0][0] = 0
    while (stack.length > 0) {
        x = stack[stack.length - 1][0]
        y = stack[stack.length - 1][1]
        stack.pop()
        possible_directions = shuffle(possible_directions)
        for (let chosenDirection of possible_directions) {
            // Move two steps in the x direction
            chooseX = x + chosenDirection[0] * 2
            // Move two steps in the y direction
            chooseY = y + chosenDirection[1] * 2
            // Check if the new position is within bounds and is a wall
            if (chooseX >= 0 && chooseX < maze[0].length && chooseY >= 0 && chooseY < maze.length && maze[chooseY][chooseX] == 1) {
                maze[y + chosenDirection[1]][x + chosenDirection[0]] = 0
                maze[chooseY][chooseX] = 0
                // Push the new cell onto the stack
                stack.push([chooseX, chooseY])
            }
        }
    }
}
function moveDown () {
    if (getValueFromMaze(position_x, position_y + 1) == 0) {
        basic.pause(200)
        position_y = position_y + 1
        drawMaze()
    }
}
function gameOver () {
    end_time = input.runningTime()
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Chase), music.PlaybackMode.InBackground)
    playing = false
    last_score = Math.ceil(height * width * (difficulty * 4) / ((end_time - start_time) / 1000))
    basic.showIcon(IconNames.Heart)
    basic.pause(200)
    basic.clearScreen()
    basic.showString("" + (last_score))
}
input.onButtonPressed(Button.AB, function () {
    if (playing) {
        playing = false
        led.stopAnimation()
        basic.clearScreen()
    } else {
        setSize()
        createMaze(width, height)
        position_x = 0
        position_y = 0
        led.stopAnimation()
        basic.clearScreen()
        drawMaze()
        playing = true
        start_time = input.runningTime()
    }
})
function drawMaze () {
    gridRow = Math.max(2 - position_y, 0)
    gridCol = Math.max(2 - position_x, 0)
    row = Math.max(position_y - 2, 0)
    col = Math.max(position_x - 2, 0)
    for (let m = 0; m <= 4; m++) {
        for (let n = 0; n <= 4; n++) {
            plotAtValue = 1
            if (m >= gridRow && n >= gridCol) {
                plotAtValue = getValueFromMaze(col + n - gridCol, row + m - gridRow)
            }
            if (plotAtValue == undefined) {
                plotAtValue = 1
            }
            if (plotAtValue && plotAtValue != 0) {
                led.plot(n, m)
            } else {
                led.unplot(n, m)
            }
        }
    }
}
input.onButtonPressed(Button.B, function () {
    if (!(playing)) {
        difficulty += 1
        if (difficulty > 9) {
            difficulty = 1
        }
        basic.showNumber(difficulty)
    }
})
function moveLeft () {
    if (getValueFromMaze(position_x - 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x - 1
        drawMaze()
    }
}
function checkTilt () {
    xTilt = input.rotation(Rotation.Roll)
    yTilt = input.rotation(Rotation.Pitch)
    if (xTilt > 10) {
        moveRight()
    } else {
        if (xTilt < -10) {
            moveLeft()
        }
    }
    if (yTilt < -10) {
        moveUp()
    } else {
        if (yTilt > 10) {
            moveDown()
        }
    }
}
let yTilt = 0
let xTilt = 0
let plotAtValue = 0
let col = 0
let row = 0
let gridCol = 0
let gridRow = 0
let start_time = 0
let end_time = 0
let chooseY = 0
let chooseX = 0
let y = 0
let x = 0
let stack: number[][] = []
let possible_directions: number[][] = []
let last_score = 0
let maze: number[][] = []
let mazeline = ""
let width = 0
let height = 0
let position_y = 0
let position_x = 0
let playing = false
let difficulty = 0
difficulty = 4
playing = false
basic.forever(function () {
    if (playing) {
        led.toggle(2, 2)
        checkTilt()
        if (position_x == width - 1 && position_y == height - 1) {
            gameOver()
        }
    }
})
