import React, { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Network from '../models/network';
import formatType from '../helpers/format-type';
import NetworkService from '../services/network-service';
import formatImage from '../helpers/format-image';
import "./network-form.scss";
import * as Icon from "react-icons/fc";
  
type Props = {
  network: Network,
  isEditForm: boolean
};

type Field = {
  value: any,
  error?: string,
  isValid?: boolean
};

type Form = {
  picture: Field,
  name: Field,
  ip: Field,
  categorie: Field,
  types: Field
};
  
const NetworkForm: FunctionComponent<Props> = ({network, isEditForm}) => {

  const [form, setForm] = useState<Form>({
    picture: { value: network.picture }, 
    name: { value: network.name, isValid: true},
    ip: { value: network.ip, isValid: true},
    categorie: { value: network.categorie, isValid: true},
    types: { value: network.types, isValid: true},
  });

  const history = useNavigate();
  
  const types: string[] = [
    'SSH', 'HTTP', 'HTTPS', 'RDP', '8080', '8443'
  ];

  const hasType = (type: string) : boolean => {
    return form.types.value.includes(type);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField = {[fieldName]: {value: fieldValue}};

    setForm({...form, ...newField});

  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldName : string = event.target.name;
    const fieldValue : string = event.target.value;
    const newField = {[fieldName]: {value: fieldValue}};

    setForm({...form, ...newField});
  }

  const selectType = (type: string, e: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = e.target.checked;
    let newField: Field;

    if(checked) {
      const newTypes: string[] = form.types.value.concat([type]);
      newField = { value: newTypes };
    } else {
      const newTypes: string[] = form.types.value.filter((currentType: string) => currentType !== type);
      newField = { value: newTypes };
    }

    setForm({...form, ...{types: newField }});

  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (isFormValid) {
      network.picture = formatImage(form.categorie.value);
      network.name = form.name.value;
      network.ip = form.ip.value;
      network.categorie = form.categorie.value;
      network.types = form.types.value;
      
      isEditForm ? updateNetworks() : addNetwork();
    }
    
  };

  // const isAddForm = () => {
  //   return !isEditForm;
  // }

  const validateForm = () => {
    let newForm: Form = form;

    // if(isAddForm()) {
      
    //   const end = ".png";
    //   if(!form.picture.value.endsWith(end)) {
    //     const errorMsg: string = "le fichier n'est pas valide";
    //     const newField: Field = { value: form.picture.value, error: errorMsg, isValid: false};
    //     newForm = { ...form, ...{ picture: newField}};

    //   } else {
    //     const newField: Field = { value: formatImage(form.categorie.value), error: '', isValid: true};
    //     newForm = { ...form, ...{ picture: newField}};
    //   }
    // }
    
    // Validator name
    if(!/^[a-zA-Zàéè0123456789 ]{3,25}$/.test(form.name.value)) {
      const errorMsg: string = 'Le nom du Device est requis (1-25).';
      const newField: Field = { value: form.name.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ name: newField } };
    } else {
      const newField: Field = { value: form.name.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ name: newField } };
    }

    // Validator IP 
    if(!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.){3}(25[0-5]|(2[0-4]|1\d|[1-9]|)\d)$/.test(form.ip.value)) {
      const errorMsg: string = 'Invalid IP Address';
      const newField: Field = {value: form.ip.value, error: errorMsg, isValid: false};
      newForm = { ...newForm, ...{ ip: newField } };
    } else {
      const newField: Field = { value: form.ip.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ ip: newField } };
    }

    // Validator categorie
    if(!/^[a-zA-Zàéè0123456789 ]{2,25}$/.test(form.categorie.value)) {

      console.log(form.categorie.value);
      const errorMsg: string = 'la catégorie ne doit pas dépasser plus de 25 Caractères';
      const newField: Field = {value: form.categorie.value, error: errorMsg, isValid: false};
      newForm = { ...newForm, ...{ categorie: newField } };
    } else {
      const newField: Field = { value: form.categorie.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ categorie: newField } };
    }

    setForm(newForm);
    return newForm.name.isValid && newForm.ip.isValid && newForm.categorie.isValid;
  }

  const isTypesValid = (type: string): boolean => {
    if(form.types.value.length === 1 && hasType(type)) {
      return false;
    }

    if(form.types.value.length >= 3 && !hasType(type)) {
      return false;
    }

    return true;
  };

  const addNetwork = () => {
    NetworkService.addNetwork(network)
    .then(() => history(`/networks`));
  }

  const updateNetworks = () => {
    NetworkService.updateNetwork(network)
    .then(() => history(`/networks/${network.id}`));
  }


  const deleteNetwork = () => {
    NetworkService.deleteNetwork(network)
    .then(() => history(`/networks`));
  }

  const retourFormulaire = () => {
    history('/networks');
  }

   
  return (
    <form onSubmit={e => handleSubmit(e)}>
      <div className="row" style={{width: "60%"}}>
        <div className="col s12 m8 offset-m2">
          <div className="card hoverable"> 
            {isEditForm && (
            <div className="card-image">
              <img src={`/${network.picture}`} alt={network.name} style={{width: '140px', margin: '0 auto'}}/>
              <span className="btn-floating halfway-fab waves-effect waves-light">
                <i onClick={deleteNetwork} className="material-icons">delete</i>
              </span>
            </div>
            )}
            <div className="card-stacked" style={{width: '80%', margin: '0 auto'}}>
              <div className="card-content">

                {/* Nom du Device */}
                  <div className="form-group">
                    <label htmlFor="icon_prefix">Nom du Device</label>
                    <input id="name" name="name" type="text" className="form-control" value={form.name.value} onChange={e => handleInputChange(e)}></input>
                    {form.name.error &&
                    <div className="card-panel red accent-1">
                      {form.name.error}
                    </div>
                    }
                  </div>
                {/* Adresse IP */}
                <div className="form-group">
              
                    <label htmlFor="ip">Adresse IP</label>
                    <input id="ip" name="ip" type="text" className="form-control" value={form.ip.value} onChange={e => handleInputChange(e)}></input>
                    {form.ip.error &&
                    <div className="card-panel red accent-1">
                      {form.ip.error}
                    </div>
                    }
                </div>
                {/* Categorie */}
                <div className="form-group">       
                  <label htmlFor="categorie">Choisissez la catégorie
                    <select className="icons browser-default" name="categorie" id="categorie" value={form.categorie.value} onChange={e => handleSelect(e)} >
                      {/* <option value="" disabled selected>Choisir une catégorie</option> */}
                      <option value="RESEAU">Réseau</option>
                      <option value="SERVEUR">Serveur</option>
                      <option value="WIFI">WIFI</option>
                      <option value="VM">Virtuelle Machine</option>
                      <option value="ESX">ESX</option>
                      <option value="ROUTEUR">Routeur</option> 
                      <option value="FIREWALL">Firewall</option>
                      <option value="STOCKAGE">Stockage</option>
                      <option value="IMPRIMANTE">Imprimante</option>
                      <option value="STATION">Station de Travail</option>
                      <option value="NUTANIX">Nutanix</option>
                    </select>
                  </label>
                  {form.categorie.error &&
                  <div className="card-panel red accent-1">
                    {form.categorie.error}
                  </div>
                  }
                </div>
                {/* types */} 
                <div className="form-group checkbox">
                  <label>Services</label>
                  {types.map(type => (
                    <div key={type} style={{marginBottom: '10px'}}>
                      <label>
                        <input id={type} type="checkbox" className="filled-in" value={type} disabled={!isTypesValid(type)} checked={hasType(type)} onChange={e => selectType(type,e)}></input>
                        <span>
                          <p className={formatType(type)}>{ type }</p>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="center">
                {/* Submit button */}
                <button type="submit" className="button-30">Valider</button>
                {/* cancel button */}
                <button type="button" className="button-30" onClick={retourFormulaire}>Abandon</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
   
export default NetworkForm;