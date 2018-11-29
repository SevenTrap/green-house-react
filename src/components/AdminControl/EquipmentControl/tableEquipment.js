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
        } else {
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
                width: '40%'
            }, {
                title: '控制器ID',
                dataIndex: 'deviceId',
                editable: true,
                isRequired: true,
                width: '40%',
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

        this.fetchGetData = this.fetchGetData.bind(this);
        this.fetchGetUserData = this.fetchGetUserData.bind(this);

        this.state = {
            data: [],
            userNames: [],
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
        this.setState({
            isLoading: true
        });
        const {data} = this.state;
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
            .then((response) => console.log(response.status))
            .then((res) => {
                message.success('删除成功');
                this.setState({
                    isLoading: false,
                    data: data.filter(item => item.key !== key)
                })
            })
            .catch((error) => {
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
            deviceId: '',
            username: '',
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
            this.setState({
                isLoading: true
            });

            const {data, isNew} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const saveItem = {
                username: newItem.username,
                deviceId: newItem.deviceId
            };

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

            fetch(url, opts)
                .then((response) => console.log(response.status))
                .then((res) => {
                    message.success('添加成功');
                    data.splice(index, 1, newItem);
                    this.setState({
                        data: data,
                        isLoading: false,
                        isNew: false,
                        editingKey: ''
                    })
                })
                .catch((err) => {
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

    fetchGetData = () => {
        this.setState({
            isLoading: true
        });
        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/device';
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(url, opts)
            .then((response) => response.json())
            .then((res) => {
                res.map((item, index) => item.key = index);
                this.setState({
                    isLoading: false,
                    count: res.length,
                    data: res
                })
            })
            .catch((err) => {
                message.error('请求数据失败')
            })
    };

    fetchGetUserData = () => {
        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/user';
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        fetch(url, opts)
            .then((response) => response.json())
            .then((res) => {
                const userData = res.map(item => item.username);
                this.setState({
                    userNames: userData
                })
            })
            .catch((err) => {
                message.error('请求数据失败')
            })
    };

    componentDidMount() {
        this.fetchGetData();
        this.fetchGetUserData();
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
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    userNames: this.state.userNames,
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
