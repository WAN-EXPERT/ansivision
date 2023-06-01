
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
      from: 'informatique@agencedpc.fr', // sender address
      to: "ljerome@wanexpert.fr", // list of receivers
      subject: "ALERTE SUPERVISION", // Subject line
      text: messageBody, // plain text body
      html: `<b>${messageBody}</b>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  //------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------

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

  let resultats = await getBaseNetworks()

  for (var x = 0; x < resultats.length; x++) {
  
    let v_monipaddress = resultats[x].ip;
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
        console.log(updateScan)

      }      
  }
}

routes.get("/scanpro", function (req, res) {
   console.log("/scanpro");

   getScanAvecPromess()
   .then(() => {
    console.log('FIN DE LA NEW PROMESSE')
    res.status(200).send('FIN DE LA NEW PROMESSE')
   })

})

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
                  //FIN SCAN NEW PROMESSE
//----------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//PING NETWORK

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

function statusPing() {
  
}


async function asyncstatusPing() {


}

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
