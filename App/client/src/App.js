/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
// import Toolbox from './Toolbox';
import CustomOverlay from './CustomOverlay';
import './App.less';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // mapLoad: undefined,
            name: 'jihun',
            factor: '',

            map: undefined, // Will set state to naver map instance
            circleToggle: true, // Indicates whether to create circle
            naver: undefined, // Will set state to window.naver

            leftClick: undefined, // Will set state to leftClick listener
            rightClick: undefined, // Will set state to rightClick listener

            toggleColor: true

            // mouseEvent: undefined, // Will set mouse event here from listener
        };

        this.mainPageLoad = this.mainPageLoad.bind(this);
    }

    componentDidMount() {
        const naver = window.naver;
        const map = new naver.maps.Map(
            d3.select('#map').node(),
            this.mapOption()
        );
        // this.drawingComponent();

        this.setState({ map: map });
        // this.setState({ naver: naver });

        this.mainPageLoad(map);
    }

    drawingComponent = () => {
        let startPos;
        const naver = window.naver;
        console.log('naver ', naver);
        const { map } = this.state;
        console.log('map ', map);
        const { circleToggle } = this.state;

        if (circleToggle === true) {
            const leftClick = naver.maps.Event.addListener(map, 'click', e => {
                console.log('click');
                // coord: lat, lng of map
                // offset: x, y of screen
                const { coord, offset } = e;
                startPos = { coord, offset };

                naver.maps.Event.removeListener(leftClick);
            });

            const rightClick = naver.maps.Event.addListener(map, 'rightclick', e => {
                console.log('right click');
                const { coord, offset } = e;
                const endPos = { coord, offset };
                new CustomOverlay({
                    position: { startPos, endPos },
                    naverMap: map
                }).setMap(map);

                naver.maps.Event.removeListener(rightClick);
            });

            this.setState({ rightClick: rightClick });
            this.setState({ leftClick: leftClick });
        }
        this.setState({ circleToggle: !circleToggle }); // Complete shape and turn off toggle
    };

    ellipseState() {
        const { circleToggle } = this.state;
        this.setState({ circleToggle: !circleToggle });
    }

    removeListener() {
        const naver = window.naver;
        const { leftClick } = this.state;
        const { rightClick } = this.state;
        naver.maps.Event.removeListener(leftClick);
        naver.maps.Event.removeListener(rightClick);
    }

    changeColor() {
        const { toggleColor } = this.state;
        this.setState({ toggleColor: !toggleColor });
    }

    circleToggleAndEllipseAndChangeColor = () => {
        this.changeColor();
        this.drawingComponent();
        this.ellipseState();
        this.removeListener();
    }

    mapOption = () => {
        const naver = window.naver;
        const mapOptions = {
            zoomControl: true,
            zoomControlOptions: {
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.TOP_RIGHT
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
                position: naver.maps.Position.BOTTOM_LEFT
            }
        };
        return mapOptions;
    };

    mainPageLoad = (map) => {
        const { name, factor } = this.state;
        // const { map } = this.state;
        console.log(this.state);
        console.log('inside mainPageLoad: ', map);
        axios
            .post('http://127.0.0.1:3001/user/load', {
                name,
                factor
            })
            .then(async result => {
                const resultData = await result.data;
                if (result.status === 200 || result.status === 201) {
                    resultData.map(el => {
                        const parseFigures = JSON.parse(el.figures);
                        const startPos = parseFigures.startPos;
                        const endPos = parseFigures.endPos;
                        return new CustomOverlay({
                            position: { startPos, endPos },
                            naverMap: map
                        }).setMap(map);
                    });
                } else if (result.status === 204) {
                    alert('호재 데이터 정보 없음');
                }
            })
            .catch(error => {
                if (error.response.status === 500) {
                    console.log(error);
                    alert('load fail');
                } else {
                    alert('error!');
                }
            });
    };

    render() {
        const { map } = this.state;
        console.log(map);
        // const { mapLoad } = this.state;
        const { toggleColor } = this.state;
        const btnClass = toggleColor ? 'lightPurple' : 'darkPurple';
        return (
            <div id="wrapper">
                <div id="map">
                    {/* <Toolbox mapLoad={mapLoad} /> */}
                </div>
                <button type="button" className={btnClass} onClick={this.circleToggleAndEllipseAndChangeColor}>Circle</button>
            </div>
        );
    }
}

export default App;
