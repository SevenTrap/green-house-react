import React, {Component} from 'react';
import {Avatar} from 'antd';
import {withRouter} from 'react-router-dom';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: window.sessionStorage.getItem('Username')
        }
    }
    getLoginOut = () => {
        window.sessionStorage.removeItem('Username');
        window.sessionStorage.removeItem('isLogin');
        window.sessionStorage.removeItem('token');
        this.props.history.push('/admin/Login');
    };
    render() {
        return (
            <header className="header">
                <div className="inner">
                    <h1 className="header-title">温室控制系统</h1>
                    <div className="user-control">
                        <Avatar className="user-logo" icon="user"/>
                        {this.state.Username}
                        &nbsp;|&nbsp;
                        <button onClick={this.getLoginOut}>
                            退出登录
                        </button>
                    </div>
                </div>
            </header>
        )
    }
}

export default withRouter(Index);
