
var Minesweeper = function() {
};

Minesweeper.prototype = {

    field: null,
    $content: null,
    showMines: false,
    fieldSize: null,

    render: function () {
        this.$content = $('.Minesweeper .Field');
        $('.Minesweeper .NewGame').click(_.bind(this.startNewGame, this));

    },

    getConfig: function () {
        this.showMines = $('.Minesweeper .Config input.ShowMines').prop('checked');
        var fieldSize = parseInt($('.Minesweeper .Config input.FieldSize').val());
        if(fieldSize > 10 || fieldSize < 5) {
            alert('Please enter correct field size');
        } else {
            this.fieldSize = fieldSize;
        }
    },

    startNewGame: function () {
        this.getConfig();

        if(this.fieldSize) {
            this.$content.html('');
            this.field = new MinesweeperField({
                rowsNum: this.fieldSize,
                colsNum: this.fieldSize,
                appendTo: this.$content,
                showMines: this.showMines
            });
            this.field.render();
        }
    }
};