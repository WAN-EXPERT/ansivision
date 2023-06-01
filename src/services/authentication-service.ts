import {auth} from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default class AuthenticationService {
    static isAuthenticated: boolean = false;

    static login(username: string, password: string): Promise<boolean> {
        let isAuthenticated = true;

        return new Promise(resolve => {
            setTimeout(() => {
                signInWithEmailAndPassword(auth, username, password)
                .then ((userCredential) => {
                    console.log(userCredential)
                    isAuthenticated = true;
                    this.isAuthenticated = isAuthenticated ;
                    resolve(isAuthenticated);      
                 })
                 .catch((error) => {
                     
                     isAuthenticated = false;
                     this.isAuthenticated = isAuthenticated ;
                     resolve(isAuthenticated);

                 })
            }, 1000);
        });
    }
    
}