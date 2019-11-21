const { parse } = require('./process-info-parser');
const { COUNTER_TYPE } = require('./process-info-retriever');

describe('Process Info', () => {
  describe('Parse', () => {
    const getInfo = (counter, timestamp, data) => `\r\n"(PDH-CSV 4.0)","\\\\CEBALLOS\\Process(node)\\${counter}"\r\n"${timestamp}","${data}"\r\nExiting, please wait...                         \r\nThe command completed successfully.\r\n\r\r`;

    it('should not parse undefined counter info', async () => {
      const info = getInfo(
        'Undefined Counter',
        'A Timestamp',
        'Some Data',
      );
      const actual = parse(info);

      expect(actual).toEqual({
        timestamp: 'A Timestamp',
        data: 'Some Data',
      });
    });

    it('should parse process ID info', async () => {
      const info = getInfo(
        COUNTER_TYPE.PROCESS_ID,
        '11/21/2019 15:28:13.223',
        '9128.000000',
      );
      const actual = parse(info);

      expect(actual).toEqual({
        timestamp: new Date('2019-11-21T17:28:13.223Z'),
        data: 9128,
      });
    });

    it('should parse process memory info', async () => {
      const info = getInfo(
        COUNTER_TYPE.TOTAL_MEMORY,
        '11/20/2019 23:01:11.527',
        '176361472.000000',
      );
      const actual = parse(info);

      expect(actual).toEqual({
        timestamp: new Date('2019-11-21T01:01:11.527Z'),
        data: 176361472,
      });
    });

    it('should parse I/O info', async () => {
      const info = getInfo(
        COUNTER_TYPE.IO_USAGE,
        '11/20/2019 23:09:30.589',
        '0.000000',
      );
      const actual = parse(info);

      expect(actual).toEqual({
        timestamp: new Date('2019-11-21T01:09:30.589Z'),
        data: 0,
      });
    });

    it('should parse time percentage info', async () => {
      const info = getInfo(
        COUNTER_TYPE.PROCESSOR_TIME_PERC,
        '11/20/2019 23:15:36.725',
        '803.998032',
      );
      const actual = parse(info);

      expect(actual).toEqual({
        timestamp: new Date('2019-11-21T01:15:36.725Z'),
        data: 803.998032,
      });
    });
  });
});
