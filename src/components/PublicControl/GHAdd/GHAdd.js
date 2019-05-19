import React, { Component } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  message,
  Spin,
  Icon
} from "antd";

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  render() {
    const {
      editing,
      dataIndex,
      isRequired,
      title,
      record,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: isRequired,
                        message: `${title}不可为空`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(<Input />)}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "温室编号",
        dataIndex: "greenHouseId",
        editable: false,
        isRequired: true,
        width: "20%"
      },
      {
        title: "名称",
        dataIndex: "name",
        editable: true,
        isRequired: true,
        width: "20%"
      },
      {
        title: "位置",
        dataIndex: "location",
        editable: true,
        isRequired: true,
        width: "20%"
      },
      {
        title: "描述",
        dataIndex: "description",
        editable: true,
        isRequired: false,
        width: "20%"
      },
      {
        title: "操作",
        dataIndex: "operation",
        width: "20%",
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确认取消？"
                    onConfirm={() => this.cancel(record.key)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0);">取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a
                    href="javascript:void(0);"
                    onClick={() => this.edit(record.key)}
                    style={{ marginRight: 8 }}
                  >
                    修改
                  </a>
                  <Popconfirm
                    title="确认删除?"
                    onConfirm={() => this.handleDelete(record.key)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0);">删除</a>
                  </Popconfirm>
                </span>
              )}
            </div>
          );
        }
      }
    ];

    this.fetchGetData = this.fetchGetData.bind(this);

    this.state = {
      data: [],
      Username: window.sessionStorage.getItem("Username"),
      editingKey: "",
      greenHouseNames: [],
      count: "",
      isNew: false,
      isLoading: false
    };
  }

  isEditing = record => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    const { editingKey } = this.state;
    if (editingKey === "") {
      this.setState({
        editingKey: key
      });
    }
  }

  cancel(key) {
    const { isNew, data } = this.state;
    if (isNew) {
      const index = data.findIndex(item => key === item.key);
      data.splice(index, 1);
      this.setState({
        isNew: false,
        data: data,
        editingKey: ""
      });
    } else {
      this.setState({
        editingKey: ""
      });
    }
  }

  handleDelete = key => {
    this.setState({
      isLoading: true
    });
    const { data, greenHouseNames, editingKey } = this.state;
    if (!editingKey === "") {
      message.warning("处于编辑中");
      return false;
    }
    const token = window.sessionStorage.getItem("token");
    const index = data.findIndex(item => key === item.key);
    const item = data[index];
    const greenHouseId = item.greenHouseId;
    const greenHouseName = item.name;

    const url = "https://in.huayuaobo.com:16400/api/greenhouse/" + greenHouseId;
    const opts = {
      method: "DELETE",
      body: JSON.stringify(greenHouseId),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token
      }
    };
    fetch(url, opts)
      .then(response => response.status)
      .then(() => {
        message.success("删除成功");
        const greenHouseNameIndex = greenHouseNames.indexOf(greenHouseName);
        greenHouseNames.splice(greenHouseNameIndex, 1);
        this.setState({
          isLoading: false,
          greenHouseNames: greenHouseNames,
          data: data.filter(item => item.key !== key)
        });
      })
      .catch(() => {
        message.error("删除失败");
        this.setState({
          isLoading: false
        });
      });
  };

  handleAdd = () => {
    const { data, count, editingKey } = this.state;

    if (!editingKey === "") {
      return false;
    }

    const timeId = new Date().getTime().toString();

    const newData = {
      key: count,
      greenHouseId: timeId,
      name: "",
      location: "",
      description: ""
    };

    this.setState({
      editingKey: count,
      count: count + 1,
      isNew: true,
      data: [newData, ...data]
    });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      const { data, isNew, Username, greenHouseNames } = this.state;
      const index = data.findIndex(item => key === item.key);
      const item = data[index];
      const newItem = { ...item, ...row };
      const saveItem = {
        greenHouseId: newItem.greenHouseId,
        name: newItem.name,
        location: newItem.location,
        username: Username,
        description: newItem.description
      };

      if (isNew && greenHouseNames.indexOf(saveItem.name) > -1) {
        message.warning("此大棚名称已经存在，请修改");
        return false;
      }

      const token = window.sessionStorage.getItem("token");
      const url =
        "https://in.huayuaobo.com:16400/api/greenhouse/" + newItem.greenHouseId;
      const opts = {
        method: "PUT",
        body: JSON.stringify(saveItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: "Bearer " + token
        }
      };
      this.setState({
        isLoading: true
      });
      fetch(url, opts)
        .then(response => response.status)
        .then(() => {
          message.success("添加成功");
          data.splice(index, 1, newItem);
          if (isNew) {
            greenHouseNames.push(saveItem.name);
          }
          this.setState({
            data: data,
            isNew: false,
            greenHouseNames: greenHouseNames,
            isLoading: false,
            editingKey: ""
          });
        })
        .catch(() => {
          message.error("添加失败");
          if (isNew) {
            data.splice(index, 1);
            this.setState({
              data: data,
              isNew: false,
              isLoading: false,
              editingKey: ""
            });
          }
        });
    });
  }

  fetchGetData() {
    this.setState({
      isLoading: true
    });
    const token = window.sessionStorage.getItem("token");
    const url = "https://in.huayuaobo.com:16400/api/greenhouse";
    const opts = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token
      }
    };

    fetch(url, opts)
      .then(response => response.json())
      .then(responseText => {
        if (responseText) {
          responseText.map((item, index) => (item.key = index));
          const greenHouseNames = responseText.map(item => item.name);
          this.setState({
            count: responseText.length,
            isLoading: false,
            greenHouseNames: greenHouseNames,
            data: responseText
          });
        }
      })
      .catch(() => {
        message.error("获取信息失败");
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.fetchGetData();
  }

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
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
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          className="add-row-button"
        >
          <Icon type="plus-circle" />
          新增温室
        </Button>
        <Spin spinning={this.state.isLoading}>
          <Table
            components={components}
            rowClassName="editable-row"
            bordered
            dataSource={this.state.data}
            columns={columns}
          />
        </Spin>
      </div>
    );
  }
}

export default EditableTable;
