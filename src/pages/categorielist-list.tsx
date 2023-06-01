import React, { FunctionComponent, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NetworkCard from "../components/network-card";
import Network from "../models/network";
import NetworkService from "../services/network-service";
import NetworkSearch from "../components/network-search";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-icons/fc";
import './categorielist-list.scss'


// type Props = {
//     isSearch: boolean
// };

//let timer;

//type Params = { _id: string };

const CategorieListList :FunctionComponent = () => {
    const params = useParams()
    const [networking, setNetworking] = useState<Network[]>([]);

    const history = useNavigate();

    
    useEffect(() => {
        console.log(params._id);
        NetworkService.getSearchCategorie(params._id)
        .then((networks) => {
            setNetworking(networks);
        });
    }, []);

    const clickActifValue = () => {
        history('/networks/categorie/')
    }
    


    return (
        <div>
            <h5 className="center">Eléments Actifs de la catégorie {params._id}</h5>
            <div className="cadre-droit">
                <div className="status-droit retour-actif">
                    <Icon.FcPrevious onClick={clickActifValue} size={40} className="menu__ic"/>
                    <p className="">RETOUR</p>
                </div>
            </div>
            <div className="container">
                <div id="MyCard" className="row">
                   
                   
                    {networking.map(network => (
                        <NetworkCard network={network} />
                    ))}
                </div>
                <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3"
                style={{position: 'fixed', bottom: '25px', right: '25px'}}
                to="/networks/add">
                    <i className="material-icons">add</i>
                </Link>
            </div>
        </div>
    );
}

export default CategorieListList;