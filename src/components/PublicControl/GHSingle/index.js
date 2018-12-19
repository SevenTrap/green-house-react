import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import GHSingle from './GHSingle';

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'GHSingle');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <GHSingle />
                </div>
            </div>
        )
    }
}

export default Index;
