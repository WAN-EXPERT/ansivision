const formatImage = (categorie: string): string => {
    let imagePng: string;
   
    switch (categorie) {
      case 'RESEAU': 
        imagePng = 'NETWORK.PNG'; 
        break; 
      case 'SERVEUR': 
        imagePng = 'SERVER.PNG'; 
        break; 
      case 'WIFI': 
        imagePng = 'WIFI.PNG'; 
        break; 
      case 'ESX': 
        imagePng = 'ESX.PNG'; 
        break; 
      case 'NUTANIX': 
        imagePng = 'NUTANIX.PNG'; 
        break; 
      case 'IMPRIMANTE': 
        imagePng = 'PRINTER.PNG'; 
        break; 
      case 'FIREWALL': 
        imagePng = 'FIREWALL.PNG'; 
        break; 
      case 'STATION': 
        imagePng = 'COMPUTER.PNG'; 
        break; 
      case 'ROUTEUR': 
        imagePng = 'ROUTEUR.PNG'; 
        break; 
      case 'VM': 
        imagePng = 'VM.PNG'; 
        break; 
      case 'STOCKAGE': 
        imagePng = 'STOCKAGE.PNG'; 
        break; 

      

      default: 
        imagePng = 'NETWORK.PNG'; 
        break; 
    }
   
    return imagePng;
  }

  export default formatImage;