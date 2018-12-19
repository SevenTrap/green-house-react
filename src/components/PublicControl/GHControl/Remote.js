import React, {Component} from 'react';
import {Card, Radio, message, Row} from 'antd';

class Index extends Component {
    handleMotor1Control = (value) => {
        const {deviceIds} = this.props;
        const actionArray = deviceIds.map(item => {
            return {
                deviceId: item,
                commandtype: '07',
                action: `${value.target.value}`
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
                    <strong>控制模式</strong>
                </Row>
                <Row gutter={24}>
                    <Radio.Group onChange={this.handleMotor1Control}>
                        <Radio.Button value='1'>远程</Radio.Button>
                        <Radio.Button value='0'>本地</Radio.Button>
                    </Radio.Group>
                </Row>
            </Card.Grid>
        )
    }
}

export default Index;
