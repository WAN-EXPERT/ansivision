import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWZX3CZUvOCdjkgskgtuwH_9TKExfP7Xo",
  authDomain: "wanexpert-network.firebaseapp.com",
  projectId: "wanexpert-network",
  storageBucket: "wanexpert-network.appspot.com",
  messagingSenderId: "564121444261",
  appId: "1:564121444261:web:342af8d2e8aaa03d8d524c"
};

const firebase_app = initializeApp(firebaseConfig);
const auth = getAuth(firebase_app);
export {auth};