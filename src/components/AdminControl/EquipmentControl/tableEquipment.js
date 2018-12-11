import React, {Component} from 'react';
import {Table, Input, Button, Popconfirm, Form, Spin, AutoComplete, message, Icon} from 'antd';

const FormItem = Form.Item;
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
            userNames: this.props.userNames
        }
    }
    //判断输入框的类型
    getInput = () => {
        if (this.props.dataIndex === 'username') {
            return (
                <AutoComplete
                    dataSource={this.state.userNames}
                    style={{width: '100%'}}
                    onSearch={this.handleUserNameSearch}
                    placeholder='请选择用户'
                />
            )
        } else {
            return <Input/>
        }
    };
    handleUserNameSearch = (value) => {
        const {userNames} = this.props;
        const newUserName = userNames.filter(item => (item.indexOf(value) > -1) ? item : null);
        this.setState({
            userNames: newUserName
        })
    };
    render() {
        const {
            editing,
            dataIndex,
            title,
            isRequired,
            record,
            userNames,
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
                title: '归属用户',
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
                title: '控制器安装位置',
                dataIndex: 'location',
                editable: true,
                isRequired: true,
                width: '20%',
            }, {
                title: '详情',
                dataIndex: 'description',
                editable: true,
                isRequired: false,
                width: '25%',
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: '15%',
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
            editingKey: '',
            isNew: false,
            isLoading: true,
            count: ''
        }
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        const {editingKey} = this.state;
        if (editingKey === '') {
            this.setState({
                editingKey: key
            })
        }
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
        const {data, deviceIds} = this.state;
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
            .then(response => response.status)
            .then(() => {
                message.success('删除设备成功');
                const deviceIdIndex = deviceIds.indexOf(deleteKey);
                deviceIds.splice(deviceIdIndex, 1);
                this.setState({
                    isLoading: false,
                    deviceIds: deviceIds,
                    data: data.filter(item => item.key !== key)
                })
            })
            .catch(() => {
                message.error('删除失败,请重新操作');
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
            description: ''
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
            const deviceIdReg = new RegExp(/^([1-9][0-9]{7})$/);
            const {data, isNew, deviceIds, userNames} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const saveItem = {
                username: newItem.username,
                deviceId: newItem.deviceId,
                location: newItem.location,
                description: newItem.description
            };
            if (userNames.indexOf(saveItem.username) === -1) {
                message.warning('此用户名不存在，请重新指定用户');
                return false;
            }
            if (!deviceIdReg.test(saveItem.deviceId)) {
                message.warning('请输入8位正整数');
                return false;
            }
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
                .then((response) => response.status)
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
                    message.error('添加失败,请重新保存');
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

        const token = window.sessionStorage.getItem('token');
        const urlGetData = 'http://47.92.206.44:80/api/device';
        const urlGetUser = 'http://47.92.206.44:80/api/user';
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
        const fetchGetUserData = new Promise((resolve, reject) => {
            fetch(urlGetUser, options)
                .then(response => response.json())
                .then(responseText => resolve(responseText))
                .catch(error => reject(error))
        });
        const getData = Promise.all([fetchGetData, fetchGetUserData])
            .then(result => Promise.resolve(result))
            .catch(error => Promise.reject(error));
        Promise.race([timeOutPromise, getData])
            .then(result => {
                result[0].map((item, index)=> item.key = index);
                const userNames = result[1].map(item => item.username);
                const deviceIds = result[0].map(item => item.deviceId);
                this.setState({
                    data: result[0],
                    count: result[0].length,
                    userNames: userNames,
                    deviceIds: deviceIds,
                    isLoading: false
                })
            })
            .catch(() => {
                message.error('网络异常，请重新刷新页面');
                this.setState({
                    isLoading: false
                })
            });
    }

    render() {
        const {isNew, userNames} = this.state;
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
            if (col.dataIndex === 'deviceId' && isNew === false) {
                return col;
            }
            if (col.dataIndex === 'username' && isNew === false) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    userNames: userNames,
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
