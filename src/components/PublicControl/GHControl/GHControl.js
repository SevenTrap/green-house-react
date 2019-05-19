import React, { Component } from "react";
import { Spin, message, Row, Card } from "antd";
import Motor1Control from "./Motor1Control";
import Motor2Control from "./Motor2Control";
import TotalTime from "./TotalTime";
import TempSetting from "./TempSetting";
import ValveFan from "./ValveFan";
import TimeOut from "./TimeOut";
import Clock from "./Clock";
import OverCurrent from "./OverCurrent";
import OpenTime from "./OpenTime";
import FanControl from "./FanControl";
import ValveControl from "./ValveControl";
import Remote from "./Remote";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deviceIds: []
    };
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    const urlDevice = "https://in.huayuaobo.com:16400/api/device";
    const opts = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "Bearer " + token
      }
    };

    fetch(urlDevice, opts)
      .then(response => response.json())
      .then(res => {
        console.log(res);

        const deviceIds = res.map(item => item.deviceId);
        this.setState({
          isLoading: false,
          deviceIds: deviceIds
        });
      })
      .catch(() => {
        message.error("网络异常，请重新刷新页面");
        this.setState({
          isLoading: false
        });
      });
  }
  render() {
    const { deviceIds, isLoading } = this.state;
    return (
      <Spin spinning={isLoading}>
        <Row gutter={24}>
          <Card title="园区一键控制">
            <Motor1Control deviceIds={deviceIds} />
            <Motor2Control deviceIds={deviceIds} />
            <ValveControl deviceIds={deviceIds} />
            <FanControl deviceIds={deviceIds} />
            <Remote deviceIds={deviceIds} />
            <Clock deviceIds={deviceIds} />
            <TimeOut deviceIds={deviceIds} />
            {/*<TotalTime deviceIds={deviceIds}/>*/}
            <OverCurrent deviceIds={deviceIds} />
            <TempSetting deviceIds={deviceIds} />
            <OpenTime deviceIds={deviceIds} />
            <ValveFan deviceIds={deviceIds} />
          </Card>
        </Row>
      </Spin>
    );
  }
}

export default Index;
