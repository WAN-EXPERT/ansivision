const util = require('util')
const exec = util.promisify(require('child_process').exec);

const ping = async (host) => {
  const {stdout, stderr} = await exec(`ping -c 5 ${host}`);
  console.log(stdout);
  console.log(stderr);
}

ping('192.168.1.1');