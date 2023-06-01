import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import Network from '../models/network';
import NetworkService from '../services/network-service';
import "./network-search.scss";
 
const NetworkSearch: FunctionComponent = () => {
  
  const [term, setTerm] = useState<string>('');
  const [networks, setNetworks] = useState<Network[]>([]);
  const [color, setColor] = useState<string>('#201F23');

  const changeItemsColor =  () => {
    setColor("#2C2D2E")
  }

  const hideItemsColor = () => {
    setColor('#201F23')
  }
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
   
    const term = e.target.value;
    setTerm(term);
 
    if(term.length <= 1) {
      setNetworks([]);
      return;
    }

    NetworkService.searchNetwork(term)
    .then(networks => setNetworks(networks));
 
  }
  
  return (
    <div className="row"> 
    <div className="col s12 m6 offset-m3"> 
      <div className="card" > 
      <div className="card-content"> 
        <div className="input-field"> 
        <input type="text" placeholder="Recherche d'élément actif" value={term} onChange={e => handleInputChange(e)} /> 
        </div> 
        <div className='collection'>
        {networks.map((network) => (
          <Link key={network.id} to={`/networks/${network.id}`} className="collection-item">
            {network.name}
          </Link>
        ))}
        </div> 
      </div> 
      </div> 
    </div> 
    </div>
  );
}
  
export default NetworkSearch;