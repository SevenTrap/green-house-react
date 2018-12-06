import React, {Component} from 'react';
import {Input, Button, Form, Icon} from 'antd';
import {message} from "antd/lib/index";

const FormItem = Form.Item;

class Index extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.newPassword !== values.password) {
                    message.error('两次密码必须相同');
                    return false;
                }
                delete values.newPassword;
                const token = window.sessionStorage.getItem('token');
                const url = 'http://47.92.206.44:80/api/user';
                const opts = {
                    method: 'PATCH',
                    body: JSON.stringify(values),
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
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} className='login-form-password'>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('previousPassword', {
                        rules: [{ required: true, message: '请输入旧密码' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="旧密码" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('newPassword', {
                        rules: [{ required: true, message: '请输入新密码' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="新密码" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请确认新密码' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认新密码" />
                    )}
                </FormItem>

                <Button type="primary" htmlType="submit" className="login-form-button">
                    确认修改
                </Button>
            </Form>
        )
    }
}

const WrappedNormalLoginForm = Form.create()(Index);

export default WrappedNormalLoginForm;