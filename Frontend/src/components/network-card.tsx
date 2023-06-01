import React, { FunctionComponent, useState, useEffect } from "react";
import Network from '../models/network';
import './network-card.scss';
import formatType from '../helpers/format-type';
import { useNavigate } from 'react-router-dom' ;
//import MenuContextClick from './MenuContext';
import * as Icon from "react-icons/fc";
import MenuContextClick from "./MenuContext";
import Loader from '../components/loader';

type Props = {
    network: Network,
    borderColor?: string
};
const  monTableau: Array<string> = [];


const NetworkCard: FunctionComponent<Props> = ({network, borderColor = '#4FE445'}) => {
    const [color, setColor] = useState<string>('#2C2D2E');
    const [valueType, setValueType] = useState<Array<string>>(network.types);
    const [valueStatus, setValueStatus] = useState<boolean>(network.status);
    //const [valueStatus, setValueStatus] = useState<boolean>(false)
    
    
  
    const history = useNavigate();
    
    useEffect(() => {
      setValueType(network.types)
      setValueStatus(network.status)
      console.log(valueType);
      console.log('Passage Hook composant')
    }, [valueType, valueStatus])


    const showBorder = () => {
        setColor(borderColor);
        if (monTableau.length > 10) {
          monTableau.length = 0;
        }
        monTableau.push(network.id);
    }

    const hideBorder = () => {
        setColor('#2C2D2E');
    }

    const goToNetwork = (id: string) => {

        history(`/networks/${id}`);
        
    }
   
    return (
      <div>
     { network ? (
     <div>
          <div><MenuContextClick envoieId={monTableau}/></div> 
          <div id="MyCard" className="col s6 m4 " onClick={() => goToNetwork(network.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>     
          <div className="card horizontal" style={{ borderColor: color }}>
            <div className="card-image"> 
              <div
                  // className="btn-floating btn-small waves-effect waves-light z-depth-1"
                  // style={{ marginTop: "20px", marginLeft: "-50%", padding: "10%", backgroundColor: network.status ? "#5CBC1C" : "#FC4C3E" }}>
                 >
                { network.status ?  <Icon.FcOk size={40} className="menu__icon" style={{marginTop: "10px",marginLeft: "-50%" }}/> :
                <Icon.FcHighPriority size={40} className="menu__icon" style={{marginTop: "10px",marginLeft: "-50%" }}/> }   
               
              </div>
              <img src={`/${network.picture}`} alt={network.name}/> 
            </div>
            <div className="card-stacked">
              
              <div className="card-content">
                <p className="name-device">{network.name}</p>
                <p className="ip-device" style={{color: network.status ? "green" : "red"}} >{network.ip}</p>
                <p className="categorie">{network.categorie}</p>
                {network.types.map((type,index) => (
                     (network.scanresult[index] === 'open') ? 
                    <span key={type} className={formatType(type)}>{type}</span>
                    : (network.scanresult[index] === "filtered") ?  <span key={type} className={formatType('0')}>{type}</span> :
                    <span key={type} className={formatType("-1")}>{type}</span>
                ))}
              </div>
            </div>
          </div> 
        </div>
      </div>
        ) : (
          <h4 className="center"><Loader /></h4>
      )}
      </div>
    );
}

export default NetworkCard;