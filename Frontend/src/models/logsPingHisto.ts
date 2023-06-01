export default class LogsPingHisto {
   
    _id: string;
    ip: string;
    status: boolean;
    name: string;
    picture: string;
    categorie: string;
    heure : string;
    date : string;
     
    
    constructor(
     _id: string ='',
     ip: string = '',
     status: boolean = false,
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
     this.status = status;
     this.name = name;
     this.picture = picture;
     this.categorie = categorie;
     this.heure = heure;
     this.date = date;
    }
   }