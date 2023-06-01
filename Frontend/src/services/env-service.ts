import axios from 'axios';
import { HOSTS } from "../constantes/hosts"
import Env from "../models/env";


export default class EnvService {

    static getEnv(): Promise<Env> {

        return new Promise((onSuccess, onFail ) => {
          axios.get(`http://${HOSTS}:4000/api/env`)
            .then((response: any) => {
              if (!response) {
                onFail("Response Failure")
                return false
              }
              onSuccess(response.data[0])
              console.log(response.data[0])
            })
        })
      }

      static updateEnv(environ: Env): Promise<Env> {

        return new Promise((onSuccess, onFail ) => {
          axios.put(`http://${HOSTS}:4000/api/env/update` ,{
            method: 'PUT',
            environ,
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
}