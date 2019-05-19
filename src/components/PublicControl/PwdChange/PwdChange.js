import React, {Component} from 'react';
import {Input, Button, Icon, Row, Col, Card, Spin} from 'antd';
import {message} from "antd/lib/index";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            password1: '',
            password1Boole: false,
            password2: '',
            password2Boole: false,
            password3: '',
            password3Boole: false,
        }
    }

    handleInputChange = () => {
        const {password1, password2, password3, password1Boole, password2Boole, password3Boole} = this.state;
        if (password2 !== password3) {
            message.error('两次新密码必须相同');
            return false;
        }
        if (!password1Boole || !password2Boole || !password3Boole) {
            message.error('请输入正确的参数');
            return false;
        }
        const token = window.sessionStorage.getItem('token');
        const username = window.sessionStorage.getItem('Username');
        const url = 'https://in.huayuaobo.com:16400/api/user';
        let newItem = {
            username: username,
            password: password2,
            previousPassword: password1
        };

        const opts = {
            method: 'PATCH',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, opts)
            .then((response) => console.log(response.status))
            .then(() => {
                message.success('修改密码成功')
            })
            .catch(() => {
                message.error('修改密码失败')
            });
    };

    handleInput1Change = (e) => {
        const value = e.target.value;
        const valueReg = new RegExp(/^(\w){6,10}$/);
        let password1Boole = false;
        if (valueReg.test(value)) {
            password1Boole = true;
        }
        this.setState({
            password1: value,
            password1Boole: password1Boole
        })
    };
    handleInput2Change = (e) => {
        const value = e.target.value;
        const valueReg = new RegExp(/^(\w){6,10}$/);
        let password2Boole = false;
        if (valueReg.test(value)) {
            password2Boole = true;
        }
        this.setState({
            password2: value,
            password2Boole: password2Boole
        })
    };
    handleInput3Change = (e) => {
        const value = e.target.value;
        const valueReg = new RegExp(/^(\w){6,10}$/);
        let password3Boole = false;
        if (valueReg.test(value)) {
            password3Boole = true;
        }
        this.setState({
            password3: value,
            password3Boole: password3Boole
        })
    };

    render() {
        const {isLoading, password1, password2, password3, password1Boole, password2Boole, password3Boole} = this.state;
        const suffix1 = password1Boole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> :
            <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;
        const suffix2 = password2Boole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> :
            <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;
        const suffix3 = password3Boole ? <Icon type='check-circle' theme="twoTone" twoToneColor='#52c41a'/> :
            <Icon type="close-circle" theme="twoTone" twoToneColor='red'/>;

        return (
            <Spin spinning={isLoading}>
                <Row gutter={24} style={{marginTop: '30px'}}>
                    <Card
                        title='修改密码'
                        extra={<span><Icon type="warning" theme="twoTone" twoToneColor="red"/>注意：密码由6~10位的数字、字母、下划线组成</span>}
                    >
                        <Row gutter={24}>
                            <Col span={6} offset={9}>
                                <Input
                                    addonBefore='旧密码'
                                    placeholder="请输入旧密码"
                                    suffix={suffix1}
                                    value={password1}
                                    onChange={this.handleInput1Change}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6} offset={9}>
                                <Input
                                    addonBefore='新密码'
                                    placeholder="请输入新密码"
                                    suffix={suffix2}
                                    value={password2}
                                    onChange={this.handleInput2Change}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6} offset={9}>
                                <Input
                                    addonBefore='新密码'
                                    placeholder="请输入新密码"
                                    suffix={suffix3}
                                    value={password3}
                                    onChange={this.handleInput3Change}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6} offset={9}>
                                <Button type="primary" onClick={this.handleInputChange}>
                                    确认修改
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Spin>
        )
    }
}

export default Index;
