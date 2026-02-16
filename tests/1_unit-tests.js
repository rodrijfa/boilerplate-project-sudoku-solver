const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');

suite('Unit Tests', () => {

  let solver = new SudokuSolver();

  // Puzzle oficial de fCC
  const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  
  const invalidCharPuzzle = '..9..5.1.85.4....2432....X.1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  const shortPuzzle = '12345';

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.equal(solver.validate(validPuzzle), true);
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const result = solver.validate(invalidCharPuzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const result = solver.validate(shortPuzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

  test('Logic handles a valid row placement', () => {
    // Posición (0,0) vacía, intentar colocar '7' (no está en fila 0)
    assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 0, '7'));
  });

  test('Logic handles an invalid row placement', () => {
    // Posición (0,0) vacía, intentar colocar '9' (ya está en fila 0, columna 2)
    assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 0, '9'));
  });

  test('Logic handles a valid column placement', () => {
    // Posición (0,0) vacía, intentar colocar '7' (no está en columna 0)
    assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 0, '7'));
  });

  test('Logic handles an invalid column placement', () => {
    // Posición (0,0) vacía, intentar colocar '8' (ya está en columna 0, fila 1)
    assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 0, '8'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    // Posición (0,0) vacía, intentar colocar '7' (no está en región superior izquierda)
    assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 0, '7'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    // Posición (0,0) vacía, intentar colocar '9' (ya está en región superior izquierda en 0,2)
    assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 0, '9'));
  });

  test('Valid puzzle strings pass the solver', () => {
    const result = solver.solve(validPuzzle);
    assert.property(result, 'solution');
    assert.isString(result.solution);
    assert.lengthOf(result.solution, 81);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const result = solver.solve(invalidCharPuzzle);
    assert.property(result, 'error');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const expectedSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

    const result = solver.solve(validPuzzle);

    assert.property(result, 'solution');
    assert.equal(result.solution, expectedSolution);
  });

});
