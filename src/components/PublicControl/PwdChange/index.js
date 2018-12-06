import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import PwdChange from './PwdChange';

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'PwdChange');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner password'>
                    <PwdChange />
                </div>
            </div>
        )
    }
}

export default Index;
