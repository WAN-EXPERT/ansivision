import React, { useEffect, useState } from "react";
import Switch from "../components/switch.jsx";
import SwitchPort from "../components/switch-port";
import { useNavigate } from 'react-router-dom';
//import NetworkService from "../services/network-service";
import EnvService from "../services/env-service";
//import Env from "../models/env";
import "./settings.scss";
import SwitchMail from "../components/switch-mail.jsx";



function Settings() {

  const history = useNavigate();

  const [triStatut, setTriStatus] = useState(JSON.parse(localStorage.getItem('is-Statut')) || false);
  const [triCategorie, setTriCategorie] = useState(JSON.parse(localStorage.getItem('is-Categorie')) || false);
  const [sendMail, setSendMail] = useState(false);
  const [environ, setEnv] = useState([])
  const [showCommentaire, setShowCommentaire] = useState(false);


  const handle_click = () => {
    setShowCommentaire(true);
    environ.EMAIL = sendMail;
    EnvService.updateEnv(environ)
    .then(() => {
      setTimeout(function() {
        history('/networks');
      }, 2000) ;
    })

    
  }

  const retourFormulaire = () => {
    history('/networks');
  }

  useEffect(() => {
    EnvService.getEnv()
    .then(environ => {
      setEnv(environ)
      console.log(environ)
      setSendMail(environ.EMAIL)
  
    })
    localStorage.setItem('is-Statut', JSON.stringify(triStatut));
    localStorage.setItem('is-Categorie', JSON.stringify(triCategorie));
    //localStorage.setItem('is-Mail', JSON.stringify(sendMail));

  }, []);


  return (
    <div className="container-status">
      <h4>Menu Paramétrage</h4>
      <form>
        <div className="row">
           <div className="col s12 m6 offset-m3">
             <div className="card">
                <div className="card-content">
                  <div className="card-action center">
                    <div className="bouton-centrer">
                      <Switch
                        isOn={triStatut}
                        onColor="#EF476F"
                        handleToggle={() => setTriStatus(!triStatut)}
                      />
                    </div>
                    <div>
                      <h5>Affichage des éléments par Statut</h5>
                    </div>
                  </div>
                  <div className="card-action center">
                    <div className="bouton-centrer">
                      <SwitchPort
                        isOnPort={triCategorie}
                        onColorPort="#4FE445"
                        handleTogglePort={() => setTriCategorie(!triCategorie)}
                      />
                    </div>
                    <div>
                      <h5 className="services">Affichage des éléments par Catégorie</h5>
                    </div>
                  </div>
                  <div className="card-action center">
                    <div className="bouton-centrer">
                      <SwitchMail
                        isOnMail={sendMail}
                        onColorMail="#4FE445"
                        handleToggleMail={() => setSendMail(!sendMail)}
                      />
                    </div>
                    <div>
                      <h5 className="services">Envoie de mails</h5>
                    </div>
                  </div>
                  <div className="card-action center">
                      {/* Submit button */}
                      <button type="button" className="button-30" onClick={handle_click}> Valider </button>
                      {/* cancel button */}
                      <button type="button" className="button-30" onClick={retourFormulaire}>Abandon</button>
                    </div>
                </div>
                {showCommentaire&&<div className="message">Mise à jour des paramatres, Veuillez patienter...</div>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;