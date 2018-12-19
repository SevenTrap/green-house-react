import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import Rain from "./rain";

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'rain');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <Rain />
                </div>
            </div>
        )
    }
}

export default Index;
