import React, {Component} from 'react';
import {Spin, message} from 'antd';
import MotorControl from './MotorControl';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            greenHouseMaps: [],
            deviceId: [],
        }
    };

    componentDidMount() {
        const {greenHouseId} = this.props;
        const token = window.sessionStorage.getItem('token');
        const urlGreenHouseMap = 'http://47.92.206.44:80/api/greenhousemap/' + greenHouseId;
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(urlGreenHouseMap, opts)
            .then(response => response.json())
            .then(res => {
                if (res.length !== 0) {
                    let deviceId = res.map(item1 => item1.deviceId);
                    deviceId = Array.from(new Set(deviceId));
                    this.setState({
                        deviceId: deviceId,
                        greenHouseMaps: res,
                        isLoading: false
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    isLoading: false
                })
            });
    }

    render() {
        const {isLoading, greenHouseMaps, deviceId} = this.state;
        if (deviceId.length === 0) {
            return '此温室暂无任何设备';
        }
        return (
            <Spin spinning={isLoading}>
                {deviceId.map((deviceIditem, index) => {
                    const deviceIdPos = greenHouseMaps.filter(item => item.deviceId === deviceIditem);
                    console.log(deviceIditem);
                    return (
                        <MotorControl key={index} deviceId={deviceIditem} deviceIdMap={deviceIdPos}/>
                    )
                })}
            </Spin>
        )
    }
}

export default Index;
