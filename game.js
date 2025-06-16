document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const boardElement = document.getElementById('game-board');
    const currentPlayerElement = document.getElementById('current-player');
    const restartButton = document.getElementById('restart-btn');

    // 初始化游戏状态
    let gameBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    let currentPlayer = 'black'; // 'black' 或 'white'
    let gameActive = true;
    let gameMode = 'ai'; // 仅保留人机对战模式
    let isAIMoving = false;

    // 创建棋盘格子
    function createBoard() {
        boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('board-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }

    // 处理格子点击
    function handleCellClick(e) {
        if (!gameActive || isAIMoving) return;

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        // 检查格子是否已被占用
        if (gameBoard[row][col] !== null) return;

        // 放置棋子
        gameBoard[row][col] = currentPlayer;
        e.target.classList.add(currentPlayer);

        // 检查胜负
        if (checkWin(row, col)) {
            alert(`${currentPlayer === 'black' ? '黑棋' : '白棋'}获胜！`);
            gameActive = false;
            return;
        }

        // 检查平局
        if (checkDraw()) {
            alert('平局！');
            gameActive = false;
            return;
        }

        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';

        // AI move if in AI mode and it's white's turn
        if (gameMode === 'ai' && currentPlayer === 'white' && gameActive) {
            isAIMoving = true;
            setTimeout(aiMakeMove, 500); // Simulate thinking time
        }
    }

    // 检查胜负
    function checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线
            [1, -1]   // 反对角线
        ];

        const player = gameBoard[row][col];

        for (const [dx, dy] of directions) {
            let count = 1; // 当前位置已有一个棋子

            // 正向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (newRow >= 0 && newRow < boardSize && newCol >=0 && newCol < boardSize && gameBoard[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }

            // 反向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (newRow >= 0 && newRow < boardSize && newCol >=0 && newCol < boardSize && gameBoard[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查平局
    function checkDraw() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (gameBoard[row][col] === null) {
                    return false; // 还有空位置
                }
            }
        }
        return true; // 棋盘已满
    }

    // AI 落子逻辑
    function aiMakeMove() {
        if (!gameActive || !isAIMoving) return;

        // 简单随机落子策略
        const emptyCells = [];
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (gameBoard[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length === 0) {
            isAIMoving = false;
            return;
        }

        // 随机选择一个空位置
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];

        // 放置AI棋子
        gameBoard[row][col] = currentPlayer;
        const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add(currentPlayer);
            
            // 检查AI是否获胜
            if (checkWin(row, col)) {
                alert(`${currentPlayer === 'black' ? '黑棋' : '白棋'}获胜！`);
                gameActive = false;
                isAIMoving = false;
                return;
            }

            // 检查平局
            if (checkDraw()) {
                alert('平局！');
                gameActive = false;
                isAIMoving = false;
                return;
            }

            // 切换回玩家
            currentPlayer = 'black';
            currentPlayerElement.textContent = '黑棋';
        }

        isAIMoving = false;
    }

    // 重新开始游戏
    function restartGame() {
        // 清空棋盘状态
        gameBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        currentPlayer = 'black';
        gameActive = true;
        isAIMoving = false;

        currentPlayerElement.textContent = '黑棋';

        // 清空棋盘元素
        boardElement.innerHTML = '';
        createBoard();
    }


    // 初始化游戏
    createBoard();
    restartButton.addEventListener('click', restartGame);
});