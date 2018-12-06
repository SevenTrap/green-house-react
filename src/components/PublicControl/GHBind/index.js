import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import GHBind from './GHBind';

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'GHBind');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <GHBind />
                </div>
            </div>
        )
    }
}

export default Index;
