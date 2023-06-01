
import Ansible from "../models/ansible";
import axios from 'axios';
import { HOSTS } from "../constantes/hosts"
 
export default class AnsibleService {
 

  static getAnsibleList(): Promise<Ansible[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/ansible`)
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

  

  static getInventory(): Promise<[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/inventory`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.data.result.all.hosts)
          console.log(response.data.result.all.hosts)
        })
    })
  }

  static updatejobs(): Promise<[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/updatejobs`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.status)
          console.log(response.status)
        })
    })
  }

  static stopjobs(): Promise<[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/stopjobs`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.status)
          console.log(response.status)
        })
    })
  }

  static startjobs(): Promise<[]> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/startjobs`)
        .then((response: any) => {
          if (!response) {
            onFail("Response Failure")
            return false
          }
          onSuccess(response.status)
          console.log(response.status)
        })
    })
  }
  static listejobs(): Promise<Object> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/listejobs`)
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

  static listcrons(): Promise<Object> {

    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/listCrons`)
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


 
  static getAnsible(id: any): Promise<Ansible|null> {
    
    return new Promise((onSuccess, onFail ) => {
      axios.get(`http://${HOSTS}:4000/api/ansible/${id}`)
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

  static updateAnsible(ansible: Ansible): Promise<Ansible> {

      return new Promise((onSuccess, onFail ) => {
        axios.put(`http://${HOSTS}:4000/api/ansible/update/${ansible._id}` ,{
          method: 'PUT',
          ansible,
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

  static addAnsible(ansible: Ansible): Promise<Ansible> {

    return new Promise((onSuccess, onFail ) => {
      axios.post(`http://${HOSTS}:4000/api/ansible/add`,{
        method: 'POST',
        ansible,
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

  static uploadAnsible(uploadFile: File): Promise<File> {

    return new Promise((onSuccess, onFail ) => {
      axios.post(`http://${HOSTS}:4000/api/ansible/upload`,
        uploadFile
      )
      .then((response: any) => {
        if (!response) {
          onFail(`Response failure`)
            return false 
          };
      onSuccess(response)
      console.log(response)
      })
    })
  }


  static deleteAnsible(ansible: Ansible): Promise<Ansible> {

    return new Promise((onSuccess, onFail ) => {
      axios.delete(`http://${HOSTS}:4000/api/ansible/delete/${ansible._id}`)
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
 
  static isEmpty(data: Object): boolean {
    return Object.keys(data).length === 0;
  }

  static handleError(error: Error): void {
      console.error(error);
  }
}