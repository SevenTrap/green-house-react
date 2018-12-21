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
            rainIds: this.props.rainIds
        }
    }

    //判断输入框的类型
    getInput = () => {
        if (this.props.dataIndex === 'rainId') {
            return (
                <AutoComplete
                    dataSource={this.state.rainIds}
                    style={{width: '100%'}}
                    onSearch={this.handleUserNameSearch}
                    placeholder='请选择雨量'
                />
            )
        } else {
            return <Input/>
        }
    };
    handleUserNameSearch = (value) => {
        const {rainIds} = this.props;
        const newRainIds = rainIds.filter(item => (item.indexOf(value) > -1) ? item : null);
        this.setState({
            rainIds: newRainIds
        })
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            isRequired,
            record,
            rainIds,
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
                title: '控制器ID',
                dataIndex: 'deviceId',
                editable: false,
                isRequired: true,
                width: '20%',
            }, {
                title: '雨量设备ID',
                dataIndex: 'rainId',
                editable: true,
                isRequired: false,
                width: '20%'
            }, {
                title: '控制器安装位置',
                dataIndex: 'location',
                editable: true,
                isRequired: false,
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
            rainIds: [],
            editingKey: '',
            isLoading: true
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

    cancel() {
        this.setState({
            editingKey: ''
        })
    }

    save(form, key) {
        form.validateFields((error, row) => {
            const {data, rainIds} = this.state;
            const index = data.findIndex(item => key === item.key);
            const item = data[index];
            const newItem = {...item, ...row};
            const saveItem = {
                username: newItem.username,
                deviceId: newItem.deviceId,
                location: newItem.location,
                rainId: newItem.rainId,
                description: newItem.description
            };
            const rainId = saveItem.rainId;
            if (rainId !== "" && rainIds.indexOf(rainId) === -1) {
                message.warning('此雨量设备不存在');
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
                    this.setState({
                        data: data,
                        isLoading: false,
                        editingKey: ''
                    })
                })
                .catch(() => {
                    message.error('添加失败,请重新保存');
                    this.setState({
                        isLoading: false
                    })
                });
        })
    };

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        const urlGetData = 'http://47.92.206.44:80/api/device';
        const urlGetUser = 'http://47.92.206.44:80/api/raininfo';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };

        const fetchGetData = new Promise((resolve, reject) => {
            fetch(urlGetData, options)
                .then(response => response.json())
                .then(responseText => resolve(responseText))
                .catch(error => reject(error))
        });
        const fetchGetRainIDData = new Promise((resolve, reject) => {
            fetch(urlGetUser, options)
                .then(response => response.json())
                .then(responseText => resolve(responseText))
                .catch(error => reject(error))
        });
        Promise.all([fetchGetData, fetchGetRainIDData])
            .then(result => {
                result[0].map((item, index) => item.key = index);
                const rainIds = result[1].map(item => item.rainId);
                this.setState({
                    data: result[0],
                    rainIds: rainIds,
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
        const {rainIds} = this.state;
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
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    rainIds: rainIds,
                    isRequired: col.isRequired,
                    editing: this.isEditing(record)
                })
            }
        });

        return (
            <Spin spinning={this.state.isLoading}>
                <Table
                    components={components}
                    rowClassName='editable-row'
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                />
            </Spin>
        )
    }
}

export default EditableTable;
