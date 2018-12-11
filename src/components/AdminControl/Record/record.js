import React, {Component} from 'react';
import {List, Row, Col, Button, message, AutoComplete, Drawer, Spin, Input, Icon, Form} from 'antd';

const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        key: i,
        dateTime: '2018-12-06',
        username: `admin`,
        deviceId: '99999999',
        content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

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
    handlePush = (event) => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const url = 'http://47.92.206.44:80/api/adminlog';
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
                    .then(res => {
                        console.log(res);
                        message.success('信息提交成功');
                        this.setState({
                            drawerVisible: false
                        })
                    })
                    .catch(() => {
                        message.error('提交失败，请重新提交');

                    })
            }

        })
    };

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        const urlData = `http://47.92.206.44:80/api/adminlog`;
        const urlDeviceId = `http://47.92.206.44:80/api/device`;
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
                console.log(result);
                result[0].map((item, index) => item.key = index);
                const deviceIds = result[1].map(item => item.deviceId);
                this.setState({
                    deviceIds: deviceIds,
                    newDeviceIds: deviceIds,
                    data: result[0],
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
    }

    render() {
        const {data, initLoading, drawerVisible, newDeviceIds} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Drawer
                    title='新增维修记录'
                    width={400}
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
                            onSearch={value => console.log(value)}
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
                            dataSource={data}
                            renderItem={item => (
                                <List.Item
                                    key={item.key}
                                    actions={[item.dateTime, item.key]}
                                    extra={`控制器ID：${item.targetid}`}
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
