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

const {RangePicker} = DatePicker;

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
            startValue: null,
            endValue: null,
            deviceId: '',
            deviceIds: [],
            newDeviceIds: []
        }
    }

    onChange = (date, dateString) => {
        this.setState({
            startValue: dateString[0],
            endValue: dateString[1]
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
        const {deviceId, startValue, endValue} = this.state;
        let time = (new Date()).getTime();
        let startTime, endTime;
        if (startValue === null || endValue === null) {
            startTime = moment(time).format('YYYY-MM-DD');
            endTime = moment(time).format('YYYY-MM-DD');
        } else {
            startTime = startValue;
            endTime = endValue;
        }
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
                const time = result.map(item => `${item.insert_time[0]}${item.insert_time[1]}${item.insert_time[2]}${item.insert_time[3]}-${item.insert_time[4]}${item.insert_time[5]}-${item.insert_time[6]}${item.insert_time[7]} ${item.insert_time[8]}${item.insert_time[9]}:${item.insert_time[10]}${item.insert_time[11]}:${item.insert_time[12]}${item.insert_time[13]}`);
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
        const colors = ['#ffa39e', '#f5222d', '#91d5ff', '#1890ff'];
        myChart.setOption({
            color: colors,
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['空气温度1', '空气温度2', '空气湿度1', '空气湿度2']
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
                            color: colors[0]
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
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },{
                    type: 'value',
                    name: '空气温度1',
                    min: 0,
                    max: 100,
                    offset: 80,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[2]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} ℃'
                    }
                },{
                    type: 'value',
                    name: '空气温度2',
                    min: 0,
                    max: 100,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[3]
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
                    yAxisIndex: 1,
                    data: humi2
                }, {
                    name: '空气温度1',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 2,
                    data: temp1
                }, {
                    name: '空气温度2',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 3,
                    data: temp2
                }
            ]
        })
    };

    componentDidMount() {

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
                    newDeviceIds: deviceIds
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
        const {newDeviceIds, deviceId, time, initLoading} = this.state;
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
                        <RangePicker placeholder={['开始日期', '结束日期']} onChange={this.onChange}/>
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
