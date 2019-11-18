const { retrieve } = require('./process-retriever');

describe('Process Retriever', () => {
  const titleLine = 'Image Name                     PID Session Name        Session#    Mem Usage';
  const separatorLine = '========================= ======== ================ =========== ============';

  it('should return a list of processes', async () => {
    const actual = await retrieve();
    expect(actual).toContain(titleLine);
    expect(actual).toContain(separatorLine);
  });
});
