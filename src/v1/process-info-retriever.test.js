const { hostname } = require('os');
const moment = require('moment');
const { GLOBAL_PROCESS, COUNTER_TYPE, retrieve } = require('./process-info-retriever');

describe('Retrieve', () => {
  const logTimeFormatPart = '(PDH-CSV 4.0)';
  const hostCounterPart = `\\\\${hostname()}`;
  const processUnderTest = 'node';
  const processPart = `\\Process(${processUnderTest})`;

  const getCurrentDate = () => moment().format('MM/DD/YYYY');

  describe('% Processor Time', () => {
    const counterTypePart = `\\${COUNTER_TYPE.PROCESSOR_TIME_PERC}`;

    it('should retrieve the total percentage time', async () => {
      const processTotalPart = '\\Process(_total)';
      const datePart = getCurrentDate();
      const actual = await retrieve(GLOBAL_PROCESS.TOTAL, COUNTER_TYPE.PROCESSOR_TIME_PERC);

      expect(actual).toIncludeMultiple([
        logTimeFormatPart,
        hostCounterPart,
        processTotalPart,
        counterTypePart,
        datePart,
      ]);
    });

    it('should retrieve a process percentage time', async () => {
      const datePart = getCurrentDate();
      const actual = await retrieve(processUnderTest, COUNTER_TYPE.PROCESSOR_TIME_PERC);

      expect(actual).toIncludeMultiple([
        logTimeFormatPart,
        hostCounterPart,
        processPart,
        counterTypePart,
        datePart,
      ]);
    });
  });

  describe('Memory', () => {
    const counterTypePart = `\\${COUNTER_TYPE.TOTAL_MEMORY}`;
    it('should retrieve a process memory usage', async () => {
      const datePart = getCurrentDate();
      const actual = await retrieve(processUnderTest, COUNTER_TYPE.TOTAL_MEMORY);

      expect(actual).toIncludeMultiple([
        logTimeFormatPart,
        hostCounterPart,
        processPart,
        counterTypePart,
        datePart,
      ]);
    });
  });

  describe('I/O', () => {
    const counterTypePart = `\\${COUNTER_TYPE.IO_USAGE}`;
    it('should retrieve a process IO data operations/sec', async () => {
      const datePart = getCurrentDate();
      const actual = await retrieve(processUnderTest, COUNTER_TYPE.IO_USAGE);

      expect(actual).toIncludeMultiple([
        logTimeFormatPart,
        hostCounterPart,
        processPart,
        counterTypePart,
        datePart,
      ]);
    });
  });

  describe('Process ID', () => {
    const counterTypePart = `\\${COUNTER_TYPE.PROCESS_ID}`;
    it('should retrieve a process ID', async () => {
      const datePart = getCurrentDate();
      const actual = await retrieve(processUnderTest, COUNTER_TYPE.PROCESS_ID);

      expect(actual).toIncludeMultiple([
        logTimeFormatPart,
        hostCounterPart,
        processPart,
        counterTypePart,
        datePart,
      ]);
    });
  });

  describe('Invalid Counter', () => {
    it('should retrieve the error message', async () => {
      try {
        const actual = await retrieve(processUnderTest, 'Invalid Counter');
        expect(actual).toBe(Error);
      } catch (actual) {
        expect(actual.message).toEqual(`Command failed: typeperf "\\Process(${processUnderTest})\\Invalid Counter" -sc 1cls\n`);
      }
    });
  });
});
