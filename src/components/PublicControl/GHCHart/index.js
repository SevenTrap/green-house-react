import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import Chart from "./chart";

class Index extends Component {
    render() {
        window.sessionStorage.setItem('PageControl', 'chart');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <Chart />
                </div>
            </div>
        )
    }
}

export default Index;
