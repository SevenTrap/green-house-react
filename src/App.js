import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import './App.css';

/*管理员系统*/
import PrivateAdminRoute from './PrivateAdminRoute';
import PrivatePublicRoute from './PrivatePublicRoute';
// import AdminLogin from './components/AdminControl/Login';
// import AdminUser from './components/AdminControl/UserControl';
// import AdminEquip from './components/AdminControl/EquipmentControl';
// import AdminRecord from './components/AdminControl/Record';
// import AdminRainInfo from './components/AdminControl/RainInfo';
// import AdminControl from './components/AdminControl/Control';
const Loading = () => <div>Loading...</div>;
const AdminLogin = Loadable({
    loader: () => import('./components/AdminControl/Login'),
    loading: Loading
});
const AdminUser = Loadable({
    loader: () => import('./components/AdminControl/UserControl'),
    loading: Loading
});
const AdminEquip = Loadable({
    loader: () => import('./components/AdminControl/EquipmentControl'),
    loading: Loading
});
const AdminRecord = Loadable({
    loader: () => import('./components/AdminControl/Record'),
    loading: Loading
});
const AdminRainInfo = Loadable({
    loader: () => import('./components/AdminControl/RainInfo'),
    loading: Loading
});
const AdminControl = Loadable({
    loader: () => import('./components/AdminControl/Control'),
    loading: Loading
});

/*用户系统*/
// import PrivatePublicRoute from './PrivatePublicRoute';
// import PublicLogin from './components/PublicControl/Login';
// import GHAdd from './components/PublicControl/GHAdd';
// import GHBind from './components/PublicControl/GHBind';
// import GHRain from './components/PublicControl/GHRain';
// import GHControl from './components/PublicControl/GHControl';
// import GHSingle from './components/PublicControl/GHSingle';
// import PwdChange from './components/PublicControl/PwdChange';
// import Record from './components/PublicControl/Record';
// import GHCHart from './components/PublicControl/GHCHart';
const PublicLogin = Loadable({
    loader: () => import('./components/PublicControl/Login'),
    loading: Loading
});
const GHAdd = Loadable({
    loader: () => import('./components/PublicControl/GHAdd'),
    loading: Loading
});
const GHBind = Loadable({
    loader: () => import('./components/PublicControl/GHBind'),
    loading: Loading
});
const GHRain = Loadable({
    loader: () => import('./components/PublicControl/GHRain'),
    loading: Loading
});
const GHControl = Loadable({
    loader: () => import('./components/PublicControl/GHControl'),
    loading: Loading
});
const GHSingle = Loadable({
    loader: () => import('./components/PublicControl/GHSingle'),
    loading: Loading
});
const PwdChange = Loadable({
    loader: () => import('./components/PublicControl/PwdChange'),
    loading: Loading
});
const Record = Loadable({
    loader: () => import('./components/PublicControl/Record'),
    loading: Loading
});
const GHCHart = Loadable({
    loader: () => import('./components/PublicControl/GHCHart'),
    loading: Loading
});


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={AdminLogin}/>
                    <Route path="/admin/Login" component={AdminLogin}/>
                    <PrivateAdminRoute path="/admin/user" component={AdminUser}/>
                    <PrivateAdminRoute path="/admin/equip" component={AdminEquip}/>
                    <PrivateAdminRoute path="/admin/record" component={AdminRecord}/>
                    <PrivateAdminRoute path="/admin/raininfo" component={AdminRainInfo}/>
                    <PrivateAdminRoute path="/admin/control" component={AdminControl}/>

                    <Route path="/public/Login" component={PublicLogin}/>
                    <PrivatePublicRoute path="/public/GHAdd" component={GHAdd}/>
                    <PrivatePublicRoute path="/public/GHBind" component={GHBind}/>
                    <PrivatePublicRoute path="/public/GHRain" component={GHRain}/>
                    <PrivatePublicRoute path="/public/GHControl" component={GHControl}/>
                    <PrivatePublicRoute path="/public/GHSingle" component={GHSingle}/>
                    <PrivatePublicRoute path="/public/PwdChange" component={PwdChange}/>
                    <PrivatePublicRoute path="/public/Record" component={Record}/>
                    <PrivatePublicRoute path="/public/chart" component={GHCHart}/>
                    <Route component={PublicLogin}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
