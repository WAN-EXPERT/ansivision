import React, { FunctionComponent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ansible from '../models/ansible';
import formatType from '../helpers/format-type';
import AnsibleService from '../services/ansible-service';
import formatImage from '../helpers/format-image';
import "./ansible-form.scss";
import Switch from "../components/switch.jsx";
import * as Icon from "react-icons/fc";
import { ReCron, CronLocalization, Tab } from '@sbzen/re-cron'
import axios from 'axios';
import { async } from '@firebase/util';
import Loader from '../components/loader';


  
const AnsibleForm = ({ansible, isEditForm}) => {

  const [form, setForm] = useState({
    fichier: { value: ansible.fichier }, 
    inventaire: { value: ansible.inventaire, isValid: true},
    cronValue: { value: ansible.periode, isValid: true},
    nom: { value: ansible.nom, isValid: true},
    actif: { value: ansible.actif, isValid: true}

  });

  const localization = {
      
    common : {
      month: {
        january: 'Janvier',
        february: 'Fevrier',
        march: 'Mars',
        april: 'Avril',
        may: 'Mai',
        june: 'Juin',
        july: 'Juillet',
        august: 'Aout',
        september: 'Septembre',
        october: 'Octobre',
        november: 'November',
        december: 'December'
      },

      dayOfWeek: {
        sunday: 'Dimanche',
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi'
      },
    },
      tabs: {
        seconds : 'secondes',
        minutes: 'Minutes',
        hours: 'Heures',
        day: 'Jour',
        month: 'Mois',
        year: 'Année'
      },
      quartz: {
        day: {
          every: {
            label: 'Chaque Jour'
          },
          dayOfWeekIncrement: {
            label1: 'Chaque',
            label2: 'Jour qui commence par'
          },
          dayOfMonthIncrement: {
            label1: 'Chaque',
            label2: 'Jour qui commence par',
            label3: 'pour le mois'
          },
          dayOfWeekAnd: {
            label: 'Specifiez jour de la semaine (choisir une ou plusieurs)'
          },
          dayOfWeekRange: {
            label1: 'Chaque jour entre',
            label2: 'et'
          },
          dayOfMonthAnd: {
            label: 'Specifiez un jour du mois (choisir une ou plusieurs)'
          },
          dayOfMonthLastDay: {
            label: 'Sur le dernier jour du mois'
          },
          dayOfMonthLastDayWeek: {
            label: 'Sur la dernière semaine du mois'
          },
          dayOfWeekLastNTHDayWeek: {
            label1: 'Sur la fin',
            label2: 'du mois'
          },
          dayOfMonthDaysBeforeEndMonth: {
            label: 'jour(s) avant la fin du mois'
          },
          dayOfMonthNearestWeekDayOfMonth: {
            label1: 'le plus proche jour de la semaine (Lundi au vendredi)',
            label2: 'sur le mois'
          },
          dayOfWeekNTHWeekDayOfMonth: {
            label1: 'Sur',
            label2: 'le mois'
          }
        },
        month: {
          every: {
            label: 'Chaque Mois'
          },
          increment: {
            label1: 'Chaque Mois',
            label2: 'Tous les chaque Mois',
          },
          and: {
            label: 'Spécifiez un mois (choisir un ou plusieurs)'
          },
          range: {
            label1: 'Chaque Mois',
            label2: 'Entre deux mois'
          }
        },
        second: {
          every: {
            label: 'Chaque seconde'
          },
          increment: {
            label1: 'Chaque Seconde',
            label2: 'Toutes les chaque Seconde',
          },
          and: {
            label: 'Specifiez les secondes (Choisir une ou plusieurs)'
          },
          range: {
            label1: 'Chaque seconde',
            label2: 'Entre deux secondes'
          }
        },
        minute: {
          every: {
            label: 'Chaque Minute'
          },
          increment: {
            label1: 'Chaque minute',
            label2: 'Toutes les chaque Minutes',
          },
          and: {
            label: 'Specifiez les minutes (Choisir une ou plusieurs)'
          },
          range: {
            label1: 'Chaque Minute',
            label2: 'Entre deux minutes'
          }
        },
        hour: {
          every: {
            label: 'Chaque Heure'
          },
          increment: {
            label1: 'Chaque Heure',
            label2: 'Toutes les chaque Heures',
          },
          and: {
            label: 'Specifiez les heures (Choisir une ou plusieurs)'
          },
          range: {
            label1: 'Chaque Heure',
            label2: 'Entre deux heures'
          }
        },
        year: {
          every: {
            label: 'Chaque Année'
          },
          increment: {
            label1: 'Chaque Année',
            label2: 'Toutes les chaques Années',
          },
          and: {
            label: 'Specifiez les années (Choisir une ou plusieurs)'
          },
          range: {
            label1: 'Chaque Année',
            label2: 'Entre deux années'
          }
        }
      }
  };

  
  const [cronValue, setCronValue] = useState('0 * * ? * * *');

  const [inventoryList, setInventoryList] = useState([]);

  const [actifValue, setActifValue] = useState(false);

  const [selectedFilePlaybook,setselectedFilePlaybook] = useState();
  const [selectedFile, setSelectedFile] = React.useState(null);
  
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const [showCommentaire, setShowCommentaire] = useState(false);
  

  // useEffect(() => {
  //   AnsibleService.getInventory()
  //   .then((inventoryList) => {
  //     setInventoryList(inventoryList);
  //     console.log(inventoryList);

  //   })
  // },[]);

  useEffect(() => {
    if (isEditForm) {
      setCronValue(ansible.periode);
      setFile(ansible.fichier);
      setActifValue(ansible.actif);
      setFileName(ansible.fichier);
      setShowCommentaire(false);
    }
  }, [])



  const history = useNavigate();
  
  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue= e.target.value;
    const newField = {[fieldName]: {value: fieldValue}};
    console.log(newField);

    setForm({...form, ...newField});
    console.log(form);

  }

  // const handleSelect = (event) => {
  //   const fieldName  = event.target.name;
  //   const fieldValue  = event.target.value;
  //   const newField = {[fieldName]: {value: fieldValue}};

  //   setForm({...form, ...newField});
  // }

  // const selectType = (type , e)  => {
  //    const checked = e.target.checked;
  //    let newField;

  //    if(checked) {
  //      const newTypes = form.types.value.concat([type]);
  //      newField = { value: newTypes };
  //    } else {
  //      const newTypes = form.types.value.filter((currentType) => currentType !== type);
  //      newField = { value: newTypes };
  //    }

  //    setForm({...form, ...{types: newField }});

  //  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = validateForm();

    console.log('Valide form');
    console.log(isFormValid);

    if (isFormValid) {
    //   network.picture = formatImage(form.categorie.value);
    //   network.name = form.name.value;
    //   network.ip = form.ip.value;
    //   network.categorie = form.categorie.value;
    //   network.types = form.types.value;
      
    //   isEditForm ? updateNetworks() : addNetwork();
  
      ansible.nom = form.nom.value;
      ansible.fichier = fileName;
      ansible.periode = cronValue;
      ansible.actif = actifValue;
      ansible.date = "";
      ansible.heure = "";
      ansible.inventaire = ['all'];
      console.log('objet Ansible');
      console.log(ansible);

      if (isEditForm) {
          updateAnsible();
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        AnsibleService.uploadAnsible(formData)
        .then (() => addAnsible());

      };

    }
    
  };

  // const isAddForm = () => {
  //   return !isEditForm;
  // }

  const validateForm = () => {
    let newForm = form;
    console.log('ValidateForm');
    console.log(form.nom.value) ;
    console.log(fileName) ;

  
    if(!/^[a-zA-Zàéè0123456789 ]{3,30}$/.test(form.nom.value)) {
      const errorMsg = "Le nom du Playbook doit contenir entre 3 et 30 caractères).";
      const newField = { value: form.nom.value, error: errorMsg, isValid: false };
      newForm = { ...form, ...{ nom: newField } };
    } else {
      const newField = { value: form.nom.value, error: '', isValid: true };
      newForm = { ...form, ...{ nom: newField } };
    }

    const end = ".yml";
    if(!fileName.endsWith(end)) {
      const errorMsg = "le fichier doit etre une fichier YAML";
      const newField = { value: form.fichier.value, error: errorMsg, isValid: false};
      newForm = { ...newForm, ...{ fichier: newField}};

    } else {
         const newField = { value: form.fichier.value, error: '', isValid: true};
         newForm = { ...newForm, ...{ fichier: newField}};
    } 

    setForm(newForm);
    // return newForm.name.isValid && newForm.ip.isValid && newForm.categorie.isValid;
    return newForm.nom.isValid && newForm.fichier.isValid;
  }

  const onChangeHandlerPlaybook = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }

  const onChangeHandlerInventory = (e) => {
    const selectedFileInventory = e.target.files ;
  }

  const clickActifValue = () => {
    console.log('actif')
    if (actifValue) {
      setActifValue(false);
    } else {
      setActifValue(true);
    };
  }

  const addAnsible = () => {
    AnsibleService.addAnsible(ansible)
    .then(() => history(`/ansible`));
  }

  const updateAnsible = () => {
    AnsibleService.updateAnsible(ansible)
    .then(() => history(`/ansible/${ansible._id}`));
  }


  const deleteAnsible = () => {
    setShowCommentaire(true)
    AnsibleService.deleteAnsible(ansible)
    .then(() => {
      history(`/ansible`)
    });
  }

  const retourFormulaire = () => {
    history('/ansible');
  }

   
  return (
    <div>
    {ansible ? (
    <form onSubmit={e => handleSubmit(e)}>
      <div className="row" style={{width: "60%"}}>
        <div className="col s12 m8 offset-m2">
          <div className="card hoverable"> 
          {isEditForm && (
            <div className="card-image">
                {showCommentaire && <div className="message">Veuillez patienter...</div>}
              <img src={`/ansible-builder.png`} alt={'ansible-builder'} style={{width: '80px', margin: '0 auto'}}/>
                <div className="ansible-actif">
                    { actifValue ? <Icon.FcOk onClick={clickActifValue} size={40} className="menu__icon"/> :
                    <Icon.FcHighPriority onClick={clickActifValue} size={40} className="menu__icon" />}
                </div>
              <span className="btn-floating halfway-fab waves-effect waves-light">
                <i onClick={deleteAnsible} className="material-icons">delete</i>
              </span>
            </div>
            )}
            <div className="card-stacked" style={{width: '100%', margin: '0 auto'}}>
              <div className="card-content">

                {/* Nom du Playbook */}
                <div className="form-group">
                  <label htmlFor="icon_prefix">Nom du Playbook</label>
                  <input id="nom" name="nom" type="text" className="form-control" value={form.nom.value} onChange={e => handleInputChange(e)}></input>
                  {form.nom.error &&
                    <div className="card-panel red accent-1">
                      {form.nom.error}
                    </div>
                    }  
                </div>

                {/* Nom du Fichier Playbook */}
                { !isEditForm ? (  
                  <form method="post" action="#" id="#">
            
                    <div className="form-group fichier">
                      <label>Télécharger le fichier Playbook </label>
                      <input type="file" name="file" className="form-control" onChange={e => onChangeHandlerPlaybook(e)}></input>
                      {form.fichier.error &&
                      <div className="card-panel red accent-1">
                        {form.fichier.error}
                      </div>
                      }
                    </div>
                  
                  </form>
                ) : (
                  
                  <div className="form-group">
                     <label>Le fichier du Playbook est :  </label>
                     <p className='label-fichier'>{ ansible.fichier }</p>
                  </div>  
                  
                )}

                <div className='re-cron'>
                  <div>
                    <input
                      readOnly
                      value={cronValue} />
                    <ReCron
                      localization={localization}
                      value={cronValue}
                      onChange={setCronValue}
                      tabs={[ Tab.MINUTES, Tab.HOURS, Tab.DAY, Tab.MONTH]} />
                  </div>                  
                </div>

              <div className="center">
                {/* Submit button */}
                <button type="submit" className="button-30">Valider</button>
                {/* cancel button */}
                <button type="button" className="button-30" onClick={retourFormulaire}>Abandon</button>
              </div>
              /</div>  
            </div>
          </div>
        </div>
      </div>
    </form>
    ) : (
      <h4 className="center"><Loader /></h4>
     )}
    </div>
  );
};
   
export default AnsibleForm;