import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AnsibleService from "../services/ansible-service";
import "./ansible-jobs.scss";
import * as Icon from "react-icons/fc";


function AnsibleJobs({caseJobs}) {

  const history = useNavigate();

  const [ message, setMessage ] = useState('Cliquez sur Valider pour Synchroniser');

  const [ resultabs, setResultab ] = useState([]);
  const [ resultatListeCrons, setresultListeCrons ] = useState([]) ;

  useEffect(() => {
    if (caseJobs===1) {
      setMessage("Cliquez sur Valider pour synchroniser")
    } else if (caseJobs===2) {
      setMessage("Cliquez sur Valider pour avoir la liste des jobs")
    } else if (caseJobs===3) {
      setMessage("Cliquez sur Valider pour stoppper le gestionaire d'événement")
    } else {
      setMessage("Cliquez sur Valider pour démarrer le gestionaire d'événement")
    }
  },[]);

  const getlistjobs = () => {
    console.log('Get de la liste des jobs')
    return new Promise((resolve, reject) => {
      AnsibleService.listejobs()
      .then((retourlistejobs) => {
          if (!resolve) {
              reject('reponse fail')
              return false
          }
          resolve(retourlistejobs)
      })
    })

  }
  const getlistcrons = () => {
    console.log('Get de la liste des crons')
    return new Promise((resolve, reject) => {
      AnsibleService.listcrons()
      .then((retourlistecrons) => {
          if (!resolve) {
              reject('reponse fail')
              return false
          }
          resolve(retourlistecrons)
      })
    })

  }

  const getlistjobscrons = async () => {
    let retourgetlistjobs = await getlistjobs()
    .then( async retourgetlistjobs => {
      setResultab(retourgetlistjobs);
      let retourgetlistcrons = await getlistcrons()
      .then( retourgetlistcrons => {
        setresultListeCrons(retourgetlistcrons)
        console.log(retourgetlistcrons)
    });


    })

  }

  const handle_click = () => {
    if (caseJobs===1) {
        AnsibleService.updatejobs()
        .then((tableauRetour) => {
            if (tableauRetour=200) {
                setMessage('Synchronisation réussie');
                setTimeout(function() {
                  history('/ansible');
                }, 3000 );
            } else {
                setMessage('Synchronisation échouée');
            };
        })
    }
    if (caseJobs===2) {
      getlistjobscrons();
    }


    if (caseJobs===3) {
      AnsibleService.stopjobs()
      .then((tableauRetour) => {
          if (tableauRetour=200) {
              setMessage('Arrêt des tâches réussi');
              setTimeout(function() {
                history('/ansible');
              }, 3000 );
          } else {
              setMessage('Arrêt des tâches échoué');
          };
      })
    }
    if (caseJobs===4) {
      AnsibleService.startjobs()
      .then((tableauRetour) => {
          if (tableauRetour=200) {
              setMessage('Démarrage des tâches réussi');
              setTimeout(function() {
                history('/ansible');
              }, 3000 );
          } else {
              setMessage('Démarrage des tâches échoué');
          };
      })
    }
  }

  const retourFormulaire = () => {
    history('/ansible');
  }

  return (
    <div className="container-status">
      <h4>Gestion des jobs Ansible</h4>
      <form>
        <div className="row">
           <div className="col s12 m6 offset-m3">
             <div className="card">
                <div className="card-content">
                  <div className="bouton-centrer">
                  </div>
                    <div>
                    <h6>{message}</h6>
                    { caseJobs === 2 &&
                      <table>
                        <th>Nom du fichier</th>
                        <th>Code Crontab</th>
                        <th>Dans Crontab</th>
                        <th>Planifiée</th>
                        { caseJobs === 2 &&
                          resultabs.map((resultab) => (
                            <tr>
                              <td>{resultab.fichier}</td>
                              <td>{resultab.periode}</td>
                              <td>
                                { (resultab.crontab) ? <Icon.FcOk size={30} className="menu__icon"/> :
                                <Icon.FcHighPriority size={30} className="menu__icon" />}
                              </td>
                              <td>
                                { (resultab.cron) ? <Icon.FcOk size={30} className="menu__icon"/> :
                                <Icon.FcHighPriority size={30} className="menu__icon" />}
                              </td>
                            </tr>
                          ))                          
                        }  
                      </table> 
                    }
                    { caseJobs === 2 && 
                      <table>
                        {resultatListeCrons.map((resultatCrons) => (
                          <tr>
                            <td className="infocrons">{resultatCrons}</td>
                          </tr>
                        ))}

                      </table>
                    }
                    </div>
                  <div className="card-action center">
                      {/* Submit button */}
                      <button type="button" className="button-30" onClick={handle_click}> Valider </button>
                      {/* cancel button */}
                      <button type="button" className="button-30" onClick={retourFormulaire}>Retour</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AnsibleJobs;
