import React, {Component} from 'react';
import {Form, Icon, Input, Button, Radio, message, Tooltip} from 'antd';
import {withRouter, Link} from 'react-router-dom';
import TopLeft from '../../../top-left.png';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NormalLoginForm extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const url = 'https://in.huayuaobo.com:16400/api/login';
                const opts = {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                fetch(url, opts)
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json()
                        } else if (response.status === 401) {
                            return response.status
                        } else {
                            return Promise.reject('网络异常，等重新登录')
                        }
                    })
                    .then((responseText) => {
                        if (responseText.role === 'Administrator') {
                            window.sessionStorage.setItem('token', responseText.token);
                            window.sessionStorage.setItem('Username', values.Username);
                            window.sessionStorage.setItem('isLogin', true);
                            this.props.history.push('/admin/user');
                        } else {
                            message.error('用户名或密码错误');
                        }
                    })
                    .catch(() => {
                        message.error('网络异常，请重新登录')
                    });
            }
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login-page">
                <header>
                    北京华雨奥博农业科技有限公司
                </header>
                <div className="login-main">
                    <div className="login-container">
                        <div className="top-left">
                            <img alt="top-left" src={TopLeft}/>
                        </div>
                        <div className="login-logo">
                        </div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <div className="user-check">
                                <RadioGroup defaultValue="admin-user" buttonStyle="solid">
                                    <Link to='/public/Login'><Radio.Button value="public-user">普通用户</Radio.Button></Link>
                                    <Link to='/admin/Login'><Radio.Button value="admin-user">管理员</Radio.Button></Link>
                                </RadioGroup>
                            </div>
                            <FormItem>
                                {getFieldDecorator('Username', {
                                    rules: [{required: true, message: '请输入管理员账户'}]
                                })(
                                    <Input prefix={<Icon type="user" style={{color: 'rgba(0, 0, 0, .25)'}}/>} placeholder="管理员账户"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('Password', {
                                    rules: [{required: true, message: '请输入密码'}]
                                })(
                                    <Input prefix={<Icon type="lock" style={{color: 'rgba(0, 0, 0, .25)'}}/>} type="password" placeholder="管理员密码"/>
                                )}
                            </FormItem>
                            <Tooltip placement='bottom' title={`请拨打电话：13311398425`}><Button style={{marginBottom: '10px'}}>忘记密码？</Button></Tooltip>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 陆
                            </Button>
                        </Form>
                    </div>
                </div>
                <footer>
                    北京华雨奥博农业科技有限公司 &copy; 版权所有 | <a target={'_blank'} style={{color: '#333'}} href={'http://www.miibeian.gov.cn/'}>京ICP备18062887号-1</a>
                </footer>
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default withRouter(WrappedNormalLoginForm);
