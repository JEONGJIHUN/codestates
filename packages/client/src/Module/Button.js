/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
    FaSlash,
    FaCircle,
    FaSquareFull,
    FaDrawPolygon,
    FaArrowLeft
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../less/Drawing.less';

class Button extends Component {
    static propTypes = {
        icons: PropTypes.string.isRequired,
        map: PropTypes.object.isRequired,
        Shape: PropTypes.func.isRequired,
        drewStatus: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            map: props.map, // Set this up as props
            leftClick: undefined,
            rightClick: undefined
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mouseup', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        const { toggle } = this.props;
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (event.button === 2 && toggle !== true) {
                this.setState({ toggle: !toggle });
            }
        }
    }

    drawingComponent = (toggle) => {
        let startPos;
        const naver = window.naver;
        const { map, drewStatus } = this.props;
        const { Shape } = this.props;
        // const { toggle } = this.props;
        // toggle = !toggle;
        console.log('inside drawingComponent: (2)', toggle);

        if (toggle === true) {
            const leftClick = naver.maps.Event.addListener(map, 'click', e => {
                const { coord, offset } = e;
                startPos = { coord, offset };

                naver.maps.Event.removeListener(leftClick);
            });

            const rightClick = naver.maps.Event.addListener(
                map,
                'rightclick',
                e => {
                    drewStatus();
                    const { coord, offset } = e;
                    const endPos = { coord, offset };
                    new Shape({
                        position: { startPos, endPos },
                        naverMap: map,
                        zoom: ''
                    }).setMap(map);

                    naver.maps.Event.removeListener(rightClick);
                }
            );

            this.setState({ rightClick: rightClick });
            this.setState({ leftClick: leftClick });
        }
        // this.setState({ toggle: !toggle }); // Complete shape and turn off toggle
    };

    // toggleState = () => {
    // const { toggle } = this.props;
    //     this.setState({ toggle: true });
    // }

    removeListener = () => {
        const naver = window.naver;
        const { leftClick } = this.state;
        const { rightClick } = this.state;
        naver.maps.Event.removeListener(leftClick);
        naver.maps.Event.removeListener(rightClick);
    }

    createShape = (toggle) => {
        const { map } = this.state;
        // this.toggleState();
        this.drawingComponent(map, toggle);
        this.removeListener();
    };

    render() {
        // const { toggle } = this.state;
        // const btnClass = toggle ? 'lightPurple' : 'darkPurple';
        const { icons, toggle } = this.props;
        const { leftClick, rightClick } = this.state;
        const naver = window.naver;

        console.log('toggle in Button.js: ', toggle + ', icon: ' + icons);
        if (toggle === false) {
            naver.maps.Event.removeListener(leftClick);
            naver.maps.Event.removeListener(rightClick);
        }

        return (
            <div>
                <span
                    role="button"
                    tabIndex="0"
                    className="drawingTools"
                    onClick={() => { this.createShape(toggle); }}
                    onKeyPress={() => { }}
                    ref={this.setWrapperRef}
                >
                    {icons === 'line' ? (
                        <FaSlash className="rotateIcon1" />
                    ) : icons === 'arrow' ? (
                        <FaArrowLeft className="rotateIcon2" />
                    ) : icons === 'square' ? (
                        <FaSquareFull />
                    ) : icons === 'circle' ? (
                        <FaCircle />
                    ) : (<FaDrawPolygon />)}
                </span>
            </div>
        );
    }
}
// <Shape className="rotateIcon1 rotateIcon2" />

// Button.propTypes = {
//     children: PropTypes.element.isRequired
// };

export default Button;
