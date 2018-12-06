import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';

class Index extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            theme: 'light',
            current: window.sessionStorage.getItem('PageControl') || "GHAdd"
        }
    }

    handleClick = (event) => {
        this.setState({
            current: event.key
        })
    };

    render() {
        return (
            <div className='nav-menu'>
                <Layout className="inner">
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                        theme={this.state.theme}
                    >
                        <Menu.Item key="GHControl">
                            <Link to="/public/GHControl"><Icon type="home"/>温室控制</Link>
                        </Menu.Item>
                        <Menu.Item key="GHAdd">
                            <Link to="/public/GHAdd"><Icon type="folder-add"/>增加温室</Link>
                        </Menu.Item>
                        <Menu.Item key="GHBind">
                            <Link to="/public/GHBind"><Icon type="link"/>设备绑定</Link>
                        </Menu.Item>
                        <Menu.Item key="PwdChange">
                            <Link to="/public/PwdChange"><Icon type="setting"/>修改密码</Link>
                        </Menu.Item>
                    </Menu>
                </Layout>
            </div>
        )
    }
}

export default Index;
