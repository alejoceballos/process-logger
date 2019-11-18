const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

const retrieve = async () => {
  const { stdout, stderr } = await execAsync('tasklist');
  if (stderr) throw new Error(stderr);
  return stdout;
};

module.exports = {
  retrieve,
};
