import React, { FunctionComponent, useEffect, useState } from "react";
import categorie from '../models/categorie';
import categorieHost from '../models/categorieHost';
import './categorie-card.scss';
import formatType from '../helpers/format-type';
import { useNavigate } from 'react-router-dom' ;
import * as Icon from "react-icons/fc";

type Props = {
    categorie: any,
    borderColor?: string
    categorieHost : any
    index : any
};

const CategorieCard: FunctionComponent<Props> = ({categorie, index, categorieHost, borderColor = '#4FE445'}) => {
    const [color, setColor] = useState<string>();

    const [cat_total, setCat_total] = useState<number>(0);
    const [cat_up, setCat_up] = useState<number>(0);
    const [cat_down, setCat_down] = useState<number>(0);
    const [cat_eteint, setCat_eteint] = useState<number>(0);
    const [host_total, setHost_total] = useState<number>(0);
    const [host_up, setHost_up] = useState<number>(0);
    const [hostAlive, setHostAlive] = useState<boolean>();
    const [serviceAlive, setServiceAlive] = useState<boolean>();

  
    const history = useNavigate();
    


    const showBorder = () => {
        setColor(borderColor);
    }

    const hideBorder = () => {
        setColor('#2C2D2E');
    }

    const goToNetwork = (id: string) => {

        history(`/networks/${id}`);
        
    }

    useEffect (() => {

        setCat_up(categorie.up);
        setCat_total(categorie.total);
        setCat_down(categorie.down);
        setHost_up(categorieHost.count);
        setHost_total(categorieHost.total);

    }, [hostAlive, serviceAlive, cat_down, host_up]);

    const goToCategorie = ( _id: string) => {
      history(`/networks/categories/${_id}`);
    };
   
    return (
     <div>
          <div id="MyCard" className="col s6 m4" onClick={() => goToCategorie(categorie._id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>     
          <div className="card horizontal MyCard-Categorie" style={{ borderColor: color, backgroundColor: (categorie.down) ? "#FC4C3E" :  (categorie.up!==categorie.total) ?  "#FC4C3E" : "#2C2D2E" }}>
            <div className="card-image"> 
              <>
            
                { (categorie.up===categorie.total) ?  <Icon.FcOk size={40} className="menu__icon" style={{marginTop: "10px",marginLeft: "-50%" }}/> :
                <Icon.FcHighPriority size={50} className="menu__icon" style={{marginTop: "10px",marginLeft: "-50%" }}/> }   
                <p className="host_alive">Machine en Service</p>

              </>
              
              <img src={`/${categorie._id}.PNG`} alt={categorie._id}/> 

              <>
            
                { (!categorie.down) ?  <Icon.FcOk size={40} className="menu__icon" style={{marginTop: "10px",marginLeft: "-50%" }}/> :
                <Icon.FcHighPriority size={50} className="menu__icon" style={{marginTop: "10px",marginLeft: "-50%" }}/> }   
                <p className="host_alive">Synthèse des Services</p>
            

              </>
            </div>
            <div className="card-stacked">
              
              <div className="card-content">
                <div>
                  <p className="name-device">{categorie._id}</p>
                </div>
                <table className="bordered striped">
                  <tbody>
                      <tr>
                        <td className="ip-device">Device Total: </td>
                        <td className="ip-online">{categorieHost.total}</td>
                      </tr>
                      <tr>
                        <td className="ip-device">Device Actif: </td>
                        { (host_up==0) ? <td className="ip-offline">{categorieHost.count}</td> : <td className="ip-online">{categorieHost.count}</td>}
                      </tr>
                  </tbody>   
                  <tbody>  
                      <tr>
                        <td className="ip-device"> Service Total: </td>
                        <td className="ip-device">{categorie.total}</td>
                      </tr>
                      <tr>
                        <td className="ip-device">Service Online: </td>
                        { (cat_up==0) ? <td className="ip-offline">{categorie.up}</td> : <td className="ip-online">{categorie.up}</td>}
                      </tr>
                      <tr>
                        <td className="ip-device">Service Arreté: </td>
                        { (cat_down==0) ? <td className="ip-online">{categorie.down}</td> : <td className="ip-offline">{categorie.down}</td>}
                      </tr>
                   
                  </tbody>
                </table>
              </div>
            </div>
          </div> 
        </div>
      </div>
    );
}

export default CategorieCard;