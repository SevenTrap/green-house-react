import React, {Component} from 'react';
import {List, Row, Col, Button, message, DatePicker, Drawer, From} from 'antd';

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
            data: [],
            list: []
        }
    }

    componentDidMount() {
        const {count} = this.state;
        const token = window.sessionStorage.getItem('token');
        const url = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, options)
            .then(response => response.json())
            .then(res => {
                this.setState({
                    initLoading: false,
                    data: res.results,
                    list: res.results
                })
            })
            .catch(() => {
                message.error('网络异常，请刷新页面')
            })
    }

    render() {
        return (
            <Row gutter={24}>
                <List
                    bordered={true}
                    itemLayout='vertical'
                    size='middle'
                    pagination={{
                        onChange: (page) => {
                            console.log(page)
                        },
                        pageSize: 5
                    }}
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item
                            key={item.key}
                            actions={[item.dateTime, item.key]}
                            extra={item.deviceId}
                        >
                            <List.Item.Meta
                                title={item.username}
                                description={item.content}
                            />
                            {item.content}
                        </List.Item>
                    )}
                />
            </Row>
        )
    }
}

export default Index;
