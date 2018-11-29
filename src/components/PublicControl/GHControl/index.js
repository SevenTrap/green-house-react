import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import GHControl from './GHControl';

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'GHControl');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <GHControl />
                </div>
            </div>
        )
    }
}

export default Index;
