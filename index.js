const mapLiveCellsToCoordinates = grid => {
  return grid.map((row, ri) => {
    return row.map((cell, ci) => {
      return cell ? ci + ',' + (row.length - 1 - ri) : 0
    });
  });
}

const liveCellCoordinates = grid => {
  return grid.reduce((prev, curr) => {
    return prev.concat(curr.filter(el => el));
  }, []);
}

const returnLiveCellCoordinates = grid => {
  return liveCellCoordinates(mapLiveCellsToCoordinates(grid));
}

const returnAllCellsToConsiderFromLiveCells = grid => {
  return grid.reduce((prev, curr) => {
    const x = parseInt(curr.split(',')[0]);
    const y = parseInt(curr.split(',')[1]);
    const arr = [-1, 0, 1].reduce((previ, curri) => {
      return previ.concat([-1, 0, 1].reduce((prevj, currj) => prevj.concat((x + currj) + ',' + (y + curri)), []));
    }, []);
    return prev.concat(arr)
  }, []);
}

const removeDuplicates = arr => arr.filter((el, i) => arr.indexOf(el) === i);

const cellsToConsider = grid => {
  return removeDuplicates(returnAllCellsToConsiderFromLiveCells(returnLiveCellCoordinates(grid)));
}

const mapLiveCellsToCellsToConsider = (liveCells, cellsToConsider) => {
  return cellsToConsider.map(el => {
    return {coord: el, state: liveCells.indexOf(el) > -1 ? 1 : 0}
  });
}

const cellsToConsiderWithState = grid => {
  return mapLiveCellsToCellsToConsider(returnLiveCellCoordinates(grid), cellsToConsider(grid))
}

const getNeighboursOfObjs = arr => arr.map(el => {
  const f = el.coord.split(',')[0];
  const s = el.coord.split(',')[1];
  const neighbours = arr.filter(e => {
    return Math.abs(e.coord.split(',')[0] - f) < 2 && Math.abs(e.coord.split(',')[1] - s) < 2
  }).reduce((prev, curr) => prev + curr.state, 0) - el.state;
  const obj = {};
  obj.coord = el.coord;
  obj.state = el.state;
  obj.neighbours = neighbours;
  return obj
});

const getNeighbours = grid => getNeighboursOfObjs(cellsToConsiderWithState(grid));

const newGeneration = grid => {
  return getNeighbours(grid).map(el => {
    const obj = {};
    obj.coord = el.coord;
    obj.state = el.neighbours < 2 || el.neighbours > 3 ? 0 : el.neighbours === 3 ? 1 : el.state
    return obj
  }).filter(el => el.state).map(el => el.coord);
}

const placeCoordinates = (arr, size) => {
  var row = [];
  var grid = [];
  while(row.length < size) {
    row.push(0);
  }
  while(grid.length < size) {
    grid.push(row);
  }
  return grid.map((row, ri) => {
    return row.map((cell, ci) => {
      return arr.indexOf(ci + ',' + (size - 1 - ri)) > -1 ? 1 : 0
    });
  });
}

const gameoflife = (grid, size) => {
  return placeCoordinates(newGeneration(grid), size);
}

module.exports = {
  mapLiveCellsToCoordinates,
  liveCellCoordinates,
  returnLiveCellCoordinates,
  returnAllCellsToConsiderFromLiveCells,
  removeDuplicates,
  cellsToConsider,
  mapLiveCellsToCellsToConsider,
  cellsToConsiderWithState,
  getNeighboursOfObjs,
  getNeighbours,
  newGeneration,
  placeCoordinates,
  gameoflife
};
