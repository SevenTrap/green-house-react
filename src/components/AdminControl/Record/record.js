import React, {Component} from 'react';
import {List, Row, Col, Button, message, AutoComplete, Drawer, Spin, Input, Icon, Form, Popconfirm} from 'antd';
import moment from 'moment';
import {sortBy} from 'lodash';
const SORTS = {
    "DATETIME": list => sortBy(list, 'dateTime').reverse(),
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 3,
            initLoading: true,
            loading: false,
            drawerVisible: false,
            deviceIds: [],
            newDeviceIds: [],
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
    handleDeviceIdSearch = (value) => {
        const {deviceIds} = this.state;
        const newDeviceId = deviceIds.filter(item => (item.indexOf(value) > -1) ? item : null);
        this.setState({
            newDeviceIds: newDeviceId
        })
    };
    handlePush = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const url = 'https://in.huayuaobo.com:16400/api/adminlog';
                const token = window.sessionStorage.getItem('token');
                const opts = {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + token
                    }
                };
                fetch(url, opts)
                    .then(response => response.status)
                    .then(() => {
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
        const url = `https://in.huayuaobo.com:16400/api/adminlog/${key}`;
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
        const newData = data.filter(item => (item.targetid.indexOf(value) > -1) ? item : null);
        this.setState({
            list: newData
        })
    };

    getData = () => {
        const token = window.sessionStorage.getItem('token');
        const urlData = `https://in.huayuaobo.com:16400/api/adminlog`;
        const urlDeviceId = `https://in.huayuaobo.com:16400/api/device`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        const getData = new Promise((resolve, reject) => {
            fetch(urlData, options)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(error => reject(error))
        });
        const getDeviceId = new Promise((resolve, reject) => {
            fetch(urlDeviceId, options)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(error => reject(error))
        });
        Promise.all([getData, getDeviceId])
            .then(result => {
                result[0].map((item, index) => item.key = index);
                const deviceIds = result[1].map(item => item.deviceId);
                this.setState({
                    deviceIds: deviceIds,
                    newDeviceIds: deviceIds,
                    data: result[0],
                    list: result[0],
                    count: result[0].length,
                    initLoading: false
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    initLoading: false
                })
            });
    };

    componentDidMount() {
        this.getData();
    }

    render() {
        const {list, initLoading, drawerVisible, newDeviceIds} = this.state;
        const sortList = SORTS['DATETIME'](list);
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Drawer
                    title='新增维修记录'
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
                                <Form.Item label="标题">
                                    {getFieldDecorator('subject', {
                                        rules: [{ required: true, message: '请输入标题' }],
                                    })(<Input placeholder="请输入标题" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="控制器ID">
                                    {getFieldDecorator('targetid', {
                                        rules: [{ required: true, message: '请选择控制器ID' }],
                                    })(<AutoComplete
                                        dataSource={newDeviceIds}
                                        style={{width: '100%'}}
                                        onSearch={this.handleDeviceIdSearch}
                                        placeholder='请选择控制器ID'
                                    />)}
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
                                                message: '请描述维修详情',
                                            },
                                        ],
                                    })(<Input.TextArea rows={4} placeholder="请描述维修详情" />)}
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
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
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
                            addonBefore='控制器ID'
                            enterButton="搜索"
                            onSearch={this.handleSearch}
                        />
                    </Col>
                    <Col span={6} offset={12}>
                        <Button onClick={this.handleAdd} style={{float: 'right'}}>
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
                                    actions={[moment(item.dateTime).format('YYYY-MM-DD HH:mm:ss'), `控制器ID：${item.targetid}`]}
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
