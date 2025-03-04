// Maze game, created by Jesper Jeeninga 2025
// For Mark, Frank en Laura

/**
 * A function to shuffle the given array using blockcode
 * 
 * First it will copy they array into a variabele shuffled_array
 * Then it will empty the original array
 * Finally it will randomly select one value from the suffled_array and move it to the new array
 * 
 */
function shuffle (array: number[][]) {
    // Create a copy of the array
    let shuffled_array: number[][] = []
    for (let index = 0; index <= array.length - 1; index++) {
        shuffled_array.push(array[index])
    }
    // Empty original
    array = []
    // While we still have items in our shuffled_array, pick a random one and add it to the array
    while (shuffled_array.length > 0) {
        array.unshift(shuffled_array.removeAt(randint(0, shuffled_array.length - 1)))
    }
    return array
}

/**
 * A function to create a semi-random maze size depending on difficulty
 * It will check if the width or height is even and make it uneven
 * An uneven value makes sure there are no walls against the boundaries
 */
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

/**
 * A function to draw the maze to the serial output.
 * This is for debugging purposes and not actively used in the game
 */
function outputMazeToSerial () {
    for (let i = 0; i <= width - 1; i++) {
        mazeline = ""
        for (let j = 0; j <= height - 1; j++) {
            mazeline = "" + mazeline + maze[i][j]
        }
        serial.writeLine(mazeline)
    }
}

/**
 * Provide an x and y to return the value of the maze on x,y
 * If the value is out of bounds, it will return 1 (wall)
 */
function getValueFromMaze (x: number, y: number) {
    if (maze[x] && maze[x][y] != undefined) {
        return maze[x][y]
    }
    return 1
}

/**
 * Show the last score of button.A press
 */
input.onButtonPressed(Button.A, function () {
    if (!(playing) && last_score) {
        basic.showString("" + (last_score))
    }
})

/**
 * Function to create a maze
 * It generates a maze using a randomized depth-first search algorithm. 
 * It initializes a grid of specified width (w) and height (h) filled with walls (represented by 1). 
 * Starting from the top-left corner, it explores random (shuffled) possible directions, carving paths (setting cells to 0) by moving two steps in a chosen direction and marking the intermediate cell as a path. 
 * The stack is used to keep track of the current position in the maze and the cells that need to be explored next, allowing the algorithm to backtrack to previous positions when it reaches a dead end.
 */
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

/**
 * Function when the game is over
 * We play a victory sound, we'll stop playing and calculate a score based on time and difficulty
 */
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

/**
 * A+B Starts the game.
 * It resets the maze and puts the player on 0,0 (top left)
 */
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

/**
 * This will draw the 5x5 part of the maze where the player is in the center of
 * It will decide what coordinates to plot given the players position.
 */
function drawMaze () {
    for (let m = 0; m <= 4; m++) {
        for (let n = 0; n <= 4; n++) {
            plotAtValue = getValueFromMaze(position_x - 2 + n, position_y - 2 + m)
            if (plotAtValue && plotAtValue != 0) {
                led.plot(n, m)
            } else {
                led.unplot(n, m)
            }
        }
    }
}
/**
 * Button B is used to change the difficulty between 1 and 9
 */
input.onButtonPressed(Button.B, function () {
    if (!(playing)) {
        difficulty += 1
        if (difficulty > 9) {
            difficulty = 1
        }
        basic.showNumber(difficulty)
    }
})

/**
 * Move function, pause and change the players position if the maze has a path (0) on the given position
 * And redraw the maze
 */
function moveLeft () {
    if (getValueFromMaze(position_x - 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x - 1
        drawMaze()
    }
}
/**
 * Move function, pause and change the players position if the maze has a path (0) on the given position
 * And redraw the maze
 */
function moveRight() {
    if (getValueFromMaze(position_x + 1, position_y) == 0) {
        basic.pause(200)
        position_x = position_x + 1
        drawMaze()
    }
}
/**
 * Move function, pause and change the players position if the maze has a path (0) on the given position
 * And redraw the maze
 */
function moveUp() {
    if (getValueFromMaze(position_x, position_y - 1) == 0) {
        basic.pause(200)
        position_y = position_y - 1
        drawMaze()
    }
}
/**
 * Move function, pause and change the players position if the maze has a path (0) on the given position
 * And redraw the maze
 */
function moveDown() {
    if (getValueFromMaze(position_x, position_y + 1) == 0) {
        basic.pause(200)
        position_y = position_y + 1
        drawMaze()
    }
}

/**
 * This function will check the tilt (rotation) of the microbit
 * Whenever we tilt it more then 10 degrees to one side, we'll change the player's position
 * This allows steering the player using the fitbit's tilt.
 */
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
/**
 * Toggeling the center led each gameloop will allow it to 'flicker' making a distinction with the walls.
 * Whenever the position reaches the bottom right of the maze, we end the game.
 */
basic.forever(function () {
    if (playing) {
        led.toggle(2, 2)
        checkTilt()
        if (position_x == width - 1 && position_y == height - 1) {
            gameOver()
        }
    }
})
