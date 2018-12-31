import React, {Component} from 'react';
import {Card, Input, message, Row, Col, Icon, Button} from 'antd';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            motor1AllTime: '',
            motor1AllTimeBoole: false,
            motor2AllTime: '',
            motor2AllTimeBoole: false,
            motor3AllTime: '',
            motor3AllTimeBoole: false,
            motor4AllTime: '',
            motor4AllTimeBoole: false
        }
    }

    handleClick = () => {
        const {motor1AllTime, motor2AllTime, motor3AllTime, motor4AllTime, motor1AllTimeBoole, motor2AllTimeBoole, motor3AllTimeBoole, motor4AllTimeBoole} = this.state;
        const {deviceIds} = this.props;
        if (!motor1AllTimeBoole || !motor2AllTimeBoole || !motor3AllTimeBoole || !motor4AllTimeBoole) {
            message.error('请输入正确的参数');
            return false;
        }
        const actionArray = deviceIds.map(item => {
            return {
                deviceId: item,
                commandtype: '14',
                action: `${motor1AllTime} ${motor2AllTime} ${motor3AllTime} ${motor4AllTime}`
            }
        });
        console.log(actionArray);
        const token = window.sessionStorage.getItem('token');
        const urlAction = 'http://47.92.206.44:80/api/action';
        let options = {
            method: 'POST',
            body: JSON.stringify(actionArray),
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
            })
            .catch(() => {
                message.error('命令下发失败');
            })
    };

    handleInput1Change = (e) => {
        const value = e.target.value;
        const valueReg =  new RegExp(/^[0-9]{3}$/);
        let motor1AllTimeBoole = false;
        if (valueReg.test(value)) {
            motor1AllTimeBoole = true;
        }
        this.setState({
            motor1AllTime: value,
            motor1AllTimeBoole: motor1AllTimeBoole
        })
    };
    handleInput2Change = (e) => {
        const value = e.target.value;
        const valueReg =  new RegExp(/^[0-9]{3}$/);
        let motor2AllTimeBoole = false;
        if (valueReg.test(value)) {
            motor2AllTimeBoole = true;
        }
        this.setState({
            motor2AllTime: value,
            motor2AllTimeBoole: motor2AllTimeBoole
        })
    };
    handleInput3Change = (e) => {
        const value = e.target.value;
        const valueReg =  new RegExp(/^[0-9]{3}$/);
        let motor3AllTimeBoole = false;
        if (valueReg.test(value)) {
            motor3AllTimeBoole = true;
        }
        this.setState({
            motor3AllTime: value,
            motor3AllTimeBoole: motor3AllTimeBoole
        })
    };
    handleInput4Change = (e) => {
        const value = e.target.value;
        const valueReg =  new RegExp(/^[0-9]{3}$/);
        let motor4AllTimeBoole = false;
        if (valueReg.test(value)) {
            motor4AllTimeBoole = true;
        }
        this.setState({
            motor4AllTime: value,
            motor4AllTimeBoole: motor4AllTimeBoole
        })
    };

    render() {
        const {motor1AllTime, motor2AllTime, motor3AllTime, motor4AllTime, motor1AllTimeBoole, motor2AllTimeBoole, motor3AllTimeBoole, motor4AllTimeBoole} = this.state;
        const suffix1 = motor1AllTimeBoole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> : <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;
        const suffix2 = motor2AllTimeBoole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> : <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;
        const suffix3 = motor3AllTimeBoole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> : <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;
        const suffix4 = motor4AllTimeBoole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> : <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;
        return (
            <Card.Grid style={{width: '100%', textAlign: 'center'}}>
                <Row gutter={24}>
                    <Col span={12} style={{textAlign: 'left'}}>
                        <strong>电机首次和再次开启时间(单位：秒)</strong>
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Button
                            type='primary'
                            onClick={this.handleClick}
                        >
                            提交
                        </Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={6}>
                        <Input
                            addonBefore='卷膜机1首开'
                            placeholder="输入3位整数"
                            suffix={suffix1}
                            value={motor1AllTime}
                            onChange={this.handleInput1Change}
                        />
                    </Col>
                    <Col span={6}>
                        <Input
                            addonBefore='卷膜机1再开'
                            placeholder="输入3位整数"
                            suffix={suffix2}
                            value={motor2AllTime}
                            onChange={this.handleInput2Change}
                        />
                    </Col>
                    <Col span={6}>
                        <Input
                            addonBefore='卷膜机2首开'
                            placeholder="输入3位整数"
                            suffix={suffix3}
                            value={motor3AllTime}
                            onChange={this.handleInput3Change}
                        />
                    </Col>
                    <Col span={6}>
                        <Input
                            addonBefore='卷膜机2再开'
                            placeholder="输入3位整数"
                            suffix={suffix4}
                            value={motor4AllTime}
                            onChange={this.handleInput4Change}
                        />
                    </Col>
                </Row>
            </Card.Grid>
        )
    }
}

export default Index;
