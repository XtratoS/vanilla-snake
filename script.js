const createCell = (cellId) => {
  const cellDiv = document.createElement('div');
  cellDiv.id = cellId;
  cellDiv.classList.add('game-cell');
  return cellDiv;
}

//=======================//

const GAME_STATE = {
  DEFAULT: "DEFAULT",
  ONGOING: "ONGOING",
  PAUSED: "PAUSED",
  ENDED: "ENDED"
}

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
const INPUT_BUFFER_SIZE = 3;

function main () {
  const parentDiv = document.querySelector('#game-board');
  const snake = new Snake(GRID_COUNT/2-1, GRID_COUNT/2-1);
  const world = new World(parentDiv, GRID_COUNT, snake);
  world.createFood();
  world.render();
  showOverlayMenu();
  countDown(3, () => {
    hideOverlayMenu();
    world.start();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

const keyDownEventListener = (ev, gameState) => {
  const {key} = ev;
  document.dispatchEvent(new CustomEvent("bufferDirection", {detail: key}));
  if (gameState === GAME_STATE.ONGOING && key === "Escape") {
    document.dispatchEvent(new Event("pauseWorld"));
    return;
  }
}

const showOverlayMenu = () => {
  const backdrop = document.querySelector("#backdrop");
  const overlayMenu = document.querySelector("#overlay-menu");
  backdrop.classList.remove("hidden");
  overlayMenu.classList.remove("hidden");
}

const hideOverlayMenu = () => {
  const backdrop = document.querySelector("#backdrop");
  const overlayMenu = document.querySelector("#overlay-menu");
  backdrop.classList.add("hidden");
  overlayMenu.classList.add("hidden");
  clearMenuContainer();
}

function clearMenuContainer () {
  const menuContainer = document.querySelector("#menu-content");
  menuContainer.replaceChildren();
}

const resumeButtonClick = (startGame) => {
  countDown(3, () => {
    hideOverlayMenu();
    clearMenuContainer();
    startGame();
  });
}

function countDown (counter, callback) {
  const menuContainer = document.querySelector("#menu-content");
  const counterDiv = document.createElement("div");
  counterDiv.classList.add("counter");
  counterDiv.textContent = counter.toString();
  menuContainer.replaceChildren(counterDiv);
  let timer = 1;
  while (counter-- > 1) {
    setTimeout((counter) => {
      counterDiv.textContent = counter.toString();
    }, timer++ * 1000, counter);
  }
  setTimeout(() => {
    callback();
  }, timer * 1000);
}

const showPauseMenu = (startGame) => {
  const overlayMenu = document.querySelector("#overlay-menu");
  const menuContainer = document.querySelector("#menu-content");
  const menu = document.createElement("div");
  menu.classList.add("pause-menu");

  const resumeButton = document.createElement("div");
  resumeButton.classList.add("choice");
  resumeButton.textContent = "Resume";
  resumeButton.onclick = () => { resumeButtonClick(startGame) };

  const restartButton = document.createElement("div");
  restartButton.classList.add("choice");
  restartButton.textContent = "Restart";
  restartButton.onclick = () => { location.reload() };

  menu.appendChild(resumeButton);
  menu.appendChild(restartButton);

  const selectOption = (nodeList, index) => {
    nodeList.forEach(node => {
      node.classList.remove("selected");
    });
    nodeList[index].classList.add("selected");
  }
  
  selectOption(menu.childNodes, 0);
  menu.childNodes.forEach((node, i) => {
    node.onmouseover = () => {
      selectOption(menu.childNodes, i);
    }
  })

  showOverlayMenu();
  menuContainer.appendChild(menu);
  overlayMenu.classList.remove("hidden");
}

class Snake {
  constructor(x, y) {
    this.direction = DIRECTIONS.RIGHT;
    this.directionLock = false;
    this.cells = [[x, y]];
    this.directionBuffer = [];
    document.addEventListener("bufferDirection", (ev) => {this.writeIntoDirectionBuffer(ev.detail)});
  }

  writeIntoDirectionBuffer(dir) {
    this.directionBuffer.push(dir);
    while(this.directionBuffer.length > INPUT_BUFFER_SIZE) this.directionBuffer.shift();
  }

  readFromDirectionBuffer() {
    if (this.directionBuffer.length === 0) return;
    this.setDirection(this.directionBuffer.shift());
  }
  
  setDirection(dir) {
    if (this.directionLock) return;
    if (!VALID_DIRECTIONS[this.direction].includes(dir)) return;
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
    if (snakeSet.size < this.cells.length) {
      return true;
    }
    return false;
  }
}

class World {
  constructor(parentDiv, dimension, snake) {
    this.parentDiv = parentDiv;
    this.dimension = dimension;
    this.snake = snake;
    this.grid = [];
    this.gameState = GAME_STATE.DEFAULT;
    this.interval = () => {};
    snake.setWorld(this);
    this.initializeGrid();
    document.addEventListener("keydown", (ev) => {keyDownEventListener(ev, this.gameState)});
    document.addEventListener("pauseWorld", () => {this.pause()});
    document.addEventListener("unpauseWorld", () => {this.start()});
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
    if (!this.grid[y]) return null;
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
    this.gameState = GAME_STATE.ONGOING;
    this.interval = setInterval(() => {
      this.snake.readFromDirectionBuffer();
      if (this.snake.willSnakeEatFoodNextMove()) {
        this.snake.grow();
        this.createFood();
      } else {
        this.snake.move();
      }
      this.render();
    }, 100);
  }

  pause() {
    this.gameState = GAME_STATE.PAUSED;
    showPauseMenu(() => {this.start()});
    clearInterval(this.interval);
  }

  stop() {
    this.gameState = GAME_STATE.ENDED;
    clearInterval(this.interval);
  }
}