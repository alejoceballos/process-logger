const { expect } = require('chai');
const sinon = require('sinon');
const childProcess = require('child_process');

const {
  convertTasksToArray,
  findTitleSeparatorLine,
  calculateColumnsInitialIndexes,
  getColumnValue,
  convertLinesToObjects,
  clearEmptyObjects,
  run,
} = require('./process-list');

describe('Process Manager', () => {
  const titleLine = 'Image Name                     PID Session Name        Session#    Mem Usage';
  const separatorLine = '========================= ======== ================ =========== ============';
  const systemIdleLine = 'System Idle Process              0 Services                   0          8 K';
  const systemLine = 'System                           4 Services                   0      8,288 K';
  const tasks = `\r\n${titleLine}\r\n${separatorLine}\r\n${systemIdleLine}\r\n${systemLine}`;
  const lines = ['', titleLine, separatorLine, systemIdleLine, systemLine];
  const clearedConvertedLines = [
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
  const convertedLines = [{}, {}, {}, ...clearedConvertedLines];
  const columnsStartIndexes = [0, 26, 35, 52, 64, 77];

  afterEach(() => {
    sinon.restore();
  });

  it('should convert the whole tasks string to an array of tasks lines', () => {
    const actual = convertTasksToArray(tasks);
    expect(actual).to.deep.equal(lines);
  });

  it('should find the title separator line among all lines', () => {
    const actual = findTitleSeparatorLine(lines);
    expect(actual).to.equal(separatorLine);
  });

  it('should calculate all columns initial indexes from the title separator line', () => {
    const actual = calculateColumnsInitialIndexes(separatorLine);
    expect(actual).to.deep.equal(columnsStartIndexes);
  });

  it("should get the task's name from a line according to column's index", () => {
    const actual = getColumnValue(systemLine, columnsStartIndexes, 0);
    expect(actual).to.equal('System');
  });

  it("should get the task's PID from a line according to column's index", () => {
    const actual = getColumnValue(systemLine, columnsStartIndexes, 1);
    expect(actual).to.equal('4');
  });

  it("should get the task's session name from a line according to column's index", () => {
    const actual = getColumnValue(systemLine, columnsStartIndexes, 2);
    expect(actual).to.equal('Services');
  });

  it("should get the task's session number from a line according to column's index", () => {
    const actual = getColumnValue(systemLine, columnsStartIndexes, 3);
    expect(actual).to.equal('0');
  });

  it("should get the task's memory usage from a line according to column's index", () => {
    const actual = getColumnValue(systemLine, columnsStartIndexes, 4);
    expect(actual).to.equal('8,288 K');
  });

  it('should convert the text task list into an object structure', () => {
    const actual = convertLinesToObjects(lines, columnsStartIndexes);
    expect(actual).to.deep.equal(convertedLines);
  });

  it('should clear all empty objects from the task objects list', () => {
    const actual = clearEmptyObjects(convertedLines);
    expect(actual).to.deep.equal(clearedConvertedLines);
  });

  it('should output all tasks as a list of structured objects', async () => {
    sinon.stub(childProcess, 'exec').callsFake(async () => {
      console.log('whatever');
      return { stdout: tasks, stderr: undefined };
    });
    const actual = await run();
    expect(actual).to.deep.equal(clearedConvertedLines);
  });
});
