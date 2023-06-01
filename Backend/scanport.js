const nmap = require('libnmap');
const opts = {
  ports: '78',  
  range: [
    '172.16.0.99'
  ]
};

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (let item in report) {
    console.log(JSON.stringify(report[item]));
  }
});