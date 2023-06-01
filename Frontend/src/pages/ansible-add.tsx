import React, { FunctionComponent, useState } from 'react';
import AnsibleForm from '../components/ansible-form.jsx';
import Ansible from '../models/ansible';

const AnsibleAdd: FunctionComponent = () => {
    const [id] = useState<string>(new Date().getTime().toString());
    const [ansible] = useState<Ansible>(new Ansible(id));

    return (
        <div className="rom">
            <h5 className="header center">Ajouter d'un Playbook</h5>
            <AnsibleForm ansible={ansible} isEditForm={false} ></AnsibleForm>
        </div>

    )
}
export default AnsibleAdd;