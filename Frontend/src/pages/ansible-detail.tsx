import React, { FunctionComponent, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Ansible from '../models/ansible';
import formatCron from '../helpers/format-cron';
import AnsibleService from '../services/ansible-service';
import './ansible-detail.scss'
import Loader from '../components/loader';
import * as Icon from "react-icons/fc";
  
//type Params = { id: string };
  
const AnsibleDetail: FunctionComponent = () => {

  const params = useParams()  
  const [ansible, setAnsible] = useState<Ansible|null>(null);
  const [togglelog, setTogglelog] = useState<boolean>(false);
  const [toggleconf, setToggleconf] = useState<boolean>(false);

  const toggleLogSwitch = () => {
    if (togglelog) {
      setTogglelog(false)
    } else {
      setTogglelog(true)
    };
  };
  
  const toggleConfSwitch = () => {
    if (toggleconf) {
      setToggleconf(false)
    } else {
      setToggleconf(true)
    };

  }

  useEffect(() => {
    AnsibleService.getAnsible(params.id)
    .then(ansible => setAnsible(ansible));
  }, [params.id]);
    
  return (
    <div>
      { ansible ? (
        <div className="row" style={{width: "60%",  marginTop: "8em"}}>
          <div className="col s12 m8 offset-m2"> 
            <h5 className="header center">{ ansible.nom }</h5 >
            <div className="card hoverable"> 
              <div className="card-image" style={{color: "#2C2D2E"}}>
                <img src={`/ansible-builder.png`} alt={"ansible-builder.png"} style={{width: '140px', margin: '0 auto'}}/>
                <Link to={`/ansible/edit/${ansible._id}`} className="btn btn-floating halfway-fab waves-effect waves-light">
                <i className="material-icons">edit</i>
                </Link>
              </div>
              <div className="card-stacked" style={{width: '80%', margin: '0 auto'}} >
                <div className="card-content">
                  <table className="bordered striped">
                    <tbody>
                      <tr> 
                        <td className='td_margin_titre'>Nom</td> 
                        <td className='td_margin_titre'>{ ansible.nom }</td> 
                      </tr>
                      <tr> 
                        <td className='td_margin_vert'>Nom du Fichier</td> 
                        <td className='td_margin_vert'><strong>{ ansible.fichier }</strong></td> 
                      </tr> 
                      <tr> 
                        <td className='td_margin_blanc'>Périodicité</td> 
                        <td className='td_margin_blanc'><strong>{formatCron(ansible.periode)}</strong></td> 
                      </tr> 
                      <tr> 
                        <td className='td_margin_vert'>Date dernière execution</td> 
                        <td className='td_margin_vert'>
                           <span>{ ansible.date} : { ansible.heure }</span>
                        </td> 
                      </tr> 
                      <tr> 
                        <td className='td_margin_blanc'>Statut du Playbook</td> 
                        <td className='td_margin_blanc'>
                        { (ansible.actif) ? <Icon.FcOk size={40} className="menu__icon"/> :
                            <Icon.FcHighPriority size={40} className="menu__icon" />}
                        </td> 
                      </tr> 
                    </tbody>
                  </table>
                </div>
                <div className="button-form">
                  <Link to="/ansible">Retour</Link>
                </div>
                <div className="card-action center">
                    { (ansible.resultat[0].indexOf("ok=") !==-1)  &&
                    <> 
                      { (ansible.resultat[0].indexOf("ok=") !==-1)  &&  (togglelog) ?
                        <button type="button" className="button-30" onClick={toggleLogSwitch}>Log<Icon.FcCollapse size = {40} className="menu__icon"></Icon.FcCollapse></button> :
                        <button type="button" className="button-30" onClick={toggleLogSwitch}>Log<Icon.FcExpand size = {40} className="menu__icon"></Icon.FcExpand></button> } 
                    </> 
                    }
                    { (ansible.config[0].indexOf("---") !==-1) &&
                    <>
                     { (toggleconf) ?
                       <button type="button" className="button-30" onClick={toggleConfSwitch}>Config<Icon.FcCollapse size = {40} className="menu__icon"></Icon.FcCollapse></button> :
                       <button type="button" className="button-30" onClick={toggleConfSwitch}>Config<Icon.FcExpand size = {40} className="menu__icon"></Icon.FcExpand></button> }                      
                    </>
                    }
                </div>
              </div>
            </div>
          </div>
          { togglelog &&
          <div className="col s12 m8 offset-m2">
            { (ansible.resultat[0].indexOf("ok=") !=-1) &&
              <h5 className="header center titre-ansible-detail">Détail retour Ansible</h5 >
            }
            { (ansible.resultat[0].indexOf("ok=") !=-1) &&
              <div className="card hoverable"> 
                <td>
                    {ansible.log.map(el => (
                    <div className={ (ansible.resultat[3].indexOf('0')!=-1) ? 'element-ansible-detail-ok' : 'element-ansible-detail-ko'} key={el}> {el} </div>))}
                </td>
              </div>
            }
          </div>
          }
          { toggleconf &&
            <div className="col s12 m8 offset-m2">
              <h5 className="header center titre-ansible-detail">Fichier de configuration Ansible</h5 >
              <>
                { (ansible.config[0].indexOf("---") !==-1) ? 
                <div className="card hoverable">
                    <td>
                      { ansible.config.map(el => (
                        <div className="config" key={el}>{el.replace(/ /g, "\u00a0")}</div>
                      ))}

                    </td>
                </div>
                :
                alert("Veuillez faire une synchronisation des événements svp")
                }
              </>
            </div>
          }
        </div>
      ) : (
        <h4 className="center"><Loader /></h4>
      )}
    </div>
  );
}
  
export default AnsibleDetail;