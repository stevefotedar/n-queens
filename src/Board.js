// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    //returns the entire set of rows
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)



    ========================================================================= */

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      const board = this.rows().slice();
      const check = board[rowIndex];
      let counter = 0;
      for (let idx = 0; idx < check.length; idx++) {
        check[idx] === 1 ? counter++ : counter;
      }
      return counter > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //invoke row and assign to var
      const allRows = this.rows();
      //iterate through all rows
      for (let index = 0; index < allRows.length; index++) {
        if (this.hasRowConflictAt(index)) {
          return true;
        }
      }
      //invoke hasRowConfictAt at current row and return if true
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //declare a const for invoking row 
      const checkArray = this.rows();
      //declare a counter const 
      let counter = 0;
      //iterate over all rows
      for (let i = 0; i < checkArray.length; i++) {
        if (checkArray[i][colIndex] === 1) {
          counter++;
        }
      } 
      return counter > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //declare a const for invoking rows at 0th index
      const checkArray = this.rows()[0];
      //iterate over the row 
      for (var i = 0; i < checkArray.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //declare a const for invoking rows 
      const checkArray = this.rows();
      //initialize a counter 
      let counter = 0;
      //initialize the position of the row number (always start at 0)
      let row = 0;
      //iterate over the rows 
      for (var i = majorDiagonalColumnIndexAtFirstRow; i < checkArray.length; i++) {
        if (checkArray[row][i] === 1) {
          counter++;
          if (counter > 1) {
            return true;
          }
        }
        row++;
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      const checkArray = this.rows();
      let modArray = checkArray.slice();
      for (let i = 0; i < checkArray[0].length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      modArray.splice(0, 1);
      const recursiveLeftOverConflictCheck = (modArray) => {
        let r = 0;
        let countCon = 0;
        for (let c = 0; c < modArray.length; c++) {
          if (modArray[r][c] === undefined) {
            modArray.splice(0, 1);
            if (modArray.length > 1) {
              recursiveLeftOverConflictCheck(modArray);
            } else {
              return false;
            }
          }
          if (modArray[r][c] === 1) {
            countCon++;
          }
          if (countCon > 1) {
            return true;
          }
          r++;
        }
        modArray.splice(0, 1);
        if (modArray.length > 1) {
          recursiveLeftOverConflictCheck(modArray);
        }
        return false;
      };
      return recursiveLeftOverConflictCheck(modArray);
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
