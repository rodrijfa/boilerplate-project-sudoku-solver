class SudokuSolver {

  validate(puzzleString) {
    // Primero verificar si existe
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }

    // Validar longitud
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    // Validar caracteres
    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return true;
  }

  stringToGrid(puzzleString) {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(
        puzzleString.slice(i * 9, i * 9 + 9).split('')
      );
    }
    return grid;
  }

  gridToString(grid) {
    return grid.flat().join('');
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);
    
    // Si la celda actual ya tiene este valor, es válido
    if (grid[row][column] === value) {
      return true;
    }

    // Verificar si el valor ya existe en la fila (excluyendo la celda actual)
    for (let c = 0; c < 9; c++) {
      if (c !== column && grid[row][c] === value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);
    
    // Si la celda actual ya tiene este valor, es válido
    if (grid[row][column] === value) {
      return true;
    }

    // Verificar si el valor ya existe en la columna (excluyendo la celda actual)
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][column] === value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let grid = this.stringToGrid(puzzleString);
    
    // Si la celda actual ya tiene este valor, es válido
    if (grid[row][column] === value) {
      return true;
    }

    let regionRow = Math.floor(row / 3) * 3;
    let regionCol = Math.floor(column / 3) * 3;

    // Verificar si el valor ya existe en la región 3x3 (excluyendo la celda actual)
    for (let r = regionRow; r < regionRow + 3; r++) {
      for (let c = regionCol; c < regionCol + 3; c++) {
        if ((r !== row || c !== column) && grid[r][c] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    let validation = this.validate(puzzleString);
    if (validation !== true) {
      return validation;
    }

    let grid = this.stringToGrid(puzzleString);

    const solveRecursive = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === '.') {
            for (let num = 1; num <= 9; num++) {
              let value = num.toString();

              if (
                this.checkRowPlacement(this.gridToString(grid), row, col, value) &&
                this.checkColPlacement(this.gridToString(grid), row, col, value) &&
                this.checkRegionPlacement(this.gridToString(grid), row, col, value)
              ) {
                grid[row][col] = value;

                if (solveRecursive()) {
                  return true;
                }

                grid[row][col] = '.';
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (!solveRecursive()) {
      return { error: 'Puzzle cannot be solved' };
    }

    return { solution: this.gridToString(grid) };
  }
}

module.exports = SudokuSolver;