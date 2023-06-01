const { DATABASE, PATH_ANSIBLE, EMAIL_FROM, EMAIL_TO} = require('./fileWithConstants');
const PORT = 4000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = express.Router();
const fileupload = require("express-fileupload")
var multer = require('multer')
app.use("/api", routes);
const ping = require("ping");
const cron = require('node-cron');
const fs = require("fs");
const path = require('path');
const CronJobManager = require('cron-job-manager');
const { exec } = require('child_process');
const lineReader = require('line-reader');
const readline = require('readline');
// body-parser
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());
const jsonParser = bodyParser.json();
const {readFile, writeFile, promises: fsPromises} = require('fs');
const nmap = require('libnmap');
const protocole = require('./protocole');
const { report } = require("process");
const portscanner = require('portscanner')
const scanpromise = require('port-scanner-promise');
const nodemailer = require("nodemailer");

var timer ;


//cors
routes.use(cors());
routes.use(fileupload());
routes.use(express.static("files"));

// mongoDB client
const MongoClient = require("mongodb").MongoClient;
const uri =
    "mongodb+srv://ljerome:ufugvSGXzqJ84AD@cluster0.fesfk.mongodb.net/networks?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


//Gestionnaire évenements 
var manager1 = new CronJobManager('Task', '30 * * * * *', 
  () => { console.log("tick - what should be executed?") },
  {
    start: false, 
    onComplete: () => {console.log("a_key_string_to_call_this_job has stopped....")}, 
    timeZone:"CET"
  }
);


// connect to server
app.listen(PORT, () => {
  console.log(`Server up and running on http://localhost:${PORT}`);
});



// connect to DB
//const DATABASE = "networks";
client.connect((err) => {
  if (err) {
    throw Error(err);
  }
  !err && console.log(`Successfully connected to database`);
  const db = client.db(DATABASE);
  const networks = db.collection("networks");
  const ansible = db.collection("ansible");
  const logsPing = db.collection("logsPing");
  const logsPingHisto = db.collection("logsPingHisto");
  const logsScan = db.collection("logsScan");
  const logsScanHisto = db.collection("logsScanHisto");

  const env = db.collection("env");
  
  let countPing = 0;
  let countScan = 0;
  //------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------
  // GET NETWORKS

  routes.get("/networks/search", function (req, res) {
    console.log("/networks/search");
    const mavariable = req.query.name;
    const myJSON = JSON.stringify(mavariable);
    console.log(myJSON) ;
    const query =  {$text: { $search: myJSON } };
    console.log(query);
    console.log(`search1 ${mavariable}`) ;
      networks
      .find({$text:{$search: myJSON}}, {projection: {_id: 0, id: 1, name: 1}})
      .toArray()
      .then((results, error) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(results);
      })
      .catch((err) => res.send(err));
  });

  routes.get("/networks/categories/searching", function (req, res) {
    console.log("/networks/categories/searching");
    const mavariable = req.query.categorie;
    console.log(mavariable) ;
      networks
      .find({categorie: mavariable})
      .toArray()
      .then((results, error) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(results);
      })
      .catch((err) => res.send(err));
  });

  routes.get("/networks/categorieHost", function (req, res) {
    console.log("/networks/categorieHost");
    varMatch = { $match : { _id : {$exists: true} } };
    unwind = { "$unwind" : { "path" : "$scanresult" } } ;
    varGroup3 = { $group : {"_id" : "$categorie", "total" : {$sum : 1}, "count": {
       $sum : { $cond : ['$status', 1, 0]}  
    } } };
    //varGroup3 = { $group : {"_id" : "$categorie", "total" : {$sum : 1}, "up": { $sum : { $cond : [{$eq : ['$scanresult', 'open'] }, 1, 0]}},
    //                        "down": { $sum : { $cond : [{$eq : ['$scanresult', 'closed'] }, 1, 0]}},
    //                        "filtrer": { $sum : { $cond : [{$eq : ['$scanresult', 'filtered'] }, 1, 0]}}}}

      networks
      .aggregate( [ varMatch, varGroup3] )
      .sort({'_id':1 })
      .toArray()
      .then((results, error) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(results);
      })
      .catch((err) => res.send(err));
  });

  routes.get("/networks/categorieService", function (req, res) {
    console.log("/networks/categorieService");
    varMatch = { $match : { _id : {$exists: true} } };
    unwind = { "$unwind" : { "path" : "$scanresult" } } ;
    // varGroup3 = { $group : {"_id" : "$categorie", "total" : {$sum : 1}, "count": {
    //   $sum : { $cond : ['$status', 1, 0]}  
    // } } };
    varGroup3 = { $group : {"_id" : "$categorie", "total" : {$sum : 1}, "up": { $sum : { $cond : [{$eq : ['$scanresult', 'open'] }, 1, 0]}},
                            "down": { $sum : { $cond : [{$eq : ['$scanresult', 'closed'] }, 1, 0]}},
                            "filtrer": { $sum : { $cond : [{$eq : ['$scanresult', 'filtered'] }, 1, 0]}}}}

      networks
      .aggregate( [ varMatch, unwind, varGroup3] )
      .sort({'_id':1 })   
      .toArray()   
      .then((results, error) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(results);
      })
      .catch((err) => res.send(err));
  });

  //---------------------------------------------------------------------------------------------------
  // FIN GET NETWORKS
  //---------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------
  // AFFICHAGE & TRIIII NETWORKS

  routes.get("/networks", function (req, res) {
    console.log("/networks") ;
    networks
      .find()
      .sort({'ip':1 })
      .toArray()
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(res);
      })
      .catch((err) => res.send(err));
  });

  routes.get("/networks/triStatut", function (req, res) {
    console.log("/networks") ;
    networks
      .find()
      .sort({'status':1, 'ip':1 })
      .toArray()
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(res);
      })
      .catch((err) => res.send(err));
  });
  routes.get("/networks/triCategorie", function (req, res) {
    console.log("/networks") ;
    networks
      .find()
      .sort({'categorie':1, 'ip':1 })
      .toArray()
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(res);
      })
      .catch((err) => res.send(err));
  });
  routes.get("/networks/triStatutCategorie", function (req, res) {
    console.log("/networks") ;
    networks
      .find()
      .sort({'status':1, 'categorie':1 })
      .toArray()
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(res);
      })
      .catch((err) => res.send(err));
  });

  routes.get("/networks/:id", function (req, res) { 
    console.log("/networks/:id");
    console.log(`id ${req.params.id}`) ;
      networks
      .findOne({ id: req.params.id})
      .then((results, error) => {
        if (error) {
            console.log(req.params.ip);
          return res.send(error);
        }
        console.log(req.params.id);
        console.log(results);
        res.status(200).send({ results });
      })
      .catch((err) => res.send(err));
  });

  //------------------------------------------------------------------------------------------------------
  // FIN AFFICHAGE & TRI
  //------------------------------------------------------------------------------------------------------

  //-----------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------
  //PING NETWORK




  routes.get("/status", function (req, res) {
    console.log("/status");
    logs
    .deleteMany()
    .then(() => {
    networks
      .find()
      .toArray()
      .then((results, error) => {
        if (error) {
          return res.send(error);
        }  
        for (var i = 0; i < results.length; i++) {
            monping(results[i].ip)
            .then(v => {
                
                console.log(`${v.host} - ${v.alive}`);
                var myquery = {ip: v.host} ;
                var newvalues = { $set : { status: v.alive }};

                // networks.updateOne(myquery, newvalues, function (err,res) {
                //     if (err) throw err ;
                //     console.log(`${v.host} - ${v.alive} à jour`)                    
                // })
                networks
                .updateOne(myquery, newvalues )
                .then(() => {
                  console.log('updateOne OKIIII')
                  console.log(`valeur status : ${v.alive}`)
                  if (v.alive===false) {
                    console.log('insertOne Logs')
                    let ts = Date.now();
                    let date_ob = new Date(ts);
                    let date = date_ob.getDate();
                    let month = date_ob.getMonth() + 1;
                    let year = date_ob.getFullYear(); 
                    let hours = date_ob.getHours();
                    let minutes = date_ob.getMinutes();
                    let seconds = date_ob.getSeconds();
                    let ma_variable_task = '';
                    let date_exec = date + "-" + month + "-" + year;
                    let heure_exec = hours+ ":"+ minutes + ":" + seconds;
                    logs
                     .insertOne({
                        ip : v.host,
                        status : v.alive,
                        date : date_exec,
                        heure : heure_exec})
                     .then(() => {
                        console.log("Logs mise à jour")
                        res.status(200).send("successfully inserted new document in the logs")
                     })
                     .catch((err) => {
                       console.log("pas de mise à jour de logs");
                       //res.send(err);
                     });                    
                  }
                })
                .catch((err) => {
                  console.log('updateOne KOOO')
                })
            })
            .catch((err) => {
              console.log("erreur ping");
            });
        }
        //res.status(200).send('Tests ICMP Terminé');
        console.log('Test ICMP Terminé')
      })
      .catch((err) => res.send(err)); 
    })
    .catch((err) => {
      console.log('suppression des logs impossible')
    })
  }); 

  //-------------------------------------------------------------------------------------
  //    FIN PING NETWORK
  //-------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------
  //    SCAN PING AVEC PROMESSE
  //-------------------------------------------------------------------------------------
  
  async function monpingOld(x) {
    var result1 = await ping.promise.probe(x , {
        timeout: 20,
    });
    return new Promise( resolve => {
        setTimeout(function() {
            resolve(result1);
            console.log("La promesse de demande de ping est terminée");
        }, 2000);
    })
  };

  async function monping(x) {
    var result1 = await ping.promise.probe(x , {
        timeout: 20,
    });
    return new Promise( resolve => {
        setTimeout(function() {
            resolve(result1);
            console.log("La promesse de demande de ping est terminée");
        }, 2000);
    })
  };

  function hostping(host) {
    let status = true;
    return new Promise(async function(resolve, reject) {
      
        const res = await ping.promise.probe(host);
        var msg = `host ${host} is ${res.alive ? 'alive' : 'dead'}`;
        console.log(msg);
        if (!res.alive) { status = false; }
      
        console.log('all host checks are done, resolving status');  
        resolve(status);
    });
  }

  function aliveupdate(marequete, setstatus) {
    console.log('update status de la machine');
    return new Promise ((resolve, reject) => {
      networks
      .updateOne(marequete, setstatus)
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('le status de la machine est à jour')
      })


    })
  }

  function insertionlogs(setip, setstatus, setdate, setheure, setname, setcategorie) {
    console.log('insertion événement Ping dans log');
    return new Promise ((resolve, reject) => {
      logsPing
      .insertOne({
         ip : setip,
         status : setstatus,
         date : setdate,
         heure : setheure,
         name : setname,
         categorie: setcategorie})
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('insertion logs est terminée')
      })      
    })
  }

  function insertionlogshisto(setip, setstatus, setdate, setheure, setname, setcategorie) {
    console.log('insertion événement Ping dans loghisto');
    return new Promise ((resolve, reject) => {
      logsPingHisto
      .insertOne({
         ip : setip,
         status : setstatus,
         date : setdate,
         heure : setheure,
         name : setname,
         categorie: setcategorie})
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('insertion logs est terminée')
      })      
    })
  }


  function eraseLog() {
    console.log('Suppression des Logs Ping')
    return new Promise((resolve, reject) => {
      logsPing
      .deleteMany()
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('Fin de suppresion de Logs')
      })
  
    })
  }
  
  
  async function asyncstatusPing() {
  
    let resultat_logs = await eraseLog();
    let resultat_query = await getBaseNetworks()
    .then ( async resultat_query => {

      for (var i = 0; i < resultat_query.length; i++) {
        const v = await hostping(resultat_query[i].ip)
        .then(async v => {
            
            console.log(`resultat ${resultat_query[i].ip} - ${v}`);
            var myquery = {ip: resultat_query[i].ip} ;
            var newvalues = { $set : { status: v }};
            let resultat_alive = await aliveupdate(myquery, newvalues)
            .then (async resultat_alive => {
              if (v===false) {
                console.log('insertOne Logs')
                let ts = Date.now();
                let date_ob = new Date(ts);
                let date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear(); 
                let hours = date_ob.getHours();
                let minutes = date_ob.getMinutes();
                let seconds = date_ob.getSeconds();
                let ma_variable_task = '';
                let date_exec = date + "-" + month + "-" + year;
                let heure_exec = hours+ ":"+ minutes + ":" + seconds;
                let resultat_insertlogs = await insertionlogs(resultat_query[i].ip, v, date_exec, heure_exec, resultat_query[i].name, resultat_query[i].categorie)
                let resultat_insertloghisto = await insertionlogshisto(resultat_query[i].ip, v, date_exec, heure_exec, resultat_query[i].name, resultat_query[i].categorie) 
                console.log("Logs mise à jour")
                res.status(200).send("successfully inserted new document in the logs")              
              }

            })
  

        })
        .catch((err) => {
          console.log("erreur ping");
        });
      }  

    })

  }
  
  routes.get("/pingAvecPromesse", function(req, res) {
    console.log('/pingAvecPromesse')
    countPing ++ ;
    console.log(countPing);
    if (countPing === 1) {
      asyncstatusPing()
      .then(() => {
        console.log('FIN DU SCAN PING AVEC LA NEW PROMESSE')
        res.status(200).send('FIN DU SCAN PING AVEC LA NEW PROMESSE')
        countPing = 0;
      })
    }
  
  
  })

  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //  FIN SCAN PING AVEC PROMESSE
  //--------------------------------------------------------------------------------------






  routes.get('/stopstatus', function() {
    // Stop the interval startet before
    // clearInterval(); <--- How i get the timer object?
    clearInterval(timer);
    console.log("Arret du timer");
  });

  //--------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------
  //OLD SCAN PORT

  routes.get("/scan", function (req, res) {
    networks
    .find()
    .toArray()
    .then((results, error) => {
      if (error) {
        return res.send(error);
      }
      res.status(200).send(results);
      
      for (var x = 0; x < results.length; x++) {
        let monipaddress = results[x].ip;
        let portchaine = "";
        for (var y = 0; y < results[x].types.length; y++ ) {
        
           
            portchaine = portchaine +','+ protocole.convertProtocole(results[x].types[y])
           
          //   portchaine = portchaine +','+ protocole.convertProtocole(results[x].types[y])
          // }
    
        }
        //mesports = protocole.convertProtocole(results[x].types)
        
        ports_final = portchaine.replace(",","");
        //ports_final = ports_final + "'";

        console.log(ports_final);

        const opts = {
          timeout: 900, // 900s = 15m and increases the reliability of scan results
          flags: [
            '-T0', // Paranoid scan type; very slow but accurate
            '--max-retries 10', // Don't give up on slow responding hosts
            '--ttl 200ms', // Accomodate for slow connections by setting the packets TTL value higher
            '--scan-delay 10s', // Account for host 'rate limiting'
            '--max-rate 30', // Slows down packet spewing to account for IDS protections
          ],
          ports: ports_final,
          range: [results[x].ip]
        };
        nmap.scan(opts, function(err, report) {
          if (err) throw new Error(err);
          
          for (let item in report) {
            var resultatScan = JSON.stringify(report[item]);
            
          }
          
          let valeur_etat = [];
          let valeurPort = opts.ports.split(',');
          
          var tableau_sortie = new Array();
          for (var i = 0; i < valeurPort.length; i++ ) {
            if (monipaddress==='192.168.0.201') {
              console.log(resultatScan);
            }
            if (monipaddress==='192.168.0.200') {
              console.log(resultatScan);
            }

            let position_debut = resultatScan.search(`"${valeurPort[i]}"`)
            let position_fin = resultatScan.search(`"${valeurPort[i]}"`) + 80 
            if (position_debut != -1) {
              var chaine_sortie = resultatScan.substring(position_debut, position_fin)  
              console.log(`${monipaddress} : ${chaine_sortie}`);
              if ((chaine_sortie.search('open') != -1) || (chaine_sortie.search('filtered') != -1) ) {
                tableau_sortie[i] = "1"
              } else {
                tableau_sortie[i] = "0"
              }
                          
            } else {
              tableau_sortie[i] = "-1"
            }
            
          }
          console.log(monipaddress)
          console.log(valeurPort)
          console.log(tableau_sortie)
          let marequete = {ip: monipaddress};
          let mesvaleurs = { $set : { scanport: valeurPort , scanresult: tableau_sortie}};
          networks.updateOne( marequete, mesvaleurs, function (err, res) {
            if (err) throw err ;
            console.log(`le host ${monipaddress} à été mise à jour`);
          });
        });       
      }
    })
    .catch((err) => res.send(err));
  });

  //---------------------------------------------------------------------------------------------
  //  FIN OLD SCAN PORT
  //---------------------------------------------------------------------------------------------

  //---------------------------------------------------------------------------------------------
  //    LOGS  LOGS  LOGS
  //---------------------------------------------------------------------------------------------
  



  function getBaseLogsPingHisto(p_limit) {
    console.log('Get de la base Logs Ping Histo')
    return new Promise((resolve, reject) => {
      logsPingHisto
      .find()
      .sort({_id:-1})
      .limit(p_limit)
      .toArray()
      .then((response) => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve(response)
      })
    })
  };

  function getBaseLogsScanHisto(p_limit) {
    console.log('Get de la base Logs Scan Histo')
    return new Promise((resolve, reject) => {
      logsScanHisto
      .find()
      .sort({_id:-1})
      .limit(p_limit)
      .toArray()
      .then((response) => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve(response)
      })
    })
  };

  routes.get("/getLogsPingHisto/:id", function (req, res) {
    console.log("/getLogsPingHisto");
    let nb_limit = parseInt(req.params.id,10) ;
    let retourLogsPingsHisto = getBaseLogsPingHisto(nb_limit)
    .then((retourLogsPingsHisto) => {
      console.log('FIN DE LA NEW PROMESSE Logs Ping Histo')
      res.status(200).send({retourLogsPingsHisto})
      console.log(retourLogsPingsHisto)
    })
  })

  routes.get("/getLogsScanHisto/:id", function (req, res) {
    console.log("/getLogsScanHisto");
    let nb_limit = parseInt(req.params.id,10) ;
    let retourLogsScanHisto = getBaseLogsScanHisto(nb_limit)
    .then((retourLogsScanHisto) => {
      console.log('FIN DE LA NEW PROMESSE Logs Scan Histo')
      res.status(200).send({retourLogsScanHisto})
      console.log(retourLogsScanHisto)

    })
  })

  //---------------------------------------------------------------------------------------------
  //  COUNT 
  //---------------------------------------------------------------------------------------------

  function getBaseLogsPingHistoCount() {
    console.log('Get de la base Logs Ping Histo Count')
    return new Promise((resolve, reject) => {
      logsPingHisto
      .count()
      .then((response) => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve(response)
      })
    })
  };

  function getBaseLogsScanHistoCount() {
    console.log('Get de la base Logs Scan Histo Count')
    return new Promise((resolve, reject) => {
      logsScanHisto
      .count()
      .then((response) => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve(response)
      })
    })
  };

  routes.get("/getLogsPingCount", function (req, res) {
    console.log("/getLogsPingCount");
    let LogsPingsHistoCount = getBaseLogsPingHistoCount()
    .then((LogsPingsHistoCount) => {
      console.log('FIN DE LA NEW PROMESSE Logs Ping Histo Count')
      res.status(200).send({LogsPingsHistoCount})
      console.log(LogsPingsHistoCount)
    })
  })

  routes.get("/getLogsScanCount", function (req, res) {
    console.log("/getLogScanCount");
    let LogsScanHistoCount = getBaseLogsScanHistoCount()
    .then((LogsScanHistoCount) => {
      console.log('FIN DE LA NEW PROMESSE Logs Scan Histo Count')
      res.status(200).send({LogsScanHistoCount})
      console.log(LogsScanHistoCount)

    })
  })

  //---------------------------------------------------------------------------------------------
  //  FIN LOGS  FIN LOGS  FIN LOGS
  //---------------------------------------------------------------------------------------------


  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------
                  //SCAN NEW PROMESSE
  //----------------------------------------------------------------------------------------------

  function getBaseNetworks() {
    console.log('Get de la base Networks')
    return new Promise((resolve, reject) => {
      networks
      .find()
      .toArray()
      .then((response) => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve(response)
      })
    })
  };

  function insertionScanlogs(setip, setport, setdate, setheure, setname, setcategorie) {
    console.log('insertion événement Scan dans log');
    return new Promise ((resolve, reject) => {
      logsScan
      .insertOne({
        ip : setip,
        port : setport,
        date : setdate,
        heure : setheure,
        name : setname,
        categorie : setcategorie})
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('insertion logs est terminée')
      })      
    })
  }

  function insertionScanlogshisto(setip, setport, setdate, setheure, setname, setcategorie) {
    console.log('insertion événement Scan dans loghisto');
    return new Promise ((resolve, reject) => {
      logsScanHisto
      .insertOne({
         ip : setip,
         port : setport,
         date : setdate,
         heure : setheure,
         name : setname,
         categorie : setcategorie})
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('insertion logs est terminée')
      })      
    })
  }


  function eraseScanLog() {
    console.log('Suppression des Logs Scan')
    return new Promise((resolve, reject) => {
      logsScan
      .deleteMany()
      .then(() => {
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('Fin de suppresion de Logs')
      })
  
    })
  }

  function scanAvecPromesse(monipaddress, portchaine,index) {
    console.log('Scan Avec Promesse')
    return new Promise((resolve, reject) => {

      scanpromise(monipaddress, portchaine, 4000)
      .then( v => {

              if (!resolve) {
                reject('reponse fail')
                return false
              }
              resolve(v)

      })
      .catch(error => {

              if (!resolve) {
                reject('reponse fail')
                return false
              }
              resolve(error)
      })
    })
  }

  function updateScanFunc(marequete, mesvaleurs) {
    console.log('Update One Scan')
    return new Promise((resolve, reject) => {
      networks
      .updateOne(marequete, mesvaleurs, function (err,res) {
        if (err) throw err;
        if (!resolve) {
          reject('reponse fail')
          return false
        }
        resolve('updateOne Scan terminé')
      
      })
    })


  }

  async function getScanAvecPromess() {
    let resultat_Scanlogs = await eraseScanLog();
    let resultats = await getBaseNetworks()

    for (var x = 0; x < resultats.length; x++) {
    
      let v_monipaddress = resultats[x].ip;
      let v_name = resultats[x].name;
      let v_categorie = resultats[x].categorie;
      //var tableau_sortie = new Array();
      var valeurPort = new Array();


        for (var y = 0; y < resultats[x].types.length; y++ ) {
        
          let v_portchaine = protocole.convertProtocole(resultats[x].types[y])
          valeurPort[y] = v_portchaine.toString() ;
          let v_index = y ;
          let flagscan = await scanAvecPromesse(v_monipaddress, v_portchaine, v_index )
          console.log(flagscan)
          let v_marequete = {ip: v_monipaddress};
          let v_mesvaleurs = { $set : { [`scanport.${v_index}`]: flagscan.port, [`scanresult.${v_index}`]: flagscan.status}};
          let updateScan = await updateScanFunc(v_marequete, v_mesvaleurs)
          .then (async updateScan => {
            if (flagscan.status==='closed') {
              console.log('insertOne Scan Logs')
              let ts = Date.now();
              let date_ob = new Date(ts);
              let date = date_ob.getDate();
              let month = date_ob.getMonth() + 1;
              let year = date_ob.getFullYear(); 
              let hours = date_ob.getHours();
              let minutes = date_ob.getMinutes();
              let seconds = date_ob.getSeconds();
              let ma_variable_task = '';
              let date_exec = date + "-" + month + "-" + year;
              let heure_exec = hours+ ":"+ minutes + ":" + seconds;
              let resultat_scaninsertlogs = await insertionScanlogs(v_monipaddress, flagscan.port, date_exec, heure_exec, v_name, v_categorie)
              let resultat_scaninsertloghisto = await insertionScanlogshisto(v_monipaddress, flagscan.port, date_exec, heure_exec, v_name, v_categorie) 
              console.log("Logs Scan mise à jour")
              //res.status(200).send("successfully inserted new document in the Scan logs")              
            }

          })

        }      
    }
  }

  routes.get("/scanpro", function (req, res) {
    console.log("/scanpro");
    countScan ++
    console.log(`countScan ${countScan}`)
    if (countScan == 1) {   
      getScanAvecPromess()
      .then(() => {
        console.log('FIN DE LA NEW PROMESSE')
        res.status(200).send('FIN DE LA NEW PROMESSE')
        countScan = 0;
      })
    }

  })

  //----------------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------------
                  //FIN SCAN NEW PROMESSE
  //----------------------------------------------------------------------------------------------


  // -----------------------------------------------------------------------
  // ----------------------------------------------------------------
  // CRUM NETWORK 
  
  routes.put("/networks/update/:id", jsonParser, function (req, res) {
      console.log("/networks/update/:id");
    networks
        .updateOne( {id: req.params.id},{$set : {
          name: req.body.network.name,
          ip: req.body.network.ip,
          status: req.body.network.status,
          categorie: req.body.network.categorie,
          picture : req.body.network.picture,
          types: req.body.network.types,
          scanport: [''],
          scanresult: ['']
        }})
        .then(() => res.status(200).send("sucessfully updated"))
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
  });

  routes.post("/networks/add", jsonParser, function (req, res) {
    console.log("/networks/add");
    networks
      .insertOne(req.body.network)
      .then(() => res.status(200).send("successfully inserted new document"))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });

  routes.delete("/networks/delete/:id", jsonParser, function (req, res) {
    console.log("/networks/delete/:id");
    const mavariable = req.params;
    console.log(mavariable);
      networks
        .deleteOne(mavariable)
        .then(() => res.status(200).send("sucessfully updated"))
        .catch((err) => {
            console.log(err);
           res.send(err);
        })
        console.log('terminé');
  });

  //-----------------------------------------------------------------
  // FIN CRUM NETWORK
  //-----------------------------------------------------------------

  //  ANSIBLE     ANSIBLE   ANSIBLE   ANSIBLE   ANSIBLE
  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------

  routes.get("/ansible", function (req, res) {
    console.log("/ansible") ;
    ansible
      .find()
      .toArray()
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(res);
      })
      .catch((err) => res.send(err));
  });

  routes.get("/ansible/:id", function (req, res) { 
    console.log("/ansible/:id");
    console.log(`id ${req.params.id}`) ;
      ansible
      .findOne({ _id: req.params.id})
      .then((results, error) => {
        if (error) {
            console.log(req.params.ip);
          return res.send(error);
        }
        console.log(req.params.id);
        console.log(results);
        res.status(200).send({ results });
      })
      .catch((err) => res.send(err));
  });



  routes.get("/inventory", function (req, res) {
    console.log('inventory');
    const yaml = require('js-yaml'); //initialize js-yaml
    const fs   = require('fs'); //initialize filestream

    try {
      const obj = yaml.load(fs.readFileSync('./ansible/inventory.yml', 'utf8'));
      //let data = yaml.loadAll(result);
      const critere = obj.all.hosts
      var inventoryTab = []
      var indextab = 0
      Object.entries(critere).forEach(entry => {
        const [key, value] = entry;
        //console.log(value.name);
        let valeur = value.name ;
        inventoryTab[indextab] = valeur;
        indextab ++
      });
      //var indentedJson = JSON.stringify(result, null, 4);
      
      console.log(inventoryTab);
      res.status(200).send({inventoryTab});
    } catch (e) {
      console.log(e); //catch exception
    }

      
  });

  routes.post("/ansible/upload",function(req, res) {
  
    const newpath = PATH_ANSIBLE;
    const file = req.files.file;
    const filename = file.name;
    console.log(filename);
    file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
        console.log('File upload failed');
      }
      res.status(200).send({ message: "File Uploaded", code: 200 });
      console.log('File uploaded')
    });
  });



  //-----------------------------------------------------------------------
  // UPDATE ANSIBLE 
  
  routes.put("/ansible/update/:id", jsonParser, function (req, res) {
    console.log("/ansible/update/:id");
    ansible
      .updateOne( {_id: req.params.id},{$set : {
        nom: req.body.ansible.nom,
        fichier: req.body.ansible.fichier,
        actif: req.body.ansible.actif,
        inventaire: req.body.ansible.inventaire,
        periode : req.body.ansible.periode,
        date: req.body.ansible.date,
        heure: req.body.ansible.heure
      }})
      .then(() => res.status(200).send("sucessfully updated"))
      .catch((err) => {
          console.log(err);
          res.send(err);
      })
  });

  routes.post("/ansible/add", jsonParser, function (req, res) {
    console.log("/ansible/add");
    ansible
      .insertOne(req.body.ansible)
      .then(() => res.status(200).send("successfully inserted new document"))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });

  });

  async function suppressionFichier(x) {

    var result1 = await fs.exists(x, function(exists) {
      if(exists) {
        console.log('Le fichier existe. Suppression ...');
        fs.unlinkSync(x); 
      } else {
        console.log('Le fichier n existe pas ...');
      }  
    });

    return new Promise( resolve => {
        setTimeout(function() {
            resolve('Le Fichier est bien supprimé');
            console.log("La promesse de demande de suppresion de fichier est terminée");
        }, 2000);
    })
  };

  routes.delete("/ansible/delete/:_id", jsonParser, function (req, res) {
    console.log("/ansible/delete/:_id");
    const newpath = PATH_ANSIBLE;
    const mavariable = req.params;
    console.log(mavariable);
    ansible
    .findOne(mavariable)
    .then((results, error) => {
      if (error) {
          console.log('Erreur de recherche');
        return res.send(error);
      }
      //console.log(req.params.id);
      console.log(results.fichier);
      const filePath = `${newpath}${results.fichier}`;
      console.log(filePath);
      suppressionFichier(filePath)
      .then ((resultat) => {
        console.log(resultat)
        ansible
        .deleteOne(mavariable)
        .then(() => {
          console.log('Ansible - suppresion dans la base est terminée')
          res.status(200).send("sucessfully updated")
          console.log('terminé');  
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
          })
        
        //res.status(200).send({ results }); 
      })
      
    })
    .catch((err) => res.send(err));

  });

  //-------------------------------------------------------------------
  //-------------------------------------------------------------------
  //CRON SERVICE

  function parcoursInventaire(nom_inventory) {

    console.log('inventory');
    const yaml = require('js-yaml'); //initialize js-yaml
    const fs   = require('fs'); //initialize filestream
    const newpath = PATH_ANSIBLE;
    const obj = yaml.load(fs.readFileSync(`${newpath}inventory.yml`, 'utf8'));
    //let data = yaml.loadAll(result);
    var inventorykeyTab = []
    var tableauListeHost = []
    var tableauListeHostName = []
    var indextab = 0
    var indextabListHost = 0
    let criterekey = ''
    let flag = true
    if (nom_inventory === 'localhost') {

      tableauListeHost[indextabListHost] = '127.0.0.1'
      tableauListeHostName[indextabListHost] = 'localhost'
      indextabListHost ++

    }
    else if (nom_inventory === '127.0.0.1') {

      tableauListeHost[indextabListHost] = '127.0.0.1'
      tableauListeHostName[indextabListHost] = 'localhost'
      indextabListHost ++
      
    }
    else if ( nom_inventory === 'all') {
        criterekey = obj[nom_inventory]
        try {
            Object.entries(criterekey).forEach(entry => {
                const [key, value] = entry;
        
                Object.entries(obj.all[key]).forEach(entrybis => {
                        flag = false
                        const [key, value] = entrybis
                        console.log(value.name)
                        tableauListeHost[indextabListHost] = value.ansible_host
                        tableauListeHostName[indextabListHost] = value.name 
                        indextabListHost ++
        
                })
        
                inventorykeyTab[indextab] = key
                indextab ++
                
                });
        } catch (e) {
            console.log(e); //catch exception
        }

    } else {
        criterekey = obj.all
        try {
            Object.entries(criterekey).forEach(entry => {
                const [key, value] = entry;
                console.log(key)
                if (nom_inventory !== key ) {
                    Object.entries(obj.all[key]).forEach(entrybis => {
                      if (flag) {  
                        const [key, value] = entrybis
                        console.log(`non match ${value.name}`)
                          if (value.name === nom_inventory) {
                            tableauListeHost[indextabListHost] = value.ansible_host
                            tableauListeHostName[indextabListHost] = value.name                 
                            indextabListHost ++
                          }  
                      }
                    
                    })
                } else {
                    Object.entries(obj.all[key]).forEach(entrybis => {
                        flag = false
                        const [key, value] = entrybis
                        console.log(value.name)
                          tableauListeHost[indextabListHost] = value.ansible_host
                          tableauListeHostName[indextabListHost] = value.name                   
                          indextabListHost ++
                        
                        //}
                    })                    

                }
        
                inventorykeyTab[indextab] = key
                indextab ++
                
                });
        } catch (e) {
            console.log(e); //catch exception
        }
    }

    return {tableauListeHost, tableauListeHostName}
  }



  function tagTaskYAML(nom_fichier, key_task, var_id) {
    const newpath = PATH_ANSIBLE;
    
    const file = fs.readFileSync(`${newpath}${nom_fichier}`, 'utf8');

    let monTableau = file.split('\n');
    let monObjetRetour;
    console.log(monTableau);

    for (var i = 0; i < monTableau.length; i++) {

        if (monTableau[i].indexOf("hosts:")!= -1) {
            let mon_inventaire = monTableau[i].substring(monTableau[i].indexOf("hosts:")+7,monTableau[i].length) ;
            console.log(`Variable Inventaire:"${mon_inventaire}"`)
           
            monObjetRetour = parcoursInventaire(mon_inventaire)

        }

        if (monTableau[i].indexOf("name:")!= -1) {
            if (monTableau[i].indexOf(" -Task")!= -1) {
                monTableau[i] = monTableau[i].substring(0,monTableau[i].indexOf(" -Task")) ;
                console.log(`if task: ${monTableau[i]}`);
            };
            if (key_task != '') {
                monTableau[i] = monTableau[i] + ` -${key_task}`;
            } else {
                monTableau[i] = monTableau[i] ;
            }
            
            console.log(monTableau[i]);
        }
    }
    console.log(`Champs Inventaire IP: ${monObjetRetour.tableauListeHost}`)
    console.log(`Champs Inventaire Name: ${monObjetRetour.tableauListeHostName}`)
    
    let finalString  = monTableau.join('\n');
    console.log(finalString);
    try {
      fs.writeFileSync(`${newpath}${nom_fichier}`, finalString ,{encoding: "utf8"});
      console.log("File written successfully");
    } catch(err) {
      console.error(err);
    }
    var myquery = {_id: var_id};
    console.log(`passage de l'id ${var_id}`)
    var newvalues = { $set : { config: monTableau, inventaireIP: monObjetRetour.tableauListeHost, inventaireName: monObjetRetour.tableauListeHostName }};
    ansible.updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
       console.log(`${myquery} Synchro Config a été mis à jour +`) ;
    }); 

    
  };



  routes.get("/updatejobs", function (req, res) {
    manager1.deleteAll();
    console.log("/crontab") ;
    ansible
      .find()
      .toArray()
      .then((results, error) => {
        if (error) {
          return res.send(error);
        }
        for (var i = 0; i < results.length; i++) {
          if (results[i].actif) {
            var extract_periode = results[i].periode;
            var myquery = {_id: results[i]._id}
            var newvalues = { $set : { crontab: true , cron: false}};
            const newpath = PATH_ANSIBLE;
            const extract_nom = results[i].fichier;
            const num_task =  `Task${i}` ;       
            var newvalues = { $set : { crontab: true , cron: false, task: num_task}};
            var splitted = extract_periode.split(' ');
            const tableauFiltrer = splitted.filter(word => word !=="?");
            console.log(tableauFiltrer);
            var nouvelle_periode = tableauFiltrer[0]+' '+tableauFiltrer[1]+' '+tableauFiltrer[2]+' '+tableauFiltrer[3]+' '+tableauFiltrer[4]+' '+tableauFiltrer[5];
            console.log(nouvelle_periode) ;

            manager1.add(num_task, nouvelle_periode, () => {
              exec(`ansible-playbook ${newpath}${extract_nom} -i ${newpath}inventory.yml` , (error, stdout, stderr) => {
                if (error) {
                  console.error(`error: ${error.message}`);
                  return;
                }
                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                  return;
                } 
                let ts = Date.now();
                let date_ob = new Date(ts);
                let date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear(); 
                let hours = date_ob.getHours();
                let minutes = date_ob.getMinutes();
                let seconds = date_ob.getSeconds();
                let ma_variable_task = '';
                let date_exec = date + "-" + month + "-" + year;
                let heure_exec = hours+ ":"+ minutes + ":" + seconds;
                let fichier_out_tab = stdout.split('\n');
                let resultat_task = '';
                
                for (var i = 0; i < fichier_out_tab.length; i++) {
                
                  if (fichier_out_tab[i].indexOf(" -Task")!= -1) {
                    let ma_limite = fichier_out_tab[i].indexOf("]") ;
                    ma_variable_task = fichier_out_tab[i].substring(fichier_out_tab[i].indexOf("Task"), ma_limite) ;
                    console.log(`ma variable task: ${ma_variable_task}`);
                  };
                  if (fichier_out_tab[i].indexOf("ok=")!= -1) {
                    let resulta_task = fichier_out_tab[i].split(' ');
                    resultat_task = resulta_task.filter(word => word !=="");
                    resultat_task.splice(0,2);
                    
                  }
                    
                }
                let marequete = {task: ma_variable_task};
                let mesvaleurs = { $set : { date: date_exec , heure: heure_exec, log : fichier_out_tab, resultat : resultat_task}};
                ansible.updateOne( marequete, mesvaleurs, function (err, res) {
                  if (err) throw err ;
                  console.log(`la tache ${ma_variable_task} à été mise à jour avec la date d'execution`);
                });

                console.log(heure_exec);
                console.log(fichier_out_tab);
                //console.log(`stdout:\n${stdout}`);

              });  
            },{onComplete: () => { console.log('Ansible Terminé')} });
            const var_id = results[i]._id;
            ansible.updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log(`${extract_nom} a été mis à jour +`) ;
              tagTaskYAML(extract_nom, num_task, var_id);
            }); 


          } else {
            const extract_nom = results[i].fichier;
            const var_id = results[i]._id;
            var myquery = {_id: results[i]._id}
            var newvalues = { $set : { crontab: false, cron: false, task: '' }};            
            ansible.updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err;
              console.log(`${extract_nom} a été mis à jour -`) ;
              tagTaskYAML(extract_nom, '', var_id);
            }); 
          };

        }
        res.status(200).send({manager1});
        console.log(`${manager1}`)
        
      })
      .catch((err) => res.send(err));

  });  
  
  routes.get("/listejobs", function (req, res) {
    ansible
    .find()
    .toArray()
    .then((results, error) => {
      if (error) {
        return res.send(error);
      }
      res.status(200).send(results);
    })
    .catch((err) => res.send(err));
    console.log(`${manager1}`);
    console.log( manager1.listCrons())
  })

  routes.get("/listCrons", function (req, res) {
    let results = manager1.listCrons()
    let array_results = results.split('\n')
      res.status(200).send(array_results);
  })



  routes.get("/startjobs", function (req, res) {
    ansible
    .find()
    .toArray()
    .then((results, error) => {
      if (error) {
        return res.send(error);
      }
      for (var i = 0; i < results.length; i++) {
        if (results[i].crontab) {
          var myquery = {_id: results[i]._id}
          var newvalues = { $set : { cron: true }};
          const extract_nom = results[i].fichier;
          console.log(`Demarrage de ${extract_nom}`);
          ansible.updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log(`${extract_nom} a été mis à jour +`) ;
          }); 

        } 
      }
      res.status(200).send(`Demarrage de tous les jobs ${manager1}`);
    })
    .catch((err) => res.send(err));
    manager1.startAll();
    console.log(`Demarrage tous les jobs ${manager1}`)
  })

  routes.get("/stopjobs", function (req, res) {
    ansible
    .find()
    .toArray()
    .then((results, error) => {
      if (error) {
        return res.send(error);
      }
      for (var i = 0; i < results.length; i++) {
        if (results[i].crontab) {
          var myquery = {_id: results[i]._id}
          var newvalues = { $set : { cron: false }};
          const extract_nom = results[i].fichier;
          console.log(`Arret de ${extract_nom}`);
          ansible.updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log(`${extract_nom} a été mis à jour +`) ;
          }); 

        } 
      }
      res.status(200).send(`Arret de tous les jobs ${manager1}`);
    })
    .catch((err) => res.send(err));
    manager1.stopAll();
    console.log(`Arret de tous les jobs: ${manager1}`)
  })

  //----------------------------------------------------------------------
  // FIN CRON SERVICE
  //----------------------------------------------------------------------

  //----------------------------------------------------------------------
  //----------------------------------------------------------------------
  //ENVOIE DE MAIL

  routes.get("/sendmail", function (req, res) {
    console.log("/sendmail") ;
    let messageBody = 'Bonjour La vie est belle'
    async function sendmail() {

      let testAccount = await nodemailer.createTestAccount();
    

      let transporter = nodemailer.createTransport({
        host: "mail.ogdpc.fr",
        port: 25,
        secure: false, // true for 465, false for other ports
        //auth: {
        //  user: testAccount.user, // generated ethereal user
        //  pass: testAccount.pass, // generated ethereal password
        //},
      });
    
      let info = await transporter.sendMail({
        from: EMAIL_FROM, // sender address
        to: EMAIL_TO, // list of receivers
        subject: "ALERTE SUPERVISION", // Subject line
        text: messageBody, // plain text body
        html: `<b>${messageBody}</b>`, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
      //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }

    function checklog () {

      return new Promise((resolve, reject) => {
        logs
        .find()
        .toArray()
        .then((response) => {
          if (!resolve) {
            reject('reponse fail')
            return false
          }
          resolve(response)
        })

      })
    }

    async function checkFichierLog() {
      let resultlog = await checklog();
      //console.log(resultlog)
      messageBody = JSON.stringify(resultlog)
      console.log(messageBody)

    }

    checkFichierLog()
    .then(() => {
      if (messageBody !== '[]') {
        sendmail()
        .then(() => {
          console.log('Terminé')
          res.status(200).send('sendmail')
        })
        .catch(console.error)
      }
    })
    .catch(console.error)
    
  });

  //----------------------------------------------------------------------
  //  FIN ENVOIE MAIL
  //----------------------------------------------------------------------

  //----------------------------------------------------------------------
  //  GESTION PARAMETRES
  //----------------------------------------------------------------------
  routes.put("/env/update", jsonParser, function (req, res) {
    console.log("/env/update/");
    console.log(req.body.environ)
    env
    .updateOne( {id: "1"},{$set : {
      EMAIL: req.body.environ.EMAIL,
      ICMP: req.body.environ.ICMP,
      TCP: req.body.environ.TCP
    }})
    .then(() => res.status(200).send("sucessfully updated"))
    .catch((err) => {
      console.log(err);
      res.send(err);
    })
  });

  routes.get("/env", function (req, res) {
    console.log("/env") ;
    env
      .find()
      .toArray()
      .then((error, results) => {
        if (error) {
          return res.send(error);
        }
        res.status(200).send({ results });
        console.log(results);
      })
      .catch((err) => res.send(err));
  });



  //----------------------------------------------------------------------
  //  FIN GESTION PARAMETRES
  //----------------------------------------------------------------------



}) ;



//----------------------------------------------------------------------
//FIN ENVOIE DE MAIL
//----------------------------------------------------------------------

//routes
routes.get("/", (req, res) => {
  res.send("Hello World!");
});