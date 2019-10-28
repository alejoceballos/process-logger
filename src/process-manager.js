const { exec } = require('child_process');
const {
  split, startsWith, map, find, flow, reduce,
} = require('lodash');
const {
  slice, isEmpty, includes, trim, trimRight,
} = require('voca');

const findTitleSeparatorLine = (taskLines) => find(taskLines, (line) => startsWith(line, '='));

const convertSeparatorLineToArray = (titleSeparatorLine) => split(titleSeparatorLine, ' ');

const convertSeparatorValuesToSizes = (separatorValues) => map(
  separatorValues,
  (value) => value.length,
);

const convertColumnSizesToStartIndexes = (columnSizes) => reduce(
  columnSizes,
  (acc, val, idx, coll) => (idx === 0 ? [0] : [...acc, acc[idx - 1] + coll[idx - 1] + 2]),
  [],
);

const getColumnEndIndexes = (taskLines) => flow([
  findTitleSeparatorLine,
  convertSeparatorLineToArray,
  convertSeparatorValuesToSizes,
  convertColumnSizesToStartIndexes,
])(taskLines);

const convertTasksToArray = (tasks) => split(tasks, '\r\n');

const convertLinesToObjects = (lines, columnStartIndexes) => map(lines, (line) => {
  if (isEmpty(line) || includes(line, 'Image Name') || startsWith(line, '=')) {
    return {};
  }

  return {
    name: trim(slice(line, 0, columnStartIndexes[0])),
    pid: parseInt(trim(slice(line, columnStartIndexes[0], columnStartIndexes[1])), 10),
    sessionName: trim(slice(line, columnStartIndexes[1], columnStartIndexes[2])),
    sessionNumber: parseInt(trim(slice(line, columnStartIndexes[2], columnStartIndexes[3])), 10),
    memory: parseInt(trimRight(trim(slice(line, columnStartIndexes[3])), ' K'), 10),
  };
});

exec('tasklist', (err, stdout /* , stderr */) => {
  if (stdout) {
    const tasksArray = convertTasksToArray(stdout);
    console.log({ tasksArray });

    const columnSizes = getColumnEndIndexes(tasksArray);
    console.log({ columnSizes });

    const tasks = convertLinesToObjects(tasksArray, columnSizes);
    console.log({ tasks });
  }
});

module.exports = {
  findTitleSeparatorLine,
  convertSeparatorLineToArray,
  convertSeparatorValuesToSizes,
  convertColumnSizesToIndexes: convertColumnSizesToStartIndexes,
  getColumnEndIndexes,
  convertTasksToArray,
  convertLinesToObjects,
};
