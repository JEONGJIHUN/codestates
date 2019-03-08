import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import Toolbox from './Toolbox';
import LoginModal from './LoginModal';
import NearbyList from './NearbyList';
import './App.less';
import Circle from './CustomOverlay/Circle';

class App extends Component {
    constructor(props) {
        super(props);
        // this.drawList = {};
        this.state = {
            name: undefined,
            factor: undefined,
            drawingData: [],
            showFilterDrawingTool: false,
            showModal: false,
            bound: undefined,
            mapLoad: undefined,
            drawList: {},
            check7: false,
            factorArray: []
        };
    }

    componentDidMount = async () => {
        const naver = window.naver;
        const map = await new naver.maps.Map(
            d3.select('#map').node(),
            this.mapOption()
        );

        this.setState({ mapLoad: map, bound: map.getBounds() });
        this.mainPageLoad(map);

        naver.maps.Event.addListener(map, 'idle', e => {
            this.setState({ bound: map.getBounds() });
            this.mainPageLoad(map);
            this.DataDelete();
        });
    };

    mapOption = () => {
        const naver = window.naver;
        const mapOptions = {
            zoomControl: true,
            zoomControlOptions: {
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.LEFT_BOTTOM
            },
            logoControl: true,
            logoControlOptions: {
                position: naver.maps.Position.BOTTOM_RIGHT
            },
            scaleControl: true,
            scaleControlOptions: {
                position: naver.maps.Position.BOTTOM_RIGHT
            },
            mapDataControl: true,
            mapDataControlOptions: {
                position: naver.maps.Position.BOTTOM_RIGHT
            }
        };
        return mapOptions;
    };

    mainPageLoad = map => {
        const { name, factor, bound, drawList } = this.state;
        axios
            .post('http://127.0.0.1:3001/user/load', {
                name,
                factor,
                bound
            })
            .then(async result => {
                const data = result.data;
                const resultData = await data[0];
                // eslint-disable-next-line no-unused-vars
                const userData = await data[1];
                // if there is user data

                const tempDrawList = { ...drawList };

                if (result.status === 200 || result.status === 201) {
                    resultData.map(el => {
                        const { startPos, endPos, zoomLevel } = JSON.parse(
                            el.figures
                        );

                        if (!(el.id in drawList)) {
                            const overlay = new Circle({
                                position: { startPos, endPos },
                                naverMap: map,
                                zoom: zoomLevel
                            });
                            overlay.setMap(map);
                            tempDrawList[el.id] = overlay;
                        }
                        this.setState({
                            drawList: {
                                ...tempDrawList
                            }
                        });
                    });
                } else if (result.status === 204) {
                    alert('호재 데이터 정보 없음');
                }
            })
            .catch(error => {
                // if (error.response.status === 500) {
                //     console.log(error);
                //     alert('load fail');
                // } else {
                //     console.log(error);
                //     alert('error!');
                // }
                alert(error);
            });
    };

    DataDelete = () => {
        const { drawList, bound } = this.state;
        Object.entries(drawList).forEach(([key, value]) => {
            const position = {};
            // reference point
            position.x = (value._startPos.coord.x + value._endPos.coord.x) / 2;
            position.y = (value._startPos.coord.y + value._endPos.coord.y) / 2;

            if (
                position.y < bound._min._lat - 0.01
                || position.y > bound._max._lat + 0.01
                || position.x < bound._min._lng - 0.01
                || position.x > bound._max._lng + 0.01
            ) {
                value.setMap(null);
                delete drawList[key];
            }
        });
    };

    _toggle7 = () => {
        const { check7 } = this.state;
        this.setState({ check7: !check7 });
        return check7;
    };

    styleToggle = check => {
        const obj = {};
        if (check) {
            obj.color = '#4d55b2';
            obj['border-bottom'] = '2px solid #aaa';
        } else {
            obj.color = '#333';
            obj['border-bottom'] = 'none';
        }
        return obj;
    };

    factorLoad = factor => {
        const { factorArray, name, drawList, mapLoad, bound } = this.state;
        let tempDrawList = {};
        this.setState({ drawList: { ...tempDrawList } });
        Object.entries(drawList).forEach(([key, value]) => {
            value.setMap(null);
            delete drawList[key];
        });
        // console.log(drawList);
        if (!factorArray.includes(factor)) {
            this.setState({ factorArray: [...factorArray, factor] });
        }
        console.log(factorArray);
        axios
            .post('http://127.0.0.1:3001/user/load', {
                name,
                bound,
                factor
            })
            .then(async result => {
                const data = await result.data;
                // console.log(data);
                const resultData = await data[0];
                // const userData = await data[1];
                tempDrawList = { ...drawList };
                if (result.status === 200 || result.status === 201) {
                    resultData.map(async el => {
                        const { startPos, endPos, zoomLevel } = JSON.parse(
                            el.figures
                        );
                        if (!(el.id in drawList)) {
                            const overlay = new Circle({
                                position: { startPos, endPos },
                                naverMap: mapLoad,
                                zoom: zoomLevel
                            });
                            overlay.setMap(mapLoad);
                            tempDrawList[el.id] = overlay;
                        }
                        await this.setState({
                            drawList: { ...tempDrawList }
                        });
                    });
                } else if (result.status === 204) {
                    alert('호재 데이터 정보 없음');
                }
            })
            .catch(error => {
                alert(error);
            });
    };

    showFilterDrawingTool = () => {
        const { showFilterDrawingTool } = this.state;
        this.setState({ showFilterDrawingTool: !showFilterDrawingTool });
    };

    showModal = () => {
        const { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    render() {
        const {
            mapLoad,
            drawingData,
            showFilterDrawingTool,
            showModal,
            bound,
            name,
            factor,
            drawList,
            check7,
            factorArray
        } = this.state;
        return (
            <div id="wrapper">
                <div id="map">
                    <NearbyList map={mapLoad} />
                    <ul id="loginFavorContainer">
                        <div
                            className="loginFavorBtn"
                            onClick={this.showModal}
                            onKeyPress={this.showModal}
                            role="button"
                            tabIndex="0"
                        >
                            {`My`}
                        </div>
                        <div
                            className="loginFavorBtn"
                            onClick={this.showFilterDrawingTool}
                            onKeyPress={this.showFilterDrawingTool}
                            role="button"
                            tabIndex="0"
                        >
                            {`호재`}
                        </div>
                    </ul>
                    {showModal ? (
                        <LoginModal showModal={this.showModal} />
                    ) : null}
                    {showFilterDrawingTool ? (
                        <Toolbox
                            mapLoad={mapLoad}
                            drawingData={drawingData}
                            bound={bound}
                            name={name}
                            factor={factor}
                            drawList={drawList}
                            DataDelete={this.DataDelete}
                            check7={check7}
                            factorArray={factorArray}
                            _toggle7={this._toggle7}
                            styleToggle={this.styleToggle}
                            factorLoad={this.factorLoad}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}

export default App;
