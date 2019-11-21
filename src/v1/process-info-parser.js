const {
  replaceAll, split, trim, includes,
} = require('voca');
const { map } = require('lodash');
const moment = require('moment');

const { COUNTER_TYPE } = require('./process-info-retriever');

const infoToLineArray = (info) => {
  const infoWithoutCr = replaceAll(info, '\r', '');
  return split(infoWithoutCr, '\n');
};

const getDataLine = (lines) => lines[2];

const dataLineToDataArray = (dataLine) => {
  const splittedDataLine = split(dataLine, '","');
  return map(splittedDataLine, (value) => trim(value, '"'));
};

const counterToFind = (counter) => `\\${counter}"\r\n`;

const convertDate = (dateAsString) => moment(dateAsString, 'MM/DD/YYYY HH:mm:ss.SSS').toDate();

const sanitizeInteger = (dataArray) => (
  [convertDate(dataArray[0]), parseInt(dataArray[1], 10)]
);

const sanitizeFloat = (dataArray) => (
  [convertDate(dataArray[0]), parseFloat(dataArray[1])]
);

const sanitize = (info, dataArray) => {
  const includesInfo = (counter) => includes(info, counterToFind(counter));

  if (includesInfo(COUNTER_TYPE.PROCESS_ID)
    || includesInfo(COUNTER_TYPE.IO_USAGE)
    || includesInfo(COUNTER_TYPE.TOTAL_MEMORY)) {
    return sanitizeInteger(dataArray);
  }

  if (includesInfo(COUNTER_TYPE.PROCESSOR_TIME_PERC)) {
    return sanitizeFloat(dataArray);
  }

  return dataArray;
};

const parse = (info) => {
  const infoLinesArray = infoToLineArray(info);
  const dataLine = getDataLine(infoLinesArray);
  const dataArray = dataLineToDataArray(dataLine);
  const sanitizedDataArray = sanitize(info, dataArray);

  return {
    timestamp: sanitizedDataArray[0],
    data: sanitizedDataArray[1],
  };
};

module.exports = {
  parse,
};
