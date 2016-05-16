const tape = require('tape');

const mapLiveCellsToCoordinates = require('./index.js').mapLiveCellsToCoordinates;
const liveCellCoordinates = require('./index.js').liveCellCoordinates;
const returnLiveCellCoordinates = require('./index.js').returnLiveCellCoordinates;
const returnAllCellsToConsiderFromLiveCells = require('./index.js').returnAllCellsToConsiderFromLiveCells;
const removeDuplicates = require('./index.js').removeDuplicates;
const cellsToConsider = require('./index.js').cellsToConsider;
const mapLiveCellsToCellsToConsider = require('./index.js').mapLiveCellsToCellsToConsider;
const cellsToConsiderWithState = require('./index.js').cellsToConsiderWithState;
const getNeighboursOfObjs = require('./index.js').getNeighboursOfObjs;
const getNeighbours = require('./index.js').getNeighbours;
const newGeneration = require('./index.js').newGeneration;
const placeCoordinates = require('./index.js').placeCoordinates;
const gameoflife = require('./index.js').gameoflife;

// used in the .sort() method to sort an array of onjects by coordinate
const compareFunc = (a, b) => a.coord < b.coord ? -1 : 1;

tape('map live cells to coordinates', t => {
  const input1 = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = mapLiveCellsToCoordinates(input1);
  const expected1 = [
    [0, 0, 0, '3,3'],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  t.deepEqual(actual1, expected1, 'input1 inputs coordinates correctly');

  const input2 = [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0]
  ];
  const actual2 = mapLiveCellsToCoordinates(input2);
  const expected2 = [
    [0, 0, 0, 0],
    ['0,2', '1,2', 0, 0],
    [0, 0, '2,1', 0],
    [0, '1,0', '2,0', 0]
  ];

  t.deepEqual(actual2, expected2, 'input2 inputs coordinates correctly');
  t.end();
});

tape('returns just the coordinates of the live cells', t => {
  const input1 = [
    [0, 0, 0, '3,3'],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = liveCellCoordinates(input1);
  const expected1 = ['3,3'];

  t.deepEqual(actual1, expected1, 'input1 inputs coordinates correctly');
  const input2 = [
    [0, 0, 0, 0],
    ['0,2', '1,2', 0, 0],
    [0, 0, '2,1', 0],
    [0, '1,0', '2,0', 0]
  ];
  const actual2 = liveCellCoordinates(input2);
  const expected2 = ['1,0', '0,2', '1,2', '2,1', '2,0'];

  t.deepEqual(actual2.sort(), expected2.sort(), 'input2 inputs coordinates correctly');
  const input3 = [
    [0, 0, 0, 0],
    ['0,2', '1,2', 0, 0],
    [0, 0, '2,1', 0],
    [0, '1,0', '2,0', 0]
  ];
  const actual3 = liveCellCoordinates(input3);
  const expected3 = ['1,0', '0,2', '1,2', '2,1', '2,0'];

  t.deepEqual(actual3.sort(), expected3.sort(), 'input3 inputs coordinates correctly');
  t.end();
});

tape('returns an array of the coordinates of the live cells', t => {
  const input1 = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = returnLiveCellCoordinates(input1);
  const expected1 = ['3,3'];

  t.deepEqual(actual1, expected1, 'inputs coordinates correctly');

  const input2 = [
    [0, 1, 0, 1],
    [0, 0, 0, 0],
    [1, 0, 1, 0],
    [0, 1, 1, 0]
  ];
  const actual2 = returnLiveCellCoordinates(input2);
  const expected2 = ['0,1', '1,0', '1,3', '2,0', '2,1', '3,3'];

  t.deepEqual(typeof actual2 === 'object' ? actual2.sort() : actual2, expected2.sort(), 'input2 inputs coordinates correctly');
  t.end();
});

tape('returns an array of all cells to consider', t => {
  const input1 = ['3,3'];
  const actual1 = returnAllCellsToConsiderFromLiveCells(input1);
  const expected1 = ['2,2', '2,3', '2,4',
    '3,2', '3,3', '3,4',
    '4,2', '4,3', '4,4'
  ];

  t.deepEqual(typeof actual1 === 'object' ? actual1.sort() : actual1, expected1.sort(), 'input1 inputs coordinates correctly');
  const input2 = ['0,0', '3,3'];
  const actual2 = returnAllCellsToConsiderFromLiveCells(input2);
  const expected2 = [
    '-1,-1', '-1,0', '-1,1',
    '0,-1', '0,0', '0,1',
    '1,-1', '1,0', '1,1',
    '2,2', '2,3', '2,4',
    '3,2', '3,3', '3,4',
    '4,2', '4,3', '4,4'
  ];

  t.deepEqual(typeof actual2 === 'object' ? actual2.sort() : actual2, expected2.sort(), 'input2 inputs coordinates correctly');
  t.end();
});

tape('remove duplicates function', t => {
  t.deepEqual(removeDuplicates(['1,1', '1,1', '0,1']).sort(), ['1,1', '0,1'].sort(), 'removes one duplicate');
  t.deepEqual(removeDuplicates(['1,1', '1,1', '1,1', '1,1', '0,1']).sort(), ['1,1', '0,1'].sort(), 'removes multiple dupliactes');
  t.end()
});

tape('returns all cells to consider from initial input', t => {
  const input1 = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = cellsToConsider(input1);
  const expected1 = ['2,2', '2,3', '2,4',
    '3,2', '3,3', '3,4',
    '4,2', '4,3', '4,4'
  ];

  t.deepEqual(typeof actual1 === 'object' ? actual1.sort() : actual1, expected1.sort(), 'inputs coordinates correctly');

  const input2 = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ];
  const actual2 = cellsToConsider(input2);
  const expected2 = [
    '0,0', '0,1', '0,2', '0,3',
    '1,0', '1,1', '1,2', '1,3',
    '2,0', '2,1', '2,2', '2,3',
    '3,0', '3,1', '3,2', '3,3'
  ];

  t.deepEqual(typeof actual2 === 'object' ? actual2.sort() : actual2, expected2.sort(), 'inputs coordinates correctly');
  t.end();
});

tape('takes in cells to consider and outputs array of objects with coordinate and state property', t => {
  const liveCells1 = ['3,3'];
  const cellsToConsider1 = [
    '2,2', '2,3', '2,4',
    '3,2', '3,3', '3,4',
    '4,2', '4,3', '4,4'
  ];
  const actual1 = mapLiveCellsToCellsToConsider(liveCells1, cellsToConsider1);
  const expected1 = [
    {coord: '2,2', state: 0}, {coord: '2,3', state: 0}, {coord: '2,4', state: 0},
    {coord: '3,2', state: 0}, {coord: '3,3', state: 1}, {coord: '3,4', state: 0},
    {coord: '4,2', state: 0}, {coord: '4,3', state: 0}, {coord: '4,4', state: 0}
  ];
  t.deepEqual(typeof actual1 === 'object' ? actual1.sort() : actual1, expected1.sort(), 'input1 inputs coordinates correctly');

  const liveCells2 = ['3,3', '0,0'];
  const cellsToConsider2 = [
    '-1,-1', '-1,0', '-1,1',
    '0,-1', '0,0', '0,1',
    '1,-1', '1,0', '1,1',
    '2,2', '2,3', '2,4',
    '3,2', '3,3', '3,4',
    '4,2', '4,3', '4,4'
  ];
  const actual2 = mapLiveCellsToCellsToConsider(liveCells2, cellsToConsider2);
  const expected2 = [
    {coord: '-1,-1', state: 0}, {coord: '-1,0', state: 0}, {coord: '-1,1', state: 0},
    {coord: '0,-1', state: 0}, {coord: '0,0', state: 1}, {coord: '0,1', state: 0},
    {coord: '1,-1', state: 0}, {coord: '1,0', state: 0}, {coord: '1,1', state: 0},
    {coord: '2,2', state: 0}, {coord: '2,3', state: 0}, {coord: '2,4', state: 0},
    {coord: '3,2', state: 0}, {coord: '3,3', state: 1}, {coord: '3,4', state: 0},
    {coord: '4,2', state: 0}, {coord: '4,3', state: 0}, {coord: '4,4', state: 0}
  ];
  
  t.deepEqual(typeof actual2 === 'object' ? actual2.sort() : actual2, expected2.sort(), 'input2 inputs coordinates correctly');
  t.end();
});

tape('outputs array of objects with coordinate and state property from initial input', t => {
  const input1 = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = cellsToConsiderWithState(input1);
  const expected1 = [
    {coord: '2,2', state: 0}, {coord: '2,3', state: 0}, {coord: '2,4', state: 0},
    {coord: '3,2', state: 0}, {coord: '3,3', state: 1}, {coord: '3,4', state: 0},
    {coord: '4,2', state: 0}, {coord: '4,3', state: 0}, {coord: '4,4', state: 0}
  ];
  
  t.deepEqual(typeof actual1 === 'object' ? actual1.sort(compareFunc) : actual1, expected1.sort(compareFunc), 'input1 inputs coordinates correctly');
  const input2 = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 0]
  ];
  const actual2 = cellsToConsiderWithState(input2);
  const expected2 = [
    {coord: '-1,-1', state: 0}, {coord: '-1,0', state: 0}, {coord: '-1,1', state: 0},
    {coord: '0,-1', state: 0}, {coord: '0,0', state: 1}, {coord: '0,1', state: 0},
    {coord: '1,-1', state: 0}, {coord: '1,0', state: 0}, {coord: '1,1', state: 0},
    {coord: '2,2', state: 0}, {coord: '2,3', state: 0}, {coord: '2,4', state: 0},
    {coord: '3,2', state: 0}, {coord: '3,3', state: 1}, {coord: '3,4', state: 0},
    {coord: '4,2', state: 0}, {coord: '4,3', state: 0}, {coord: '4,4', state: 0}
  ];
  
  t.deepEqual(typeof actual2 === 'object' ? actual2.sort(compareFunc) : actual2, expected2.sort(compareFunc), 'input2 inputs coordinates correctly');
t.end();
});

tape('adds the number of neighbours a cell has to its object', t => {
  const input1 = [
    {coord: '2,2', state: 0}, {coord: '2,3', state: 0}, {coord: '2,4', state: 0},
    {coord: '3,2', state: 0}, {coord: '3,3', state: 1}, {coord: '3,4', state: 0},
    {coord: '4,2', state: 0}, {coord: '4,3', state: 0}, {coord: '4,4', state: 0}
  ];
  const actual1 = getNeighboursOfObjs(input1);
  const expected1 = [
    {coord: '2,2', state: 0, neighbours: 1}, {coord: '2,3', state: 0, neighbours: 1}, {coord: '2,4', state: 0, neighbours: 1},
    {coord: '3,2', state: 0, neighbours: 1}, {coord: '3,3', state: 1, neighbours: 0}, {coord: '3,4', state: 0, neighbours: 1},
    {coord: '4,2', state: 0, neighbours: 1}, {coord: '4,3', state: 0, neighbours: 1}, {coord: '4,4', state: 0, neighbours: 1}
  ];

  t.deepEqual(typeof actual1 === 'object' ? actual1.sort(compareFunc) : actual1, expected1.sort(compareFunc), 'inputs coordinates correctly');

  const input2 = [
    {coord: '-1,-1', state: 0}, {coord: '-1,0', state: 0}, {coord: '-1,1', state: 0},
    {coord: '0,-1', state: 0}, {coord: '0,0', state: 1}, {coord: '0,1', state: 0},
    {coord: '1,-1', state: 0}, {coord: '1,0', state: 0}, {coord: '1,1', state: 0},
    {coord: '2,2', state: 0}, {coord: '2,3', state: 0}, {coord: '2,4', state: 0},
    {coord: '3,2', state: 0}, {coord: '3,3', state: 1}, {coord: '3,4', state: 0},
    {coord: '4,2', state: 0}, {coord: '4,3', state: 0}, {coord: '4,4', state: 0}
  ];
  const actual2 = getNeighboursOfObjs(input2);
  const expected2 = [
    {coord: '-1,-1', state: 0, neighbours: 1}, {coord: '-1,0', state: 0, neighbours: 1}, {coord: '-1,1', state: 0, neighbours: 1},
    {coord: '0,-1', state: 0, neighbours: 1}, {coord: '0,0', state: 1, neighbours: 0}, {coord: '0,1', state: 0, neighbours: 1},
    {coord: '1,-1', state: 0, neighbours: 1}, {coord: '1,0', state: 0, neighbours: 1}, {coord: '1,1', state: 0, neighbours: 1},
    {coord: '2,2', state: 0, neighbours: 1}, {coord: '2,3', state: 0, neighbours: 1}, {coord: '2,4', state: 0, neighbours: 1},
    {coord: '3,2', state: 0, neighbours: 1}, {coord: '3,3', state: 1, neighbours: 0}, {coord: '3,4', state: 0, neighbours: 1},
    {coord: '4,2', state: 0, neighbours: 1}, {coord: '4,3', state: 0, neighbours: 1}, {coord: '4,4', state: 0, neighbours: 1}
  ];

  t.deepEqual(typeof actual2 === 'object' ? actual2.sort(compareFunc) : actual2, expected2.sort(compareFunc), 'inputs coordinates correctly');
  const input3 = [
    {coord: '-1,-1', state: 0}, {coord: '-1,0', state: 0}, {coord: '-1,1', state: 0},
    {coord: '0,-1', state: 0}, {coord: '0,0', state: 1}, {coord: '0,1', state: 0},
    {coord: '1,-1', state: 0}, {coord: '1,0', state: 1}, {coord: '1,1', state: 0},
    {coord: '2,-1', state: 0}, {coord: '2,0', state: 0}, {coord: '2,1', state: 0},
  ];
  const actual3 = getNeighboursOfObjs(input3);
  const expected3 = [
    {coord: '-1,-1', state: 0, neighbours: 1}, {coord: '-1,0', state: 0, neighbours: 1}, {coord: '-1,1', state: 0, neighbours: 1},
    {coord: '0,-1', state: 0, neighbours: 2}, {coord: '0,0', state: 1, neighbours: 1}, {coord: '0,1', state: 0, neighbours: 2},
    {coord: '1,-1', state: 0, neighbours: 2}, {coord: '1,0', state: 1, neighbours: 1}, {coord: '1,1', state: 0, neighbours: 2},
    {coord: '2,-1', state: 0, neighbours: 1}, {coord: '2,0', state: 0, neighbours: 1}, {coord: '2,1', state: 0, neighbours: 1},
  ];

  t.deepEqual(typeof actual3 === 'object' ? actual3.sort(compareFunc) : actual3, expected3.sort(compareFunc), 'inputs coordinates correctly');
  t.end();
});

tape('adds the number of neighbours a cell has to its object', t => {
  const input1 = [
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = getNeighbours(input1);
  const expected1 = [
    {coord: '2,2', state: 0, neighbours: 1}, {coord: '2,3', state: 0, neighbours: 1}, {coord: '2,4', state: 0, neighbours: 1},
    {coord: '3,2', state: 0, neighbours: 1}, {coord: '3,3', state: 1, neighbours: 0}, {coord: '3,4', state: 0, neighbours: 1},
    {coord: '4,2', state: 0, neighbours: 1}, {coord: '4,3', state: 0, neighbours: 1}, {coord: '4,4', state: 0, neighbours: 1},
  ];
  t.deepEqual(typeof actual1 === 'object' ? actual1.sort(compareFunc) : actual1, expected1.sort(compareFunc), 'inputs coordinates correctly');
  const input2 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ];
  const actual2 = getNeighbours(input2);
  const expected2 = [
    {coord: '0,0', state: 0, neighbours: 1}, {coord: '0,1', state: 0, neighbours: 1}, {coord: '0,2', state: 0, neighbours: 1},
    {coord: '1,0', state: 0, neighbours: 2}, {coord: '1,1', state: 1, neighbours: 1}, {coord: '1,2', state: 0, neighbours: 2},
    {coord: '2,0', state: 0, neighbours: 2}, {coord: '2,1', state: 1, neighbours: 1}, {coord: '2,2', state: 0, neighbours: 2},
    {coord: '3,0', state: 0, neighbours: 1}, {coord: '3,1', state: 0, neighbours: 1}, {coord: '3,2', state: 0, neighbours: 1},
  ];

  t.deepEqual(typeof actual2 === 'object' ? actual2.sort(compareFunc) : actual2, expected2.sort(compareFunc), 'inputs coordinates correctly');
  t.end();
});

tape('translates to a new generation based on a cells neighbours', t => {
  const input1 = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
  ];
  const actual1 = newGeneration(input1);
  const expected1 = ['1,1', '1,2', '2,1', '2,2'];

  t.deepEqual(typeof actual1 === 'object' ? actual1.sort() : actual1, expected1.sort(), '#14-inputs coordinates correctly');

  const input2 = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
  ];
  const actual2= newGeneration(input2);
  const expected2 = ['1,2', '2,2', '3,2'];

  t.deepEqual(typeof actual2 === 'object' ? actual2.sort() : actual2, expected2.sort(), 'inputs coordinates correctly');
  t.end();
});

tape('places coordinates back on to a grid of specified size', t => {
  const arr =  ['1,1', '1,2', '2,1', '2,2'];
  const size = 4;
  const actual = placeCoordinates(arr, size);
  const expected = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ];

  t.deepEqual(typeof actual === 'object' ? actual.sort() : actual, expected.sort(), 'inputs coordinates correctly');
  t.end();
});

tape('entire test for the game of life, maps one generation to the next', t => {
  const input = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
  ];
  const actual = gameoflife(input, 4);
  const expected = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ];

  t.deepEqual(typeof actual === 'object' ? actual.sort() : actual, expected.sort(), 'inputs coordinates correctly');
  t.end();
});

tape('another final gameoflife test', t => {
  const input = [
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1]
  ];
  const actual = gameoflife(input, 6);
  const expected = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ];

  t.deepEqual(typeof actual === 'object' ? actual.sort() : actual, expected.sort(), 'inputs coordinates correctly');
  t.end();
});
