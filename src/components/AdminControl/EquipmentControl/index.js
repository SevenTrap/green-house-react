import React, {Component} from 'react';

import Header from '../Header/index';
import Nav from '../Nav/index';
import TableEquipment from "./tableEquipment";

class Index extends Component {
    render() {
        window.sessionStorage.setItem('AdminPageControl', 'equipment');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <TableEquipment />
                </div>
            </div>
        )
    }
}

export default Index;
