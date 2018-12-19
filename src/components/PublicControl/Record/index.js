import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import Record from "./record";

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'record');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <Record />
                </div>
            </div>
        )
    }
}

export default Index;
