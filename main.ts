function right () {
    if (table.getValue(maze, position_x + 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x + 1
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
function gameOver () {
    end_time = input.runningTime()
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Chase), music.PlaybackMode.InBackground)
    playing = false
    last_score = Math.ceil((end_time - start_time) / 1000)
    basic.showIcon(IconNames.Heart)
    basic.pause(200)
    basic.showString("" + (last_score))
}
input.onButtonPressed(Button.AB, function () {
    if (playing) {
        playing = false
        led.stopAnimation()
        basic.clearScreen()
    } else {
        setSize()
        maze = table.createMaze(width, height)
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
    difficulty += 1
    if (difficulty > 9) {
        difficulty = 1
    }
    basic.showNumber(difficulty)
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
let last_score = 0
let width = 0
let height = 0
let position_x = 0
let position_y = 0
let maze: number[][] = []
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
