import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

export default class LogsScanHisto {
   
    _id: string;
    ip: string;
    port: number;
    name: string;
    picture: string;
    categorie: string;
    heure : string;
    date : string;
     
    
    constructor(
     _id: string ='',
     ip: string = '',
     port: number = 0,
     name: string = '',
     picture: string = '.png',
     categorie: string = 'SERVER',
     heure: string = '',
     date: string = '',

    ) 
    {
     // 3. Initialisation des propiétés d'un network.
     this._id = _id;
     this.ip = ip;
     this.port = port;
     this.name = name;
     this.picture = picture;
     this.categorie = categorie;
     this.heure = heure;
     this.date = date;
    }
   }