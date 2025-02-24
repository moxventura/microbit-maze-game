function right () {
    if (table.getValue(maze, position_x + 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x + 1
        drawMaze()
    }
}
function shuffle (array: any[]) {
    let tmp_directions: number[][] = []
    for (let index = 0; index <= possible_directions.length - 1; index++) {
        tmp_directions.push(possible_directions[index])
    }
    possible_directions = []
    while (tmp_directions.length > 0) {
        possible_directions.unshift(tmp_directions.removeAt(randint(0, tmp_directions.length - 1)))
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
function up () {
    if (table.getValue(maze, position_x, position_y + 1) == 0) {
        basic.pause(200)
        position_y = position_y + 1
        drawMaze()
    }
}
function left () {
    if (table.getValue(maze, position_x - 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x - 1
        drawMaze()
    }
}
input.onButtonPressed(Button.A, function () {
    if (!(playing) && last_score) {
        basic.showString("" + (last_score))
    }
})
function createMaze (cols: number, rows: number) {
    for (let i = 0; i <= rows - 1; i++) {
        maze[i] = []
        for (let j = 0; j <= cols - 1; j++) {
            maze[i][j] = 1
        }
    }
    carvePathIterative(0, 0)
}
function carvePathIterative (startX: number, startY: number) {
    // Initialize the stack with the starting position
    stack = [[startX, startY]]
    maze[startY][startX] = 0
    while (stack.length > 0) {
        x = stack[stack.length - 1][0]
        y = stack[stack.length - 1][1]
        stack.pop()
        shuffle(possible_directions)
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
    table.plotAt(
    maze,
    Math.max(2 - position_x, 0),
    Math.max(2 - position_y, 0),
    Math.max(position_x - 2, 0),
    Math.max(position_y - 2, 0),
    1
    )
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
function down () {
    if (table.getValue(maze, position_x, position_y - 1) == 0) {
        basic.pause(200)
        position_y = position_y - 1
        drawMaze()
    }
}
function checkTilt () {
    xTilt = input.rotation(Rotation.Roll)
    yTilt = input.rotation(Rotation.Pitch)
    if (xTilt < -10) {
        left()
    }
    if (xTilt > 10) {
        right()
    }
    if (yTilt < -10) {
        down()
    }
    if (yTilt > 10) {
        up()
    }
}
let yTilt = 0
let xTilt = 0
let start_time = 0
let end_time = 0
let chooseY = 0
let chooseX = 0
let last_score = 0
let width = 0
let height = 0
let position_x = 0
let position_y = 0
let maze: number[][] = []
let playing = false
let difficulty = 0
let stack: number[][] = []
let y = 0
let x = 0
let possible_directions: number[][] = []
possible_directions = [
[1, 0],
[0, 1],
[-1, 0],
[0, -1]
]
x = 0
y = 0
stack = []
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
