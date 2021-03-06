import React, { Component } from "react";
import { Card, Input, message, Row, Col, Icon, Button } from "antd";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motor1AllTime: "",
      motor1AllTimeBoole: false,
      motor2AllTime: "",
      motor2AllTimeBoole: false
    };
  }

  handleClick = () => {
    const {
      motor1AllTime,
      motor2AllTime,
      motor1AllTimeBoole,
      motor2AllTimeBoole
    } = this.state;
    const { deviceIds } = this.props;
    let temp1 = Number(motor1AllTime) * 10;
    let temp2 = Number(motor2AllTime) * 10;
    if (!motor1AllTimeBoole || !motor2AllTimeBoole) {
      message.error("请输入正确的参数");
      return false;
    }
    if (temp1 <= temp2) {
      message.error("温度上限应大于温度下限");
      return false;
    }
    if (typeof deviceIds === "undefined") {
      return false;
    }
    const actionArray = deviceIds.map(item => {
      return {
        deviceId: item,
        commandtype: "08",
        action: `1 ${temp1} ${temp2} ${temp1} ${temp2}`
      };
    });
    console.log(actionArray);
    const token = window.sessionStorage.getItem("token");
    const urlAction = "https://in.huayuaobo.com:16400/api/action";
    let options = {
      method: "POST",
      body: JSON.stringify(actionArray),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token
      }
    };
    fetch(urlAction, options)
      .then(response => response.status)
      .then(status => {
        console.log(status);
        message.success("命令下发成功");
      })
      .catch(() => {
        message.error("命令下发失败");
      });
  };

  handleInput1Change = e => {
    const value = e.target.value;
    const valueReg = new RegExp(/^([0-9]|[1-5][0-9]|60)$/);
    let motor1AllTimeBoole = false;
    if (valueReg.test(value)) {
      motor1AllTimeBoole = true;
    }
    this.setState({
      motor1AllTime: value,
      motor1AllTimeBoole: motor1AllTimeBoole
    });
  };
  handleInput2Change = e => {
    const value = e.target.value;
    const valueReg = new RegExp(/^([0-9]|[1-5][0-9]|60)$/);
    let motor2AllTimeBoole = false;
    if (valueReg.test(value)) {
      motor2AllTimeBoole = true;
    }
    this.setState({
      motor2AllTime: value,
      motor2AllTimeBoole: motor2AllTimeBoole
    });
  };

  render() {
    const {
      motor1AllTime,
      motor2AllTime,
      motor1AllTimeBoole,
      motor2AllTimeBoole
    } = this.state;
    const suffix1 = motor1AllTimeBoole ? (
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
    ) : (
      <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
    );
    const suffix2 = motor2AllTimeBoole ? (
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
    ) : (
      <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
    );
    return (
      <Card.Grid style={{ width: "50%", textAlign: "center" }}>
        <Row gutter={24}>
          <Col span={12} style={{ textAlign: "left" }}>
            <strong>温度阈值(单位：摄氏度)</strong>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={this.handleClick}>
              提交
            </Button>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Input
              addonBefore="温度上限"
              placeholder="0～60"
              suffix={suffix1}
              value={motor1AllTime}
              onChange={this.handleInput1Change}
            />
          </Col>
          <Col span={12}>
            <Input
              addonBefore="温度下限"
              placeholder="0～60"
              suffix={suffix2}
              value={motor2AllTime}
              onChange={this.handleInput2Change}
            />
          </Col>
        </Row>
      </Card.Grid>
    );
  }
}

export default Index;
