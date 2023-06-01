import React, { FunctionComponent, useEffect, useState } from "react";
import LogsPingHisto from "../models/logsPingHisto";
import LogsScanHisto from "../models/logsScanHisto";
import './ansible-item.scss';
import formatCron from '../helpers/format-cron';
import { useNavigate } from 'react-router-dom' ;
import * as Icon from "react-icons/fc";
import { ReactComponent as BrandIcon } from "../images/bell.svg";


type Props = {
    logsPing: LogsPingHisto,
    borderColor?: string
};

const LogsItem: FunctionComponent<Props> = ({logsPing, borderColor = '#4FE445'}) => {
    const [color, setColor] = useState<string>();

    const [cat_total, setCat_total] = useState<number>(0);
    const [cat_count, setCat_count] = useState<number>(0);
    
  
    const history = useNavigate();
    
    //const affichageCron = formatCron(ansible.periode);

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
     
         <li className="collection-item avatar">
            {/* <img src={`ansible-builder.png`} alt={'ansible_build'} className="circle"/> 
            <BrandIcon />
            <div className="secondary-content">
                    { (ansible.actif) ? <Icon.FcOk size={40} className="menu__icon"/> :
                    <Icon.FcHighPriority size={40} className="menu__icon" />}
            </div> */}
           
            <table className="bordered striped cadre">
                <tbody>
                    <tr>
                        <td className="ansible-titre">Nom Device: </td>
                        <td className="ansible-champ">{logsPing.name}</td>
                        <td className="ansible-titre">Adresse IP  : </td>
                        <td className="ansible-champ">{logsPing.ip}</td>
                    </tr>
                    <tr>
                        <td className="ansible-titre">Catégorie : </td>
                        <td className="ansible-champ">{logsPing.categorie}</td>
                        <td className="ansible-titre">Status : </td>
                        <td className="ansible-champ">{logsPing.status}</td>
                    </tr>
                  
                    <tr>
                        <td className="ansible-titre">Date :</td>
                        <td className="ansible-cron">{logsPing.date}</td>
                        <td className="ansible-titre">Heure :</td>
                        <td className="ansible-champ">{logsPing.heure}</td>
                    </tr>

                </tbody>
            </table>

        </li>
    
    );
}

export default LogsItem;