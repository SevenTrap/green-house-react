import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                >
                    <Menu.Item key="user">
                        <Link to="/admin/user"><Icon type="user"/>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="rainInfo">
                        <Link to="/admin/raininfo"><Icon type="radar-chart"/>雨量管理</Link>
                    </Menu.Item>
                    <Menu.Item key="equipment">
                        <Link to="/admin/equip"><Icon type="radar-chart"/>设备管理</Link>
                    </Menu.Item>
                    <Menu.Item key="control">
                        <Link to="/admin/control"><Icon type="radar-chart"/>设备监控</Link>
                    </Menu.Item>
                    <Menu.Item key="record">
                        <Link to="/admin/record"><Icon type="radar-chart"/>维修记录</Link>
                    </Menu.Item>
                </Menu>
            </Layout>
            </div>
        )
    }
}

export default Index;
