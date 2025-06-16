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

    // AI 落子逻辑 - 高级策略
    function aiMakeMove() {
        if (!gameActive || !isAIMoving) return;

        // 评估所有空位并选择最佳位置
        const bestMove = findBestMove();
        if (!bestMove) {
            isAIMoving = false;
            return;
        }

        const { row, col } = bestMove;
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

    // 寻找最佳落子位置
    function findBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        const aiPlayer = currentPlayer;
        const humanPlayer = aiPlayer === 'black' ? 'white' : 'black';

        // 评估每个空位
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (gameBoard[row][col] === null) {
                    // 尝试放置AI棋子
                    gameBoard[row][col] = aiPlayer;
                    const aiScore = evaluatePosition(row, col, aiPlayer);

                    // 尝试放置玩家棋子
                    gameBoard[row][col] = humanPlayer;
                    const humanScore = evaluatePosition(row, col, humanPlayer);

                    // 恢复空位
                    gameBoard[row][col] = null;

                    // 综合评分 (防守优先于进攻)
                    const score = humanScore * 1.2 + aiScore;

                    // 中心位置加成
                    const centerBonus = 10 - (Math.abs(row - 7) + Math.abs(col - 7)) * 0.5;
                    const finalScore = score + centerBonus;

                    // 更新最佳位置
                    if (finalScore > bestScore) {
                        bestScore = finalScore;
                        bestMove = { row, col };
                    }
                }
            }
        }

        return bestMove;
    }

    // 评估位置分数
    function evaluatePosition(row, col, player) {
        const opponent = player === 'black' ? 'white' : 'black';
        let score = 0;

        // 检查所有方向
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线
            [1, -1]   // 反对角线
        ];

        for (const [dx, dy] of directions) {
            // 计算当前方向上的连续棋子和空位
            let consecutive = 1; // 当前位置已有一个棋子
            let openEnds = 0;
            let blocks = 0;

            // 正向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (gameBoard[newRow][newCol] === player) {
                        consecutive++;
                    } else if (gameBoard[newRow][newCol] === null) {
                        openEnds++;
                        break;
                    } else {
                        blocks++;
                        break;
                    }
                } else {
                    blocks++;
                    break;
                }
            }

            // 反向检查
            for (let i = 1; i < 5; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (gameBoard[newRow][newCol] === player) {
                        consecutive++;
                    } else if (gameBoard[newRow][newCol] === null) {
                        openEnds++;
                        break;
                    } else {
                        blocks++;
                        break;
                    }
                } else {
                    blocks++;
                    break;
                }
            }

            // 根据连续棋子数和开放端评分
            if (consecutive >= 5) {
                score += 100000; // 五连子，最高优先级
            } else if (consecutive === 4) {
                if (openEnds >= 1) score += 10000; // 活四
                else if (blocks === 1) score += 1000; // 冲四
            } else if (consecutive === 3) {
                if (openEnds === 2) score += 1000; // 活三
                else if (openEnds === 1) score += 100; // 冲三
            } else if (consecutive === 2) {
                if (openEnds === 2) score += 100; // 活二
                else if (openEnds === 1) score += 10; // 冲二
            } else if (consecutive === 1) {
                if (openEnds === 2) score += 5; // 活一
            }
        }

        return score;
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
