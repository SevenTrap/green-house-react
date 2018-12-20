import React, {Component} from 'react';
import {Table, Input, Button, Popconfirm, Form, Select, AutoComplete, Spin, Icon} from 'antd';
import {message} from "antd/lib/index";

let deviceNameToPos = {};
let devicePosToName = {};
let deviceName = ['卷膜机1', '卷膜机2', '阀门', '风机'];
deviceNameToPos["卷膜机1"] = 0;
deviceNameToPos["卷膜机2"] = 1;
deviceNameToPos["阀门"] = 2;
deviceNameToPos["风机"] = 3;

devicePosToName[0] = "卷膜机1";
devicePosToName[1] = "卷膜机2";
devicePosToName[2] = "阀门";
devicePosToName[3] = "风机";

const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props}/>
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            greenHouseName: this.props.greenHouseName,
            deviceId: this.props.deviceId
        }
    }
    handleGreenHouseName = (value) => {
        const {greenHouseName} = this.props;
        if (value === "") {
            this.setState({
                greenHouseName: greenHouseName
            })
        }
        const newData = greenHouseName.filter(item => (item.indexOf(value) > -1) ? item : null);
        this.setState({
            greenHouseName: newData
        })
    };
    handleDeviceId = (value) => {
        const {deviceId} = this.props;
        if (value === "") {
            this.setState({
                deviceId: deviceId
            })
        }
        const newData = deviceId.filter(item => (item.indexOf(value) > -1) ? item : null);
        this.setState({
            deviceId: newData
        })
    };
    getInput = () => {
        const {greenHouseName, deviceId} = this.state;
        if (this.props.dataIndex === 'greenHouseName') {
            return (
                <AutoComplete
                    dataSource={greenHouseName}
                    style={{width: '100%'}}
                    onChange={this.handleGreenHouseName}
                    placeholder='请选择温室名称'
                />
            )
        } else if (this.props.dataIndex === 'deviceName') {
            const options = deviceName.map(item => <Option key={item}>{item}</Option>);
            return (
                <Select style={{width: '100%'}}>
                    {options}
                </Select>
            )
        } else if (this.props.dataIndex === 'deviceId') {
            return (
                <AutoComplete
                    dataSource={deviceId}
                    style={{width: '100%'}}
                    onChange={this.handleDeviceId}
                    placeholder='请选择控制器编号'
                />
            )
        } else {
            return <Input/>
        }
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            record,
            greenHouseName,
            deviceId,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{margin: 0}}>
                                    {form.getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `${title}不可为空!!!`,
                                        }],
                                        initialValue: record[dataIndex]
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    )
                }}
            </EditableContext.Consumer>
        )
    }
}

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '温室名称',
                dataIndex: 'greenHouseName',
                editable: true,
                width: '20%'
            }, {
                title: '设备位置',
                dataIndex: 'greenHousePos',
                editable: true,
                width: '20%'
            }, {
                title: '控制器编号',
                dataIndex: 'deviceId',
                editable: true,
                width: '20%'
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
                editable: true,
                width: '20%',
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: '20%',
                render: (text, record) => {
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable
                                ? (
                                    <span>
                                        <EditableContext.Consumer>
                                            {form => (
                                                <a
                                                    href='javascript:void(0);'
                                                    onClick={() => this.save(form, record.key)}
                                                    style={{marginRight: 8}}
                                                >
                                                    保存
                                                </a>
                                            )}
                                        </EditableContext.Consumer>
                                        <Popconfirm
                                            title="确认取消？"
                                            onConfirm={() => this.cancel(record.key)}
                                            okText='确定'
                                            cancelText='取消'
                                        >
                                            <a href='javascript:void(0);'>取消</a>
                                        </Popconfirm>
                                    </span>
                                ) : (
                                    <span>
                                    <a
                                        href='javascript:void(0);'
                                        onClick={() => this.edit(record.key)}
                                        style={{marginRight: 8}}
                                    >
                                        修改
                                    </a>
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={() => this.handleDelete(record.key)}
                                        okText='确定'
                                        cancelText='取消'
                                    >
                                        <a href='javascript:void(0);'>删除</a>
                                    </Popconfirm>
                                    </span>
                                )
                            }
                        </div>
                    )
                }
            }
        ];
        this.state = {
            data: [],
            greenHouseIdToName: [],
            greenHouseNameToId: [],
            greenHouseName: [],
            greenHouseIdAndPos: [],
            deviceIdAndPos: [],
            editingKey: '',
            count: '',
            isNew: false,
            isLoading: true
        }
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        const {editingKey} = this.state;
        if (editingKey === "") {
            this.setState({
                editingKey: key
            })
        }
    }

    cancel(key) {
        const {isNew, data} = this.state;
        if (isNew) {
            const index = data.findIndex(item => key === item.key);
            data.splice(index, 1);
            this.setState({
                isNew: false,
                data: data,
                editingKey: ''
            })
        }
        this.setState({
            editingKey: ''
        })
    }

    handleDelete = (key) => {
        const {data, greenHouseIdAndPos, deviceIdAndPos, editingKey} = this.state;
        if (editingKey !== "") {
            message.warning('处于编辑中');
            return false;
        }
        const token = window.sessionStorage.getItem('token');
        const index = data.findIndex(item => key === item.key);
        const item = data[index];
        let deleteItem = {
            greenHouseId: item.greenHouseId,
            greenHousePos: item.greenHousePos
        };
        let greenHouseIdAndPosItem = `${item.greenHouseId} ${item.greenHousePos}`;
        let deviceIdAndPosItem = `${item.deviceId} ${item.devicePos} ${key}`;
        const url = 'http://47.92.206.44:80/api/greenhousemap';
        const opts = {
            method: 'DELETE',
            body: JSON.stringify(deleteItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        this.setState({
            isLoading: true
        });
        fetch(url, opts)
            .then((response) => console.log(response.status))
            .then(() => {
                message.success('删除成功');
                greenHouseIdAndPos.splice(greenHouseIdAndPos.findIndex(item => item === greenHouseIdAndPosItem), 1);
                deviceIdAndPos.splice(deviceIdAndPos.findIndex(item => item === deviceIdAndPosItem), 1);
                this.setState({
                    isLoading: false,
                    greenHouseIdAndPos: greenHouseIdAndPos,
                    deviceIdAndPos: deviceIdAndPos,
                    data: data.filter(item => item.key !== key)
                })
            })
            .catch(() => {
                message.error('删除失败');
                this.setState({
                    isLoading: false
                })
            });
    };

    handleAdd = () => {
        const {data, count, editingKey} = this.state;
        if (editingKey !== "") {
            return false
        }
        const newData = {
            key: count,
            greenHouseName: '',
            greenHousePos: '',
            deviceId: '',
            deviceName: ''
        };
        this.setState({
            editingKey: count,
            isNew: true,
            count: count + 1,
            data: [newData, ...data]
        })
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return false;
            }
            const {data, isNew, greenHouseNameToId} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const greenHouseId = greenHouseNameToId[newItem.greenHouseName];
            console.log(newItem, greenHouseId, key);
            if (isNew) {
                this.handlePushNewItem(newItem, greenHouseId, key, index);
            } else {
                this.handleChangeOldItem(newItem, greenHouseId, key, index);
            }
        })
    };

    handlePushNewItem = (item, greenHouseId, key, index) => {
        const {data, greenHouseIdAndPos, deviceIdAndPos} = this.state;
        let newItem = [{
            greenHouseId: greenHouseId,
            greenHousePos: item.greenHousePos,
            deviceId: item.deviceId,
            devicePos: deviceNameToPos[item.deviceName],
        }];
        const greenHouseIdAndPosItem = `${greenHouseId} ${item.greenHousePos}`;
        const deviceIdAndPosItem = `${newItem[0].deviceId} ${newItem[0].devicePos}`;
        const deviceIdAndPosItemKey = `${newItem[0].deviceId} ${newItem[0].devicePos} ${key}`;
        let greenHouseIdAndPosItemIndex = greenHouseIdAndPos.findIndex(item => item === greenHouseIdAndPosItem);
        let deviceIdAndPosItemIndex = true;
        for (let i = 0; i < deviceIdAndPos.length; i++) {
            let deviceIdArr = deviceIdAndPos[i].split(" ");
            let temp = `${deviceIdArr[0]} ${deviceIdArr[1]}`;
            if (deviceIdAndPosItem === temp) {
                deviceIdAndPosItemIndex = false;
            }
        }
        if (!deviceIdAndPosItemIndex) {
            message.warning('此控制器的设备已绑定大棚');
            return false;
        }
        if (greenHouseIdAndPosItemIndex > -1) {
            message.warning('此大棚下的设备位置已重复');
            return false;
        }

        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/greenhousemap/' + greenHouseId;
        const opts = {
            method: 'PATCH',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        this.setState({
            isLoading: true
        });
        fetch(url, opts)
            .then(response => response.status)
            .then(() =>{
                data.splice(index, 1, item);
                message.success('数据上传成功');
                greenHouseIdAndPos.push(greenHouseIdAndPosItem);
                deviceIdAndPos.push(deviceIdAndPosItemKey);
                this.setState({
                    data: data,
                    greenHouseIdAndPos: greenHouseIdAndPos,
                    deviceIdAndPos: deviceIdAndPos,
                    isNew: false,
                    editingKey: '',
                    isLoading: false
                })
            })
            .catch(() => {
                message.error("数据上传失败");
                this.setState({
                    isLoading: false
                })
            })
    };

    handleChangeOldItem = (item, greenHouseId, key, index) => {
        const {data, deviceIdAndPos} = this.state;
        let newItem = [{
            greenHouseId: greenHouseId,
            greenHousePos: item.greenHousePos,
            deviceId: item.deviceId,
            devicePos: deviceNameToPos[item.deviceName],
        }];
        const deviceIdAndPosItem = `${newItem[0].deviceId} ${newItem[0].devicePos}`;
        const deviceIdAndPosItemKey = `${newItem[0].deviceId} ${newItem[0].devicePos} ${key}`;
        let deviceIdAndPosItemIndex = true;
        for (let i = 0; i < deviceIdAndPos.length; i++) {
            let deviceIdArr = deviceIdAndPos[i].split(" ");
            if (`${key}` === deviceIdArr[2]) {
                deviceIdAndPos.splice(i, 1);
                break;
            }
        }
        for (let i = 0; i < deviceIdAndPos.length; i++) {
            let deviceIdArr = deviceIdAndPos[i].split(" ");
            if (deviceIdAndPosItem === `${deviceIdArr[0]} ${deviceIdArr[1]}`) {
                deviceIdAndPosItemIndex = false;
            }
        }
        if (!deviceIdAndPosItemIndex) {
            message.warning('此控制器的设备已绑定大棚');
            return false;
        }

        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/greenhousemap/' + greenHouseId;
        const opts = {
            method: 'PATCH',
            body: JSON.stringify(newItem),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        this.setState({
            isLoading: true
        });
        fetch(url, opts)
            .then(response => response.status)
            .then(() =>{
                data.splice(index, 1, item);
                message.success('数据上传成功');
                deviceIdAndPos.push(deviceIdAndPosItemKey);
                this.setState({
                    data: data,
                    deviceIdAndPos: deviceIdAndPos,
                    editingKey: '',
                    isLoading: false
                })
            })
            .catch(() => {
                message.error("数据上传失败");
                this.setState({
                    isLoading: false,
                })
            })
    };

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        const urlGreenHouseMap = 'http://47.92.206.44:80/api/greenhousemap';
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
        const getGreenHouseMap = new Promise((resolve, reject) => {
            fetch(urlGreenHouseMap, opts)
                .then((response) => response.json())
                .then((res) => resolve(res))
                .catch(() => reject('获取绑定信息失败'))
        });
        const getGreenHouse = new Promise((resolve, reject) => {
            fetch(urlGreenHouse, opts)
                .then((response) => response.json())
                .then((res) => resolve(res))
                .catch(() => reject('获取大棚信息失败'))
        });
        const getDevice = new Promise((resolve, reject) => {
            fetch(urlDevice, opts)
                .then((response) => response.json())
                .then((res) => resolve(res))
                .catch(() => reject('获取设备信息失败'))
        });
        Promise.all([getGreenHouseMap, getGreenHouse, getDevice])
            .then(result => {
                const deviceId = result[2].map(item => item.deviceId);
                const greenHouseName = result[1].map(item => item.name);
                let greenHouseIdToName = {};
                let greenHouseNameToId = {};
                result[1].map(item => greenHouseIdToName[item.greenHouseId] = item.name);
                result[1].map(item => greenHouseNameToId[item.name] = item.greenHouseId);

                result[0].map(item => item.greenHouseName = greenHouseIdToName[item.greenHouseId]);
                result[0].map(item => item.deviceName = devicePosToName[item.devicePos]);
                result[0].map((item, index) => item.key = index);
                let deviceIdAndPos = result[0].map(item => `${item.deviceId} ${item.devicePos} ${item.key}`);
                let greenHouseIdAndPos = result[0].map(item => `${item.greenHouseId} ${item.greenHousePos}`);

                this.setState({
                    deviceId: deviceId,
                    deviceIdAndPos: deviceIdAndPos,
                    greenHouseIdAndPos: greenHouseIdAndPos,
                    greenHouseIdToName: greenHouseIdToName,
                    greenHouseNameToId: greenHouseNameToId,
                    greenHouseName: greenHouseName,
                    data: result[0],
                    count: result[0].length,
                    isLoading: false
                })
            })
            .catch(() => {
                message.error('网络异常，请刷新页面');
                this.setState({
                    isLoading: false
                })
            });
    }

    render() {
        const {isNew, greenHouseName, deviceId} = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            if (col.dataIndex === 'greenHouseName' && isNew === false) {
                return col;
            }
            if (col.dataIndex === 'greenHousePos' && isNew === false) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    greenHouseName: greenHouseName,
                    deviceId: deviceId,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            }
        });

        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" className='add-row-button'>
                    <Icon type="plus-circle"/>新增绑定
                </Button>
                <Spin spinning={this.state.isLoading}>
                    <Table
                        components={components}
                        rowClassName='editable-row'
                        bordered
                        dataSource={this.state.data}
                        columns={columns}
                    />
                </Spin>
            </div>
        )
    }
}

export default EditableTable;
