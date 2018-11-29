import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

/*管理员系统*/
import PrivateAdminRoute from './PrivateAdminRoute';
import AdminLogin from './components/AdminControl/Login';
import AdminUser from './components/AdminControl/UserControl';
import AdminEquip from './components/AdminControl/EquipmentControl';


/*用户系统*/
import PrivatePublicRoute from './PrivatePublicRoute';
import PublicLogin from './components/PublicControl/Login';
import GHAdd from './components/PublicControl/GHAdd';
import GHBind from './components/PublicControl/GHBind';
import GHControl from './components/PublicControl/GHControl';
import PwdChange from './components/PublicControl/PwdChange';


import './App.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home}/>

                    <Route path="/admin/Login" component={AdminLogin}/>
                    <PrivateAdminRoute path="/admin/user" component={AdminUser}/>
                    <PrivateAdminRoute path="/admin/equip" component={AdminEquip}/>

                    <Route path="/public/Login" component={PublicLogin}/>
                    <PrivatePublicRoute path="/public/GHAdd" component={GHAdd}/>
                    <PrivatePublicRoute path="/public/GHBind" component={GHBind}/>
                    <PrivatePublicRoute path="/public/GHControl" component={GHControl}/>
                    <PrivatePublicRoute path="/public/PwdChange" component={PwdChange}/>
                    <Route component={PublicLogin}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

const Home = () => <h1>Home</h1>;

export default App;
