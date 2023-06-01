import Network from "../models/network";
import Categorie from "../models/categorie";
import LogsPingHisto from "../models/logsPingHisto";
import LogsScanHisto from "../models/logsScanHisto";
import Ansible from "../models/ansible";
import CategorieHost from "../models/categorieHost";
import axios from 'axios';
import { HOSTS} from "../constantes/hosts"
 
export default class NetworkService {
 
  static getNetworks(): Promise<Network[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/networks`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.data)
          console.log(response.data)
        })
    })
  }
  static getNetworkstriStatut(): Promise<Network[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/networks/triStatut`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.data)
          console.log(response.data)
        })
    })
  }
  static getNetworkstriCategorie(): Promise<Network[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/networks/triCategorie`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.data)
          console.log(response.data)
        })
    })
  }
  static getNetworkstriStatutCategorie(): Promise<Network[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/networks/triStatutCategorie`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.data)
          console.log(response.data)
        })
    })
  }

//-----------------------------------------------------------------------------------


  static getLogsPingHisto(id: number): Promise<LogsPingHisto|null> {
    
    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/getLogsPingHisto/${id}`)
        .then((response: any) => {
          if (!response) {
            onFail(`Response failure`)
            return false 
          };
        onSuccess(response.data.retourLogsPingsHisto)
        console.log(response.data.retourLogsPingsHisto)
      })
    }) 
  }

  static getLogsScanHisto(id: number): Promise<LogsScanHisto|null> {
    
    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/getLogsScanHisto/${id}`)
        .then((response: any) => {
          if (!response) {
            onFail(`Response failure`)
            return false 
          };
        onSuccess(response.data.retourLogsScanHisto)
        console.log(response.data.retourLogsScanHisto)
      })
    }) 
  }

  static getLogsPingcount(): Promise<LogsScanHisto|null> {
    
    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/getLogsPingCount`)
        .then((response: any) => {
          if (!response) {
            onFail(`Response failure`)
            return false 
          };
        onSuccess(response.data.LogsPingsHistoCount)
        console.log(response.data.LogsPingsHistoCount)
      })
    }) 
  }

  static getLogsScancount(): Promise<LogsScanHisto|null> {
    
    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/getLogsScanCount`)
        .then((response: any) => {
          if (!response) {
            onFail(`Response failure`)
            return false 
          };
        onSuccess(response.data.LogsScanHistoCount)
        console.log(response.data.LogsScanHistoCount)
      })
    }) 
  }


//-----------------------------------------------------------------------------------

static getNetwork(id: any): Promise<Network|null> {
    
  return new Promise((onSuccess, onFail ) => {
    axios.get(`http://${HOSTS}:4000/api/networks/${id}`)
      .then((response: any) => {
        if (!response) {
          onFail(`Response failure`)
          return false 
        };
      onSuccess(response.data.results)
      console.log(response.data.results)
    })
  }) 
}





  static updateNetwork(network: Network): Promise<Network> {

      return new Promise((onSuccess, onFail ) => {
        axios.put(`http://${HOSTS}:4000/api/networks/update/${network.id}` ,{
          method: 'PUT',
          network,
          headers: { 'Content-Type': 'application/json' }
        })
       .then((response: any) => {
         if (!response) {
           onFail(`Response failure`)
            return false 
          };
       onSuccess(response.data.results)
       console.log(response.data.results)
     })
    })
  }

  static addNetwork(network: Network): Promise<Network> {

    return new Promise((onSuccess, onFail ) => {
      axios.post(`http://${HOSTS}:4000/api/networks/add`,{
        method: 'POST',
        network,
        headers: { 'Content-Type': 'application/json' }
      })
      .then((response: any) => {
        if (!response) {
          onFail(`Response failure`)
            return false 
          };
      onSuccess(response.data.results)
      console.log(response.data.results)
      })
    })
  }

  static deleteNetwork(network: Network): Promise<Network> {

    return new Promise((onSuccess, onFail ) => {
      axios.delete(`http://${HOSTS}:4000/api/networks/delete/${network.id}`)
       .then((response: any) => {
       if (!response) {
         onFail(`Response failure`)
          return false 
        };
     onSuccess(response.data.results)
     console.log(`delete Axios ${response.data.results}`)
      })
     })
  }




static searchNetwork(term: string): Promise<Network[]> {

  return new Promise((onSuccess, onFail ) => {
    console.log({term});
    axios.get(`http://${HOSTS}:4000/api/networks/search?name=${term}`)
    .then((response: any) => {
      if (!response) {
        onFail(`Response failure`)
        return false 
      };
    onSuccess(response.data.results)
    console.log(response.data.results)
    })
  })
}

static getSearchCategorie(categorie: any): Promise<Network[]> {

  return new Promise((onSuccess, onFail ) => {
    console.log({categorie});
    axios.get(`http://${HOSTS}:4000/api/networks/categories/searching?categorie=${categorie}`)
    .then((response: any) => {
      if (!response) {
        onFail(`Response failure`)
        return false 
      };
    onSuccess(response.data.results)
    console.log(response.data.results)
    })
  })
}


static getStatusPing(): Promise<Network[]> {

  return new Promise((onSuccess, onFail ) => {
    axios.get(`http://${HOSTS}:4000/api/pingAvecPromesse`)
      .then((response: any) => {
        if (!response) {
          onFail("Response Failure")
          return false
        }
        onSuccess(response.data)
        console.log(response.data)
      })
  })
}

static getScan(): Promise<Network[]> {

  return new Promise((onSuccess, onFail ) => {
    axios.get(`http://${HOSTS}:4000/api/scanpro`)
      .then((response: any) => {
        if (!response) {
          onFail("Response Failure")
          return false
        }
        onSuccess(response.data)
        console.log(response.data)
      })
  })
}



static getCategorieService(): Promise<Categorie[]> {

  return new Promise((onSuccess, onFail ) => {
    axios.get(`http://${HOSTS}:4000/api/networks/categorieService`)
      .then((response: any) => {
        if (!response) {
          onFail("Response Failure")
          return false
        }
        onSuccess(response.data.results)
        // console.log(response.data.results)
      })
  })
}

static getCategorieHost(): Promise<CategorieHost[]> {

  return new Promise((onSuccess, onFail ) => {
    axios.get(`http://${HOSTS}:4000/api/networks/categorieHost`)
      .then((response: any) => {
        if (!response) {
          onFail("Response Failure")
          return false
        }
        onSuccess(response.data.results)
        // console.log(response.data.results)
      })
  })
}



static sendMailStatus(): Promise<Categorie[]> {

  return new Promise((onSuccess, onFail ) => {
    axios.get(`http://${HOSTS}:4000/api/sendmail`)
      .then((response: any) => {
        if (!response) {
          onFail("Response Failure")
          return false
        }
        onSuccess(response)
        // console.log(response.data.results)
      })
  })
}




 
  static isEmpty(data: Object): boolean {
    return Object.keys(data).length === 0;
  }

  static handleError(error: Error): void {
      console.error(error);
  }
}