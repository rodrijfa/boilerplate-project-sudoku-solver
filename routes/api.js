'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);

      if (validation !== true) {
        return res.json(validation);
      }

      const solution = solver.solve(puzzle);

      if (solution.error) {
        return res.json(solution);
      }

      return res.json(solution);
    });

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation !== true) {
        return res.json(validation);
      }

      // Validar longitud de coordenada ANTES de acceder a sus caracteres
      if (coordinate.length !== 2) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // coordinate validation
      const rowLetter = coordinate[0];
      const colNumber = coordinate[1];

      const rows = 'ABCDEFGHI';
      const cols = '123456789';

      if (!rows.includes(rowLetter) || !cols.includes(colNumber)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = rows.indexOf(rowLetter);
      const column = parseInt(colNumber) - 1;

      const rowValid = solver.checkRowPlacement(puzzle, row, column, value);
      const colValid = solver.checkColPlacement(puzzle, row, column, value);
      const regionValid = solver.checkRegionPlacement(puzzle, row, column, value);

      if (rowValid && colValid && regionValid) {
        return res.json({ valid: true });
      }

      let conflicts = [];

      if (!rowValid) conflicts.push('row');
      if (!colValid) conflicts.push('column');
      if (!regionValid) conflicts.push('region');

      return res.json({
        valid: false,
        conflict: conflicts
      });
    });
};