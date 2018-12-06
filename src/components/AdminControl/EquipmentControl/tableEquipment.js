import React, {Component} from 'react';
import {Table, Input, Button, Popconfirm, Form, Select, Spin, message, Icon} from 'antd';

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
    //判断输入框的类型
    getInput = () => {
        if (this.props.dataIndex === 'username') {
            const option = this.props.userNames.map(item => <Option key={item}>{item}</Option>);
            return (
                <Select showSearch style={{width: '100%'}}>
                    {option}
                </Select>
            )
        } else if (this.props.dataIndex === 'name') {
            const option = this.props.rainNames.map(item => <Option key={item}>{item}</Option>);
            return (
                <Select showSearch style={{width: '100%'}}>
                    {option}
                </Select>
            )
        }
        else {
            return <Input/>
        }
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            isRequired,
            record,
            userNames,
            rainNames,
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
                                            required: isRequired,
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
                title: '用户名',
                dataIndex: 'username',
                editable: true,
                isRequired: true,
                width: '20%'
            }, {
                title: '控制器ID',
                dataIndex: 'deviceId',
                editable: true,
                isRequired: true,
                width: '20%',
            }, {
                title: '控制器位置',
                dataIndex: 'location',
                editable: true,
                isRequired: false,
                width: '20%',
            }, {
                title: '雨量传感器',
                dataIndex: 'name',
                editable: true,
                isRequired: false,
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
            userNames: [],
            deviceIds: [],
            rainNames: [],
            rainNamesToId: [],
            editingKey: '',
            isNew: false,
            isLoading: false,
            count: ''
        }
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        const {editingKey} = this.state;
        if (editingKey) {
            return false;
        }
        this.setState({
            editingKey: key
        })
    }

    cancel(key) {
        const {isNew, data} = this.state;
        if (isNew === true) {
            const index = data.findIndex(item => key === item.key);
            data.splice(index, 1);
            this.setState({
                isNew: false,
                data: data,
                editingKey: ''
            })
        } else {
            this.setState({
                editingKey: ''
            })
        }
    }

    handleDelete = (key) => {
        const {data, editingKey} = this.state;
        if (editingKey) {
            message.warning('存在正在编辑项目');
            return false;
        }
        this.setState({
            isLoading: true
        });
        const index = data.findIndex(item => key === item.key);
        const item = data[index];
        const deleteKey = item.deviceId;
        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/device/' + deleteKey;
        const opts = {
            method: 'DELETE',
            body: JSON.stringify(deleteKey),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, opts)
            .then(response => console.log(response.status))
            .then(() => {
                message.success('删除成功');
                this.setState({
                    isLoading: false,
                    data: data.filter(item => item.key !== key)
                })
            })
            .catch((error) => {
                if (error === 401) {
                    message.warning('删除失败，您的登录信息已失效，请退出后重新登录', 5);
                } else if (error === 500) {
                    message.warning('服务器崩溃', 5);
                }
                this.setState({
                    isLoading: false
                })
            });
    };

    handleAdd = () => {
        const {data, count, editingKey} = this.state;

        if (editingKey) {
            return false;
        }
        const newData = {
            key: count,
            deviceId: '',
            username: '',
            location: '',
            rainId: ''
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
                return;
            }
            const {data, isNew, rainNamesToId, deviceIds} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const saveItem = {
                username: newItem.username,
                deviceId: newItem.deviceId,
                location: newItem.location,
                rainId: rainNamesToId[newItem.name]
            };

            if (deviceIds.indexOf(saveItem.deviceId) > -1 && isNew) {
                message.warning('此控制器已经卖出，请重新选择控制器');
                return false;
            }

            const token = window.sessionStorage.getItem('token');
            const url = 'http://47.92.206.44:80/api/device/' + newItem.deviceId;
            const opts = {
                method: 'PUT',
                body: JSON.stringify(saveItem),
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
                    message.success('添加成功');
                    data.splice(index, 1, newItem);
                    if (isNew) {
                        deviceIds.push(newItem.deviceId);
                    }
                    this.setState({
                        data: data,
                        isLoading: false,
                        deviceIds: deviceIds,
                        isNew: false,
                        editingKey: ''
                    })
                })
                .catch(() => {
                    message.error('添加失败');
                    if (isNew) {
                        data.splice(index, 1);
                        this.setState({
                            data: data,
                            isNew: false,
                            isLoading: false,
                            editingKey: ''
                        })
                    }
                });
        })
    };

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const token = window.sessionStorage.getItem('token');
        const urlGetData = 'http://47.92.206.44:80/api/device';
        const urlGetUser = 'http://47.92.206.44:80/api/user';
        const urlGetRainInfoData = 'http://47.92.206.44:80/api/raininfo';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        const timeOutPromise = new Promise((resolve, reject) => {
            setTimeout(function () {
                reject('TimeOut!')
            }, 20000)
        });
        const fetchGetData = new Promise((resolve, reject) => {
            fetch(urlGetData, options)
                .then(response => response.json())
                .then(responseText => resolve(responseText))
                .catch(error => reject(error))
        });
        const fetchGetRainInfoData = new Promise((resolve, reject) => {
            fetch(urlGetRainInfoData, options)
                .then(response => response.json())
                .then(responseText => resolve(responseText))
                .catch(error => reject(error))
        });
        const fetchGetUserData = new Promise((resolve, reject) => {
            fetch(urlGetUser, options)
                .then(response => response.json())
                .then(responseText => resolve(responseText))
                .catch(error => reject(error))
        });
        const getData = Promise.all([fetchGetData, fetchGetUserData, fetchGetRainInfoData])
            .then(result => Promise.resolve(result))
            .catch(error => Promise.reject(error));
        Promise.race([timeOutPromise, getData])
            .then(result => {
                console.log(result);
                result[0].map((item, index)=> item.key = index);
                const userData = result[1].map(item => item.username);
                let rainNamesToId = {};
                let rainIdToNames = {};
                const deviceIds = result[0].map(item => item.deviceId);
                result[2].map(item => rainNamesToId[`${item.name} | ${item.location}`] = item.rainId);
                result[2].map(item => rainIdToNames[item.rainId] = `${item.name} | ${item.location}`);
                const rainNames = result[2].map(item => `${item.name} | ${item.location}`);
                result[0].map(item => item.name = rainIdToNames[item.rainId]);
                console.log(deviceIds);
                this.setState({
                    data: result[0],
                    count: result[0].length,
                    userNames: userData,
                    deviceIds: deviceIds,
                    rainNamesToId: rainNamesToId,
                    rainIdToNames: rainIdToNames,
                    rainNames: rainNames,
                    isLoading: false
                })
            })
            .catch(error => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    isLoading: false
                })
            });
    }

    render() {
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
            if (col.dataIndex === 'deviceId' && this.state.isNew === false) {
                return col;
            }
            if (col.dataIndex === 'username' && this.state.isNew === false) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    userNames: this.state.userNames,
                    rainNames: this.state.rainNames,
                    isRequired: col.isRequired,
                    editing: this.isEditing(record)
                })
            }
        });

        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" className='add-row-button'>
                    <Icon type="plus-circle"/>新增设备
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
