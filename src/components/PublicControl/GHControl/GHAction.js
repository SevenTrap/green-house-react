import React, {Component} from 'react';

import {Spin, message, Card, Icon, Row, Col, Switch, Radio, Slider, Button, Badge, Modal, Tag, Input} from 'antd';
import './index.css';

let tempMarks = {
    0: {
        label: <strong>0</strong>
    },
    60: {
        style: {
            color: '#f50'
        },
        label: <strong>60℃</strong>
    }
};
let humiMarks = {
    0: {
        style: {
            color: 'green'
        },
        label: <strong>0</strong>
    },
    100: {
        style: {
            color: '#f50'
        },
        label: <strong>100%</strong>
    }
};

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorInfo: '',
            isLoading: false,
            greenHouseId: this.props.greenHouseId,
            greenHouseMaps: [],
            deviceId: [],
            isAction: [],
            tempModalDeviceId: '',
            tempModalNum: '',
            deviceStatus: {}
        }
    }

    handleMotorControl = (deviceIdItem, num, event) => {
        const {isAction, deviceStatus} = this.state;
        this.setState({
            isAction: {
                ...isAction,
                controlStatus: true
            }
        });
        //TODO
        //每次执行操作之前，先获取当前deviceId最新状态，然后再执行操作
        let value = event.target.value;
        let deviceId = [];
        deviceId.push(deviceIdItem);
        const token = window.sessionStorage.getItem('token');
        let urlDeviceStatus = 'http://47.92.206.44:80/api/devicestatus/';

        const optionDeviceId = {
            method: 'POST',
            body: JSON.stringify(deviceId),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(urlDeviceStatus, optionDeviceId)
            .then((response) => response.json())
            .then(res => {
                let deviceStatusItem = res[0];
                let motor_1_act = deviceStatusItem.motor_1_act;
                let motor_2_act = deviceStatusItem.motor_2_act;
                let serve_1_act = deviceStatusItem.serve_1_act;
                let serve_2_act = deviceStatusItem.serve_2_act;
                if (num === 0) {
                    if (value === "2" || motor_2_act === "2") {
                        let newAction = {};
                        let newItem = [];
                        newAction.deviceId = deviceIdItem;
                        newAction.commandtype = '03';
                        newAction.action = `${value} ${motor_2_act} ${serve_1_act} ${serve_2_act}`;
                        newItem.push(newAction);
                        console.log(newItem);
                        let urlDeviceAction = 'http://47.92.206.44:80/api/action/';
                        let options = {
                            method: 'POST',
                            body: JSON.stringify(newItem),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer ' + token
                            }
                        };
                        fetch(urlDeviceAction, options)
                            .then(response2 => console.log(response2.status))
                            .then(res2 => {
                                deviceStatusItem.motor_1_act = value;
                                this.setState({
                                    deviceStatus: {
                                        ...deviceStatus,
                                        [deviceIdItem]: deviceStatusItem
                                    },
                                    isAction: {
                                        ...isAction,
                                        controlStatus: false
                                    }
                                });
                            })
                            .catch(error => {
                                this.setState({
                                    isAction: {
                                        ...isAction,
                                        controlStatus: false
                                    }
                                });
                            })

                    }
                    else {
                        this.setState({
                            isAction: {
                                ...isAction,
                                controlStatus: false
                            }
                        });
                        message.error('两个卷膜机不能同时工作')
                    }
                }
                else {
                    if (value === "2" || motor_1_act === "2") {
                        let newAction = {};
                        let newItem = [];
                        newAction.deviceId = deviceIdItem;
                        newAction.commandtype = '03';
                        newAction.action = `${motor_1_act} ${value} ${serve_1_act} ${serve_2_act}`;
                        newItem.push(newAction);
                        console.log(newItem);
                        let urlDeviceAction = 'http://47.92.206.44:80/api/action/';
                        let options = {
                            method: 'POST',
                            body: JSON.stringify(newItem),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer ' + token
                            }
                        };
                        fetch(urlDeviceAction, options)
                            .then(response => console.log(response.status))
                            .then(res => {
                                deviceStatusItem.motor_2_act = value;
                                this.setState({
                                    deviceStatus: {
                                        ...deviceStatus,
                                        [deviceIdItem]: deviceStatusItem
                                    },
                                    isAction: {
                                        ...isAction,
                                        controlStatus: false
                                    }
                                });
                            })
                            .catch(error => {
                                this.setState({
                                    isAction: {
                                        ...isAction,
                                        controlStatus: false
                                    }
                                });
                            })
                    }
                    else {
                        this.setState({
                            isAction: {
                                ...isAction,
                                controlStatus: false
                            }
                        });
                        message.error('两个卷膜机不能同时工作')
                    }
                }

            })
            .catch(error => {
                message.error('网络错误，请刷新网页');
                this.setState({
                    isAction: {
                        ...isAction,
                        controlStatus: false
                    }
                });
            });
    };

    handleServerControl = (deviceIdItem, num, action) => {
        //TODO
        //每次执行操作之前，先获取当前deviceId最新状态，然后再执行操作
        console.log(num);
        console.log(deviceIdItem);
        console.log(action);

        let value = action ? '1' : '0';


        const {isAction, deviceStatus} = this.state;
        this.setState({
            isAction: {
                ...isAction,
                controlStatus: true
            }
        });
        //TODO
        //每次执行操作之前，先获取当前deviceId最新状态，然后再执行操作
        let deviceId = [];
        deviceId.push(deviceIdItem);
        const token = window.sessionStorage.getItem('token');
        let urlDeviceStatus = 'http://47.92.206.44:80/api/devicestatus/';

        const optionDeviceId = {
            method: 'POST',
            body: JSON.stringify(deviceId),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(urlDeviceStatus, optionDeviceId)
            .then((response) => response.json())
            .then(res => {
                let deviceStatusItem = res[0];
                let motor_1_act = deviceStatusItem.motor_1_act;
                let motor_2_act = deviceStatusItem.motor_2_act;
                let serve_1_act = deviceStatusItem.serve_1_act;
                let serve_2_act = deviceStatusItem.serve_2_act;
                if (num === 2) {
                    let newAction = {};
                    let newItem = [];
                    newAction.deviceId = deviceIdItem;
                    newAction.commandtype = '03';
                    newAction.action = `${motor_1_act} ${motor_2_act} ${value} ${serve_2_act}`;

                    newItem.push(newAction);
                    console.log(newItem);
                    let urlDeviceAction = 'http://47.92.206.44:80/api/action/';
                    let options = {
                        method: 'POST',
                        body: JSON.stringify(newItem),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + token
                        }
                    };
                    fetch(urlDeviceAction, options)
                        .then(response2 => console.log(response2.status))
                        .then(res2 => {
                            deviceStatusItem.serve_1_act = value;
                            console.log(deviceStatusItem);
                            this.setState({
                                deviceStatus: {
                                    ...deviceStatus,
                                    [deviceIdItem]: deviceStatusItem
                                },
                                isAction: {
                                    ...isAction,
                                    controlStatus: false
                                }
                            });
                        })
                        .catch(error => {
                            this.setState({
                                isAction: {
                                    ...isAction,
                                    controlStatus: false
                                }
                            });
                        })

                }
                else {

                        let newAction = {};
                        let newItem = [];
                        newAction.deviceId = deviceIdItem;
                        newAction.commandtype = '03';
                        newAction.action = `${motor_1_act} ${motor_2_act} ${serve_1_act} ${value}`;
                        newItem.push(newAction);
                    console.log(newItem);
                        let urlDeviceAction = 'http://47.92.206.44:80/api/action/';
                        let options = {
                            method: 'POST',
                            body: JSON.stringify(newItem),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'authorization': 'Bearer ' + token
                            }
                        };
                        fetch(urlDeviceAction, options)
                            .then(response => console.log(response.status))
                            .then(res => {
                                deviceStatusItem.serve_2_act = value;
                                console.log(deviceStatusItem);
                                this.setState({
                                    deviceStatus: {
                                        ...deviceStatus,
                                        [deviceIdItem]: deviceStatusItem
                                    },
                                    isAction: {
                                        ...isAction,
                                        controlStatus: false
                                    }
                                });
                            })
                            .catch(error => {
                                this.setState({
                                    isAction: {
                                        ...isAction,
                                        controlStatus: false
                                    }
                                });
                            })
                }

            })
            .catch(error => {
                message.error('网络错误，请刷新网页');
                this.setState({
                    isAction: {
                        ...isAction,
                        controlStatus: false
                    }
                });
            });
    };

    handleChangeTempModal = (deviceIdItem, num, event) => {
        const {isAction} = this.state;
        this.setState({
            tempModalDeviceId: deviceIdItem,
            tempModalNum: num,
            isAction: {
                ...isAction,
                tempModal: true
            }
        })
    };

    handleChangeTempModalOk = (tempMax, tempMin) => {
        const {isAction, deviceStatus, tempModalNum, tempModalDeviceId} = this.state;
        console.log(tempMax, tempMin, tempModalDeviceId, tempModalNum);

        if (tempMin >= tempMax) {
            message.error('温度下限应当小于温度上限');
            return false;
        }
        tempMax = tempMax * 10;
        tempMin = tempMin * 10;

        this.setState({
            isAction: {
                ...isAction,
                tempModal: true
            }
        });
        //TODO
        //每次执行操作之前，先获取当前deviceId最新状态，然后再执行操作
        let deviceId = [];
        deviceId.push(tempModalDeviceId);
        const token = window.sessionStorage.getItem('token');
        let urlDeviceStatus = 'http://47.92.206.44:80/api/devicestatus/';

        const optionDeviceId = {
            method: 'POST',
            body: JSON.stringify(deviceId),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(urlDeviceStatus, optionDeviceId)
            .then((response) => response.json())
            .then(res => {
                let deviceStatusItem = res[0];
                let motor_1_max = deviceStatusItem.motor_1_max;
                let motor_1_min = deviceStatusItem.motor_1_min;
                let motor_2_max = deviceStatusItem.motor_2_max;
                let motor_2_min = deviceStatusItem.motor_2_min;
                if (tempModalNum === 4) {
                    let newAction = {};
                    let newItem = [];
                    newAction.deviceId = tempModalDeviceId;
                    newAction.commandtype = '08';
                    newAction.action = `1 ${tempMax} ${tempMin} ${motor_2_max} ${motor_2_min}`;

                    newItem.push(newAction);
                    console.log(newItem);
                    let urlDeviceAction = 'http://47.92.206.44:80/api/action/';
                    let options = {
                        method: 'POST',
                        body: JSON.stringify(newItem),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + token
                        }
                    };
                    fetch(urlDeviceAction, options)
                        .then(response2 => console.log(response2.status))
                        .then(res2 => {
                            deviceStatusItem.motor_1_max = tempMax;
                            deviceStatusItem.motor_1_min = tempMin;
                            console.log(deviceStatusItem);
                            this.setState({
                                deviceStatus: {
                                    ...deviceStatus,
                                    [tempModalDeviceId]: deviceStatusItem
                                },
                                isAction: {
                                    ...isAction,
                                    tempModal: false
                                }
                            });
                        })
                        .catch(error => {
                            this.setState({
                                isAction: {
                                    ...isAction,
                                    tempModal: false
                                }
                            });
                        })

                }
                else {

                    let newAction = {};
                    let newItem = [];
                    newAction.deviceId = tempModalDeviceId;
                    newAction.commandtype = '08';
                    newAction.action = `1 ${motor_1_max} ${motor_1_min} ${tempMax} ${tempMin}`;
                    newItem.push(newAction);
                    console.log(newItem);
                    let urlDeviceAction = 'http://47.92.206.44:80/api/action/';
                    let options = {
                        method: 'POST',
                        body: JSON.stringify(newItem),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': 'Bearer ' + token
                        }
                    };
                    fetch(urlDeviceAction, options)
                        .then(response => console.log(response.status))
                        .then(res => {
                            deviceStatusItem.motor_2_max = tempMax;
                            deviceStatusItem.motor_2_min = tempMin;
                            console.log(deviceStatusItem);
                            this.setState({
                                deviceStatus: {
                                    ...deviceStatus,
                                    [tempModalDeviceId]: deviceStatusItem
                                },
                                isAction: {
                                    ...isAction,
                                    tempModal: false
                                }
                            });
                        })
                        .catch(error => {
                            this.setState({
                                isAction: {
                                    ...isAction,
                                    tempModal: false
                                }
                            });
                        })
                }

            })
            .catch(error => {
                message.error('网络错误，请刷新网页');
                this.setState({
                    isAction: {
                        ...isAction,
                        controlStatus: false
                    }
                });
            });

        //TODO
        //每次执行操作之前，先获取当前deviceId最新状态，然后再执行操作
        //也可以不执行获取数据操作，因为此状态不可变
        this.setState({
            isAction: {
                ...isAction,
                tempModal: false
            }
        })
    };

    handleChangeTempModalCancel = () => {
        const {isAction} = this.state;
        this.setState({
            isAction: {
                ...isAction,
                tempModal: false
            }
        })
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const that = this;
        const {greenHouseId} = this.state;
        const token = window.sessionStorage.getItem('token');

        const urlGreenHouseMap = 'http://47.92.206.44:80/api/greenhousemap/' + greenHouseId;
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        const getGreenHouseMap = new Promise((resolve, reject) => {
            fetch(urlGreenHouseMap, opts)
                .then(response => {
                    console.log(response.status);
                    return response.json();
                })
                .then(res => resolve(res))
                .catch(error => reject('获取绑定信息失败'))
        });

        getGreenHouseMap.then(res => {
            if (res.length !== 0) {
                //获取当前大棚下所有deviceId并去重复
                let isAction = {};
                let deviceId = [];
                for (let i = 0; i < res.length; i++) {
                    deviceId.push(res[i].deviceId);
                }
                isAction['controlStatus'] = false;
                isAction['tempModal'] = false;
                deviceId = Array.from(new Set(deviceId));
                const urlDeviceStatus = 'http://47.92.206.44:80/api/devicestatus/';
                const optionDeviceId = {
                    method: 'POST',
                    body: JSON.stringify(deviceId),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': 'Bearer ' + token
                    }
                };

                fetch(urlDeviceStatus, optionDeviceId)
                    .then((response) => {
                        console.log(response.status);
                        return response.json();
                    })
                    .then(resStatus => {
                        let deviceIdStatus = {};
                        for (let i = 0; i < deviceId.length; i++) {
                            deviceIdStatus[deviceId[i]] = resStatus[i];
                        }
                        console.log(res);
                        console.log(deviceId);
                        console.log(deviceIdStatus);

                        that.setState({
                            greenHouseMaps: res,
                            deviceId: deviceId,
                            deviceStatus: deviceIdStatus,
                            isLoading: false,
                            isAction: isAction,
                            errorInfo: ''
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        message.error('网络异常')
                    });

            } else {
                this.setState({
                    isLoading: false,
                    errorInfo: '此大棚暂无绑定控制器'
                })
            }
        }).catch(error => {
            console.log(error);
            message.error(error);
            this.setState({
                isLoading: false,
                errorInfo: error
            })
        })
    }

    render() {
        const {errorInfo, isLoading, greenHouseMaps, deviceId, deviceStatus, isAction} = this.state;

        if (errorInfo) {
            return errorInfo;
        }

        if (isLoading) {
            return <Spin spinning={true}>加载中...</Spin>
        }

        return (
            <Spin spinning={isLoading}>

                {deviceId.map((deviceIdItem, deviceIdIndex) => {
                    const deviceIdPos = greenHouseMaps.filter(item => item.deviceId === deviceIdItem);
                    let pos0 = deviceIdPos.filter(item => item.devicePos === "0");
                    let pos1 = deviceIdPos.filter(item => item.devicePos === "1");
                    let pos2 = deviceIdPos.filter(item => item.devicePos === "2");
                    let pos3 = deviceIdPos.filter(item => item.devicePos === "3");
                    let greenHousePos0 = pos0.map(item => item.greenHousePos);
                    let greenHousePos1 = pos1.map(item => item.greenHousePos);
                    let greenHousePos2 = pos2.map(item => item.greenHousePos);
                    let greenHousePos3 = pos3.map(item => item.greenHousePos);

                    let temp1 = (deviceStatus[`${deviceIdItem}`].temp1) / 10;
                    let temp2 = (deviceStatus[`${deviceIdItem}`].temp2) / 10;
                    let humi1 = (deviceStatus[`${deviceIdItem}`].hum1) / 10;
                    let humi2 = (deviceStatus[`${deviceIdItem}`].hum2) / 10;
                    let motor_1_act = deviceStatus[`${deviceIdItem}`].motor_1_act;
                    let motor_2_act = deviceStatus[`${deviceIdItem}`].motor_2_act;
                    let serve_1_act = deviceStatus[`${deviceIdItem}`].serve_1_act;
                    let serve_2_act = deviceStatus[`${deviceIdItem}`].serve_2_act;
                    let motor_1_max = (deviceStatus[`${deviceIdItem}`].motor_1_max) / 10;
                    let motor_1_min = (deviceStatus[`${deviceIdItem}`].motor_1_min) / 10;
                    let motor_2_max = (deviceStatus[`${deviceIdItem}`].motor_2_max) / 10;
                    let motor_2_min = (deviceStatus[`${deviceIdItem}`].motor_2_min) / 10;

                    return (
                        <Card
                            key={deviceIdIndex}
                            title={`控制器ID：${deviceIdItem}`}
                            style={{
                                borderColor: deviceStatus[`${deviceIdItem}`].is_online === '0' ? 'red' : '',
                                marginBottom: '10px'
                            }}
                            extra={
                                <div>
                                    <Icon type='setting'/>&nbsp;
                                    {deviceStatus[deviceIdItem].is_online === '0' ? '掉线' : '在线'}
                                </div>
                            }
                        >
                            <ChangeTempModal
                                title={'温度设置'}
                                onOk={this.handleChangeTempModalOk}
                                onCancel={this.handleChangeTempModalCancel}
                                visible={isAction.tempModal}
                                deviceIdItem={deviceIdItem}
                            />
                            <Spin spinning={isAction.controlStatus}>
                                <Row gutter={24}>
                                    {greenHousePos0[0] ?
                                        <Col span={12}>
                                            <Card>
                                                <Col span={12}>
                                                    <strong>卷膜机1 | {greenHousePos0[0]}</strong>
                                                </Col>
                                                <Col span={12}>
                                                    <Radio.Group name={deviceIdItem} value={motor_1_act}
                                                                 onChange={this.handleMotorControl.bind(this, deviceIdItem, 0)}>
                                                        <Radio.Button value='0'>上升</Radio.Button>
                                                        <Radio.Button value='2'>停止</Radio.Button>
                                                        <Radio.Button value='1'>下降</Radio.Button>
                                                    </Radio.Group>
                                                </Col>
                                            </Card>
                                        </Col>
                                        : null
                                    }
                                    {greenHousePos1[0] ?
                                        <Col span={12}>
                                            <Card>
                                                <Col span={12}>
                                                    <strong>卷膜机2 | {greenHousePos1[0]}</strong>
                                                </Col>
                                                <Col span={12}>
                                                    <Radio.Group name={deviceIdItem} value={motor_2_act}
                                                                 onChange={this.handleMotorControl.bind(this, deviceIdItem, 1)}>
                                                        <Radio.Button value='0'>上升</Radio.Button>
                                                        <Radio.Button value='2'>停止</Radio.Button>
                                                        <Radio.Button value='1'>下降</Radio.Button>
                                                    </Radio.Group>
                                                </Col>
                                            </Card>
                                        </Col>
                                        : null
                                    }
                                </Row>
                                <Row gutter={24}>
                                    {greenHousePos0[0] ?
                                        <Col span={12}>
                                            <Card>
                                                <Col span={5}>
                                                    <strong>温湿度1:</strong>
                                                </Col>
                                                <Col span={12}>
                                                    实时温度：<Slider style={{width: '100%'}} min={0} max={60}
                                                                 marks={tempMarks} step={1} value={temp1}/>
                                                    实时湿度：<Slider style={{width: '100%'}} min={0} max={100}
                                                                 marks={humiMarks} step={1} value={humi1}/>
                                                </Col>
                                                <Col span={7} className="changTemp">
                                                    <div className="tempControlBox">
                                                        <div>
                                                            <Badge count={motor_1_max}>
                                                                <Tag color='red'>温度上限</Tag>
                                                            </Badge>
                                                        </div>
                                                        <br/>
                                                        <div>
                                                            <Badge count={motor_1_min}>
                                                                <Tag color='green'>温度下限</Tag>
                                                            </Badge>
                                                        </div>
                                                        <br/>
                                                        <div>
                                                            <Button type='primary'
                                                                    onClick={this.handleChangeTempModal.bind(this, deviceIdItem, 4)}>
                                                                修改阈值
                                                            </Button>
                                                        </div>
                                                    </div>

                                                </Col>
                                            </Card>
                                        </Col>
                                        : null
                                    }
                                    {greenHousePos1[0] ?
                                        <Col span={12}>
                                            <Card>
                                                <Col span={5}>
                                                    <strong>温湿度2:</strong>
                                                </Col>
                                                <Col span={12}>
                                                    实时温度：<Slider style={{width: '100%'}} min={0} max={60}
                                                                 marks={tempMarks} step={1} value={temp2}/>
                                                    实时湿度：<Slider style={{width: '100%'}} min={0} max={100}
                                                                 marks={humiMarks} step={1} value={humi2}/>
                                                </Col>
                                                <Col span={7} className="changTemp">
                                                    <div className="tempControlBox">
                                                        <div>
                                                            <Badge count={motor_2_max}>
                                                                <Tag color='red'>温度上限</Tag>
                                                            </Badge>
                                                        </div>
                                                        <br/>
                                                        <div>
                                                            <Badge count={motor_2_min}>
                                                                <Tag color='green'>温度下限</Tag>
                                                            </Badge>
                                                        </div>
                                                        <br/>
                                                        <div>
                                                            <Button type='primary'
                                                                    onClick={this.handleChangeTempModal.bind(this, deviceIdItem, 5)}>
                                                                修改阈值
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Card>
                                        </Col>
                                        : null
                                    }
                                </Row>
                                <Row gutter={24}>
                                    {greenHousePos2[0] ?
                                        <Col span={12}>
                                            <Card>
                                                <Col span={12}>
                                                    <strong>阀门 | {greenHousePos2[0]}</strong>
                                                </Col>
                                                <Col span={12}>
                                                    <Switch checkedChildren={'开'} unCheckedChildren={'关'}
                                                            onChange={this.handleServerControl.bind(this, deviceIdItem, 2)}
                                                            checked={serve_1_act === '1'}
                                                    />
                                                </Col>
                                            </Card>
                                        </Col>
                                        : null
                                    }
                                    {greenHousePos3[0] ?
                                        <Col span={12}>
                                            <Card>
                                                <Col span={12}>
                                                    <strong>风机 | {greenHousePos3[0]}</strong>
                                                </Col>
                                                <Col span={12}>
                                                    <Switch checkedChildren={'开'} unCheckedChildren={'关'}
                                                            onChange={this.handleServerControl.bind(this, deviceIdItem, 3)}
                                                            checked={serve_2_act === '1'}
                                                    />
                                                </Col>
                                            </Card>
                                        </Col>
                                        : null
                                    }
                                </Row>
                            </Spin>
                        </Card>
                    )
                })}
            </Spin>
        )
    }
}

class ChangeTempModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempMax: '',
            tempMin: '',
        }
    }

    handleOk = () => {
        const {tempMax, tempMin} = this.state;
        this.props.onOk(tempMax, tempMin);
    };

    handleCancel = () => {
        this.props.onCancel();
    };
    handleTempMax = (e) => {
        let value = Number(e.target.value);
        if (value > 60) {
            value = 60;
        }
        if (value < 0) {
            value = 0;
        }
        this.setState({
            tempMax: value
        })
    };
    handleTempMin = (e) => {
        let value = Number(e.target.value);
        if (value > 60) {
            value = 60;
        }
        if (value < 0) {
            value = 0;
        }
        this.setState({
            tempMin: value
        })
    };

    render() {
        const {visible} = this.props;

        const {tempMax, tempMin} = this.state;
        return (
            <Modal
                title={this.props.title}
                visible={visible}
                okText='提交'
                onOk={this.handleOk}
                cancelText='取消'
                width='400px'
                onCancel={this.handleCancel}
            >
                <Input
                    addonBefore='温度上限：'
                    addonAfter='摄氏度'
                    size='large'
                    type='number'
                    value={tempMax}
                    placeholder='0～60'
                    onChange={this.handleTempMax}
                />
                <br/>
                <br/>
                <Input
                    addonBefore='温度下限：'
                    addonAfter='摄氏度'
                    size='large'
                    type='number'
                    value={tempMin}
                    placeholder='0～60'
                    onChange={this.handleTempMin}
                />
            </Modal>
        )
    }
}

export default Index;
