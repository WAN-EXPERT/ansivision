import React, { FunctionComponent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/loader';
import AnsibleForm from '../components/ansible-form';
import Ansible from '../models/ansible';
import AnsibleService from '../services/ansible-service';
 
type Params = { id: string};
  
const AnsibleEdit: FunctionComponent = () => {
  const params = useParams()  
  const [ansible, setAnsible] = useState<Ansible|null>(null);
  
  useEffect(() => {
    AnsibleService.getAnsible(params.id)
    .then(network => setAnsible(network));
  }, [params.id]);
    
  return (
    <div>
      { ansible ? (
        <div className="row">
            <h5 className="header center">Éditer { ansible.nom }</h5>
            <AnsibleForm ansible={ansible} isEditForm={true} ></AnsibleForm>
        </div>
      ) : (
        <h4 className="center"><Loader /></h4>
      )}
    </div>
  );
}
  
export default AnsibleEdit