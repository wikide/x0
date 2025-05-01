// Инициализация Telegram WebApp
function initTelegramWebApp() {
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        return true;
    }
    return false;
}

// Класс игры с ИИ
class TicTacToeAI {
    constructor() {
        this.board = Array(9).fill(null);
        this.humanPlayer = 'X';
        this.aiPlayer = 'O';
        this.currentPlayer = this.humanPlayer;
        this.gameEnded = false;

        this.statusElement = document.querySelector('.status');
        this.boardElement = document.querySelector('.gamespace');
        this.restartButton = document.getElementById('restart-btn');

        this.init();
    }

    init() {
        this.renderBoard();
        this.restartButton.addEventListener('click', () => this.restartGame());

        // Если играем в Telegram, добавляем кнопку "Поделиться"
        if (window.Telegram && Telegram.WebApp) {
            const shareBtn = document.createElement('button');
            shareBtn.id = 'share-btn';
            shareBtn.textContent = 'Поделиться результатом';
            shareBtn.style.marginLeft = '10px';
            shareBtn.addEventListener('click', () => this.shareResult());
            this.restartButton.after(shareBtn);
        }
    }

    renderBoard() {
        this.boardElement.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = `item ${this.board[i] ? this.board[i].toLowerCase() : ''}`;
            cell.textContent = this.board[i] || '';
            cell.addEventListener('click', () => this.handleCellClick(i));
            this.boardElement.appendChild(cell);
        }
    }

    handleCellClick(index) {
        if (this.gameEnded || this.currentPlayer !== this.humanPlayer || this.board[index]) return;

        this.makeMove(index, this.humanPlayer);

        if (!this.gameEnded) {
            setTimeout(() => this.aiMove(), 500); // Задержка для "раздумий" ИИ
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        this.renderBoard();

        if (this.checkWin(player)) {
            this.gameEnded = true;
            const winner = player === this.humanPlayer ? 'Вы победили! 🎉' : 'Компьютер победил! 🤖';
            this.statusElement.textContent = winner;
            return;
        }

        if (this.isBoardFull()) {
            this.gameEnded = true;
            this.statusElement.textContent = 'Ничья! 🤝';
            return;
        }

        this.currentPlayer = player === this.humanPlayer ? this.aiPlayer : this.humanPlayer;
        this.statusElement.textContent = this.currentPlayer === this.humanPlayer ? 'Ваш ход (X)' : 'Компьютер думает...';
    }

    aiMove() {
        if (this.gameEnded || this.currentPlayer !== this.aiPlayer) return;

        // Простой ИИ:
        // 1. Сначала пытается выиграть
        // 2. Потом блокирует игрока
        // 3. Иначе случайный ход

        let move = this.findWinningMove(this.aiPlayer) ||
            this.findWinningMove(this.humanPlayer) ||
            this.findRandomMove();

        this.makeMove(move, this.aiPlayer);
    }

    findWinningMove(player) {
        // Проверяем все возможные ходы
        for (let i = 0; i < 9; i++) {
            if (!this.board[i]) {
                this.board[i] = player;
                const isWin = this.checkWin(player);
                this.board[i] = null;

                if (isWin) return i;
            }
        }
        return null;
    }

    findRandomMove() {
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (!this.board[i]) availableMoves.push(i);
        }
        return availableMoves.length > 0 ?
            availableMoves[Math.floor(Math.random() * availableMoves.length)] : null;
    }

    checkWin(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return this.board[index] === player;
            });
        });
    }

    isBoardFull() {
        return this.board.every(cell => cell !== null);
    }

    restartGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = this.humanPlayer;
        this.gameEnded = false;
        this.statusElement.textContent = 'Ваш ход (X)';
        this.renderBoard();
    }

    shareResult() {
        if (window.Telegram && Telegram.WebApp) {
            const result = this.gameEnded ?
                `Я сыграл в крестики-нолики: ${this.statusElement.textContent}` :
                'Я играю в крестики-нолики!';

            Telegram.WebApp.sendData(JSON.stringify({
                action: "share_result",
                game: "tic_tac_toe",
                result: result
            }));
        }
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    const isTelegram = initTelegramWebApp();
    window.game = new TicTacToeAI();

    if (!isTelegram) {
        document.body.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h2>Пожалуйста, откройте игру через Telegram бота</h2>
                    </div>
                `;
    }
});