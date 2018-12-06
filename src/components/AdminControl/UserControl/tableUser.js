import React, {Component} from 'react';
import {Table, Input, Button, Popconfirm, Form, Select, Spin, AutoComplete, message, Icon} from 'antd';

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
        if (this.props.dataIndex === 'role') {
            return (
                <Select style={{width: '100%'}}>
                    <Option value='User'>普通用户</Option>
                    <Option value='Administrator'>管理员</Option>
                </Select>
            )
        } else {
            return <Input/>
        }
    };

    render() {
        const {editing, dataIndex, isRequired, title, record, ...restProps} = this.props;
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
                title: '用户名',
                dataIndex: 'username',
                editable: true,
                isRequired: true,
                width: '15%'
            }, {
                title: '密码',
                dataIndex: 'password',
                editable: true,
                isRequired: false,
                width: '15%'
            }, {
                title: '角色权限',
                dataIndex: 'role',
                editable: true,
                isRequired: true,
                width: '15%'
            }, {
                title: '电话',
                dataIndex: 'phone',
                editable: true,
                isRequired: false,
                width: '15%'
            }, {
                title: 'Email',
                dataIndex: 'emailAddress',
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
            isLoading: false,
            userNames: []
        }
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    //当存在编辑行时，不可在进行编辑
    edit(key) {
        const {editingKey} = this.state;
        if (editingKey) {
            return false;
        }
        this.setState({
            editingKey: key
        })
    }

    //如果是新增的项目，则取消时需要删除
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

    //删除用户时，会删除用户底下所有信息，包括所有设备以及大棚信息
    handleDelete = (key) => {
        this.setState({
            isLoading: true
        });
        const {data, userNames} = this.state;
        const index = data.findIndex(item => key === item.key);
        const item = data[index].username;
        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/user/' + item;
        const opts = {
            method: 'DELETE',
            body: JSON.stringify(item),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, opts)
            .then(() => {
                message.success('删除用户成功');
                const userNameIndex = userNames.indexOf(item);
                userNames.splice(userNameIndex, 1);
                this.setState({
                    isLoading: false,
                    userNames: userNames,
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
        if (editingKey) {
            return false;
        }
        const newData = {
            key: count,
            username: '',
            password: '',
            role: 'User',
            phone: '',
            emailAddress: ''
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
            if (error) {
                return false;
            }
            const {data, isNew, userNames} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const saveItem = {
                username: newItem.username,
                password: newItem.password,
                role: newItem.role,
                phone: newItem.phone,
                emailAddress: newItem.emailAddress,
                description: newItem.description
            };
            if (userNames.indexOf(saveItem.username) > -1 && isNew) {
                message.warning('此用户名已存在，请重新指定用户');
                return false;
            }
            const token = window.sessionStorage.getItem('token');
            const url = 'http://47.92.206.44:80/api/user/' + newItem.username;
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
                        userNames.push(newItem.username);
                    }
                    this.setState({
                        isLoading: false,
                        data: data,
                        isNew: false,
                        userNames: userNames,
                        editingKey: ''
                    })
                })
                .catch((err) => {
                    message.error('添加失败');
                    if (isNew) {
                        data.splice(index, 1);
                        this.setState({
                            data: data,
                            isLoading: false,
                            isNew: false,
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
        const url = 'http://47.92.206.44:80/api/user';
        const option = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, option)
            .then(response => response.json())
            .then((res) => {
                res.map((item, index) => item.key = index);
                res.map(item => item.role = `${item.role === 'User' ? '普通用户' : '管理员'}`);
                let userNames = res.map(item => item.username);
                this.setState({
                    userNames: userNames,
                    count: res.length,
                    isLoading: false,
                    data: res
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
            if (col.dataIndex === 'username' && this.state.isNew === false) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    isRequired: col.isRequired,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            }
        });

        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" className='add-row-button'>
                    <Icon type="plus-circle"/>新增用户
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
