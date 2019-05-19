import React, {Component} from 'react';
import {Row, Col, Button, message, AutoComplete, DatePicker, Input, Select, Spin} from 'antd';
import moment from 'moment';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const {RangePicker} = DatePicker;
const Option = Select.Option;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            param: 'airtemp',
            result: [],
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
            deviceId: value
        })
    };
    handleParamChange = (value) => {
        this.setState({
            param: value
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
        const urlData = `https://in.huayuaobo.com:16400/api/history`;
        const param = {
            deviceId: deviceId,
            startTime: `${startTime} 00:00:00`,
            endTime: `${endTime} 23:59:59`
        };
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
                if (result.length === 0) {
                    this.setState({
                        initLoading: false,
                        result: []
                    });
                } else {
                    this.setState({
                        initLoading: false,
                        result: result
                    });
                }
                this.draw();
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面2');
                this.setState({
                    initLoading: false,
                    result: []
                })
            })
    };

    draw = () => {

        const {result, param} = this.state;

        if (result.length === 0) {
            return false;
        }
        let time = [];
        let value1 = [];
        let value2 = [];
        const colors = ['#f5222d', '#1890ff'];

        if (param === 'airtemp') {
            for (let i = 0; i < result.length; i++) {
                let item1 = Number(result[i].temp1 / 10);
                let item2 = Number(result[i].temp2 / 10);
                let item3 = `${result[i].insert_time[0]}${result[i].insert_time[1]}${result[i].insert_time[2]}${result[i].insert_time[3]}-${result[i].insert_time[4]}${result[i].insert_time[5]}-${result[i].insert_time[6]}${result[i].insert_time[7]} ${result[i].insert_time[8]}${result[i].insert_time[9]}:${result[i].insert_time[10]}${result[i].insert_time[11]}:${result[i].insert_time[12]}${result[i].insert_time[13]}`;
                if ((-30 < item1 && item1 < 60) || (-30 < item2 && item2 < 60)) {
                    value1.push(item1);
                    value2.push(item2);
                    time.push(item3);
                }
            }

            const myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                title: {
                    text: '单位：摄氏度'
                },
                color: colors,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['空气温度1', '空气温度2']
                },
                xAxis: {
                    type: 'category',
                    data: time
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '空气温度',
                        min: -20,
                        max: 60,
                        axisLabel: {
                            formatter: '{value} ℃'
                        }
                    },
                ],
                series: [
                    {
                        name: '空气温度1',
                        type: 'line',
                        smooth: true,
                        data: value1
                    }, {
                        name: '空气温度2',
                        type: 'line',
                        smooth: true,
                        data: value2
                    }
                ]
            })

        }
        else if (param === 'airhumi') {
            for (let i = 0; i < result.length; i++) {
                let item1 = Number(result[i].hum1);
                let item2 = Number(result[i].hum2);
                let item3 = `${result[i].insert_time[0]}${result[i].insert_time[1]}${result[i].insert_time[2]}${result[i].insert_time[3]}-${result[i].insert_time[4]}${result[i].insert_time[5]}-${result[i].insert_time[6]}${result[i].insert_time[7]} ${result[i].insert_time[8]}${result[i].insert_time[9]}:${result[i].insert_time[10]}${result[i].insert_time[11]}:${result[i].insert_time[12]}${result[i].insert_time[13]}`;
                if ((0 < item1 && item1 < 100) || (0 < item2 && item2 < 100)) {
                    value1.push(item1);
                    value2.push(item2);
                    time.push(item3);
                }
            }

            const myChart = echarts.init(document.getElementById('main'));

            myChart.setOption({
                title: {
                    text: '单位：百分比'
                },
                color: colors,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['空气湿度1', '空气湿度2']
                },
                xAxis: {
                    type: 'category',
                    data: time
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '空气湿度',
                        min: 0,
                        max: 100,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name: '空气湿度1',
                        type: 'line',
                        smooth: true,
                        data: value1
                    }, {
                        name: '空气湿度2',
                        type: 'line',
                        smooth: true,
                        data: value2
                    }
                ]
            })
        } else if (param === 'fan') {
            for (let i = 0; i < result.length; i++) {
                let item1 = Number(result[i].motor_1_act);
                let item2 = Number(result[i].motor_2_act);
                let item3 = `${result[i].insert_time[0]}${result[i].insert_time[1]}${result[i].insert_time[2]}${result[i].insert_time[3]}-${result[i].insert_time[4]}${result[i].insert_time[5]}-${result[i].insert_time[6]}${result[i].insert_time[7]} ${result[i].insert_time[8]}${result[i].insert_time[9]}:${result[i].insert_time[10]}${result[i].insert_time[11]}:${result[i].insert_time[12]}${result[i].insert_time[13]}`;

                    value1.push(item1);
                    value2.push(item2);
                    time.push(item3);
            }

            const myChart = echarts.init(document.getElementById('main'));

            myChart.setOption({
                title: {
                    text: '上升:0   下降:1   停止:2'
                },
                color: colors,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['卷膜机1', '卷膜机2']
                },
                xAxis: {
                    type: 'category',
                    data: time
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '卷膜机',
                        min: 0,
                        max: 2,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '卷膜机1',
                        type: 'line',
                        smooth: false,
                        data: value1
                    }, {
                        name: '卷膜机2',
                        type: 'line',
                        smooth: false,
                        data: value2
                    }
                ]
            })
        } else if (param === 'valve') {
            for (let i = 0; i < result.length; i++) {
                let item1 = Number(result[i].serve_1_act);
                let item2 = Number(result[i].serve_2_act);
                let item3 = `${result[i].insert_time[0]}${result[i].insert_time[1]}${result[i].insert_time[2]}${result[i].insert_time[3]}-${result[i].insert_time[4]}${result[i].insert_time[5]}-${result[i].insert_time[6]}${result[i].insert_time[7]} ${result[i].insert_time[8]}${result[i].insert_time[9]}:${result[i].insert_time[10]}${result[i].insert_time[11]}:${result[i].insert_time[12]}${result[i].insert_time[13]}`;
                    value1.push(item1);
                    value2.push(item2);
                    time.push(item3);
            }
            const myChart = echarts.init(document.getElementById('main'));
            myChart.setOption({
                title: {
                    text: '关闭:0   打开:1'
                },
                color: colors,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['阀门', '风机']
                },
                xAxis: {
                    type: 'category',
                    data: time
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '阀门风机',
                        min: 0,
                        max: 1,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '阀门',
                        type: 'line',
                        smooth: false,
                        data: value1
                    }, {
                        name: '风机',
                        type: 'line',
                        smooth: false,
                        data: value2
                    }
                ]
            })
        } else {
            return false;
        }

    };

    componentDidMount() {

        const token = window.sessionStorage.getItem('token');
        const urlData = `https://in.huayuaobo.com:16400/api/device`;
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
        const {newDeviceIds, deviceId, result, initLoading} = this.state;
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
                            <Input style={{width: '30%', color: '#333'}} defaultValue="参数" disabled={true}/>
                            <Select style={{width: '60%', color: '#333'}} defaultValue="airtemp" onChange={this.handleParamChange}>
                                <Option value="airtemp">空气温度</Option>
                                <Option value="airhumi">空气湿度</Option>
                                <Option value="fan">卷膜机</Option>
                                <Option value="valve">阀门风机</Option>
                            </Select>
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
                        {result.length === 0
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
