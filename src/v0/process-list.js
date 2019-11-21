const {
  split, startsWith, map, find, remove,
} = require('lodash');
const {
  slice, isEmpty, includes, trim, trimRight, indexOf, count, replaceAll,
} = require('voca');
const { retrieve } = require('./process-retriever');

const convertTasksToArray = (tasks) => split(tasks, '\r\n');

const findTitleSeparatorLine = (taskLines) => find(taskLines, (line) => startsWith(line, '='));

const calculateColumnsInitialIndexes = (titleSeparatorLine) => {
  const initialIndexes = [];
  let currIdx = 0;

  do {
    initialIndexes.push(currIdx);
    currIdx = indexOf(titleSeparatorLine, ' ', currIdx + 1) + 1;
  } while (currIdx > 0);

  initialIndexes.push(count(titleSeparatorLine) + 1);

  return initialIndexes;
};

const getColumnValue = (line, columnInitialIndexes, index) => trim(slice(
  line,
  columnInitialIndexes[index],
  columnInitialIndexes[index + 1] - 1,
));

const convertLinesToObjects = (lines, columnInitialIndexes) => map(lines, (line) => {
  if (isEmpty(line) || includes(line, 'Image Name') || startsWith(line, '=')) {
    return {};
  }

  return {
    name: getColumnValue(line, columnInitialIndexes, 0),
    pid: parseInt(getColumnValue(line, columnInitialIndexes, 1), 10),
    sessionName: getColumnValue(line, columnInitialIndexes, 2),
    sessionNumber: parseInt(getColumnValue(line, columnInitialIndexes, 3), 10),
    memory: parseInt(replaceAll(trimRight(getColumnValue(
      line,
      columnInitialIndexes,
      4,
    ), ' K'), ',', ''), 10),
  };
});

const clearEmptyObjects = (objects) => remove(objects, (object) => !!object.name);

const run = async () => {
  const tasks = await retrieve();

  if (tasks) {
    const tasksArray = convertTasksToArray(tasks);
    const titleSeparatorLine = findTitleSeparatorLine(tasksArray);
    const columnsInitialIndexes = calculateColumnsInitialIndexes(titleSeparatorLine);
    const convertedLines = convertLinesToObjects(tasksArray, columnsInitialIndexes);
    return clearEmptyObjects(convertedLines);
  }

  return [];
};

module.exports = {
  convertTasksToArray,
  findTitleSeparatorLine,
  calculateColumnsInitialIndexes,
  getColumnValue,
  convertLinesToObjects,
  clearEmptyObjects,
  run,
};
