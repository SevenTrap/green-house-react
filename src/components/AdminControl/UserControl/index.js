import React, {Component} from 'react';
import Header from '../Header/index';
import Nav from '../Nav/index';
import TableUser from "./tableUser";
class Index extends Component {
    render() {
        window.sessionStorage.setItem('AdminPageControl', 'user');
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
