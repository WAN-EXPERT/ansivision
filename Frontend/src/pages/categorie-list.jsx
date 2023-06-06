import React, { useState, useEffect } from "react";
import CategorieCard from "../components/categorie-card";
import NetworkService from "../services/network-service";
import EnvService from "../services/env-service";
import { Link } from 'react-router-dom';
import * as Icon from "react-icons/fc";
import "./categorielist-list.css"

let timer
const CategorieList = () => {
    const [categories, setCategories] = useState([]);
    const [categorieHost, setCategorieHost] = useState([]);
    const [value, setValue] = useState();
    const [valuePort, setValuePort] = useState(false);
    const [sendMail, setSendMail] = useState(false);
    const [environ, setEnv] = useState([])

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
        const retourMethodCategorie = await getMethodCategorie()
            console.log(retourMethodCategorie)

    }

    

    // const sequentialGet = async () => {
    //     const retourCheckPing = await checkPingService();
    //         console.log(retourCheckPing)
    //     .then (async retourCheckPing => {
    //         if (valuePort) {
    //             const retourCheckPort = await checkPortService();
    //             console.log(retourCheckPort)
    //             .then (async retourCheckPort => {
    //                 if (sendMail) {
    //                     const retourSendMail = await sendMailService()
    //                     console.log(retourSendMail)
    //                     .then ( async retourSendMail => {
    //                         const retourMethodCategorie = await getMethodCategorie()
    //                         console.log(retourMethodCategorie)
    //                     })
    //                 } else {
    //                     const retourMethodCategorie = await getMethodCategorie()
    //                     console.log(retourMethodCategorie)                    
    //                 } 
    //             } )
    //         } else {
    //             if (sendMail) {
    //                 const retourSendMail = await sendMailService()
    //                 console.log(retourSendMail)
    //                 .then ( async retourSendMail => {
    //                     const retourMethodCategorie = await getMethodCategorie()
    //                     console.log(retourMethodCategorie)
    //                 })
    //             } else {
    //                 const retourMethodCategorie = await getMethodCategorie()
    //                 console.log(retourMethodCategorie)                    
    //             }               
    //         }
    //     })
    // }

    const sequentialGetuseEffect = async () => {
        const retourCheckVariableEnv = await getEnvPromess();
        console.log(retourCheckVariableEnv)
        setEnv(retourCheckVariableEnv)
        console.log(retourCheckVariableEnv)
        console.log(retourCheckVariableEnv.ICMP)
        setValue(retourCheckVariableEnv.ICMP)
        console.log(value)
        setValuePort(retourCheckVariableEnv.TCP)
        setSendMail(retourCheckVariableEnv.EMAIL)
        getMethodCategorie()
        console.log('Promesse Environnement')
        console.log(value)
        if (value) {
            timer = setInterval( async function() {
            console.log('Dans le timer')
            let retour = await sequentialGet()
            .then (retour => {
                console.log('retour Timer')
            })
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

    const getByCategorieService = () => {
        return new Promise((resolve, reject) => {
            NetworkService.getCategorieService()
            .then((response1) => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve(response1)
            })
        })
    }

    const getByCategorieHost = () => {
        return new Promise((resolve, reject) => {
            NetworkService.getCategorieHost()
            .then((response2) => {
                if (!resolve) {
                    reject('reponse fail')
                    return false
                }
                resolve(response2)
            })
        })

    }

    const getMethodCategorie = async () => {

        let categorieHost = await getByCategorieHost()
        .then ((categorieHost) => {
            setCategorieHost(categorieHost)
        })

        let categories = await getByCategorieService()
        .then ((categories) =>{
            setCategories(categories);
        })    
            
    };

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
  

    return (
        <div>
            <div className="entete">
                <h5>Eléments Actifs / Catégorie</h5>
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
                </div>
            </div>
            <div className="max-width: 50%">
                <div id="MyCard" className="row">
                        {categories.map((categorie, index) => (
                            <CategorieCard key={categorie._id} categorie={categorie} categorieHost={categorieHost[index]} />
                        ))}
                </div>
                <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                style={{position: 'fixed', bottom: '25px', right: '25px'}}
                to="/networks/add">
                    <i className="material-icons">add</i>
                </Link>
            </div>
        </div>
    );
}

export default CategorieList;