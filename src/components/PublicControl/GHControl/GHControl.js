import React, {Component} from 'react';
import {Collapse, Spin, message, Row, Radio, Card, Input, Button} from 'antd';
import GHAction from './GHAction';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            greenHouse: [],
            deviceIds: [],
            panelKey: ''
        }
    }

    handleMotor1Control = () => {
        const {deviceIds} = this.state;
        let actionArray = [];
        let actionItem = {};
        for (let i = 0; i < deviceIds.length; i++) {
            actionItem.deviceId = deviceIds[i];
            actionItem.commandtype = '03';
            actionItem.action = ``
        }
        console.log(deviceIds);
        console.log('dianji1')
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const token = window.sessionStorage.getItem('token');
        const urlGreenHouse = 'http://47.92.206.44:80/api/greenhouse';
        const urlDevice = 'http://47.92.206.44:80/api/device';
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        const getDeviceId = new Promise((resolve, reject) => {
            fetch(urlDevice, opts)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(() => reject('获取控制器信息失败'))
        });
        const getGreenHouse = new Promise((resolve, reject) => {
            fetch(urlGreenHouse, opts)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(() => reject('获取控制器信息失败'))
        });
        Promise.all([getDeviceId, getGreenHouse])
            .then(result => {
                const deviceIds = result[0].map(item => item.deviceId);
                this.setState({
                    isLoading: false,
                    greenHouse: result[1],
                    deviceIds: deviceIds
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    isLoading: false
                })
            })
    }

    render() {
        const {greenHouse} = this.state;
        if (greenHouse.length === 0) {
            return '此用户暂无任何大棚信息';
        }
        return (
            <Spin spinning={this.state.isLoading}>
                <Row gutter={24}>
                    <Card title='园区一键控制'>
                        <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                            <span style={{marginRight: 16, fontWeight: 500}}>卷膜机1:</span>
                            <Radio.Group onChange={this.handleMotor1Control}>
                                <Radio.Button value='0'>上升</Radio.Button>
                                <Radio.Button value='2'>停止</Radio.Button>
                                <Radio.Button value='1'>下降</Radio.Button>
                            </Radio.Group>
                        </Card.Grid>
                        <Card.Grid style={{width: '50%', textAlign: 'center'}}>
                            <span style={{marginRight: 16, fontWeight: 500}}>卷膜机2:</span>
                            <Radio.Group onChange={this.handleMotor1Control}>
                                <Radio.Button value='0'>上升</Radio.Button>
                                <Radio.Button value='2'>停止</Radio.Button>
                                <Radio.Button value='1'>下降</Radio.Button>
                            </Radio.Group>
                        </Card.Grid>
                        <Card.Grid style={{width: '25%', textAlign: 'center'}}>
                            <p style={{marginBottom: 10, fontWeight: 500}}>行程时间(单位：秒)</p>
                            <Input.Search style={{width: '80%'}}
                                          placeholder='请输入正整数'
                                          enterButton="提交"
                                          onSearch={this.handleMotorRange}/>
                        </Card.Grid>
                        <Card.Grid style={{width: '25%', textAlign: 'center'}}>
                            <p style={{marginBottom: 10, fontWeight: 500}}>超时时间(单位：分钟)</p>
                            <Input.Search style={{width: '80%'}}
                                          placeholder='请输入正整数'
                                          enterButton="提交"
                                          onSearch={this.handleMotorRange}/>
                        </Card.Grid>
                        <Card.Grid style={{width: '25%', textAlign: 'center'}}>
                            <p style={{marginBottom: 10, fontWeight: 500}}>阀门时间(单位：分钟)</p>
                            <Input.Search style={{width: '80%'}}
                                          placeholder='请输入正整数'
                                          enterButton="提交"
                                          onSearch={this.handleMotorRange}/>
                        </Card.Grid>
                        <Card.Grid style={{width: '25%', textAlign: 'center'}}>
                            <p style={{marginBottom: 10, fontWeight: 500}}>风机时间(单位：分钟)</p>
                            <Input.Search style={{width: '80%'}}
                                          placeholder='请输入正整数'
                                          enterButton="提交"
                                          onSearch={this.handleMotorRange}/>
                        </Card.Grid>
                        <Card.Grid style={{width: '25%', textAlign: 'center'}}>
                            <p style={{marginBottom: 10, fontWeight: 500}}>定时闹钟(例如：0900)</p>
                            <Input.Search style={{width: '80%'}}
                                          placeholder='请输入行程时间'
                                          enterButton="提交"
                                          onSearch={this.handleMotorRange}/>
                        </Card.Grid>
                        <Card.Grid style={{width: '75%', textAlign: 'center'}}>
                            <p style={{marginBottom: 10, fontWeight: 500}}>温度阈值设置</p>
                            <Input addonBefore='温度上限' style={{width: '25%', display: 'inline-block'}}
                                   placeholder="0～60"/>
                            <span style={{width: '10%', display: 'inline-block'}}>&nbsp;</span>
                            <Input addonBefore='温度下限' style={{width: '25%', display: 'inline-block'}}
                                   placeholder="0～60"/>
                            <span style={{width: '10%', display: 'inline-block'}}>&nbsp;</span>
                            <Button type='primary'>
                                提交
                            </Button>
                        </Card.Grid>
                    </Card>
                </Row>
                <Row gutter={24}>
                    <Card title='单个大棚控制'>
                        <Collapse accordion>
                            {greenHouse.map(item => {
                                return (
                                    <Collapse.Panel key={item.greenHouseId}
                                                    header={`大棚基本信息：${item.name} | ${item.location} | ${item.description}`}>
                                        <GHAction greenHouseId={item.greenHouseId}/>
                                    </Collapse.Panel>
                                )
                            })}
                        </Collapse>
                    </Card>
                </Row>

            </Spin>
        )
    }
}
export default Index;
