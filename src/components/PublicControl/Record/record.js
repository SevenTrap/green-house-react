import React, {Component} from 'react';
import {List, Row, Col, Button, message, Drawer, Spin, Input, Icon, Form, Popconfirm} from 'antd';
import moment from 'moment';
import {sortBy} from 'lodash';

const SORTS = {
    "DATETIME": list => sortBy(list, 'dateTime').reverse(),
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: true,
            loading: false,
            drawerVisible: false,
            data: [],
            list: []
        }
    }

    handleAdd = () => {
        this.setState({
            drawerVisible: true
        })
    };
    onClose = () => {
        this.setState({
            drawerVisible: false
        })
    };
    handlePush = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const username = window.sessionStorage.getItem('Username');
                let newItem = {
                    targetId: username,
                    subject: values.subject,
                    description: values.description
                };
                const url = 'https://in.huayuaobo.com:16400/api/userlog';
                const token = window.sessionStorage.getItem('token');
                const opts = {
                    method: 'POST',
                    body: JSON.stringify(newItem),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + token
                    }
                };
                fetch(url, opts)
                    .then(response => response.status)
                    .then((res) => {
                        console.log(res);
                        message.success('信息提交成功');
                        this.setState({
                            drawerVisible: false
                        });
                        this.getData();
                    })
                    .catch(() => {
                        message.error('提交失败，请重新提交');
                    })
            }

        })
    };
    handleDelete = (key) => {
        const url = `https://in.huayuaobo.com:16400/api/userlog/${key}`;
        const token = window.sessionStorage.getItem('token');
        const opts = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, opts)
            .then(response => response.status)
            .then(() => {
                message.success('删除成功');
                this.getData();
            })
            .catch(() => {
                message.error('网络异常，请重新尝试')
            })
    };
    handleSearch = (value) => {
        const {data} = this.state;
        if (value === "") {
            this.setState({
                list: data
            });
            return false;
        }
        const newData = data.filter(item => (item.subject.indexOf(value) > -1) ? item : null);
        this.setState({
            list: newData
        })
    };

    getData = () => {
        const token = window.sessionStorage.getItem('token');
        const urlData = `https://in.huayuaobo.com:16400/api/userlog`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(urlData, options)
            .then(response => response.json())
            .then(result => {
                result.map((item, index) => item.key = index);
                this.setState({
                    data: result,
                    list: result,
                    initLoading: false
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    initLoading: false
                })
            })
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const {list, initLoading, drawerVisible} = this.state;
        console.log(list);
        const sortList = SORTS['DATETIME'](list);
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Drawer
                    title='操作记录'
                    width={600}
                    onClose={this.onClose}
                    visible={drawerVisible}
                    style={{
                        overflow: 'auto',
                        height: 'calc(100% - 108px)',
                        paddingBottom: '108px',
                    }}
                >
                    <Form layout='vertical' hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="主题">
                                    {getFieldDecorator('subject', {
                                        rules: [{required: true, message: '请输入主题'}],
                                    })(<Input placeholder="请输入主题"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="详情">
                                    {getFieldDecorator('description', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请描述操作详情',
                                            },
                                        ],
                                    })(<Input.TextArea rows={4} placeholder="请描述操作详情"/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={this.onClose} style={{marginRight: 8}}>
                            取消
                        </Button>
                        <Button onClick={this.handlePush} type="primary">
                            确认提交
                        </Button>
                    </div>
                </Drawer>
                <Row gutter={24}>
                    <Col span={6}>
                        <Input.Search
                            addonBefore='主题'
                            enterButton="搜索"
                            onSearch={this.handleSearch}
                        />
                    </Col>
                    <Col span={6} offset={12}>
                        <Button type="primary" onClick={this.handleAdd} style={{float: 'right'}}>
                            <Icon type='plus'/>
                            添加记录
                        </Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Spin spinning={initLoading}>
                        <List
                            bordered={true}
                            itemLayout='vertical'
                            size='middle'
                            pagination={{
                                onChange: (page) => {
                                    console.log(page)
                                },
                                pageSize: 10
                            }}
                            dataSource={sortList}
                            renderItem={item => (
                                <List.Item
                                    key={item.key}
                                    actions={[`记录时间：${moment(item.dateTime).format('YYYY-MM-DD HH:mm:ss')}`]}
                                    extra={
                                        <Popconfirm
                                            title="确认删除?"
                                            onConfirm={() => this.handleDelete(item.id)}
                                            okText='确定'
                                            cancelText='取消'
                                        >
                                            <Button type='danger'>删除</Button>
                                        </Popconfirm>
                                    }
                                >
                                    <List.Item.Meta
                                        title={item.subject}
                                        description={item.description}
                                    />
                                    {item.content}
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Row>
            </div>
        )
    }
}

const Record = Form.create()(Index);
export default Record;
