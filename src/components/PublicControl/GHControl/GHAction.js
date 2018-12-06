import React, {Component} from 'react';

import {Spin, message, Card, Icon, Row, Col, Switch, Radio, Slider, Button, Badge, Tag, Input, Form} from 'antd';

let tempMarks = {
    0: {
        label: <strong>0</strong>
    },
    60: {
        style: {
            color: '#f50'
        },
        label: <strong>60℃</strong>
    }
};
let humiMarks = {
    0: {
        style: {
            color: 'green'
        },
        label: <strong>0</strong>
    },
    100: {
        style: {
            color: '#f50'
        },
        label: <strong>100%</strong>
    }
};
const INITIAL_VALUE_MOTOR_RANGE = '15';//卷膜机行程时间初始值
const INITIAL_VALUE_TIMEOUT = '60';//超时参数初始值
const INITIAL_VALUE_CLOCK = '0900';//闹钟初始值
const INITIAL_VALUE_TEMP_MAX = '260';//温度上限初始值
const INITIAL_VALUE_TEMP_MIN = '200';//温度下限初始值
const INITIAL_VALUE_SERVER1_RANGE = '10';//阀门控制时间初始值
const INITIAL_VALUE_SERVER2_RANGE = '10';//风机控制时间初始值
const FormItem = Form.Item;

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorInfo: '',
            isLoading: false,
            greenHouseId: this.props.greenHouseId,
            greenHouseMaps: [],
            deviceId: [],
            tempModalDeviceId: '',
            tempModalNum: '',
            clockValue: '',
            devicesStatus: ''
        }
    };

    handleTimeOut = (deviceIdItem, value) => {
        const timeOutReg = new RegExp(/^\+?[1-9][0-9]*$/);
        if (!timeOutReg.test(value)) {
            message.warning('请输入正整数');
            return false;
        }
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '09';
        newAction.action = `1 ${value}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        this.setState({
            isLoading: true
        });
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.timeout = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    isLoading: false,
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({
                    isLoading: false
                });
            })

    };
    handleClockSwitch = (deviceIdItem, clockStatus) => {
        let value = clockStatus ? INITIAL_VALUE_CLOCK : '';
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '10';
        newAction.action = `1 ${value} 1`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.clock = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleClock = (deviceIdItem, value) => {
        const timeReg = new RegExp(/^(20|21|22|23|[0-1]\d)[0-5]\d$/);
        if (!timeReg.test(value)) {
            message.error('请输入正确的时间，例如：0930');
            return false;
        }
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '10';
        newAction.action = `1 ${value} 1`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.clock = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })

    };
    handleMotor1Control = (event) => {
        let deviceIdItem = event.target.name;
        let value = event.target.value;
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];

        // let motor_1_act = deviceStatusItem.motor_1_act;
        let motor_2_act = deviceStatusItem.motor_2_act;
        let serve_1_act = deviceStatusItem.serve_1_act;
        let serve_2_act = deviceStatusItem.serve_2_act;

        motor_2_act = (motor_2_act === null || motor_2_act === '') ? '2' : motor_2_act;
        serve_1_act = (serve_1_act === null || serve_1_act === '') ? '0' : serve_1_act;
        serve_2_act = (serve_2_act === null || serve_2_act === '') ? '0' : serve_2_act;

        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '03';
        newAction.action = `${value} ${motor_2_act} ${serve_1_act} ${serve_2_act}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.motor_1_act = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleMotor2Control = (event) => {
        let deviceIdItem = event.target.name;
        let value = event.target.value;
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];

        let motor_1_act = deviceStatusItem.motor_1_act;
        // let motor_2_act = deviceStatusItem.motor_2_act;
        let serve_1_act = deviceStatusItem.serve_1_act;
        let serve_2_act = deviceStatusItem.serve_2_act;

        motor_1_act = (motor_1_act === null || motor_1_act === '') ? '2' : motor_1_act;
        serve_1_act = (serve_1_act === null || serve_1_act === '') ? '0' : serve_1_act;
        serve_2_act = (serve_2_act === null || serve_2_act === '') ? '0' : serve_2_act;

        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '03';
        newAction.action = `${motor_1_act} ${value} ${serve_1_act} ${serve_2_act}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.motor_2_act = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleMotor1Range = (deviceIdItem, value) => {
        console.log(deviceIdItem, value);
        const timeOutReg = new RegExp(/^\+?[1-9][0-9]*$/);
        if (!timeOutReg.test(value)) {
            message.warning('请输入正整数');
            return false;
        }
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];

        // let motor_1_range = deviceStatusItem.motor_1_range;
        let motor_2_range = deviceStatusItem.motor_2_range;
        motor_2_range = (motor_2_range === null || motor_2_range === '') ? INITIAL_VALUE_MOTOR_RANGE : motor_2_range;

        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '13';
        newAction.action = `1 ${value} ${motor_2_range}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.motor_1_range = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleMotor2Range = (deviceIdItem, value) => {
        console.log(deviceIdItem, value);
        const timeOutReg = new RegExp(/^\+?[1-9][0-9]*$/);
        if (!timeOutReg.test(value)) {
            message.warning('请输入正整数');
            return false;
        }
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];

        let motor_1_range = deviceStatusItem.motor_1_range;
        // let motor_2_range = deviceStatusItem.motor_2_range;
        motor_1_range = (motor_1_range === null || motor_1_range === '') ? INITIAL_VALUE_MOTOR_RANGE : motor_1_range;

        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '13';
        newAction.action = `1 ${motor_1_range} ${value}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.motor_2_range = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleTemp1Range = (deviceIdItem, event) => {
        event.preventDefault();
        console.log(deviceIdItem);
        this.props.form.validateFields((err, values) => {
            console.log(values);
            let tempMax = Number(values[`tempMax${deviceIdItem}1`]);
            let tempMin = Number(values[`tempMin${deviceIdItem}1`]);
            const tempReg = new RegExp(/^([1-9]|[1-5][0-9]|60)$/);
            if (!tempReg.test(tempMax) || !tempReg.test(tempMin)) {
                message.warning('请输入1~60之间的正整数');
                return false;
            }
            if (tempMax <= tempMin) {
                message.warning('温度上限应大于温度下限');
                return false;
            }
            const {devicesStatus} = this.state;
            const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
            const deviceStatusItem = devicesStatus[deviceStatusIndex];

            let motor_2_max = deviceStatusItem.motor_2_max;
            let motor_2_min = deviceStatusItem.motor_2_min;

            motor_2_max = (motor_2_max === null || motor_2_max === '') ? INITIAL_VALUE_TEMP_MAX : motor_2_max;
            motor_2_min = (motor_2_min === null || motor_2_min === '') ? INITIAL_VALUE_TEMP_MIN : motor_2_min;

            const token = window.sessionStorage.getItem('token');
            const urlAction = 'http://47.92.206.44:80/api/action/';
            let newAction = {};
            let newItem = [];
            newAction.deviceId = deviceIdItem;
            newAction.commandtype = '08';
            newAction.action = `${tempMax} ${tempMin} ${motor_2_max} ${motor_2_min}`;
            newItem.push(newAction);
            console.log(newItem);
            let options = {
                method: 'POST',
                body: JSON.stringify(newItem),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token
                }
            };
            fetch(urlAction, options)
                .then(response => console.log(response.status))
                .then(() => {
                    deviceStatusItem.motor_1_max = tempMax;
                    deviceStatusItem.motor_1_min = tempMin;
                    devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                    this.setState({
                        devicesStatus: devicesStatus
                    });
                })
                .catch(() => {
                    message.error('网络异常，请重新提交');
                    this.setState({

                    });
                })
        })
    };
    handleTemp2Range = (deviceIdItem, event) => {
        event.preventDefault();
        console.log(deviceIdItem);
        this.props.form.validateFields((err, values) => {
            console.log(values);
            let tempMax = Number(values[`tempMax${deviceIdItem}2`]);
            let tempMin = Number(values[`tempMin${deviceIdItem}2`]);
            const tempReg = new RegExp(/^([1-9]|[1-5][0-9]|60)$/);
            if (!tempReg.test(tempMax) || !tempReg.test(tempMin)) {
                message.warning('请输入1~60之间的正整数');
                return false;
            }
            if (tempMax <= tempMin) {
                message.warning('温度上限应大于温度下限');
                return false;
            }
            const {devicesStatus} = this.state;
            const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
            const deviceStatusItem = devicesStatus[deviceStatusIndex];

            let motor_1_max = deviceStatusItem.motor_1_max;
            let motor_1_min = deviceStatusItem.motor_1_min;
            // let motor_2_max = deviceStatusItem.motor_2_max;
            // let motor_2_min = deviceStatusItem.motor_2_min;

            motor_1_max = (motor_1_max === null || motor_1_max === '') ? INITIAL_VALUE_TEMP_MAX : motor_1_max;
            motor_1_min = (motor_1_min === null || motor_1_min === '') ? INITIAL_VALUE_TEMP_MIN : motor_1_min;

            const token = window.sessionStorage.getItem('token');
            const urlAction = 'http://47.92.206.44:80/api/action/';
            let newAction = {};
            let newItem = [];
            newAction.deviceId = deviceIdItem;
            newAction.commandtype = '08';
            newAction.action = `${motor_1_max} ${motor_1_min} ${tempMax} ${tempMin}`;
            newItem.push(newAction);
            console.log(newItem);
            let options = {
                method: 'POST',
                body: JSON.stringify(newItem),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token
                }
            };
            fetch(urlAction, options)
                .then(response => console.log(response.status))
                .then(() => {
                    deviceStatusItem.motor_2_max = tempMax;
                    deviceStatusItem.motor_2_min = tempMin;
                    devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                    this.setState({
                        devicesStatus: devicesStatus
                    });
                })
                .catch(() => {
                    message.error('网络异常，请重新提交');
                    this.setState({

                    });
                })
        })
    };

    handleServer1Control = (deviceIdItem, serverStatus) => {
        console.log(deviceIdItem, serverStatus);
        const value = serverStatus ? '1' : '0';
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];

        let motor_1_act = deviceStatusItem.motor_1_act;
        let motor_2_act = deviceStatusItem.motor_2_act;
        // let serve_1_act = deviceStatusItem.serve_1_act;
        let serve_2_act = deviceStatusItem.serve_2_act;

        motor_1_act = (motor_1_act === null || motor_1_act === '') ? '2' : motor_1_act;
        motor_2_act = (motor_2_act === null || motor_2_act === '') ? '2' : motor_2_act;
        serve_2_act = (serve_2_act === null || serve_2_act === '') ? '0' : serve_2_act;

        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '03';
        newAction.action = `${motor_1_act} ${motor_2_act} ${value} ${serve_2_act}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.serve_1_act = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleServer2Control = (deviceIdItem, serverStatus) => {
        console.log(deviceIdItem, serverStatus);
        const value = serverStatus ? '1' : '0';
        const {devicesStatus} = this.state;
        const deviceStatusIndex = devicesStatus.findIndex(item => item.station_num === deviceIdItem);
        const deviceStatusItem = devicesStatus[deviceStatusIndex];

        let motor_1_act = deviceStatusItem.motor_1_act;
        let motor_2_act = deviceStatusItem.motor_2_act;
        let serve_1_act = deviceStatusItem.serve_1_act;
        // let serve_2_act = deviceStatusItem.serve_2_act;

        motor_1_act = (motor_1_act === null || motor_1_act === '') ? '2' : motor_1_act;
        motor_2_act = (motor_2_act === null || motor_2_act === '') ? '2' : motor_2_act;
        serve_1_act = (serve_1_act === null || serve_1_act === '') ? '0' : serve_1_act;

        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action/';
        let newAction = {};
        let newItem = [];
        newAction.deviceId = deviceIdItem;
        newAction.commandtype = '03';
        newAction.action = `${motor_1_act} ${motor_2_act} ${serve_1_act} ${value}`;
        newItem.push(newAction);
        console.log(newItem);
        let options = {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => console.log(response.status))
            .then(() => {
                deviceStatusItem.serve_2_act = value;
                devicesStatus.splice(deviceStatusIndex, 1, deviceStatusItem);
                this.setState({
                    devicesStatus: devicesStatus
                });
            })
            .catch(() => {
                message.error('网络异常，请重新提交');
                this.setState({

                });
            })
    };
    handleServer1Range = (deviceIdItem, value) => {
        console.log(deviceIdItem, value)
    };
    handleServer2Range = (deviceIdItem, value) => {
        console.log(deviceIdItem, value)
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const {greenHouseId} = this.state;
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
        const getGreenHouseMap = new Promise((resolve, reject) => {
            fetch(urlGreenHouseMap, opts)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(() => reject('获取绑定信息失败'))
        });
        getGreenHouseMap
            .then(res => {
                if (res.length !== 0) {
                    //获取当前大棚下所有deviceId并去重复
                    let deviceId = res.map(item1 => item1.deviceId);
                    deviceId = Array.from(new Set(deviceId));
                    const urlDeviceStatus = 'http://47.92.206.44:80/api/devicestatus';
                    const optionDeviceId = {
                        method: 'POST',
                        body: JSON.stringify(deviceId),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + token
                        }
                    };

                    fetch(urlDeviceStatus, optionDeviceId)
                        .then((response) => response.json())
                        .then(resStatus => {
                            let deviceIdStatus = {};
                            for (let i = 0; i < deviceId.length; i++) {
                                deviceIdStatus[deviceId[i]] = resStatus[i];
                            }

                            console.log(res);
                            console.log(deviceId);
                            console.log(deviceIdStatus);

                            this.setState({
                                greenHouseMaps: res,
                                deviceId: deviceId,
                                devicesStatus: resStatus,
                                isLoading: false,
                                errorInfo: ''
                            })
                        })
                        .catch(() => message.error('网络异常'))

                }
                else {
                    this.setState({
                        isLoading: false,
                        errorInfo: '此大棚暂无绑定控制器'
                    })
                }
            })
            .catch(error => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    isLoading: false,
                    errorInfo: error
                })
            })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {errorInfo, isLoading, greenHouseMaps, deviceId, devicesStatus} = this.state;
        if (errorInfo) {
            return errorInfo;
        }
        return (
            <Spin spinning={isLoading}>
                {deviceId.map((deviceIdItem, deviceIdIndex) => {
                    const deviceIdPos = greenHouseMaps.filter(item => item.deviceId === deviceIdItem);
                    const deviceStatus = devicesStatus.filter(item => item.station_num === deviceIdItem);
                    let pos0 = deviceIdPos.filter(item => item.devicePos === "0");
                    let pos1 = deviceIdPos.filter(item => item.devicePos === "1");
                    let pos2 = deviceIdPos.filter(item => item.devicePos === "2");
                    let pos3 = deviceIdPos.filter(item => item.devicePos === "3");
                    let greenHousePos0 = (pos0.length === 0) ? null : pos0[0].greenHousePos;
                    let greenHousePos1 = (pos1.length === 0) ? null : pos1[0].greenHousePos;
                    let greenHousePos2 = (pos2.length === 0) ? null : pos2[0].greenHousePos;
                    let greenHousePos3 = (pos3.length === 0) ? null : pos3[0].greenHousePos;
                    let temp1 = deviceStatus[0].temp1;
                    let temp2 = deviceStatus[0].temp2;
                    let humi1 = deviceStatus[0].hum1;
                    let humi2 = deviceStatus[0].hum2;
                    temp1 = (temp1 === null) ? 0 : (temp1/10);
                    temp2 = (temp2 === null) ? 0 : (temp2/10);
                    humi1 = (humi1 === null) ? 0 : humi1;
                    humi2 = (humi2 === null) ? 0 : humi2;
                    //当控制命令为null时，默认赋值
                    let motor_1_act = deviceStatus[0].motor_1_act;
                    let motor_2_act = deviceStatus[0].motor_2_act;
                    let serve_1_act = deviceStatus[0].serve_1_act;
                    let serve_2_act = deviceStatus[0].serve_2_act;
                    motor_1_act = (motor_1_act === null) ? '2' : motor_1_act;
                    motor_2_act = (motor_2_act === null) ? '2' : motor_2_act;
                    serve_1_act = (serve_1_act === null) ? '1' : serve_1_act;
                    serve_2_act = (serve_2_act === null) ? '1' : serve_2_act;
                    //当温度上下限为null时，默认赋值
                    let motor_1_max = deviceStatus[0].motor_1_max;
                    let motor_1_min = deviceStatus[0].motor_1_min;
                    let motor_2_max = deviceStatus[0].motor_2_max;
                    let motor_2_min = deviceStatus[0].motor_2_min;
                    motor_1_max = (motor_1_max === null) ? 0 : parseInt(motor_1_max/10);
                    motor_1_min = (motor_1_min === null) ? 0 : parseInt(motor_1_min/10);
                    motor_2_max = (motor_2_max === null) ? 0 : parseInt(motor_2_max/10);
                    motor_2_min = (motor_2_min === null) ? 0 : parseInt(motor_2_min/10);

                    let timeOut = deviceStatus[0].timeout;
                    let clock = deviceStatus[0].clock;
                    let motor_1_range = deviceStatus[0].motor_1_range;
                    let motor_2_range = deviceStatus[0].motor_2_range;
                    let rain = deviceStatus[0].rain;
                    let rain_num = deviceStatus[0].rain_num;

                    let clockSwitch = !(clock === null || clock === '');
                    clock = (clock === null || clock === '') ? 'null' : `${clock[0]}${clock[1]}:${clock[2]}${clock[3]}`;

                    return (
                        <Card
                            key={deviceIdIndex}
                            title={`控制器ID：${deviceIdItem}`}
                            style={{
                                borderColor: deviceStatus[0].is_online === '0' ? 'red' : '',
                                marginBottom: '10px'
                            }}
                            extra={
                                <div style={{width: '700px'}}>
                                    {rain_num ?
                                        <p style={{float: 'left'}}>降雨量（雨量ID：{rain_num}）: <em
                                            style={{color: 'red'}}>{rain} </em>mm</p>
                                        : null
                                    }
                                    <Icon type='setting'/>&nbsp;
                                    {deviceStatus[0].is_online === '0' ? '掉线' : '在线'}
                                </div>
                            }
                        >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Card>
                                        <Col span={12}>
                                            {`超时参数：${timeOut} min`}
                                        </Col>
                                        <Col span={12}>
                                            <Input.Search onSearch={this.handleTimeOut.bind(this, deviceIdItem)}
                                                          placeholder='请输入正整数' enterButton="提交"/>
                                        </Col>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Col span={8}>
                                            {`闹钟定时：${clock}`}
                                        </Col>
                                        <Col span={4}>
                                            <Switch checkedChildren={'开'} unCheckedChildren={'关'}
                                                    onChange={this.handleClockSwitch.bind(this, deviceIdItem)}
                                                    checked={clockSwitch}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Input.Search onSearch={this.handleClock.bind(this, deviceIdItem)}
                                                          placeholder='请输入闹钟时间' enterButton="提交"/>
                                        </Col>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                {greenHousePos0 ?
                                    <Col span={12}>
                                        <Card
                                            title={`卷膜机1 | ${greenHousePos0}`}
                                            extra={
                                                <p>行程时间: <strong
                                                    style={{color: 'green'}}>{`${motor_1_range}`}</strong> 秒</p>
                                            }
                                        >
                                            <Col span={12}>
                                                <Radio.Group name={deviceIdItem} value={String(motor_1_act)}
                                                             onChange={this.handleMotor1Control}>
                                                    <Radio.Button value='0'>上升</Radio.Button>
                                                    <Radio.Button value='2'>停止</Radio.Button>
                                                    <Radio.Button value='1'>下降</Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                            <Col span={12}>
                                                <Input.Search placeholder='请输入行程时间' enterButton="提交"
                                                              onSearch={this.handleMotor1Range.bind(this, deviceIdItem)}/>
                                            </Col>
                                        </Card>
                                    </Col>
                                    : null
                                }
                                {greenHousePos1 ?
                                    <Col span={12}>
                                        <Card
                                            title={`卷膜机2 | ${greenHousePos1}`}
                                            extra={
                                                <p>行程时间: <strong
                                                    style={{color: 'green'}}>{`${motor_2_range}`}</strong> 秒</p>
                                            }
                                        >
                                            <Col span={12}>
                                                <Radio.Group name={deviceIdItem} value={String(motor_2_act)}
                                                             onChange={this.handleMotor2Control}>
                                                    <Radio.Button value='0'>上升</Radio.Button>
                                                    <Radio.Button value='2'>停止</Radio.Button>
                                                    <Radio.Button value='1'>下降</Radio.Button>
                                                </Radio.Group>
                                            </Col>
                                            <Col span={12}>
                                                <Input.Search placeholder='请输入行程时间' enterButton="提交"
                                                              onSearch={this.handleMotor2Range.bind(this, deviceIdItem)}/>
                                            </Col>
                                        </Card>
                                    </Col>
                                    : null
                                }
                            </Row>
                            <Row gutter={24}>
                                {greenHousePos0 ?
                                    <Col span={12}>
                                        <Card
                                            title='温湿度1'
                                            extra={
                                                <div>
                                                    <Badge count={motor_1_max}>
                                                        <Tag color='red'>温度上限</Tag>
                                                    </Badge>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Badge count={motor_1_min}>
                                                        <Tag color='green'>温度下限</Tag>
                                                    </Badge>
                                                </div>
                                            }
                                        >
                                            <Col span={12}>
                                                实时温度：{temp1} ℃<Slider style={{width: '100%'}} min={0} max={60}
                                                                    marks={tempMarks} value={Number(temp1)}/>
                                                实时湿度：{humi1} %<Slider style={{width: '100%'}} min={0} max={100}
                                                                    marks={humiMarks} value={Number(humi1)}/>
                                            </Col>
                                            <Col span={12} className="changTemp">
                                                <Form
                                                    onSubmit={this.handleTemp1Range.bind(this, deviceIdItem)}
                                                    className="login-form">
                                                    <FormItem>
                                                        {getFieldDecorator(`tempMax${deviceIdItem}1`, {
                                                            rules: [{required: false}],
                                                        })(
                                                            <Input addonBefore='温度上限' placeholder="1～60"/>
                                                        )}
                                                    </FormItem>
                                                    <FormItem>
                                                        {getFieldDecorator(`tempMin${deviceIdItem}1`, {
                                                            rules: [{required: false}],
                                                        })(
                                                            <Input addonBefore='温度下限' placeholder="1～60"/>
                                                        )}
                                                    </FormItem>
                                                    <FormItem style={{textAlign: 'center'}}>
                                                        <Button type="primary" htmlType="submit">
                                                            提交阈值
                                                        </Button>
                                                    </FormItem>
                                                </Form>
                                            </Col>
                                        </Card>
                                    </Col>
                                    : null
                                }
                                {greenHousePos1 ?
                                    <Col span={12}>
                                        <Card
                                            title='温湿度2'
                                            extra={
                                                <div>
                                                    <Badge count={motor_2_max}>
                                                        <Tag color='red'>温度上限</Tag>
                                                    </Badge>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <Badge count={motor_2_min}>
                                                        <Tag color='green'>温度下限</Tag>
                                                    </Badge>
                                                </div>
                                            }
                                        >
                                            <Col span={12}>
                                                实时温度：{temp2} ℃<Slider style={{width: '100%'}} min={0} max={60}
                                                                    marks={tempMarks} value={Number(temp2)}/>
                                                实时湿度：{humi2} %<Slider style={{width: '100%'}} min={0} max={100}
                                                                    marks={humiMarks} value={Number(humi2)}/>
                                            </Col>
                                            <Col span={12} className="changTemp">
                                                <Form
                                                    onSubmit={this.handleTemp2Range.bind(this, deviceIdItem)}
                                                    className="login-form">
                                                    <FormItem>
                                                        {getFieldDecorator(`tempMax${deviceIdItem}2`, {
                                                            rules: [{required: false}],
                                                        })(
                                                            <Input addonBefore='温度上限' placeholder="1～60"/>
                                                        )}
                                                    </FormItem>
                                                    <FormItem>
                                                        {getFieldDecorator(`tempMin${deviceIdItem}2`, {
                                                            rules: [{required: false}],
                                                        })(
                                                            <Input addonBefore='温度下限' placeholder="1～60"/>
                                                        )}
                                                    </FormItem>
                                                    <FormItem style={{textAlign: 'center'}}>
                                                        <Button type="primary" htmlType="submit"
                                                                className="login-form-button">
                                                            提交阈值
                                                        </Button>
                                                    </FormItem>
                                                </Form>
                                            </Col>
                                        </Card>
                                    </Col>
                                    : null
                                }
                            </Row>
                            <Row gutter={24}>
                                {greenHousePos2 ?
                                    <Col span={12}>
                                        <Card
                                            title={`阀门 | ${greenHousePos2}`}
                                        >
                                            <Col span={12}>
                                                <Switch checkedChildren={'开'} unCheckedChildren={'关'}
                                                        onChange={this.handleServer1Control.bind(this, deviceIdItem)}
                                                        checked={serve_1_act === '1'}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Input.Search onSearch={this.handleServer1Range.bind(this, deviceIdItem)}
                                                              placeholder='请输入正整数' enterButton="提交"/>
                                            </Col>
                                        </Card>
                                    </Col>
                                    : null
                                }
                                {greenHousePos3 ?
                                    <Col span={12}>
                                        <Card
                                            title={`风机 | ${greenHousePos3}`}
                                        >
                                            <Col span={12}>
                                                <Switch checkedChildren={'开'} unCheckedChildren={'关'}
                                                        onChange={this.handleServer2Control.bind(this, deviceIdItem)}
                                                        checked={serve_2_act === '1'}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Input.Search onSearch={this.handleServer2Range.bind(this, deviceIdItem)}
                                                              placeholder='请输入正整数' enterButton="提交"/>
                                            </Col>
                                        </Card>
                                    </Col>
                                    : null
                                }
                            </Row>
                        </Card>
                    )
                })}
            </Spin>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(Index);

export default WrappedNormalLoginForm;
