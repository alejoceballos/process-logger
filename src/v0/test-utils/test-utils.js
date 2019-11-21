const someImageName = 'System';
const someImagePid = '4';
const columnTitlesLine = 'Image Name                     PID Session Name        Session#    Mem Usage';
const columnsSeparatorsLine = '========================= ======== ================ =========== ============';
const systemIdleLine = 'System Idle Process              0 Services                   0          8 K';
const systemLine = `${someImageName}                           ${someImagePid} Services                   0      8,288 K`;
const execTaskListResult = `\r\n${columnTitlesLine}\r\n${columnsSeparatorsLine}\r\n${systemIdleLine}\r\n${systemLine}`;

module.exports = {
  someImageName,
  someImagePid,
  columnTitlesLine,
  columnsSeparatorsLine,
  systemIdleLine,
  systemLine,
  execTaskListResult,
};
