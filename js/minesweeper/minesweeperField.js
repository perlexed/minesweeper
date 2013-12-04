
var MinesweeperField = function (params) {
    this.init(params);
};

MinesweeperField.prototype = {

    colsNum: null,
    rowsNum: null,
    $content: null,
    minesMatrix: null,
    showMines: false,

    totalMinesCount: null,
    totalFieldsClosed: null,

    init: function (params) {
        this.colsNum = params.colsNum;
        this.rowsNum = params.rowsNum;
        this.totalMinesCount = 0;
        this.totalFieldsClosed = this.colsNum * this.rowsNum;
        this.showMines = params.showMines ? params.showMines : false;

        this.$content = params.appendTo;

        this.setMines(0.3);
    },

    endGame: function() {
        this.$content.find('.square').unbind();
    },

    setMines: function (density) {
        this.minesMatrix = {};
        var row, isMine;

        for(var i = 0; i < this.rowsNum; i++) {
            row = {};
            for(var j = 0; j < this.colsNum; j++) {
                isMine = Math.random() < density;
                row[j] = isMine;
                if(isMine) {
                    this.totalMinesCount++;
                }
            }
            this.minesMatrix[i] = row;
        }
    },

    render: function () {

        var row, mine = '';
        var table = '<table>';

        for(var i = 0; i < this.rowsNum; i++) {
            row = '<tr>';
            for(var j = 0; j < this.colsNum; j++) {
                mine = this.minesMatrix[i][j] ? '1' : '0';
                row += '<td class="square ID-Y' + i + ' ID-X' + j;
                row += this.showMines && this.minesMatrix[i][j] ? ' hiddenMine">' : '">';
                row += '<div class="minesCount"></div>';
                row += '<input type="hidden" class="YX" value="' + i + ';' + j + '">';
                row += '<input type="hidden" class="isMine" value="' + mine + '">';
                row += '</td>';
            }
            row += '</tr>';
            table += row;
        }
        table += '</table>';

        this.$content.append(table);
        this.$content.find('.square').click(_.bind(this.squareClicked, this));
        this.$content.find('.square').on('contextmenu', _.bind(this.setProbableMine, this));
    },

    getSquareCoordinated: function (square) {
        var YX = $(square).find('input.YX').val().split(';');
        return {
            'y': parseInt(YX[0]),
            'x': parseInt(YX[1])
        };
    },

    setProbableMine: function(square) {
        $(square.target).toggleClass('probableMine');
        square.preventDefault();
    },

    squareClicked: function (event) {
        event.stopPropagation();
        if(!$(event.target).hasClass('square')) {
            return;
        }
        var coords = this.getSquareCoordinated(event.target);

        if($(event.target).hasClass('probableMine')) {
            return;
        }

        if(this.isMine(coords)) {
            this.mineClicked(event.target);
        } else {
            this.openField(coords);
        }
    },

    mineClicked: function(element) {
        $(element).addClass('mine');
        alert('Boom!');
        this.endGame();
    },

    isMine: function(coords) {
        return this.minesMatrix[coords.y][coords.x];
    },

    isOpened: function(coords) {
        return this.findSquare(coords).hasClass('opened');
    },

    isWin: function() {
        return this.totalFieldsClosed === this.totalMinesCount;
    },

    openField: function (coords) {
        var square = this.findSquare(coords);

        if($(square).hasClass('opened')) {
            return;
        }

        var currentFieldMinesCount = this.countNeighbourMines(coords);

        $(square).addClass('opened');

        this.totalFieldsClosed--;

        if(this.isWin()) {
            alert('Congratulations!');
            this.endGame();
        }

        if(!this.isSetMineNumbers(coords)) {
            if(currentFieldMinesCount > 0) {
                this.markMineNumbers(coords, currentFieldMinesCount);
            }
        }

        var newCoordsArray = [
            {y: coords.y-1, x: coords.x-1},
            {y: coords.y+1, x: coords.x+1},
            {y: coords.y-1, x: coords.x+1},
            {y: coords.y+1, x: coords.x-1},
            {y: coords.y-1, x: coords.x},
            {y: coords.y+1, x: coords.x},
            {y: coords.y, x: coords.x-1},
            {y: coords.y, x: coords.x+1}
        ];

        if(!this.isSetMineNumbers(coords)) {
            _.each(newCoordsArray, _.bind(function(newCoords) {
                if(this.isExists(newCoords)) {
                    if(!this.isMine(newCoords) && !this.isOpened(newCoords)) {
                        this.openField(newCoords);
                    }
                }
            }, this));
        }
    },

    isExists: function(coords) {
        if(this.minesMatrix[coords.y] !== undefined) {
            if(this.minesMatrix[coords.y][coords.x] !== undefined) {
                return true;
            }
        }
        return false;
    },

    isSetMineNumbers: function (coords) {
        return this.findSquare(coords).find('.minesCount').html().length > 0;
    },

    markMineNumbers: function (coords, minesCount) {
        this.findSquare(coords).find('.minesCount').html(minesCount);
    },

    countNeighbourMines: function (coords) {

        var minesCount = 0, newCoordsArray = [
            {y: coords.y-1, x: coords.x-1},
            {y: coords.y+1, x: coords.x+1},
            {y: coords.y-1, x: coords.x+1},
            {y: coords.y+1, x: coords.x-1},
            {y: coords.y-1, x: coords.x},
            {y: coords.y+1, x: coords.x},
            {y: coords.y, x: coords.x-1},
            {y: coords.y, x: coords.x+1}
        ];

        _.each(newCoordsArray, _.bind(function(newCoords) {
            if(this.isExists(newCoords)) {
                if(this.isMine(newCoords)) {
                    minesCount++;
                }
            }
        }, this));

        return minesCount;
    },

    findSquare: function (coords) {
        return $('.square :input[value="' + coords.y + ';' + coords.x + '"].YX').parent();
    }

};