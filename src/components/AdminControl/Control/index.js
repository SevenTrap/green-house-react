import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import Control from "./control";

class Index extends Component {
    render() {
        window.sessionStorage.setItem('AdminPageControl', 'control');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <Control />
                </div>
            </div>
        )
    }
}

export default Index;
