import React, {Component} from 'react';
import {Row, Col, Tabs, Button, Card, message, Spin} from 'antd';
import {sortBy} from 'lodash';

const SORTS = {
    "station_num": list => sortBy(list, 'station_num'),
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceID_over: [],
            deviceID_down: [],
            deviceID_on: [],
            deviceID_off: [],
            deviceID: [],
            initLoading: false
        }
    }

    getData = () => {
        const token = window.sessionStorage.getItem('token');
        const deviceState = `http://47.92.206.44:80/api/devicestatus`;
        const deviceID = `http://47.92.206.44:80/api/device`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        this.setState({
            initLoading: true
        });
        const getDeviceID = new Promise((resolve, reject) => {
            fetch(deviceID, options)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(error => reject(error))
        });
        const getDeviceState = new Promise((resolve, reject) => {
            fetch(deviceState, options)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(error => reject(error))
        });
        Promise.all([getDeviceID, getDeviceState])
            .then(result => {
                console.log(result);
                result[1].map((item, index) => item.key = index);
                const deviceID_off = result[1].filter(item => item.is_online === "0");
                const deviceID_on = result[1].filter(item => item.is_online === "1");
                const deviceID_over = deviceID_on.filter(item => (Number(item.temp1) > (Number(item.motor_1_max) + 5) || Number(item.temp2) > (Number(item.motor_2_max) + 5)));
                const deviceID_down = deviceID_on.filter(item => (Number(item.temp1) < (Number(item.motor_1_min) - 5) || Number(item.temp2) < (Number(item.motor_2_min) - 5)));
                console.log(deviceID_off, deviceID_on, deviceID_over, deviceID_down);
                this.setState({
                    deviceID_over: deviceID_over,
                    deviceID_down: deviceID_down,
                    deviceID_on: deviceID_on,
                    deviceID_off: deviceID_off,
                    deviceID: result[0],
                    initLoading: false
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    initLoading: false
                })
            });
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const {initLoading, deviceID_over, deviceID_down, deviceID_on, deviceID_off, deviceID} = this.state;
        const deviceID_over_list = SORTS['station_num'](deviceID_over);
        const deviceID_down_list = SORTS['station_num'](deviceID_down);
        const deviceID_on_list = SORTS['station_num'](deviceID_on);
        const deviceID_off_list = SORTS['station_num'](deviceID_off);
        return (
            <Spin spinning={initLoading}>
                <Tabs tabBarExtraContent={<Button type="primary" onClick={this.getData}>刷新</Button>}>
                    <Tabs.TabPane tab="设备在线" key="1">
                        <Card>
                            <Row gutter={24}>
                                {deviceID_on_list.map(item => {
                                    const index = deviceID.findIndex(itemID => item.station_num === itemID.deviceId);
                                    const deviceID_only = deviceID[index];
                                    if (index < 0) {
                                        return false;
                                    }
                                    const temp1 = Number(item.temp1) / 10;
                                    const temp2 = Number(item.temp2) / 10;
                                    return (
                                        <Card.Grid bordered={true} style={{width: "50%"}}>
                                            <Col span={12}>用户名：{deviceID_only.username}</Col>
                                            <Col span={12}>控制器ID：{deviceID_only.deviceId}</Col>
                                            <Col span={12}>实时温度1：<strong style={{color: 'red'}}>{temp1}</strong> ℃</Col>
                                            <Col span={12}>实时温度2：<strong style={{color: 'red'}}>{temp2}</strong> ℃</Col>
                                        </Card.Grid>
                                    )
                                })}
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="设备离线" key="2">
                        <Card>
                            <Row gutter={24}>
                                {deviceID_off_list.map(item => {
                                    const index = deviceID.findIndex(itemID => item.station_num === itemID.deviceId);
                                    const deviceID_only = deviceID[index];
                                    if (index < 0) {
                                        return false;
                                    }
                                    return (
                                        <Card.Grid bordered={true} style={{width: "50%"}}>
                                            <Col span={12}>用户名：{deviceID_only.username}</Col>
                                            <Col span={12}>控制器ID：{deviceID_only.deviceId}</Col>
                                        </Card.Grid>
                                    )
                                })}
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="温度过高" key="3">
                        <Card>
                            <Row gutter={24}>
                                {deviceID_over_list.map(item => {
                                    const index = deviceID.findIndex(itemID => item.station_num === itemID.deviceId);
                                    const deviceID_only = deviceID[index];
                                    if (index < 0) {
                                        return false;
                                    }
                                    const temp1 = Number(item.temp1) / 10;
                                    const temp2 = Number(item.temp2) / 10;
                                    const motor_1_max = Number(item.motor_1_max) / 10;
                                    const motor_2_max = Number(item.motor_2_max) / 10;
                                    return (
                                        <Card.Grid bordered={true} style={{width: "50%"}}>
                                            <Col span={12}>用户名：{deviceID_only.username}</Col>
                                            <Col span={12}>控制器ID：{deviceID_only.deviceId}</Col>
                                            <Col span={12}>实时温度1：<strong style={{color: 'red'}}>{temp1}</strong> ℃</Col>
                                            <Col span={12}>实时温度2：<strong style={{color: 'red'}}>{temp2}</strong> ℃</Col>
                                            <Col span={12}>温度上限1：<strong style={{color: 'red'}}>{motor_1_max}</strong> ℃</Col>
                                            <Col span={12}>温度上限2：<strong style={{color: 'red'}}>{motor_2_max}</strong> ℃</Col>
                                        </Card.Grid>
                                    )
                                })}
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="温度过低" key="4">
                        <Card>
                            <Row gutter={24}>
                                {deviceID_down_list.map(item => {
                                    const index = deviceID.findIndex(itemID => item.station_num === itemID.deviceId);
                                    const deviceID_only = deviceID[index];
                                    if (index < 0) {
                                        return false;
                                    }
                                    const temp1 = Number(item.temp1) / 10;
                                    const temp2 = Number(item.temp2) / 10;
                                    const motor_1_min = Number(item.motor_1_min) / 10;
                                    const motor_2_min = Number(item.motor_2_min) / 10;
                                    return (
                                        <Card.Grid bordered={true} style={{width: "50%"}}>
                                            <Col span={12}>用户名：{deviceID_only.username}</Col>
                                            <Col span={12}>控制器ID：{deviceID_only.deviceId}</Col>
                                            <Col span={12}>实时温度1：<strong style={{color: 'red'}}>{temp1}</strong> ℃</Col>
                                            <Col span={12}>实时温度2：<strong style={{color: 'red'}}>{temp2}</strong> ℃</Col>
                                            <Col span={12}>温度下限1：<strong style={{color: 'red'}}>{motor_1_min}</strong> ℃</Col>
                                            <Col span={12}>温度下限2：<strong style={{color: 'red'}}>{motor_2_min}</strong> ℃</Col>
                                        </Card.Grid>
                                    )
                                })}
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                </Tabs>
            </Spin>
        )
    }
}

export default Index;
