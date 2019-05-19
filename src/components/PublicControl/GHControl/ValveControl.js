import React, { Component } from "react";
import { Card, Radio, message } from "antd";

class Index extends Component {
  handleMotor1Control = value => {
    const { deviceIds } = this.props;
    console.log(deviceIds);
    if (typeof deviceIds === "undefined") {
      return false;
    }
    const actionArray = deviceIds.map(item => {
      return {
        deviceId: item,
        commandtype: "17",
        action: `${value.target.value}`
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

  render() {
    return (
      <Card.Grid style={{ width: "25%", textAlign: "center" }}>
        <p style={{ fontWeight: 500 }}>阀门控制</p>
        <Radio.Group onChange={this.handleMotor1Control}>
          <Radio.Button value="1">打开</Radio.Button>
          <Radio.Button value="0">关闭</Radio.Button>
        </Radio.Group>
      </Card.Grid>
    );
  }
}

export default Index;
