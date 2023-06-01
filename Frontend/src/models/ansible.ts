export default class Ansible {
    // 1. Typage des propiétés de ansible.
    _id: string;
    fichier: string;
    inventaire: string;
    periode: string;
    nom : string;
    actif : boolean;
    date : string;
    heure : string;
    crontab : boolean;
    cron : boolean;
    task : string;
    log: Array<string>;
    resultat : Array<string>;
    config: Array<string>;
    inventaireIP: Array<string>;
    inventaireName: Array<string>;
        
    // 2. Définition des valeurs par défaut des propriétés de ansible.
    constructor(
     _id: string ='',
     fichier: string = '',
     inventaire: string = '',
     periode: string = '',
     nom: string = '',
     actif : boolean = false,
     date : string = '',
     heure : string = '',
     crontab : boolean = false,
     cron : boolean = false,
     task : string = '',
     log : Array<string> = [''],
     resultat : Array<string> = [''],
     config : Array<string> = [''],
     inventaireIP: Array<string> = [''],
     inventaireName: Array<string> = [''],
    ) 
    {
     // 3. Initialisation des propiétés de ansible.
     this._id = _id;
     this.fichier = fichier;
     this.inventaire = inventaire;
     this.periode = periode;
     this.nom = nom;
     this.actif = actif;
     this.date = date;
     this.heure = heure ;
     this.crontab = crontab;
     this.cron = cron;
     this.task = task;
     this.log = log;
     this.resultat = resultat;
     this.config = config;
     this.inventaireIP = inventaireIP;
     this.inventaireName = inventaireName;
    }
   }