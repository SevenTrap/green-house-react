import React, {Component} from 'react';
import {Card, Input, message, Row} from 'antd';

class Index extends Component {
    handleMotorRange = (value) => {
        const valueReg = new RegExp(/^[0-9]{3}$/);
        if (!valueReg.test(value)) {
            message.error('请输入3位正整数');
            return false;
        }
        const {deviceIds} = this.props;
        const actionArray = deviceIds.map(item => {
            return {
                deviceId: item,
                commandtype: '09',
                action: `1 ${value}`
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
        return (
            <Card.Grid style={{width: '25%', textAlign: 'center'}}>
                <Row gutter={24}>
                    <strong>超时时间(单位：分钟)</strong>
                </Row>
                <Row gutter={24}>
                    <Input.Search style={{width: '80%'}}
                                  placeholder='输入3位整数'
                                  enterButton="提交"
                                  onSearch={this.handleMotorRange}/>
                </Row>
            </Card.Grid>
        )
    }
}

export default Index;
