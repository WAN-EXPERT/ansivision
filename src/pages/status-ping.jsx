import React, { useEffect, useState } from "react";
import Switch from "../components/switch.jsx";
import SwitchPort from "../components/switch-port";
import { useNavigate, Link } from 'react-router-dom';
import NetworkService from "../services/network-service";
import EnvService from "../services/env-service";
import "./status-ping.scss";



function StatusPing() {
  
  // let timer;
  // let timerPort;

  const history = useNavigate();

  const [value, setValue] = useState(false);
  const [valuePort, setValuePort] = useState(false);
  const [environ, setEnv] = useState([])

  const [showCommentaire, setShowCommentaire] = useState(false);

  const funStatus = () => {
    //clearInterval(timer);
    NetworkService.getStatusPing()
    .then( (reponse) => {
      setTimeout(function(){
      },10000)
    })
  };

  const funStatusPort = () => {
    //clearInterval(timerPort);
    NetworkService.getScan()
    .then( (reponse) => {
      setTimeout(function(){
      },10000)
    })
  };

  const funStatusTimer = () => {

    //let timer = setInterval(function() {  
      console.log('Interval is running'); 
      NetworkService.getStatusPing()
      .then(() => {
        setTimeout(function(){
        },10000)
      })
   //}, 120000);
  };

  const funStatusTimerPort = () => {

    //let timerPort = setInterval(function() {  
      console.log('Interval is running'); 
      NetworkService.getScan()
      .then(() => {
        setTimeout(function(){
        },10000)
      })
   //}, 120000);
  };

  const handle_click = () => {
    environ.ICMP = value;
    environ.TCP = valuePort;
    EnvService.updateEnv(environ)
    .then(() => {
      setTimeout(function() {
        setShowCommentaire(true);
        window.location.reload()
        history('/');
      }, 1000) 
    })    
  }

  const retourFormulaire = () => {
    
    history('/');
  }

  useEffect(() => {

    EnvService.getEnv()
    .then(environ => {
      setEnv(environ)
      console.log(environ)
      setValue(environ.ICMP)
      setValuePort(environ.TCP)
    })
    //localStorage.setItem('is-On', JSON.stringify(value));
    //localStorage.setItem('is-OnPort', JSON.stringify(valuePort));
  }, []);


  return (
    <div className="container-status">
      <h4>Synchronisation Status</h4>
      <form>
        <div className="row">
           <div className="col s12 m6 offset-m3">
             <div className="card">
                <div className="card-content">
                  <div className="card-action center">
                    <div className="bouton-centrer">
                      <Switch
                        isOn={value}
                        onColor="#EF476F"
                        handleToggle={() => setValue(!value)}
                      />
                    </div>
                    <div>
                      <h5>Activer le check des status des devices</h5>
                    </div>
                  </div>
                  <div className="card-action center">
                    <div className="bouton-centrer">
                      <SwitchPort
                        isOnPort={valuePort}
                        onColorPort="#4FE445"
                        handleTogglePort={() => setValuePort(!valuePort)}
                      />
                    </div>
                    <div>
                      <h5 className="services">Activer le check des services des devices</h5>
                    </div>
                  </div>
                  <div className="card-action center">
                      {/* Submit button */}
                      <Link to="/" onClick={(handle_click)} style={{ color: '#FFFFFF' }}>Valider</Link>
                      {/* <button type="button" className="button-30" onClick={handle_click}> Valider </button> */}
                      {/* cancel button */}
                      <Link to="/" style={{ color: '#FFFFFF' }}>Retour</Link>
                      {/* <button type="button" className="button-30" onClick={retourFormulaire}>Abandon</button> */}
                    </div>
                </div>
                {showCommentaire&&<div className="message">L'analyse a commencé, Veuillez patienter...</div>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StatusPing;
