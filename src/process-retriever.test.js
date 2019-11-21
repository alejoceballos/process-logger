const util = require('util');
const { retrieve, getPidByImageName } = require('./process-retriever');
const {
  someImageName,
  someImagePid,
  execTaskListResult,
} = require('./test-utils/test-utils');

jest.mock('util');

describe('Process Retriever', () => {
  beforeEach(() => {
    util.promisify.mockReturnValue(() => ({ stdout: execTaskListResult }));
  });

  afterEach(() => {
    util.promisify.mockClear();
  });

  it('should return a list of processes', async () => {
    const actual = await retrieve();
    expect(actual).toEqual(execTaskListResult);
  });

  it('should return the process ID when searching by its Image Name', async () => {
    const actual = await getPidByImageName(someImageName);
    expect(actual).toEqual(parseInt(someImagePid));
  });
});
