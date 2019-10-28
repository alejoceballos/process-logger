const assert = require('assert');
const {
  findTitleSeparatorLine,
  convertSeparatorLineToArray,
  convertSeparatorValuesToSizes,
  convertColumnSizesToIndexes,
  getColumnSizes,
  convertTasksToArray,
  convertLinesToObjects,
} = require('./process-manager');

describe('Process Manager', () => {
  const separatorLine = '========================= ======== ================ =========== ============';
  const tasks = `\r\nImage Name                     PID Session Name        Session#    Mem Usage\r\n${separatorLine}\r\nSystem Idle Process              0 Services                   0          8 K\r\nSystem                           4 Services                   0      8,288 K`;
  const lines = ['',
    'Image Name                     PID Session Name        Session#    Mem Usage',
    separatorLine,
    'System Idle Process              0 Services                   0          8 K',
    'System                           4 Services                   0      8,288 K',
  ];
  const separatorValues = [
    '=========================', '========', '================', '===========', '============',
  ];
  const columnsSizes = [25, 8, 16, 11, 12];
  const columnsStartIndexes = [0, 27, 36, 53, 65];

  it('should find the title separator line among all lines', () => {
    const actual = findTitleSeparatorLine(lines);
    assert.equal(actual, separatorLine);
  });

  it('should convert the separator line into an array', () => {
    const actual = convertSeparatorLineToArray(separatorLine);
    assert.deepEqual(actual, separatorValues);
  });

  it('should get all values lengths', () => {
    const actual = convertSeparatorValuesToSizes(separatorValues);
    assert.deepEqual(actual, columnsSizes);
  });

  it('should get all columns sizes from the complete task list', () => {
    const actual = getColumnSizes(lines);
    assert.deepEqual(actual, columnsSizes);
  });

  it('should convert the wholw tasks string to an array of tasks lines', () => {
    const actual = convertTasksToArray(tasks);
    assert.deepEqual(actual, lines);
  });

  it('should convert column sizes int end indexes', () => {
    const actual = convertColumnSizesToIndexes(columnsSizes);
    assert.deepEqual(actual, columnsStartIndexes);
  });

  it('should convert the text task list into an object structure', () => {
    const actual = convertLinesToObjects(lines, columnsStartIndexes);
    const expected = [
      {},
      {},
      {},
      {
        name: 'System Idle Process',
        pid: 0,
        sessionName: 'Services',
        sessionNumber: 0,
        memory: 8,
      },
      {
        name: 'System',
        pid: 4,
        sessionName: 'Services',
        sessionNumber: 0,
        memory: 8288,
      },
    ];
    assert.deepEqual(actual, expected);
  });
});
