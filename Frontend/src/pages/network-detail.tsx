import React, { FunctionComponent, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Network from '../models/network';
import formatType from '../helpers/format-type';
import NetworkService from '../services/network-service';
import Loader from '../components/loader';
import './network-detail.scss'
  
type Params = { id: string };
  
const NetworksDetail: FunctionComponent = () => {
  
  const params = useParams()
  const [network, setNetwork] = useState<Network|null>(null);
  
  useEffect(() => {
    NetworkService.getNetwork(params.id)
    .then(network => setNetwork(network));
  }, []);
    
  return (
    <div>
      { network ? (
        <div className="row" style={{width: "60%",  marginTop: "8em"}}>
          <div className="col s12 m8 offset-m2"> 
            <h5 className="header center">{ network.name }</h5 >
            <div className="card hoverable"> 
              <div className="card-image" style={{color: "#2C2D2E"}}>
                <img src={`/${network.picture}`} alt={network.name} style={{width: '140px', margin: '0 auto'}}/>
                <Link to={`/networks/edit/${network.id}`} className="btn btn-floating halfway-fab waves-effect waves-light">
                <i className="material-icons">edit</i>
                </Link>
              </div>
              <div className="card-stacked" style={{width: '80%', margin: '0 auto'}} >
                <div className="card-content">
                  <table className="bordered striped">
                    <tbody>
                      <tr> 
                        <td className='td_margin_blanc'>Nom</td> 
                        <td className='td_margin_blanc'><strong>{ network.name }</strong></td> 
                      </tr>
                      <tr> 
                        <td className='td_margin_vert'>Adresse IP</td> 
                        <td className='td_margin_vert'><strong>{ network.ip }</strong></td> 
                      </tr> 
                      <tr> 
                        <td className='td_margin_blanc'>Catégorie</td> 
                        <td className='td_margin_blanc'><strong>{ network.categorie }</strong></td> 
                      </tr> 
                      <tr> 
                        <td className='td_margin_vert'>Services</td> 
                        <td className='td_margin_vert'>
                          {network.types.map(type => (
                           <span key={type} className={formatType(type)}>{type}</span>
                          ))}</td> 
                      </tr> 
                    </tbody>
                  </table>
                </div>
                <div className="button-form">
                  <Link to="/networks">Retour</Link>
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
  
export default NetworksDetail;