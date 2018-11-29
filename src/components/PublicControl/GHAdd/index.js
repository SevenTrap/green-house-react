import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import GHAdd from './GHAdd';

// import './index.css';

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'GHAdd');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <GHAdd />
                </div>
            </div>
        )
    }
}

export default Index;
