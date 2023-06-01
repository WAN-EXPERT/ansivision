import React, { useState, useEffect } from "react";
import AnsibleService from "../services/ansible-service";
import Ansible from "../models/ansible";
import { Link } from 'react-router-dom';
import "./ansible-list.scss";
import AnsibleItem from "../components/ansible-item";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

// type Props = {
//     isSearch: boolean
// };

let timer;

const AnsibleList = () => {
    const [ansibleListe, setAnsibleList] = useState([]);

    useEffect(() => {
        AnsibleService.getAnsibleList()
        .then((ansibleListe) => {
            setAnsibleList(ansibleListe);
            console.log(ansibleListe);
        });
    }, []);

    return (
        <div>
            <div className="container">
                <div className="menu-ansible">
                    <nav>
                        <div className="nav-wrapper">
                            
                            <ul id="nav-mobile" class="left hide-on-med-and-down">
                                <li>
                                    <Link to='/ansible/updatejobs'>Synchronisé les événements</Link>
                                </li>                              
                                <li>
                                    <Link to='/ansible/listejobs'>Liste les événements</Link>
                                </li>
                                <li>
                                    <Link to='/ansible/stopjobs'>Arreter le gestionaire d'événements</Link>
                                </li>
                                <li>
                                    <Link to='/ansible/startjobs'>Démarrer le gestionaire d'événements</Link>
                                </li>
                            </ul>
                            <a href="#" class="right-titre-ansible">Ansible Menu</a>
                        </div>
                       
                    </nav>
                </div>
                <h5 className="center m-ansible">Liste des Tâches Ansible</h5>
                <ul class="collection">
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={false} transitionEnterTimeout={5000} transitionEnter={true} transitionLeave={false}> 
                        {ansibleListe.map((ansible) => (
                            <AnsibleItem ansible={ansible} />
                        ))}
                    </ReactCSSTransitionGroup>
                </ul> 
                <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                 style={{position: 'fixed', bottom: '25px', right: '25px'}}
                 to="/ansible/add">
                    <i className="material-icons">add</i>
                </Link>
            </div>
        </div>
    );
}

export default AnsibleList;