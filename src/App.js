import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import asyncComponent from './components/AsyncComponent';
import './App.css';

// /*管理员系统*/
// import PrivateAdminRoute from './PrivateAdminRoute';
// import AdminLogin from './components/AdminControl/Login';
// import AdminUser from './components/AdminControl/UserControl';
// import AdminEquip from './components/AdminControl/EquipmentControl';
//
// /*用户系统*/
// import PrivatePublicRoute from './PrivatePublicRoute';
// import PublicLogin from './components/PublicControl/Login';
// import GHAdd from './components/PublicControl/GHAdd';
// import GHBind from './components/PublicControl/GHBind';
// import GHControl from './components/PublicControl/GHControl';
// import PwdChange from './components/PublicControl/PwdChange';

import PrivateAdminRoute from './PrivateAdminRoute';
import PrivatePublicRoute from './PrivatePublicRoute';

const AsyncAdminLogin = asyncComponent(() => import('./components/AdminControl/Login'));
const AsyncAdminUser = asyncComponent(() => import('./components/AdminControl/UserControl'));
const AsyncAdminEquip = asyncComponent(() => import('./components/AdminControl/EquipmentControl'));

const AsyncPublicLogin = asyncComponent(() => import('./components/PublicControl/Login'));
const AsyncPublicGHAdd = asyncComponent(() => import('./components/PublicControl/GHAdd'));
const AsyncPublicGHBind = asyncComponent(() => import('./components/PublicControl/GHBind'));
const AsyncPublicGHControl = asyncComponent(() => import('./components/PublicControl/GHControl'));
const AsyncPublicPWD = asyncComponent(() => import('./components/PublicControl/PwdChange'));

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={AsyncAdminLogin}/>
                    <Route path="/admin/Login" component={AsyncAdminLogin}/>
                    <PrivateAdminRoute path="/admin/user" component={AsyncAdminUser}/>
                    <PrivateAdminRoute path="/admin/equip" component={AsyncAdminEquip}/>

                    <Route path="/public/Login" component={AsyncPublicLogin}/>
                    <PrivatePublicRoute path="/public/GHAdd" component={AsyncPublicGHAdd}/>
                    <PrivatePublicRoute path="/public/GHBind" component={AsyncPublicGHBind}/>
                    <PrivatePublicRoute path="/public/GHControl" component={AsyncPublicGHControl}/>
                    <PrivatePublicRoute path="/public/PwdChange" component={AsyncPublicPWD}/>
                    <Route component={AsyncPublicLogin}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
