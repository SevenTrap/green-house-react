import React, {Component} from 'react';
import Header from '../Header/index';
import Nav from '../Nav/index';
import TableUser from "./rainInfo";
class Index extends Component {
    render() {
        window.sessionStorage.setItem('AdminPageControl', 'rainInfo');
        return (
            <div>
                <Header/>
                <Nav/>
                <div className='inner table'>
                    <TableUser />
                </div>
            </div>
        )
    }
}

export default Index;
