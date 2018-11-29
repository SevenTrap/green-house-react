import React, {Component} from 'react';
import {Collapse, Spin} from 'antd';
import GHAction from './GHAction';

const Panel = Collapse.Panel;

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            greenHouse: [],
            panelKey: ''
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });
        const token = window.sessionStorage.getItem('token');
        const url = 'http://47.92.206.44:80/api/greenhouse';
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        };
        fetch(url, opts)
            .then(response => response.json())
            .then((res) => {
                this.setState({
                    isLoading: false,
                    greenHouse: res
                });
            })
            .catch(error => console.error(error))

    }

    render() {
        const {greenHouse} = this.state;
        if (greenHouse.length === 0) {
            return '此用户暂无任何大棚信息';

        }
        return (
            <Spin spinning={this.state.isLoading}>
                <Collapse accordion>
                    {greenHouse.map(item => {
                        return (
                            <Panel key={item.greenHouseId} header={`大棚基本信息：${item.name} | ${item.location} | ${item.description}`}>
                                <GHAction greenHouseId={item.greenHouseId}/>
                            </Panel>
                        )
                    })}
                </Collapse>
            </Spin>
        )
    }
}

export default Index;
