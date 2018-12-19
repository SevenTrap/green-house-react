import React, {Component} from 'react';
import {Card, Input, message, Row, Col, Button, Icon} from 'antd';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clockTime: '',
            clockBoole: false
        }
    }

    handleInputChange = (e) => {
        const value = e.target.value;
        const valueReg = new RegExp(/^(20|21|22|23|[0-1]\d)[0-5]\d$/);
        let clockBoole = false;
        if (valueReg.test(value)) {
            clockBoole = true;
        }
        this.setState({
            clockTime: value,
            clockBoole: clockBoole
        })
    };

    handleOpen = () => {
        const {clockTime, clockBoole} = this.state;
        const {deviceIds} = this.props;
        if (!clockBoole) {
            message.error('请输入正确的参数');
            return false;
        }
        const actionArray = deviceIds.map(item => {
            return {
                deviceId: item,
                commandtype: '10',
                action: `1 ${clockTime} 1`
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

    handleClose = () => {
        const {deviceIds} = this.props;
        const actionArray = deviceIds.map(item => {
            return {
                deviceId: item,
                commandtype: '10',
                action: `1 0000 0`
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

    render() {
        const {clockTime, clockBoole} = this.state;
        const suffix1 = clockBoole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> : <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;

        return (
            <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                <Row gutter={24}>
                    <strong>定时闹钟(例如：0900)</strong>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Input
                            addonBefore='闹钟时间'
                            placeholder="请输入闹钟时间"
                            suffix={suffix1}
                            value={clockTime}
                            onChange={this.handleInputChange}
                        />
                    </Col>
                    <Col span={12}>
                        <Button.Group>
                            <Button onClick={this.handleOpen}>
                                打开
                            </Button>
                            <Button onClick={this.handleClose}>
                                关闭
                            </Button>
                        </Button.Group>
                    </Col>
                </Row>
            </Card.Grid>
        )
    }
}

export default Index;
