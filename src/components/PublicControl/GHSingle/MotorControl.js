import React, {Component} from 'react';
import {Row, Col, Radio, Card, Input, Badge, Button, Tag, Icon, message} from 'antd';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceIdStatus: "",
            motor1First: '',
            motor2First: '',
            motor1Second: '',
            motor2Second: '',
            motor1Max: '',
            motor2Max: '',
            motor1Min: '',
            motor2Min: '',
            clock: ''
        }
    }

    handleServer1Control = (e) => {
        const value = e.target.value;
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '17',
            action: `${value}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        serve_1_act: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleServer2Control = (e) => {
        const value = e.target.value;
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '18',
            action: `${value}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        serve_2_act: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor1Control = (e) => {
        const value = e.target.value;
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '03',
            action: `${value} 2`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_act: value,
                        motor_2_act: '2',
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor1Range = (value) => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let motor_2_range = deviceIdStatus.motor_2_range;
        motor_2_range = (motor_2_range === null) ? value : motor_2_range;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '13',
            action: `1 ${value} ${motor_2_range}`
        }];
        console.log(actionItem);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_range: value,
                        motor_2_range: motor_2_range
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor1Over = (value) => {
        const valueReg = new RegExp(/^[1-9]$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        value = value * 1000;
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let motor_2_over = deviceIdStatus.motor_2_over;
        motor_2_over = (motor_2_over === null) ? value : motor_2_over;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '16',
            action: `${value} ${motor_2_over}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_over: value,
                        motor_2_over: motor_2_over
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor1First = (e) => {
        this.setState({
            motor1First: e.target.value
        })
    };
    handleMotor1Second = (e) => {
        this.setState({
            motor1Second: e.target.value
        })
    };
    handleMotor1OpenTime = () => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        const {deviceIdStatus, motor1First, motor1Second} = this.state;
        const {deviceId} = this.props;
        if (!valueReg.test(motor1First) || !valueReg.test(motor1Second)) {
            message.warning('请输入正确的参数');
            return false;
        }
        let motor_2_first = deviceIdStatus.motor_2_first;
        let motor_2_second = deviceIdStatus.motor_2_second;
        motor_2_first = (motor_2_first === null) ? motor1First : motor_2_first;
        motor_2_second = (motor_2_second === null) ? motor1Second : motor_2_second;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '14',
            action: `${motor1First} ${motor1Second} ${motor_2_first} ${motor_2_second}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_first: motor1First,
                        motor_2_first: motor_2_first,
                        motor_1_second: motor1Second,
                        motor_2_second: motor_2_second
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor1Max = (e) => {
        this.setState({
            motor1Max: e.target.value
        })
    };
    handleMotor1Min = (e) => {
        this.setState({
            motor1Min: e.target.value
        })
    };
    handleMotor1Temp = () => {
        const valueReg = new RegExp(/^([0-9]|[1-5][0-9]|60)$/);
        const {deviceIdStatus, motor1Max, motor1Min} = this.state;
        const {deviceId} = this.props;
        if (!valueReg.test(motor1Max) || !valueReg.test(motor1Min)) {
            message.warning('请输入正确的参数');
            return false;
        }
        let temp1 = Number(motor1Max) * 10;
        let temp2 = Number(motor1Min) * 10;
        if (temp1 <= temp2) {
            message.warning('温度上限应大于温度下限');
            return false;
        }
        let motor_2_max = deviceIdStatus.motor_2_max;
        let motor_2_min = deviceIdStatus.motor_2_min;
        motor_2_max = (motor_2_max === null) ? temp1 : motor_2_max;
        motor_2_min = (motor_2_min === null) ? temp2 : motor_2_min;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '08',
            action: `1 ${temp1} ${temp2} ${motor_2_max} ${motor_2_min}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_max: temp1,
                        motor_1_min: temp2,
                        motor_2_max: motor_2_max,
                        motor_2_min: motor_2_min
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleServer1Time = (value) => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let serve_2_timer = deviceIdStatus.serve_2_timer;
        serve_2_timer = (serve_2_timer === null) ? value : serve_2_timer;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '15',
            action: `${value} ${serve_2_timer}`
        }];
        console.log(actionItem);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        serve_1_timer: value,
                        serve_2_timer: serve_2_timer
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };

    handleMotor2Control = (e) => {
        const value = e.target.value;
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '03',
            action: `2 ${value}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_act: '2',
                        motor_2_act: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor2Range = (value) => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let motor_1_range = deviceIdStatus.motor_1_range;
        motor_1_range = (motor_1_range === null) ? value : motor_1_range;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '13',
            action: `1 ${motor_1_range} ${value}`
        }];
        console.log(actionItem);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_range: motor_1_range,
                        motor_2_range: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor2Over = (value) => {
        const valueReg = new RegExp(/^[1-9]$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        value = value * 1000;
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let motor_1_over = deviceIdStatus.motor_1_over;
        motor_1_over = (motor_1_over === null) ? value : motor_1_over;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '16',
            action: `${motor_1_over} ${value}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_over: motor_1_over,
                        motor_2_over: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor2First = (e) => {
        this.setState({
            motor2First: e.target.value
        })
    };
    handleMotor2Second = (e) => {
        this.setState({
            motor2Second: e.target.value
        })
    };
    handleMotor2OpenTime = () => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        const {deviceIdStatus, motor2First, motor2Second} = this.state;
        const {deviceId} = this.props;
        if (!valueReg.test(motor2First) || !valueReg.test(motor2Second)) {
            message.warning('请输入正确的参数');
            return false;
        }
        let motor_1_first = deviceIdStatus.motor_1_first;
        let motor_1_second = deviceIdStatus.motor_1_second;
        motor_1_first = (motor_1_first === null) ? motor2First : motor_1_first;
        motor_1_second = (motor_1_second === null) ? motor2Second : motor_1_second;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '14',
            action: `${motor_1_first} ${motor_1_second} ${motor2First} ${motor2Second}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_first: motor_1_first,
                        motor_1_second: motor_1_second,
                        motor_2_first: motor2First,
                        motor_2_second: motor2Second
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleMotor2Max = (e) => {
        this.setState({
            motor2Max: e.target.value
        })
    };
    handleMotor2Min = (e) => {
        this.setState({
            motor2Min: e.target.value
        })
    };
    handleMotor2Temp = () => {
        const valueReg = new RegExp(/^([0-9]|[1-5][0-9]|60)$/);
        const {deviceIdStatus, motor2Max, motor2Min} = this.state;
        const {deviceId} = this.props;
        if (!valueReg.test(motor2Max) || !valueReg.test(motor2Min)) {
            message.warning('请输入正确的参数');
            return false;
        }
        let temp1 = Number(motor2Max) * 10;
        let temp2 = Number(motor2Min) * 10;
        if (temp1 <= temp2) {
            message.warning('温度上限应大于温度下限');
            return false;
        }
        let motor_1_max = deviceIdStatus.motor_1_max;
        let motor_1_min = deviceIdStatus.motor_1_min;
        motor_1_max = (motor_1_max === null) ? temp1 : motor_1_max;
        motor_1_min = (motor_1_min === null) ? temp2 : motor_1_min;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '08',
            action: `1 ${motor_1_max} ${motor_1_min} ${temp1} ${temp2}`
        }];
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        console.log(actionItem);
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        motor_1_max: motor_1_max,
                        motor_1_min: motor_1_min,
                        motor_2_max: temp1,
                        motor_2_min: temp2
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleServer2Time = (value) => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let serve_1_timer = deviceIdStatus.serve_1_timer;
        serve_1_timer = (serve_1_timer === null) ? value : serve_1_timer;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '15',
            action: `${serve_1_timer} ${value}`
        }];
        console.log(actionItem);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        serve_1_timer: serve_1_timer,
                        serve_2_timer: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };

    handleClockInput = (e) => {
        this.setState({
            clock: e.target.value
        })
    };
    handleClockControl = (e) => {
        console.log(e.target.value);
        const value = e.target.value;
        const valueReg = new RegExp(/^(20|21|22|23|[0-1]\d)[0-5]\d$/);
        const {clock, deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let actionItem = [];
        let clockValue = "";
        if (value === "0") {
            actionItem = [{
                deviceId: deviceId,
                commandtype: '10',
                action: `1 0900 0`
            }];
        }
        else {
            if (!valueReg.test(clock)) {
                message.error('请输入正确的参数');
                return false;
            }
            clockValue = clock;
            actionItem = [{
                deviceId: deviceId,
                commandtype: '10',
                action: `1 ${clock} 1`
            }];
        }

        console.log(actionItem);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        clock: clockValue
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };
    handleTimeOut = (value) => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        if (!valueReg.test(value)) {
            message.warning('请输入正确的参数');
            return false;
        }
        const {deviceIdStatus} = this.state;
        const {deviceId} = this.props;
        let actionItem = [{
            deviceId: deviceId,
            commandtype: '09',
            action: `1 ${value}`
        }];
        console.log(actionItem);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'https://in.huayuaobo.com:16400/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlAction, options)
            .then(response => response.status)
            .then((status) => {
                console.log(status);
                message.success('命令下发成功');
                this.setState({
                    deviceIdStatus: {
                        ...deviceIdStatus,
                        timeout: value
                    }
                })
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };

    componentDidMount() {
        const {deviceId} = this.props;
        const token = window.sessionStorage.getItem('token');
        const urlDeviceStatus = `https://in.huayuaobo.com:16400/api/devicestatus/${deviceId}`;
        const option = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(urlDeviceStatus, option)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    deviceIdStatus: res
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面')
            })
    }

    render() {
        const {deviceIdStatus, motor1First, motor2First, motor1Second, motor2Second, motor1Max, motor2Max, motor1Min, motor2Min} = this.state;
        const {deviceIdMap, deviceId} = this.props;
        if (deviceIdStatus === "") {
            return false;
        }
        let pos0 = deviceIdMap.filter(item => item.devicePos === "0");
        let pos1 = deviceIdMap.filter(item => item.devicePos === "1");
        let pos2 = deviceIdMap.filter(item => item.devicePos === "2");
        let pos3 = deviceIdMap.filter(item => item.devicePos === "3");
        // console.log(pos0, pos1, pos2, pos3);

        let greenHousePos0 = (pos0.length === 0) ? null : pos0[0].greenHousePos;
        let greenHousePos1 = (pos1.length === 0) ? null : pos1[0].greenHousePos;
        let greenHousePos2 = (pos2.length === 0) ? null : pos2[0].greenHousePos;
        let greenHousePos3 = (pos3.length === 0) ? null : pos3[0].greenHousePos;
        console.log(greenHousePos0, greenHousePos1, greenHousePos2, greenHousePos3);

        let temp1 = deviceIdStatus.temp1;
        let temp2 = deviceIdStatus.temp2;
        let humi1 = deviceIdStatus.hum1;
        let humi2 = deviceIdStatus.hum2;
        temp1 = (temp1 === null) ? 0 : (temp1 / 10);
        temp2 = (temp2 === null) ? 0 : (temp2 / 10);
        humi1 = (humi1 === null) ? 0 : humi1;
        humi2 = (humi2 === null) ? 0 : humi2;
        // console.log(temp1, temp2, humi1, humi2);

        let motor_1_act = deviceIdStatus.motor_1_act;
        let motor_2_act = deviceIdStatus.motor_2_act;
        motor_1_act = (motor_1_act === null) ? '2' : motor_1_act;
        motor_2_act = (motor_2_act === null) ? '2' : motor_2_act;
        // console.log(motor_1_act, motor_2_act);

        let motor_1_max = deviceIdStatus.motor_1_max;
        let motor_1_min = deviceIdStatus.motor_1_min;
        let motor_2_max = deviceIdStatus.motor_2_max;
        let motor_2_min = deviceIdStatus.motor_2_min;
        motor_1_max = (motor_1_max === null) ? 0 : parseInt(motor_1_max / 10);
        motor_1_min = (motor_1_min === null) ? 0 : parseInt(motor_1_min / 10);
        motor_2_max = (motor_2_max === null) ? 0 : parseInt(motor_2_max / 10);
        motor_2_min = (motor_2_min === null) ? 0 : parseInt(motor_2_min / 10);
        // console.log(motor_1_max, motor_1_min, motor_2_max, motor_2_min);

        let motor_1_first = deviceIdStatus.motor_1_first;
        let motor_2_first = deviceIdStatus.motor_2_first;
        let motor_1_second = deviceIdStatus.motor_1_second;
        let motor_2_second = deviceIdStatus.motor_2_second;
        // console.log(motor_1_first, motor_2_first, motor_1_second, motor_2_second);

        let motor_1_over = deviceIdStatus.motor_1_over;
        let motor_2_over = deviceIdStatus.motor_2_over;
        motor_1_over = (motor_1_over === null) ? 0 : parseInt(motor_1_over / 1000);
        motor_2_over = (motor_2_over === null) ? 0 : parseInt(motor_2_over / 1000);
        let motor_1_range = deviceIdStatus.motor_1_range;
        let motor_2_range = deviceIdStatus.motor_2_range;
        // let motor_1_stat = deviceIdStatus.motor_1_stat;
        // let motor_2_stat = deviceIdStatus.motor_2_stat;
        // console.log(motor_1_over, motor_2_over, motor_1_range, motor_2_range);

        let clock = deviceIdStatus.clock;
        let timeout = deviceIdStatus.timeout;
        let is_online = deviceIdStatus.is_online;
        let rain = deviceIdStatus.rain;
        let rain_num = deviceIdStatus.rain_num;
        let clockValue = (clock === null || clock === "") ? "0" : '1';
        clock = (clockValue === "0") ? "关闭" : `${clock[0]}${clock[1]}:${clock[2]}${clock[3]}`;


        is_online = (is_online === null) ? "0" : is_online;
        rain = (rain_num === null || rain_num === "") ? "0" : rain;
        rain_num = (rain_num === null || rain_num === "") ? "空" : rain_num;
        // console.log(station_num, clock, timeout, is_online, rain, rain_num);
        // console.log(rain_num, rain);

        let serve_1_act = deviceIdStatus.serve_1_act;
        let serve_2_act = deviceIdStatus.serve_2_act;
        serve_1_act = (serve_1_act === null) ? '0' : serve_1_act;
        serve_2_act = (serve_2_act === null) ? '0' : serve_2_act;

        // let serve_1_stat = deviceIdStatus.serve_1_stat;
        // let serve_2_stat = deviceIdStatus.serve_2_stat;
        let serve_1_timer = deviceIdStatus.serve_1_timer;
        let serve_2_timer = deviceIdStatus.serve_2_timer;
        // console.log(serve_1_act, serve_2_act, serve_1_timer, serve_2_timer);

        return (
            <Card
                title={`控制器ID：${deviceId}`}
                style={{
                    borderColor: is_online === '0' ? 'red' : '',
                    marginBottom: '10px'
                }}
                extra={<span><Icon type='setting'/> {is_online === '0' ? '掉线' : '在线'}</span>}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Card.Grid style={{width: '100%', textAlign: 'center'}}>
                            <Row gutter={24}>
                                <strong>定时闹钟(目前：<span
                                    style={{color: 'red'}}>{clock}</span>) &nbsp;&nbsp; (例如：0930)</strong>
                            </Row>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Input
                                        addonBefore='闹钟时间'
                                        placeholder="请输入闹钟时间"
                                        onChange={this.handleClockInput}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Radio.Group value={String(clockValue)}
                                                 onChange={this.handleClockControl}>
                                        <Radio.Button value='1'>打开</Radio.Button>
                                        <Radio.Button value='0'>关闭</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </Card.Grid>
                    </Col>
                    <Col span={12}>
                        <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                            <Row gutter={24}>
                                <strong>超时时间(单位：<span style={{color: 'red'}}>{`${timeout}`}</span> 分钟)</strong>
                            </Row>
                            <Row gutter={24}>
                                <Input.Search style={{width: '80%'}}
                                              placeholder='输入3位整数'
                                              enterButton="提交"
                                              onSearch={this.handleTimeOut}/>
                            </Row>
                        </Card.Grid>
                        <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                            <Row gutter={24}>
                                <strong>雨量设备ID：{rain_num}</strong>
                            </Row>
                            <Row gutter={24}>
                                <p style={{marginBottom: '11px'}}>降雨量：<span style={{color: 'red'}}>{rain}</span> mm</p>
                            </Row>
                        </Card.Grid>
                    </Col>
                </Row>
                <Row gutter={24}>
                    {greenHousePos0 ?
                        <Col span={12}>
                            <Card title={`卷膜机1 | ${greenHousePos0}`}>
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>卷膜机1控制</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Radio.Group value={String(motor_1_act)}
                                                     onChange={this.handleMotor1Control}>
                                            <Radio.Button value='0'>上升</Radio.Button>
                                            <Radio.Button value='2'>停止</Radio.Button>
                                            <Radio.Button value='1'>下降</Radio.Button>
                                        </Radio.Group>
                                    </Row>
                                </Card.Grid>
                                {/*<Card.Grid style={{width: '50%', textAlign: 'center'}}>*/}
                                {/*<Row gutter={24}>*/}
                                {/*<strong>行程时间(目前：<span style={{color: 'red'}}>{`${motor_1_range}`}</span> 秒)</strong>*/}
                                {/*</Row>*/}
                                {/*<Row gutter={24}>*/}
                                {/*<Input.Search style={{width: '80%'}}*/}
                                {/*placeholder='输入3位整数'*/}
                                {/*enterButton="提交"*/}
                                {/*onSearch={this.handleMotor1Range}/>*/}
                                {/*</Row>*/}
                                {/*</Card.Grid>*/}
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>过流保护(目前：<span
                                            style={{color: 'red'}}>{`${motor_1_over}`}</span> 安培)</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Input.Search style={{width: '80%'}}
                                                      placeholder='输入1位整数'
                                                      enterButton="提交"
                                                      onSearch={this.handleMotor1Over}/>
                                    </Row>
                                </Card.Grid>
                                <Card.Grid style={{width: '100%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <strong>首开时间(目前：<span style={{color: 'red'}}>{`${motor_1_first}`}</span> 秒)</strong>
                                        </Col>
                                        <Col span={10}>
                                            <strong>再开时间(目前：<span style={{color: 'red'}}>{`${motor_1_second}`}</span> 秒)</strong>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <Input value={motor1First} placeholder="输入3位整数"
                                                   onChange={this.handleMotor1First} addonBefore="首开"/>
                                        </Col>
                                        <Col span={10}>
                                            <Input value={motor1Second} placeholder="输入3位整数"
                                                   onChange={this.handleMotor1Second} addonBefore="再开"/>
                                        </Col>
                                        <Col span={4}>
                                            <Button onClick={this.handleMotor1OpenTime} type="primary">
                                                提交
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Grid>
                            </Card>
                        </Col>
                        : null
                    }
                    {greenHousePos1 ?
                        <Col span={12}>
                            <Card title={`卷膜机2 | ${greenHousePos1}`}>
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>卷膜机1控制</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Radio.Group value={String(motor_2_act)}
                                                     onChange={this.handleMotor2Control}>
                                            <Radio.Button value='0'>上升</Radio.Button>
                                            <Radio.Button value='2'>停止</Radio.Button>
                                            <Radio.Button value='1'>下降</Radio.Button>
                                        </Radio.Group>
                                    </Row>
                                </Card.Grid>
                                {/*<Card.Grid style={{width: '50%', textAlign: 'center'}}>*/}
                                {/*<Row gutter={24}>*/}
                                {/*<strong>行程时间(目前：<span style={{color: 'red'}}>{`${motor_2_range}`}</span> 秒)</strong>*/}
                                {/*</Row>*/}
                                {/*<Row gutter={24}>*/}
                                {/*<Input.Search style={{width: '80%'}}*/}
                                {/*placeholder='输入3位整数'*/}
                                {/*enterButton="提交"*/}
                                {/*onSearch={this.handleMotor2Range}/>*/}
                                {/*</Row>*/}
                                {/*</Card.Grid>*/}
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>过流保护(目前：<span
                                            style={{color: 'red'}}>{`${motor_2_over}`}</span> 安培)</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Input.Search style={{width: '80%'}}
                                                      placeholder='输入1位整数'
                                                      enterButton="提交"
                                                      onSearch={this.handleMotor2Over}/>
                                    </Row>
                                </Card.Grid>
                                <Card.Grid style={{width: '100%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <strong>首开时间(目前：<span style={{color: 'red'}}>{`${motor_2_first}`}</span> 秒)</strong>
                                        </Col>
                                        <Col span={10}>
                                            <strong>再开时间(目前：<span style={{color: 'red'}}>{`${motor_2_second}`}</span> 秒)</strong>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <Input value={motor2First} placeholder="输入3位整数"
                                                   onChange={this.handleMotor2First} addonBefore="首开"/>
                                        </Col>
                                        <Col span={10}>
                                            <Input value={motor2Second} placeholder="输入3位整数"
                                                   onChange={this.handleMotor2Second} addonBefore="再开"/>
                                        </Col>
                                        <Col span={4}>
                                            <Button onClick={this.handleMotor2OpenTime} type="primary">
                                                提交
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Grid>
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
                                <Card.Grid style={{width: '100%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <strong>温度(目前：<span style={{color: 'red'}}>{`${temp1}`}</span> ℃)</strong>
                                        </Col>
                                        <Col span={10}>
                                            <strong>湿度(目前：<span style={{color: 'red'}}>{`${humi1}`}</span> %)</strong>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <Input value={motor1Max} placeholder="0～60" onChange={this.handleMotor1Max}
                                                   addonBefore="上限"/>
                                        </Col>
                                        <Col span={10}>
                                            <Input value={motor1Min} placeholder="0～60" onChange={this.handleMotor1Min}
                                                   addonBefore="下限"/>
                                        </Col>
                                        <Col span={4}>
                                            <Button onClick={this.handleMotor1Temp} type="primary">
                                                提交
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Grid>
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
                                <Card.Grid style={{width: '100%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <strong>温度(目前：<span style={{color: 'red'}}>{`${temp2}`}</span> ℃)</strong>
                                        </Col>
                                        <Col span={10}>
                                            <strong>湿度(目前：<span style={{color: 'red'}}>{`${humi2}`}</span> %)</strong>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={10}>
                                            <Input value={motor2Max} placeholder="0～60" onChange={this.handleMotor2Max}
                                                   addonBefore="上限"/>
                                        </Col>
                                        <Col span={10}>
                                            <Input value={motor2Min} placeholder="0～60" onChange={this.handleMotor2Min}
                                                   addonBefore="下限"/>
                                        </Col>
                                        <Col span={4}>
                                            <Button onClick={this.handleMotor2Temp} type="primary">
                                                提交
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Grid>
                            </Card>
                        </Col>
                        : null
                    }
                </Row>
                <Row gutter={24}>
                    {greenHousePos2 ?
                        <Col span={12}>
                            <Card title={`阀门 | ${greenHousePos2}`}>
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row>
                                        <strong>阀门控制</strong>
                                    </Row>
                                    <Row>
                                        <Radio.Group value={serve_1_act} onChange={this.handleServer1Control}>
                                            <Radio.Button value='1'>打开</Radio.Button>
                                            <Radio.Button value='0'>关闭</Radio.Button>
                                        </Radio.Group>
                                    </Row>
                                </Card.Grid>
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>阀门时间(目前：<span
                                            style={{color: 'red'}}>{`${serve_1_timer}`}</span> 分钟)</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Input.Search style={{width: '80%'}}
                                                      placeholder='输入3位整数'
                                                      enterButton="提交"
                                                      onSearch={this.handleServer1Time}/>
                                    </Row>
                                </Card.Grid>
                            </Card>
                        </Col>
                        : null
                    }
                    {greenHousePos3 ?
                        <Col span={12}>
                            <Card
                                title={`风机 | ${greenHousePos3}`}
                            >
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>风机控制</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Radio.Group value={serve_2_act} onChange={this.handleServer2Control}>
                                            <Radio.Button value='1'>打开</Radio.Button>
                                            <Radio.Button value='0'>关闭</Radio.Button>
                                        </Radio.Group>
                                    </Row>
                                </Card.Grid>
                                <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                                    <Row gutter={24}>
                                        <strong>风机时间(目前：<span
                                            style={{color: 'red'}}>{`${serve_2_timer}`}</span> 分钟)</strong>
                                    </Row>
                                    <Row gutter={24}>
                                        <Input.Search style={{width: '80%'}}
                                                      placeholder='输入3位整数'
                                                      enterButton="提交"
                                                      onSearch={this.handleServer2Time}/>
                                    </Row>
                                </Card.Grid>
                            </Card>
                        </Col>
                        : null
                    }
                </Row>
            </Card>
        )
    }
}

export default Index;
