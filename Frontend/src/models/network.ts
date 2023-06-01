export default class Network {
    // 1. Typage des propiétés d'un network.
    id: string;
    ip: string;
    status: boolean;
    name: string;
    picture: string;
    categorie: string;
    types: Array<string>;
    scanport: Array<string>;
    scanresult: Array<string>;
     
    // 2. Définition des valeurs par défaut des propriétés d'un network.
    constructor(
     id: string ='',
     ip: string = '',
     status: boolean = false,
     name: string = '',
     picture: string = '.png',
     categorie: string = 'SERVER',
     types: Array<string> = ['HTTPS'],
     scanport: Array<string> = [],
     scanresult: Array<string> = []
    ) 
    {
     // 3. Initialisation des propiétés d'un network.
     this.id = id;
     this.ip = ip;
     this.status = status;
     this.name = name;
     this.picture = picture;
     this.categorie = categorie;
     this.types = types;
     this.scanport = scanport;
     this.scanresult = scanresult;
    }
   }