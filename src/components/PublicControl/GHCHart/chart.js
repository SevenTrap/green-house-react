import React, {Component} from 'react';
import {Row, Col, Button, message, AutoComplete, DatePicker, Input, Spin} from 'antd';
import moment from 'moment';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            humi1: [],
            humi2: [],
            temp1: [],
            temp2: [],
            time: [],
            initLoading: true,
            startTime: '',
            endTime: '',
            deviceId: '',
            deviceIds: [],
            newDeviceIds: []
        }
    }

    handleStartTime = (date, dateString) => {
        this.setState({
            startTime: dateString
        })
    };
    handleEndTime = (date, dateString) => {
        this.setState({
            endTime: dateString
        })
    };
    handleDeviceIdSearch = (value) => {
        const {deviceIds} = this.state;
        const newDeviceId = deviceIds.filter(item => (item.indexOf(value) > -1) ? item : null);
        this.setState({
            newDeviceIds: newDeviceId,
        })
    };
    handleDeviceIdChange = (value) => {
        this.setState({
            deviceId: value,
        })
    };

    getData = () => {
        const {deviceId, startTime, endTime} = this.state;
        const token = window.sessionStorage.getItem('token');
        const urlData = `http://47.92.206.44:80/api/history`;
        const param = {
            deviceId: deviceId,
            startTime: `${startTime} 00:00:00`,
            endTime: `${endTime} 23:59:59`
        };
        console.log(param);
        const options = {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        this.setState({
            initLoading: true
        });
        fetch(urlData, options)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.length === 0) {
                    this.setState({
                        initLoading: false
                    });
                    return false;
                }
                const hum1 = result.map(item => Number(item.hum1));
                const hum2 = result.map(item => Number(item.hum2));
                const temp1 = result.map(item => Number(item.temp1 / 10));
                const temp2 = result.map(item => Number(item.temp2 / 10));
                const time = result.map(item => `${item.insert_time[0]}${item.insert_time[1]}-${item.insert_time[2]}${item.insert_time[3]}-${item.insert_time[4]}${item.insert_time[5]} ${item.insert_time[6]}${item.insert_time[7]}:${item.insert_time[8]}${item.insert_time[9]}:${item.insert_time[10]}${item.insert_time[11]}`);
                console.log(hum1, hum2, temp1, temp2, time);
                this.setState({
                    humi1: hum1,
                    humi2: hum2,
                    temp1: temp1,
                    temp2: temp2,
                    time: time,
                    initLoading: false
                });
                this.draw();
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面2');
                this.setState({
                    initLoading: false
                })
            })
    };

    draw = () => {
        const {humi1, humi2, temp1, temp2, time} = this.state;
        const myChart = echarts.init(document.getElementById('main'));
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['空气湿度1', '空气湿度2', '空气温度1', '空气温度2']
            },
            xAxis: {
                type: 'category',
                data: time
            },
            yAxis: [
                {
                    type: 'value',
                    name: '空气湿度1',
                    min: 0,
                    max: 100,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: 'red'
                        }
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },{
                    type: 'value',
                    name: '空气湿度2',
                    min: 0,
                    max: 100,
                    offset: 80,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: 'red'
                        }
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },{
                    type: 'value',
                    name: '空气温度1',
                    min: -20,
                    max: 80,
                    offset: 80,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: 'blue'
                        }
                    },
                    axisLabel: {
                        formatter: '{value} ℃'
                    }
                },{
                    type: 'value',
                    name: '空气温度2',
                    min: -20,
                    max: 80,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: 'blue'
                        }
                    },
                    axisLabel: {
                        formatter: '{value} ℃'
                    }
                },
            ],
            series: [
                {
                    name: '空气湿度1',
                    type: 'line',
                    smooth: true,
                    data: humi1
                }, {
                    name: '空气湿度2',
                    type: 'line',
                    smooth: true,
                    data: humi2
                }, {
                    name: '空气温度1',
                    type: 'line',
                    smooth: true,
                    data: temp1
                }, {
                    name: '空气温度2',
                    type: 'line',
                    smooth: true,
                    data: temp2
                }
            ]
        })
    };

    componentDidMount() {
        let time = (new Date()).getTime();
        time = moment(time).format('YYYY-MM-DD');
        const token = window.sessionStorage.getItem('token');
        const urlData = `http://47.92.206.44:80/api/device`;
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
                if (result.length === 0) {
                    this.setState({
                        initLoading: false
                    });
                    return false;
                }
                const deviceIds = result.map(item => item.deviceId);
                this.setState({
                    deviceId: deviceIds[0],
                    deviceIds: deviceIds,
                    newDeviceIds: deviceIds,
                    startTime: time,
                    endTime: time
                });
                this.getData();
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面1');
                this.setState({
                    initLoading: false
                })
            })
    }

    render() {
        const {endTime, startTime, newDeviceIds, deviceId, time, initLoading} = this.state;
        return (
            <div>
                <Row gutter={24}>
                    <Col span={6}>
                        <Input.Group compact>
                            <Input style={{width: '30%', color: '#333'}} defaultValue="控制器ID" disabled={true}/>
                            <AutoComplete
                                dataSource={newDeviceIds}
                                onSearch={this.handleDeviceIdSearch}
                                onChange={this.handleDeviceIdChange}
                                value={deviceId}
                                placeholder='请选择控制器ID'
                            >
                                {deviceId}
                            </AutoComplete>
                        </Input.Group>
                    </Col>
                    <Col span={6}>
                        <Input.Group compact>
                            <Input style={{width: '30%', color: '#333'}} defaultValue="开始时间" disabled={true}/>
                            <DatePicker onChange={this.handleStartTime} value={moment(startTime, 'YYYY-MM-DD')}/>
                        </Input.Group>
                    </Col>
                    <Col span={6}>
                        <Input.Group compact>
                            <Input style={{width: '30%', color: '#333'}} defaultValue="结束时间" disabled={true}/>
                            <DatePicker onChange={this.handleEndTime} value={moment(endTime, 'YYYY-MM-DD')}/>
                        </Input.Group>
                    </Col>
                    <Col span={6}>
                        <Button onClick={this.getData} type='primary'>
                            查询
                        </Button>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Spin spinning={initLoading}>
                        {time.length === 0
                            ? (<p>暂无数据</p>)
                            : (<div id="main" style={{width: '100%', height: '500px', border: '1px solid #eee'}}></div>)
                        }
                    </Spin>
                </Row>
            </div>
        )
    }
}

export default Index;
