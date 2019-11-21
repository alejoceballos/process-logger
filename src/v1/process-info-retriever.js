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

typeperf "\Process(whatsapp)\ID Process" -sc 1cls
"(PDH-CSV 4.0)","\\CEBALLOS\Process(whatsapp)\ID Process"
"11/21/2019 11:38:31.992","7404.000000"
*/

const { promisify } = require('util');
const { exec } = require('child_process');

const GLOBAL_PROCESS = {
  ALL: '*',
  TOTAL: '_total',
};

const COUNTER_TYPE = {
  PROCESSOR_TIME_PERC: '% Processor Time',
  TOTAL_MEMORY: 'Working Set',
  IO_USAGE: 'IO Data Operations/sec',
  PROCESS_ID: 'ID Process',
};

const retrieve = (processName, counter) => {
  const execAsync = promisify(exec);
  return execAsync(`typeperf "\\Process(${processName})\\${counter}" -sc 1cls`).then((result) => {
    const { stdout } = result;
    return stdout;
  });
};

module.exports = {
  GLOBAL_PROCESS,
  COUNTER_TYPE,
  retrieve,
};
