/*
WhatsApp.exe                  8176 Console                    2    172,180 K

typeperf "\Process(whatsapp)\Working Set" -sc 1cls
"(PDH-CSV 4.0)","\\CEBALLOS\Process(whatsapp)\Working Set"
"11/20/2019 23:01:11.527","176361472.000000"

typeperf "\Process(whatsapp)\IO Data Operations/sec" -sc 1cls
"(PDH-CSV 4.0)","\\CEBALLOS\Process(whatsapp)\IO Data Operations/sec"
"11/20/2019 23:09:30.589","0.000000"

typeperf "\Process(_total)\% Processor Time" -sc 1cls
"(PDH-CSV 4.0)","\\CEBALLOS\Process(_total)\% Processor Time"
"11/20/2019 23:15:36.725","803.998032"

typeperf "\Process(whatsapp)\% Processor Time" -sc 1cls
"(PDH-CSV 4.0)","\\CEBALLOS\Process(whatsapp)\% Processor Time"
"11/20/2019 23:16:20.661","3.104402"
 */

const { promisify } = require('util');
const { exec } = require('child_process');
const {
  indexOf, substr, count, trim, isNumeric,
} = require('voca');

const retrieve = async () => {
  const execAsync = promisify(exec);
  const { stdout, stderr } = await execAsync('tasklist');
  if (stderr) throw new Error(stderr);
  return stdout;
};

const getPidByImageName = async (imageName) => {
  const uniqueImageName = `${imageName}  `;
  const taskList = await retrieve();
  const lineStartIndex = indexOf(taskList, uniqueImageName) + count(uniqueImageName);
  let lineEndIndex = indexOf(taskList, '\r\n', lineStartIndex);
  lineEndIndex = lineEndIndex === -1 ? undefined : lineEndIndex;
  const processLine = trim(substr(taskList, lineStartIndex, lineEndIndex), ' ');
  const processId = substr(processLine, 0, indexOf(processLine, ' '));
  return isNumeric(processId) ? parseInt(processId, 10) : undefined;
};

module.exports = {
  retrieve,
  getPidByImageName,
};
