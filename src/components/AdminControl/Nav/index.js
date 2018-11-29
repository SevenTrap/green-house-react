import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';

import './index.css';

class Index extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            theme: 'light',
            current: window.sessionStorage.getItem('AdminPageControl') || "user"
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
                    <Menu.Item key="user">
                        <Link to="/admin/user"><Icon type="user"/>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="equipment">
                        <Link to="/admin/equip"><Icon type="radar-chart"/>设备管理</Link>
                    </Menu.Item>
                    {/*<Menu.Item key="order">*/}
                        {/*<Link to="/admin/order"><Icon type="line-chart"/>订单管理</Link>*/}
                    {/*</Menu.Item>*/}
                </Menu>
            </Layout>
            </div>
        )
    }
}

export default Index;
