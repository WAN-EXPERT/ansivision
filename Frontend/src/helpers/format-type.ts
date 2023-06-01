const formatType = (type: string): string => {
    let color: string;
   
    switch (type) {
      case 'HTTP': 
        color = 'green lighten-1'; 
        break; 
      case 'HTTPS': 
        color = 'green lighten-2'; 
        break; 
      case 'RDP': 
        color = 'blue lighten-1'; 
        break; 
      case 'NUTANIX': 
        color = 'blue lighten-2'; 
        break; 
      case 'SSH': 
        color = 'brown lighten-3'; 
        break; 
      case '-1': 
        color = 'red'; 
        break; 
      case '0': 
        color = 'orange'; 
        break; 
      default: 
        color = 'grey'; 
        break; 
    }
   
    return `chip ${color}`;
  }

  export default formatType;