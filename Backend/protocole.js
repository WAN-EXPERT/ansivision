function convertProtocole (protocole) {
    let port
   
    switch (protocole) {
      case 'HTTP': 
        port = 80; 
        break; 
      case 'HTTPS': 
        port = 443; 
        break; 
      case 'RDP': 
        port = 3389; 
        break; 
      case '8080': 
        port = 8080; 
        break; 
      case '8443': 
        port = 8443; 
        break; 
      case 'SSH': 
        port = 22; 
        break; 
      case 'MYSQL': 
        port = 3306; 
        break; 
      case 'NETBIOS': 
        port = 445; 
        break; 
      default: 
        port = 443; 
        break; 
    }
   
    return port
  }

  module.exports = {convertProtocole}