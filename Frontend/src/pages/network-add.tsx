import React, { FunctionComponent, useState } from 'react';
import NetworkForm from '../components/network-form';
import Network from '../models/network';

const NetworkAdd: FunctionComponent = () => {
    const [id] = useState<string>(new Date().getTime().toString());
    const [network] = useState<Network>(new Network(id));

    return (
        <div className="rom">
            <h5 className="header center">Ajouter un Device</h5>
            <NetworkForm network={network} isEditForm={false} ></NetworkForm>
        </div>

    )
}
export default NetworkAdd;