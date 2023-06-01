export default class CategorieHost {
    // 1. Typage des propiétés d'un network.
    _id: string;
    total: number;
    count: number;
     
    // 2. Définition des valeurs par défaut des propriétés d'un network.
    constructor(
     _id: string ='',
     total: number = 0,
     count: number = 0
    ) 
    {
     // 3. Initialisation des propiétés d'un network.
     this._id = _id;
     this.total = total;
     this.count = count;

    }
   }