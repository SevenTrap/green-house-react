import React, {Component} from 'react';
import {Table, Input, Button, Popconfirm, Form, Icon} from 'antd';

/*测试数据，上线之前需要删除*/
const dataSource = [];
for (let i = 0; i < 100; i++) {
    dataSource.push({
        key: i.toString(),
        name: `Order${i}`,
        username: `admin${i}`,
        password: '123456',
        contact: '18692907545',
        address: `北京林业大学${i}`
    })
}

/*给a标签添加一个空的url，避免报错*/
const nullUrl = 'javascript: void(0)';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props}/>
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    render() {
        const {
            editing,
            dataIndex,
            title,
            record,
            index,
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
                                            message: `${title} is required.`,
                                        }],
                                        initialValue: record[dataIndex]
                                    })(<Input/>)}
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
                title: '姓名',
                dataIndex: 'name',
                editable: true,
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="Search name"
                            value={selectedKeys[0]}
                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={this.handleSearch(selectedKeys, confirm)}
                        />
                        <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>
                            Search
                        </Button>
                        <Button onClick={this.handleReset(clearFilters)}>
                            Reset
                        </Button>
                    </div>
                ),
                filterIcon: filtered => <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa', fontSize: '16px'}}/>,
                onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus()
                        })
                    }
                },
                render: (text) => {
                    const {searchText} = this.state;
                    return searchText ? (
                        <span>
                            {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                                fragment.toLowerCase() === searchText.toLowerCase()
                                    ? <span key={i} className="hightlight">{fragment}</span> : fragment
                            ))}
                        </span>
                    ) : text;

                }
            }, {
                title: '用户名',
                dataIndex: 'username',
                editable: true
            }, {
                title: '订单数量',
                dataIndex: 'password',
                editable: true
            }, {
                title: '联系方式',
                dataIndex: 'contact',
                editable: true
            },
            {
                title: '通信地址',
                dataIndex: 'address',
                editable: true
            }, {
                title: '操作',
                dataIndex: 'operation',
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
                                                    href={nullUrl}
                                                    onClick={() => this.save(form, record.key)}
                                                    style={{marginRight: 8}}
                                                >
                                                    存储
                                                </a>
                                            )}
                                        </EditableContext.Consumer>
                                        <Popconfirm
                                            title="确认取消？"
                                            onConfirm={() => this.cancel(record.key)}
                                        >
                                            <a href={nullUrl}>取消</a>
                                        </Popconfirm>
                                    </span>
                                ) : (
                                    <span>
                                    <a
                                        href={nullUrl}
                                        onClick={() => this.edit(record.key)}
                                        style={{marginRight: 8}}
                                    >
                                        修改
                                    </a>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.key)}
                                    >
                                        <a href={nullUrl}>删除</a>
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
            data: dataSource,
            count: 1000,
            editingKey: '',
            searchKey: ''
        }
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey;
    };

    edit(key) {
        this.setState({
            editingKey: key
        })
    }

    cancel() {
        this.setState({
            editingKey: ''
        })
    }

    handleSearch = (searchKeys, confirm) => () => {
        confirm();
        this.setState({searchKey: searchKeys[0]})
    };

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({
            searchKey: ''
        })
    };

    handleDelete = (key) => {
        const data = [...this.state.data];
        this.setState({
            data: data.filter(item => item.key !== key)
        })
    };

    handleAdd = () => {
        const {count, data} = this.state;
        const newData = {
            key: count.toString(),
            name: `用户名${count}`,
            username: `admin${count}`,
            password: '123456',
            contact: '12345678910',
            address: `北京林业大学${count}`
        };

        this.setState({
            data: [newData, ...data],
            count: count + 1
        })
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }

            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });

                this.setState({
                    data: newData,
                    editingKey: ''
                })
            } else {
                newData.push(row);
                this.setState({
                    data: newData,
                    editingKey: ''
                })
            }
        })
    };

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
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            }
        });

        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" className='add-row-button'>
                    <Icon type="plus-circle"/>新增订单
                </Button>
                <Table
                    components={components}
                    rowClassName='editable-row'
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                />
            </div>
        )
    }
}

export default EditableTable;
