import React, {Component} from 'react';
import {Collapse, Spin, message, Row, Card} from 'antd';
import GHAction from './GHAction';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            greenHouse: [],
            panelKey: ''
        }
    }

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        const urlGreenHouse = 'http://47.92.206.44:80/api/greenhouse';
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlGreenHouse, opts)
            .then(response => response.json())
            .then(res => {
                console.log(res);
                this.setState({
                    isLoading: false,
                    greenHouse: res
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    isLoading: false
                })
            })
    }

    render() {
        const {greenHouse} = this.state;
        return (
            <Spin spinning={this.state.isLoading}>
                <Row gutter={24}>
                    <Card title='单个大棚控制'>
                        <Collapse accordion>
                            {greenHouse.map(item => {
                                return (
                                    <Collapse.Panel key={item.greenHouseId}
                                                    header={`大棚基本信息：${item.name} | ${item.location} | ${item.description}`}>
                                        <GHAction greenHouseId={item.greenHouseId}/>
                                    </Collapse.Panel>
                                )
                            })}
                        </Collapse>
                    </Card>
                </Row>
            </Spin>
        )
    }
}

export default Index;
