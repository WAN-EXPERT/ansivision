import React, { FunctionComponent, useEffect, useState } from "react";
import Ansible from '../models/ansible';
import './ansible-item.scss';
import formatCron from '../helpers/format-cron';
import { useNavigate } from 'react-router-dom' ;
import * as Icon from "react-icons/fc";
import { ReactComponent as BrandIcon } from "../images/bell.svg";


type Props = {
    ansible: Ansible,
    borderColor?: string
};

const AnsibleItem: FunctionComponent<Props> = ({ansible, borderColor = '#4FE445'}) => {
    const [color, setColor] = useState<string>();

    const [cat_total, setCat_total] = useState<number>(0);
    const [cat_count, setCat_count] = useState<number>(0);
    
  
    const history = useNavigate();
    
    const affichageCron = formatCron(ansible.periode);

    const showBorder = () => {
        setColor(borderColor);
    }

    const hideBorder = () => {
        setColor('#2C2D2E');
    }

    const goToAnsible = (id: string) => {

        history(`/ansible/${id}`);
        
    }
   
    return (
     
         <li className="collection-item avatar" onClick={() => goToAnsible(ansible._id)}>
            <img src={`ansible-builder.png`} alt={'ansible_build'} className="circle"/> 
            <BrandIcon />
            <div className="secondary-content">
                    { (ansible.actif) ? <Icon.FcOk size={40} className="menu__icon"/> :
                    <Icon.FcHighPriority size={40} className="menu__icon" />}
            </div>
           
            <table className="bordered striped cadre">
                <tbody>
                    <tr>
                        <td className="ansible-titre">Nom du Playbook: </td>
                        <td className="ansible-champ">{ansible.nom}</td>
                        <td className="ansible-titre">Nom du Fichier  : </td>
                        <td className="ansible-champ">{ansible.fichier}</td>
                    </tr>
                    <tr>
                        <td className="ansible-titre">Date Dernière execution  : </td>
                        <td className="ansible-champ">{ansible.date}</td>
                        <td className="ansible-titre">Heure Dernière execution : </td>
                        <td className="ansible-champ">{ansible.heure}</td>
                    </tr>
                    { (ansible.actif) &&
                    <tr>
                        <td className="ansible-titre">Tâche planifiée :</td>
                        <td className="ansible-cron">
                            { (ansible.crontab) ? <Icon.FcClock size={40}/> :
                            <Icon.FcCancel size={40}/>}
                            <p>{affichageCron}</p>
                        </td>
                        <td className="ansible-titre">En attende d'execution :</td>
                        <td>
                            { (ansible.cron) ? <Icon.FcAlarmClock size={40}/> :
                            <Icon.FcCancel size={40}/>}
                        </td>
                    </tr>
                    }
                    { (ansible.resultat[0].indexOf("ok=") !=-1) &&
                    <tr>
                        <td className="ansible-titre">Résultat Ansible</td>
                        <td className={(ansible.resultat[3].indexOf("0") !=-1) ? "ansible-resultat-ok" : "ansible-resultat-ko"}>
                            {ansible.resultat.map(el => (
                            <span key={el}> {el} </span>
                        ))}
                        </td>
                        <td className="ansible-titre">Statut Ansible</td>
                        <td>
                            { (ansible.resultat[3].indexOf("0") !=-1) ?  <Icon.FcApproval size={40}/> :
                            <Icon.FcDisapprove size={40}/>
                            }
                        </td>
                    </tr>
                    }
                </tbody>
            </table>

        </li>
    
    );
}

export default AnsibleItem;