import React, { FunctionComponent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/loader';
import NetworkForm from '../components/network-form';
import Network from '../models/network';
import NetworkService from '../services/network-service';
 
type Params = { id: string};
  
const NetworkEdit: FunctionComponent = () => {
    
  const [network, setNetwork] = useState<Network|null>(null);
  const params = useParams()
  
  useEffect(() => {
    NetworkService.getNetwork(params.id)
    .then(network => setNetwork(network));
  }, [params.id]);
    
  return (
    <div>
      { network ? (
        <div className="row">
            <h5 className="header center">Éditer { network.name }</h5>
            <NetworkForm network={network} isEditForm={true} ></NetworkForm>
        </div>
      ) : (
        <h4 className="center"><Loader /></h4>
      )}
    </div>
  );
}
  
export default NetworkEdit