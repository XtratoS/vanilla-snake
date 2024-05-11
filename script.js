// const GRID_COUNT = 20;
// const CELL_TYPES = {
//   "EMPTY": 1,
//   "SNAKE": 2,
//   "FOOD": 3
// }
// const DIRECTIONS = [
//   "ArrowUp",
//   "ArrowRight",
//   "ArrowDown",
//   "ArrowLeft"
// ]
// const VALID_DIRECTIONS = {
//   "ArrowUp": ["ArrowRight", "ArrowLeft"],
//   "ArrowDown": ["ArrowRight", "ArrowLeft"],
//   "ArrowRight": ["ArrowUp", "ArrowDown"],
//   "ArrowLeft": ["ArrowUp", "ArrowDown"],
// }

// const abortController = new AbortController();
// const Grid = [];
// let Snake = [[GRID_COUNT/2, GRID_COUNT/2]]
// let latestInput = "ArrowRight";
// let gameInterval;

// const onKeyPressHandleEnter = (ev) => {
//   const { key } = ev;
//   // console.log(ev);
//   if (key === "Enter") {
//     startGame(Grid, Snake);
//     // console.log("start game");
//     // abortController.abort();
//   }
//   if (DIRECTIONS.includes(key) && VALID_DIRECTIONS[latestInput].includes(key)) {
//     latestInput = key;
//   }
// }

// const startGame = (grid, snake) => {
//   initializeGrid(grid, snake);
//   gameInterval = setInterval(() => {
//     moveSnake(grid, snake, latestInput);
//     updateGrid(grid, snake);
//     drawGrid(grid);
//   }, 100);
// }

// const createFood = (grid, snake) => {
//   let randomX = snake[0][1];
//   let randomY = snake[0][0];
//   while (snake.map(cell => cell[1]).includes(randomX)) {
//     randomX = Math.floor(Math.random() * GRID_COUNT);
//   }
//   while (snake.map(cell => cell[0]).includes(randomY)) {
//     randomY = Math.floor(Math.random() * GRID_COUNT);
//   }
//   grid[randomY][randomX] = CELL_TYPES.FOOD;
//   console.log(JSON.stringify(grid));
// }

// const eatFood = (grid, snake) => {
//   const snakeHeadY = snake[0][0];
//   const snakeHeadX = snake[0][1];
//   if (!(snakeHeadY in grid)) return false;
//   const snakeHeadPositionHasFood = grid[snakeHeadY][snakeHeadX] === CELL_TYPES.FOOD;
//   return snakeHeadPositionHasFood;
// }

// const clamp = (num, min, max) => {
//   return Math.min(Math.max(num, min), max);
// }

// const endGame = (grid, snake) => {
//   initializeGrid(grid, snake);
//   clearInterval(gameInterval);
//   latestInput = "ArrowRight";
//   alert("GAME OVER");
// }

// const moveSnake = (grid, snake, direction) => {
//   const motion = MotionMap[direction];
//   let snakeHead = [snake[0][0] + motion[1], snake[0][1] + motion[0]];
//   snake.unshift(snakeHead);
//   if (eatFood(grid, snake)) {
//     createFood(grid, snake);
//   } else {
//     const poppedSnakeCell = snake.pop();
//     grid[poppedSnakeCell[0]][poppedSnakeCell[1]] = CELL_TYPES.EMPTY;
//   }
//   // console.log(snakeHead);
//   if (isSnakeDead(snakeHead)) {
//     endGame(grid, snake);
//   }
//   if (snakeHead[0] in grid) {
//     grid[snakeHead[0]][snakeHead[1]] = CELL_TYPES.SNAKE;
//   }
//   const snakeSet = new Set(snake.map(cell => JSON.stringify(cell)));
//   console.log(snakeSet.length, snake.length);
//   if (snakeSet.size < snake.length) {
//     endGame(grid, snake);
//   }
//   console.log(JSON.stringify(snake));
// }

// const isSnakeDead = (snakeHead) => {
//   // console.log(snakeHead);
//   for (let i=0; i<2; i++) {
//     if (snakeHead[i] < 0 || snakeHead[i] >= GRID_COUNT) {
//       return true;
//     }
//   }
//   return false;
// }

// document.addEventListener("DOMContentLoaded", () => {
//   initializeGrid(Grid, Snake);
//   document.addEventListener("keydown", onKeyPressHandleEnter, {signal: abortController.signal});
// });

// const initializeGrid = (grid, snake) => {
//   for (let y=0; y<GRID_COUNT; y++) {
//     grid[y] = [];
//     for (let x=0; x<GRID_COUNT; x++) {
//       grid[y][x] = CELL_TYPES.EMPTY;
//     }
//   }
//   snake.splice(0, snake.length);
//   snake.push([GRID_COUNT/2, GRID_COUNT/2]);
//   grid[snake[0][0]][snake[0][1]] = CELL_TYPES.SNAKE;
//   createFood(grid, snake);
// }

// const updateGrid = (grid, snake) => {
//   // for (let y=0; y<GRID_COUNT; y++) {
//   //   grid[y] = [];
//   //   for (let x=0; x<GRID_COUNT; x++) {
//   //     grid[y][x] = CELL_TYPES.EMPTY;
//   //   }
//   // }
//   // grid[snake[0][0]][snake[0][1]] = CELL_TYPES.SNAKE;
// }

// const drawGrid = (grid) => {
//   const gameBoard = document.querySelector('#game-board');
//   const newChildren = [];
//   for (let y=0; y<GRID_COUNT; y++) {
//     for (let x=0; x<GRID_COUNT; x++) {
//       const newCell = createCell(`cell-${y}-${x}`);
//       newCell.classList.add(`type-${grid[y][x]}`)
//       newChildren.push(newCell);
//     }
//   }
//   gameBoard.replaceChildren(...newChildren);
// }

const createCell = (cellId) => {
  const cellDiv = document.createElement('div');
  cellDiv.id = cellId;
  cellDiv.classList.add('game-cell');
  return cellDiv;
}

//=======================//

const CELL_CONTENT = {
  EMPTY: "EMPTY",
  SNAKE: "SNAKE",
  FOOD: "FOOD"
}

const DIRECTIONS = {
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft"
}

const MotionMap = {
  "ArrowUp": [0, -1],
  "ArrowRight": [1, 0],
  "ArrowDown": [0, 1],
  "ArrowLeft": [-1, 0],
}

const VALID_DIRECTIONS = {
  "ArrowUp": ["ArrowRight", "ArrowLeft"],
  "ArrowDown": ["ArrowRight", "ArrowLeft"],
  "ArrowRight": ["ArrowUp", "ArrowDown"],
  "ArrowLeft": ["ArrowUp", "ArrowDown"],
}

const GRID_COUNT = 40;

function main () {
  const parentDiv = document.querySelector('#game-board');
  const snake = new Snake(GRID_COUNT/2-1, GRID_COUNT/2-1);
  const world = new World(parentDiv, GRID_COUNT, snake);
  world.createFood();
  world.render();
  setTimeout(() => {
    world.start();
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

class Snake {
  constructor(x, y) {
    this.direction = DIRECTIONS.RIGHT;
    this.directionLock = false;
    this.cells = [[x, y]];
  }
  
  setDirection(dir) {
    if (this.directionLock) return;
    this.direction = dir;
    this.directionLock = true;
  }

  setWorld(world) {
    this.world = world;
  }

  getHead() {
    return this.cells[0];
  }

  getNextHead() {
    const [motionX, motionY] = MotionMap[this.direction];
    const [headX, headY] = this.getHead();
    const newHead = [headX + motionX, headY + motionY];
    return newHead;
  }

  nextMove() {
    if (this.willSnakeEatFoodNextMove()) {
      this.grow();
    } else {
      this.move();
    }
  }

  willSnakeEatFoodNextMove() {
    const nextCell = this.getNextHead();
    const nextCellContent = this.world.getCellContent(nextCell[0], nextCell[1]);
    if (nextCellContent === CELL_CONTENT.FOOD) return true;
    return false;
  }

  grow() {
    this.directionLock = false;
    const newHead = this.getNextHead();
    this.cells.unshift(newHead);
    const [x, y] = newHead;
    if (this.isDead()) {
      this.world.stop();
      return false;
    }
    this.world.setContent(x, y, CELL_CONTENT.SNAKE);
    return true;
  }

  move() {
    const grown = this.grow();
    const [x, y] = this.cells.pop();
    if (!grown) return;
    this.world.setContent(x, y, CELL_CONTENT.EMPTY);
  }

  isDead() {
    let [x ,y] = this.cells[0];
    if (x < 0 || y < 0 || x >= this.world.dimension || y >= this.world.dimension) return true;
    const snakeSet = new Set(this.cells.map(cell => JSON.stringify(cell)));
    console.log(snakeSet.size, this.cells.length);
    if (snakeSet.size < this.cells.length) {
      return true;
    }
    return false;
  }
}

const keyDownEventListener = (world, ev) => {
  const {key} = ev;
  if (VALID_DIRECTIONS[world.snake.direction].includes(key)) {
    world.snake.setDirection(key);
  }
}

class World {
  constructor(parentDiv, dimension, snake) {
    this.parentDiv = parentDiv;
    this.dimension = dimension;
    this.snake = snake;
    this.grid = [];
    this.interval = () => {};
    snake.setWorld(this);
    this.initializeGrid();
    document.addEventListener("keydown", (ev) => {keyDownEventListener(this, ev)});
  }

  initializeGrid() {
    for (let y = 0; y < this.dimension; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.dimension; x++) {
        this.grid[y][x] = CELL_CONTENT.EMPTY;
      }
    }
    for (let [x, y] of this.snake.cells) {
      this.grid[y][x] = CELL_CONTENT.SNAKE;
    }
  }

  setContent(x, y, content) {
    this.grid[y][x] = content;
  }

  getCellContent(x, y) {
    return this.grid[y][x];
  }

  createFood() {
    let randomX = this.snake.getHead()[0];
    let randomY = this.snake.getHead()[1];
    while (this.snake.cells.map(cell => cell[0]).includes(randomX)) {
      randomX = Math.floor(Math.random() * this.dimension);
    }
    while (this.snake.cells.map(cell => cell[1]).includes(randomY)) {
      randomY = Math.floor(Math.random() * this.dimension);
    }
    this.setContent(randomX, randomY, CELL_CONTENT.FOOD);
  }

  render() {
    const newChildren = [];
    for (let y = 0; y < this.dimension; y++) {
      for (let x = 0; x < this.dimension; x++) {
        const newCell = createCell(`cell-${y}-${x}`);
        newCell.classList.add(`type-${this.grid[y][x]}`);
        newChildren.push(newCell);
      }
    }
    this.parentDiv.replaceChildren(...newChildren);
  }

  start() {
    this.interval = setInterval(() => {
      if (this.snake.willSnakeEatFoodNextMove()) {
        this.snake.grow();
        this.createFood();
      } else {
        this.snake.move();
      }
      this.render();
    }, 150);
  }

  stop() {
    clearInterval(this.interval);
  }
}