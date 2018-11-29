import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivatPublicRoute = ({component: Component, ...rest}) => {

    const isLogin = window.sessionStorage.getItem('isLogin');

    return (
        <Route
            {...rest}
            render={props =>
                isLogin ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to='/public/Login'/>
                )
            }
        />
    )
};

export default PrivatPublicRoute;
