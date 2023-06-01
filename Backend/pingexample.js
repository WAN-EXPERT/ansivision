var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

for(let host of hosts){
     // WARNING: -i 2 argument may not work in other platform like windows
    let res = await ping.promise.probe(host, {
           timeout: 10,
           extra: ['-i', '2'],
       });
    console.log(res);
}
