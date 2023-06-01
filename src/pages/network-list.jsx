import React, { useState, useEffect } from "react";
import NetworkCard from "../components/network-card";
import NetworkService from "../services/network-service";
import EnvService from "../services/env-service";
import { Link } from 'react-router-dom';
import NetworkSearch from "../components/network-search";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-icons/fc";
import Loader from '../components/loader';
import "./network-list.scss"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let timer

const NetworkList = ({isSearch}) => {
    const [networks, setNetworks] = useState([]);
    const [value, setValue] = useState(false);
    const [valuePort, setValuePort] = useState(false);
    const [triStatut, setTriStatus] = useState(JSON.parse(localStorage.getItem('is-Statut')) || false);
    const [triCategorie, setTriCategorie] = useState(JSON.parse(localStorage.getItem('is-Categorie')) || false);
    const [sendMail, setSendMail] = useState(false);
    const [panelRouge, setPanelRouge] = useState(false)
    const [environ, setEnv] = useState([])
    //const [inProp, setInProp] = useState(false);
     
    const history = useNavigate();
    

    useEffect(() => {
        sequentialGetuseEffect()
    }, [value, valuePort, sendMail]);




    const sequentialGet = async () => {
        const retourCheckPing = await checkPingService();
            console.log(retourCheckPing)
        if (valuePort) {
            const retourCheckPort = await checkPortService();
            console.log(retourCheckPort)
        }
        if (sendMail) {
            const retourSendMail = await sendMailService()
            console.log(retourSendMail)
        }
        const retourMethodTri = await PromMethodTri()
            console.log(retourMethodTri)
        //console.log(retourCheck);

    }

    const sequentialGetuseEffect = async () => {
        const retourCheckVariableEnv = await getEnvPromess();
        console.log(retourCheckVariableEnv)
        setEnv(retourCheckVariableEnv)
        console.log(retourCheckVariableEnv)
        setValue(retourCheckVariableEnv.ICMP)
        setValuePort(retourCheckVariableEnv.TCP)
        setSendMail(retourCheckVariableEnv.EMAIL)
        setTriStatus(JSON.parse(localStorage.getItem('is-Statut')))
        setTriCategorie(JSON.parse(localStorage.getItem('is-Categorie')))
        getMethodTri()
        console.log('Promesse Environnement')
        console.log(value)
        if (value) {
            timer = setInterval(function() {
            console.log('Dans le timer')
            sequentialGet()
            }, 120000);
        } 

    }

    const getEnvPromess = () => {
        console.log('Get des variable d environnement')
        return new Promise((resolve, reject) => {
            EnvService.getEnv()
            .then((environ) => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve(environ)
            })
        })

    }

    const checkPortService = () => {
        console.log('Interval Check Service with Hook')
        return new Promise((resolve, reject) => {
            NetworkService.getScan()
            .then(() => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve('checkPortService')
            })
        })
    }

    const sendMailService = () => {
        console.log('Envoie de mail')
        return new Promise((resolve, reject) => {
            NetworkService.sendMailStatus()
            .then(() => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve('sendMailService')                
            })
        })
    }

    const checkPingService = () => {
        console.log('Interval Ping is running with Hook');
        return new Promise((resolve, reject) => {
            NetworkService.getStatusPing()
            .then(() => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve('checkPingService')                
            })    
        })
    }

    const PromMethodTri = () => {
        console.log('Interval Affichage avec tri with Hook');
        return new Promise((resolve, reject) => {
            getMethodTri()
            .then(() => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve('retourAffichage')                
            })    
        })
        
    }
    
    const getMethodTri = () => {
        if (triStatut && !triCategorie)  {
            NetworkService.getNetworkstriStatut()
            .then(networks =>  {
                setNetworks(networks)
            });
        } else if ( !triStatut && triCategorie) {
            NetworkService.getNetworkstriCategorie()
            .then(networks =>  {
                setNetworks(networks)
            });
        } else if ( triStatut && triCategorie) {
            NetworkService.getNetworkstriStatutCategorie()
            .then(networks =>  {
                setNetworks(networks)
            });
        } else {
            NetworkService.getNetworks()
            .then(networks =>  {
                setNetworks(networks)
            }); 
        }
    }

    return (
        <div>
            { networks ? (
            <div>
                
                <div className="entete">
                    <h5>Eléments Actifs</h5>
                    <div className="cadre-droit">
                        <div className="status-droit">
                            <div className="scan-ping">Scan ICMP
                    
                                { value ?  <Icon.FcOk size={30} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px"}}/> :
                                <Icon.FcCancel size={20} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px"}}/> }   
                    
                            </div>
                            <div className="scan-port">Scan  TCP

                                { valuePort ?  <Icon.FcOk size={30} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px" }}/> :
                                <Icon.FcCancel size={20} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px" }}/> }  

                            </div>
                        </div>
                        <div className="status-droit">
                            <div className="scan-ping">Tri Status
                    
                                { triStatut ?  <Icon.FcOk size={30} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px"}}/> :
                                <Icon.FcCancel size={20} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px"}}/> }   
                    
                            </div>
                            <div className="scan-port">Tri Catégorie

                                { triCategorie ?  <Icon.FcOk size={30} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px" }}/> :
                                <Icon.FcCancel size={20} className="nav__icon" style={{marginTop: "5px",marginLeft: "5px" }}/> }  

                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    {isSearch && <NetworkSearch />}
                    <div id="MyCard" className="row">
                        <ReactCSSTransitionGroup transitionName="anim" transitionAppear={false} transitionEnterTimeout={5000} transitionEnter={true} transitionLeave={false}>
                            {networks.map(network => (
                                <NetworkCard key={network.id} network={network} />
                                
                            ))}
                        </ReactCSSTransitionGroup>
                    </div>
                    <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                    style={{position: 'fixed', bottom: '25px', right: '25px'}}
                    to="/networks/add">
                        <i className="material-icons">add</i>
                    </Link>
                </div>
            </div>
        ) : (
            <h4 className="center"><Loader /></h4>
        )}
        </div>
    );
}

export default NetworkList;