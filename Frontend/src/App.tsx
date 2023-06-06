import React, { FunctionComponent } from 'react';
import NetworkList from './pages/network-list.jsx';
import NetworkDetail from './pages/network-detail';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import PageNotFound from './pages/page-not-found';
import NetworkEdit from './pages/network-edit';
import NetworkAdd from './pages/network-add';
import 'boxicons/css/boxicons.min.css';
import Login from './pages/login';
//import PrivateRoute from './PrivateRoute';
import './App.css';
import SideNav from "./components/SideNav";
import StatusPing from './pages/status-ping.jsx';
import NewCategorieList from './pages/new-categorie-list.jsx';
import CategorieListList from './pages/categorielist-list';
import AnsibleList from './pages/ansible-list.jsx';
import AnsibleAdd from './pages/ansible-add';
import AnsibleDetail from "./pages/ansible-detail"
import AnsibleEdit from './pages/ansible-edit';
import AnsibleJobs from './components/ansible-jobs.jsx';
import Settings from './pages/settings.jsx';
import LogsList from './pages/logs-list.jsx';

const App: FunctionComponent = () => {

 return (
    <BrowserRouter>
        <div>
            <SideNav isSearching={false} />
            <Routes>
                <Route path="/" element={ <NewCategorieList/> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="/networks" element={<NetworkList isSearch={false}/>} />
                <Route path="/networks/search" element={<NetworkList isSearch={true}/>} />
                <Route path="/networks/add" element={ <NetworkAdd /> } />
                <Route path="/ansible/add" element={ <AnsibleAdd />} />
                <Route path="/networks/status" element={ <StatusPing />} />
                <Route path="/ansible" element={ <AnsibleList />}/>
                <Route path="/logsPing" element={ <LogsList isScan={false} />}/>
                <Route path="/logsScan" element={ <LogsList isScan={true}/>}/>
                <Route path="/settings" element={ <Settings />}/>
                <Route path="/ansible/updatejobs" element={ <AnsibleJobs caseJobs={1}/>}/>
                <Route path="/ansible/listejobs" element={ <AnsibleJobs caseJobs={2}/>}/>
                <Route path="/ansible/stopjobs" element={ <AnsibleJobs caseJobs={3}/>}/>
                <Route path="/ansible/startjobs" element={ <AnsibleJobs caseJobs={4}/>}/>
                <Route path="/networks/categorie" element={ <NewCategorieList /> } />
                <Route path="/networks/edit/:id" element={ <NetworkEdit />} />
                <Route path="/ansible/edit/:id" element={ <AnsibleEdit />} />
                <Route path="/networks/:id" element={ <NetworkDetail /> } />
                <Route path="/ansible/:id" element={ <AnsibleDetail /> } />
                <Route path="/networks/categories/:_id" element={ <CategorieListList />}/>
                <Route path="*" element={<Navigate to="/" />} />

                <Route element={ <PageNotFound />} />

            </Routes>

        </div>

    </BrowserRouter>
 )
}

  
export default App;