import React, {Component} from 'react';
import {Form, Icon, Input, Button, message, Radio} from 'antd';
import {withRouter, Link} from 'react-router-dom';
import './index.less';
import TopLeft from './top-left.png';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class NormalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const opts = {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                };

                fetch('http://47.92.206.44:80/api/login', opts)
                    .then((response) => response.json())
                    .then((responseText) => {
                        if (responseText.role === 'User') {
                            window.sessionStorage.setItem('token', responseText.token);
                            window.sessionStorage.setItem('Username', values.Username);
                            window.sessionStorage.setItem('isLogin', true);
                            this.props.history.push('/public/GHControl');
                        } else {
                            message.error('用户名或密码错误')
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        message.error('用户名或密码错误')
                    });
            }
        });
        event.preventDefault()
    }

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
                                <RadioGroup defaultValue="public-user" buttonStyle="solid">
                                    <Link to='/public/Login'><Radio.Button value="public-user">普通用户</Radio.Button></Link>
                                    <Link to='/admin/Login'><Radio.Button value="admin-user">管理员</Radio.Button></Link>
                                </RadioGroup>
                            </div>
                            <FormItem>
                                {getFieldDecorator('Username', {
                                    rules: [{
                                        required: true,
                                        message: '请输入用户名!'
                                    }],
                                })(
                                    <Input prefix={<Icon type="user" style={{color: 'rgba(0, 0, 0, .25)'}}/>}
                                           placeholder="用户名"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('Password', {
                                    rules: [{
                                        required: true,
                                        message: '请输入密码!'
                                    }],

                                })(
                                    <Input prefix={<Icon type="lock" style={{color: 'rgba(0, 0, 0, .25)'}}/>}
                                           type="password"
                                           placeholder="密码"/>
                                )}
                            </FormItem>
                            <a className="login-form-forgot" href="/">忘记密码 ？</a>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 陆
                            </Button>
                        </Form>
                    </div>
                </div>
                <footer>
                    北京林业大学 &copy; 版权所有
                </footer>
            </div>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default withRouter(WrappedNormalLoginForm);
