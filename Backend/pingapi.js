const ping = require("ping");

(async function (x) {
  const result = await ping.promise.probe(x, {
    timeout: 10,
    extra: ["-i", "2"],
  });

  console.log(result.alive);
})('192.168.200.14');

async function monping(x) {
    var result1 = await ping.promise.probe(x , {
        timeout: 20,
    });
    return new Promise( resolve => {
        setTimeout(function() {
            resolve(result1);
            console.log("La promesse lente est terminée");
        }, 2000);
    })
};
monping('192.168.200.14').then(v => {
    console.log(v);
});
