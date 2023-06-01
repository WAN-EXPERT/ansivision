import Network from './network';
   
export const NETWORKS: Network[] = [
 {
  id: "1",
  name: "Serveur AD1",
  ip: "192.168.200.1",
  categorie: "",
  picture: "SERVER.png",
  types: ["SERVER"],
  status: true,
  scanport: [],
  scanresult: [],
 },
 {
  id: "2",
  name: "Serveur AD2",
  ip: "192.168.200.2",
  categorie: "",
  picture: "SERVER.png",
  types: ["SERVER"],
  status: true,
  scanport: [],
  scanresult: [],
 }
];
  
export default NETWORKS;