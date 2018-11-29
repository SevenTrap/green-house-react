import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import PwdChange from './PwdChange';
import './index.css';

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'PwdChange');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <PwdChange />
                </div>
            </div>
        )
    }
}

export default Index;
