export default class Categorie {
    // 1. Typage des propiétés d'un network.
    _id: string;
    total: number;
    up: number;
    down: number;
    filter: number;
     
    // 2. Définition des valeurs par défaut des propriétés d'un network.
    constructor(
     _id: string ='',
     total: number = 0,
     up: number = 0,
     down: number = 0,
     filter: number = 0
    ) 
    {
     // 3. Initialisation des propiétés d'un network.
     this._id = _id;
     this.total = total;
     this.up = up;
     this.down = down;
     this.filter = filter;

    }
   }