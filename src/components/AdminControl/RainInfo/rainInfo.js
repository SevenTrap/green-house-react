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
        const {editing, dataIndex, isRequired, title, record, userNames, ...restProps} = this.props;
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
                                            message: `${title}不可为空`,
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
                width: '20%',
            }, {
                title: '雨量设备ID',
                dataIndex: 'rainId',
                editable: true,
                isRequired: true,
                width: '20%'
            }, {
                title: '雨量安装位置',
                dataIndex: 'location',
                editable: true,
                isRequired: false,
                width: '20%'
            }, {
                title: '详情',
                dataIndex: 'description',
                editable: true,
                isRequired: false,
                width: '25%'
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
                                                    href="javascript:void(0);"
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
                                            <a href="javascript:void(0);">取消</a>
                                        </Popconfirm>
                                    </span>
                                ) : (
                                    <span>
                                    <a
                                        href="javascript:void(0);"
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
                                        <a href="javascript:void(0);">删除</a>
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
            editingKey: '',
            isNew: false,
            count: '',
            isLoading: true,
            rainIds: [],
            userNames: []
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
        if (isNew) {
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
        const {data, rainIds, userNames, editingKey} = this.state;
        if (editingKey !== "") {
            message.warning('存在编辑项');
            return false;
        }
        const index = data.findIndex(item => key === item.key);
        const item = data[index].rainId;
        const deleteUserName = data[index].username;
        const token = window.sessionStorage.getItem('token');
        const url = 'https://in.huayuaobo.com:16400/api/raininfo/' + item;
        const opts = {
            method: 'DELETE',
            body: JSON.stringify(item),
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
            .then(() => {
                message.success('删除雨量成功');
                const rainIdsIndex = rainIds.indexOf(item);
                rainIds.splice(rainIdsIndex, 1);
                console.log(deleteUserName);
                userNames.push(deleteUserName);
                this.setState({
                    isLoading: false,
                    rainIds: rainIds,
                    userNames: userNames,
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
        const {data, count, userNames, editingKey} = this.state;
        if (editingKey !== "") {
            message.warning('存在编辑项');
            return false;
        }
        if (userNames.length === 0) {
            message.warning('所有用户均有雨量设备');
            return false;
        }
        const newData = {
            key: count,
            rainId: '',
            name: '',
            location: '',
            description: '',
            username: ''
        };
        this.setState({
            editingKey: count,
            count: count + 1,
            isNew: true,
            data: [newData, ...data]
        })
    };

    //新增项目保存时，保存失败需要将其删除
    save(form, key) {
        form.validateFields((error, row) => {
            const rainIdReg = new RegExp(/^([1-9][0-9]{7})$/);
            const {data, isNew, rainIds, userNames} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const saveItem = {
                rainId: newItem.rainId,
                location: newItem.location,
                description: newItem.description,
                username: newItem.username,
            };
            console.log(saveItem);
            if (userNames.indexOf(saveItem.username) === -1 && isNew) {
                message.warning('此用户名不存在，请重新指定用户');
                return false;
            }
            if (!rainIdReg.test(saveItem.rainId)) {
                message.warning('请输入8位正整数');
                return false;
            }
            if (rainIds.indexOf(saveItem.rainId) > -1 && isNew) {
                message.warning('此雨量ID已存在，请重新分配雨量ID');
                return false;
            }

            const token = window.sessionStorage.getItem('token');
            const url = 'https://in.huayuaobo.com:16400/api/raininfo/' + newItem.rainId;
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
                        rainIds.push(newItem.rainId);
                        let deleteIndex = userNames.findIndex(item => item === saveItem.username);
                        userNames.splice(deleteIndex, 1);
                    }
                    this.setState({
                        isLoading: false,
                        data: data,
                        isNew: false,
                        userNames: userNames,
                        rainIds: rainIds,
                        editingKey: ''
                    })
                })
                .catch(() => {
                    message.error('添加失败,请重新保存');
                    if (isNew) {
                        this.setState({
                            isLoading: false
                        })
                    }
                });
        })
    };

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        const urlUser = 'https://in.huayuaobo.com:16400/api/user';
        const urlRainInfo = 'https://in.huayuaobo.com:16400/api/raininfo';
        const option = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        const getUsers = new Promise((resolve, reject) => {
            fetch(urlUser, option)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(() => reject('获取用户信息失败'))
        });
        const getRainInfo = new Promise((resolve, reject) => {
            fetch(urlRainInfo, option)
                .then(response => response.json())
                .then(res => resolve(res))
                .catch(() => reject('获取雨量信息失败'))
        });
        Promise.all([getRainInfo, getUsers])
            .then(result => {
                console.log(result);
                result[0].map((item, index) => item.key = index);
                let rainIds = result[0].map(item => item.rainId);
                let rainUser = result[0].map(item => item.username);

                let userNames = [];
                for (let i = 0; i < result[1].length; i++) {
                    let item = result[1][i];
                    if (item.role !== "Administrator" && rainUser.indexOf(item.username) === -1) {
                        userNames.push(item.username);
                    }
                }
                this.setState({
                    isLoading: false,
                    rainIds: rainIds,
                    userNames: userNames,
                    data: result[0],
                    count: result[0].length
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
        const {isNew, userNames} = this.state;
        console.log(userNames);
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
            if (col.dataIndex === 'rainId' && isNew === false) {
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
                    isRequired: col.isRequired,
                    title: col.title,
                    userNames: userNames,
                    editing: this.isEditing(record)
                })
            }
        });

        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" className='add-row-button'>
                    <Icon type="plus-circle"/>新增雨量
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
