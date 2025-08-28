// 游戏常量
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const DIFFICULTY_SPEEDS = {
    easy: 200,
    medium: 150,
    hard: 100
};

// 游戏状态
const GAME_STATES = {
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game-over'
};

// 蛇类
class Snake {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.reset();
    }

    reset() {
        // 初始化蛇身，从中心开始
        const centerX = Math.floor(this.gridWidth / 2);
        const centerY = Math.floor(this.gridHeight / 2);
        this.body = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];
        this.direction = DIRECTIONS.RIGHT;
        this.nextDirection = DIRECTIONS.RIGHT;
    }

    move() {
        // 更新方向
        this.direction = this.nextDirection;

        // 获取蛇头位置
        const head = { ...this.body[0] };

        // 计算新的蛇头位置
        head.x += this.direction.x;
        head.y += this.direction.y;

        // 添加新的蛇头
        this.body.unshift(head);

        // 移除蛇尾（除非吃到食物）
        return this.body.pop();
    }

    grow() {
        // 在蛇尾添加一节
        const tail = { ...this.body[this.body.length - 1] };
        this.body.push(tail);
    }

    changeDirection(newDirection) {
        // 防止反向移动
        if (this.direction.x === -newDirection.x && this.direction.y === -newDirection.y) {
            return;
        }
        this.nextDirection = newDirection;
    }

        checkCollision() {
        const head = this.body[0];

        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.gridWidth || head.y < 0 || head.y >= this.gridHeight) {
            return true;
        }

        // 检查自身碰撞
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    }

    checkFoodCollision(food) {
        const head = this.body[0];
        return head.x === food.position.x && head.y === food.position.y;
    }
}

// 食物类
class Food {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.position = { x: 0, y: 0 };
    }

    generate(snakeBody) {
        let newPosition;
        do {
            newPosition = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } while (this.isOnSnake(newPosition, snakeBody));

        this.position = newPosition;
    }

    isOnSnake(position, snakeBody) {
        return snakeBody.some(segment =>
            segment.x === position.x && segment.y === position.y
        );
    }
}

// 游戏主类
class SnakeGame {
        constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = parseInt(document.getElementById('grid-size').value);
        this.gridWidth = this.gridSize;
        this.gridHeight = this.gridSize;
        this.difficulty = document.getElementById('difficulty').value;

        this.snake = new Snake(this.gridWidth, this.gridHeight);
        this.food = new Food(this.gridWidth, this.gridHeight);

        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameState = GAME_STATES.READY;
        this.gameLoop = null;
        this.lastUpdateTime = 0;
        this.gridSizeTimeout = null;

        this.initializeCanvas();
        this.setupEventListeners();
        this.updateUI();
        this.showOverlay('开始游戏', '按空格键开始游戏');
    }

                initializeCanvas() {
        // 设置最大Canvas尺寸
        const maxCanvasSize = 600;

        // 计算网格单元大小，确保Canvas不超过最大尺寸
        const maxDimension = Math.max(this.gridWidth, this.gridHeight);
        this.cellSize = Math.min(20, Math.floor(maxCanvasSize / maxDimension));

        // 根据网格数量计算画布大小
        const canvasWidth = this.cellSize * this.gridWidth;
        const canvasHeight = this.cellSize * this.gridHeight;

        // 设置画布大小
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        // 设置画布样式
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';
    }

    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // 按钮事件
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());

        // 方向控制按钮
        document.getElementById('up-btn').addEventListener('click', () => this.changeDirection(DIRECTIONS.UP));
        document.getElementById('down-btn').addEventListener('click', () => this.changeDirection(DIRECTIONS.DOWN));
        document.getElementById('left-btn').addEventListener('click', () => this.changeDirection(DIRECTIONS.LEFT));
        document.getElementById('right-btn').addEventListener('click', () => this.changeDirection(DIRECTIONS.RIGHT));

                // 设置变化事件
        document.getElementById('grid-size').addEventListener('change', (e) => {
            // 添加一个小延迟，避免频繁更新
            clearTimeout(this.gridSizeTimeout);
            this.gridSizeTimeout = setTimeout(() => {
                this.handleGridSizeChange(e.target.value);
            }, 100);
        });

                // 自定义网格宽度输入
        document.getElementById('custom-grid-width').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 10 && value <= 50) {
                this.gridWidth = value;
            }
        });

        // 自定义网格高度输入
        document.getElementById('custom-grid-height').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 10 && value <= 50) {
                this.gridHeight = value;
            }
        });

        // 当用户完成输入后（失去焦点或按回车）才更新游戏
        const updateCustomGrid = () => {
            if (document.getElementById('grid-size').value === 'custom') {
                const width = parseInt(document.getElementById('custom-grid-width').value);
                const height = parseInt(document.getElementById('custom-grid-height').value);
                if (width >= 10 && width <= 50 && height >= 10 && height <= 50) {
                    this.gridWidth = width;
                    this.gridHeight = height;
                    // 重新初始化Canvas和游戏对象
                    this.initializeCanvas();
                    this.snake = new Snake(this.gridWidth, this.gridHeight);
                    this.food = new Food(this.gridWidth, this.gridHeight);
                    this.resetGame();
                }
            }
        };

        document.getElementById('custom-grid-width').addEventListener('blur', updateCustomGrid);
        document.getElementById('custom-grid-height').addEventListener('blur', updateCustomGrid);

        document.getElementById('custom-grid-width').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        });

        document.getElementById('custom-grid-height').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        });

        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
    }

    handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.changeDirection(DIRECTIONS.UP);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.changeDirection(DIRECTIONS.DOWN);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.changeDirection(DIRECTIONS.LEFT);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.changeDirection(DIRECTIONS.RIGHT);
                break;
            case ' ':
                e.preventDefault();
                if (this.gameState === GAME_STATES.READY) {
                    this.startGame();
                } else if (this.gameState === GAME_STATES.PLAYING) {
                    this.togglePause();
                } else if (this.gameState === GAME_STATES.PAUSED) {
                    this.togglePause();
                }
                break;
        }
    }

    changeDirection(direction) {
        if (this.gameState === GAME_STATES.PLAYING) {
            this.snake.changeDirection(direction);
        }
    }

    startGame() {
        if (this.gameState === GAME_STATES.READY || this.gameState === GAME_STATES.GAME_OVER) {
            this.resetGame();
        }

        this.gameState = GAME_STATES.PLAYING;
        this.hideOverlay();
        this.updateUI();
        this.gameLoop = requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    togglePause() {
        if (this.gameState === GAME_STATES.PLAYING) {
            this.gameState = GAME_STATES.PAUSED;
            this.showOverlay('游戏暂停', '按空格键继续游戏');
            this.updateUI();
        } else if (this.gameState === GAME_STATES.PAUSED) {
            this.gameState = GAME_STATES.PLAYING;
            this.hideOverlay();
            this.updateUI();
            this.gameLoop = requestAnimationFrame((timestamp) => this.update(timestamp));
        }
    }

    restartGame() {
        this.resetGame();
        this.startGame();
    }

    resetGame() {
        this.score = 0;
        this.snake.reset();
        this.food.generate(this.snake.body);
        this.gameState = GAME_STATES.READY;
        this.lastUpdateTime = 0;
        this.updateUI();
        this.render();
    }

    update(currentTime) {
        if (this.gameState !== GAME_STATES.PLAYING) {
            return;
        }

        const deltaTime = currentTime - this.lastUpdateTime;
        const updateInterval = DIFFICULTY_SPEEDS[this.difficulty];

        if (deltaTime >= updateInterval) {
            this.lastUpdateTime = currentTime;

            // 移动蛇
            const tail = this.snake.move();

            // 检查碰撞
            if (this.snake.checkCollision()) {
                this.gameOver();
                return;
            }

            // 检查是否吃到食物
            if (this.snake.checkFoodCollision(this.food)) {
                this.snake.grow();
                this.food.generate(this.snake.body);
                this.score += 10;
                this.updateUI();
            }

            // 渲染游戏
            this.render();
        }

        this.gameLoop = requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    gameOver() {
        this.gameState = GAME_STATES.GAME_OVER;

        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }

        this.updateUI();
        this.showOverlay('游戏结束', `最终得分: ${this.score}`);
    }

    render() {
        // 清空画布
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格
        this.drawGrid();

        // 绘制蛇
        this.drawSnake();

        // 绘制食物
        this.drawFood();
    }

        drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;

        // 绘制垂直线
        for (let i = 0; i <= this.gridWidth; i++) {
            const pos = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
        }

        // 绘制水平线
        for (let i = 0; i <= this.gridHeight; i++) {
            const pos = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        this.snake.body.forEach((segment, index) => {
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;

            if (index === 0) {
                // 蛇头
                this.ctx.fillStyle = '#2E7D32';
                this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);

                // 蛇头边框
                this.ctx.strokeStyle = '#1B5E20';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
            } else {
                // 蛇身
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);

                // 蛇身边框
                this.ctx.strokeStyle = '#388E3C';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
            }
        });
    }

    drawFood() {
        const x = this.food.position.x * this.cellSize;
        const y = this.food.position.y * this.cellSize;

        // 食物主体
        this.ctx.fillStyle = '#f44336';
        this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);

        // 食物边框
        this.ctx.strokeStyle = '#d32f2f';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);

        // 食物高光
        this.ctx.fillStyle = '#ffcdd2';
        this.ctx.fillRect(x + 4, y + 4, 3, 3);
    }

    showOverlay(title, message) {
        const overlay = document.getElementById('game-overlay');
        const overlayTitle = document.getElementById('overlay-title');
        const overlayMessage = document.getElementById('overlay-message');
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const restartBtn = document.getElementById('restart-btn');

        overlayTitle.textContent = title;
        overlayMessage.textContent = message;

        // 显示/隐藏按钮
        startBtn.style.display = this.gameState === GAME_STATES.READY ? 'block' : 'none';
        pauseBtn.style.display = this.gameState === GAME_STATES.PLAYING ? 'block' : 'none';
        restartBtn.style.display = this.gameState === GAME_STATES.GAME_OVER ? 'block' : 'none';

        overlay.classList.remove('hidden');
    }

    hideOverlay() {
        const overlay = document.getElementById('game-overlay');
        overlay.classList.add('hidden');
    }

    updateUI() {
        // 更新分数
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;

        // 更新游戏状态
        const gameStatus = document.getElementById('game-status');
        gameStatus.textContent = this.getStatusText();
        gameStatus.className = 'game-status ' + this.gameState;
    }

    getStatusText() {
        switch (this.gameState) {
            case GAME_STATES.READY:
                return '准备开始';
            case GAME_STATES.PLAYING:
                return '游戏中';
            case GAME_STATES.PAUSED:
                return '已暂停';
            case GAME_STATES.GAME_OVER:
                return '游戏结束';
            default:
                return '未知状态';
        }
    }

    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    }

            handleGridSizeChange(value) {
        const customContainer = document.getElementById('custom-grid-container');

        if (value === 'custom') {
            customContainer.style.display = 'flex';
            const width = parseInt(document.getElementById('custom-grid-width').value) || 20;
            const height = parseInt(document.getElementById('custom-grid-height').value) || 20;
            this.gridWidth = width;
            this.gridHeight = height;
        } else {
            customContainer.style.display = 'none';
            const size = parseInt(value);
            this.gridWidth = size;
            this.gridHeight = size;
        }

        // 重新初始化Canvas和游戏对象
        this.initializeCanvas();
        this.snake = new Snake(this.gridWidth, this.gridHeight);
        this.food = new Food(this.gridWidth, this.gridHeight);
        this.resetGame();
    }

    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
