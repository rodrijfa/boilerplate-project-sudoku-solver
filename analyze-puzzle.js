const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

function stringToGrid(puzzleString) {
  let grid = [];
  for (let i = 0; i < 9; i++) {
    grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
  }
  return grid;
}

function checkConflicts(grid, row, col, value) {
  let conflicts = [];
  
  // Check row
  if (grid[row].includes(value)) {
    conflicts.push('row');
  }
  
  // Check column
  if (grid.map(r => r[col]).includes(value)) {
    conflicts.push('column');
  }
  
  // Check region
  let regionRow = Math.floor(row / 3) * 3;
  let regionCol = Math.floor(col / 3) * 3;
  let region = [];
  for(let r = regionRow; r < regionRow + 3; r++) {
    region.push(...grid[r].slice(regionCol, regionCol + 3));
  }
  if (region.includes(value)) {
    conflicts.push('region');
  }
  
  return conflicts;
}

let grid = stringToGrid(validPuzzle);

console.log('Buscando celdas vacías con exactamente 1 conflicto:\n');

const rows = 'ABCDEFGHI';

for(let r = 0; r < 9; r++) {
  for(let c = 0; c < 9; c++) {
    if(grid[r][c] === '.') {
      // Probar valores del 1-9
      for(let v = 1; v <= 9; v++) {
        let conflicts = checkConflicts(grid, r, c, v.toString());
        if(conflicts.length === 1) {
          console.log(`${rows[r]}${c+1} con valor ${v}: conflicto en ${conflicts[0]}`);
        }
      }
    }
  }
}