window.addEventListener('load', function () {
    window.game = {
        finishGame: false,
        cells: 3,
        players: {
            zero: {
                value: 0,
                symbol: '0',
            },
            crosse: {
                value: 1,
                symbol: 'X',
            }
        },
        activePlayer: null,
        result: [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ],
        init: function() {
            this.activePlayer = this.players.crosse;
            this.createGameSpace();
            document.querySelector('.status').innerHTML = 'Ходит игрок: ' + this.activePlayer.symbol;
        },
        createGameSpace: function() {
            let gamespace = '';
            for(let i = 0; i < this.cells; i++) {
                gamespace += this.createRow(i);
            }
            document.querySelector('.gamespace').innerHTML = gamespace;
        },
        createRow: function(i) {
            let row = document.createElement('div');
            row.classList.add('row');
            for(let j =0; j < this.cells; j++) {
                let col = document.createElement('div');
                col.classList.add('col');
                col.insertAdjacentHTML('beforeend', this.createItem(i, j));
                row.insertAdjacentHTML('beforeend', col.outerHTML);
            }

            return row.outerHTML;
        },
        createItem: function(i, j) {
            let item = document.createElement('div');
            item.classList.add('item');
            item.dataset.row = i;
            item.dataset.col = j;

            return item.outerHTML;
        },
        switchPlayer: function() {
            this.activePlayer = this.activePlayer === this.players.zero ? this.players.crosse : this.players.zero;
        },
        finish: function() {
            this.finishGame = true;
        },
        checkWin: function() {
            let isWin = false;
            loop: for (let i = 0; i < this.result.length; i++) {
                for(let j =0; j < this.result[i].length; j++) {
                    if(this.winRow(i,j) || this.winCol(i,j)) {
                        isWin = true;
                        break loop;
                    }
                }
            }
            return isWin || this.winDia();
        },
        winRow: function(row,col) {
            return null !== this.result[row][col] && this.result[row][col] === this.result[row][col+1] && this.result[row][col] === this.result[row][col+2];
        },
        winCol: function(row,col) {
            return null !== this.result[row][col] && this.result[row][col] === this.result[row+1][col] && this.result[row][col] === this.result[row+2][col];
        },
        winDia: function() {
            return this.winDia1() || this.winDia2();
        },
        winDia1: function() {
            return this.result[0][0] === this.result[1][1] && this.result[0][0]  === this.result[2][2] && null !== this.result[0][0]
        },
        winDia2: function() {
            return this.result[0][2] === this.result[1][1] && this.result[0][2] === this.result[2][0] && null !== this.result[0][2];
        },
        showWinLine: function(isWin) {
            if (this.finishGame) {
                window.game.switchPlayer();
                document.querySelector('.status').innerHTML = 'Победил: ' + this.activePlayer.symbol;
            } else {
                document.querySelector('.status').innerHTML = this.isStandoff() ? 'Ничья!' : 'Ходит игрок: ' + this.activePlayer.symbol;
            }
        },
        isStandoff: function() {
            let standoff = true;
            for(let i = 0; i < this.result.length; i++) {
                for(let j = 0; j < this.result[i].length; j++) {
                    if (null === this.result[i][j]) {
                        standoff = false;
                    }
                }
            }
            return standoff;
        }
    }
    window.game.init();
    document.querySelectorAll('.item').forEach(function (e) {
        e.addEventListener('click', function () {
            if ('' === e.innerText && !window.game.finishGame) {
                e.innerText = window.game.activePlayer.symbol;
                window.game.result[parseInt(e.dataset.row)][parseInt(e.dataset.col)] = window.game.activePlayer.value;
                window.game.switchPlayer();
                window.game.showWinLine();
                let finishGame = window.game.checkWin();
                if (finishGame) {
                    window.game.finish();
                    window.game.showWinLine();
                }
            }
        });
    });
});