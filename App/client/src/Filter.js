import React, { Component } from 'react';
import './Filter.less';
import PropTypes from 'prop-types';

class Toolbox extends Component {
    static propTypes = {
        bound: PropTypes.object.isRequired,
        mapLoad: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        drawList: PropTypes.object.isRequired
    };

    // state = {
    //     check7: false,
    //     factorArray: []
    // };

    // _toggle7 = () => {
    //     const { check7 } = this.state;
    //     this.setState({ check7: !check7 });
    // };

    // styleToggle = check => {
    //     const obj = {};
    //     if (check) {
    //         obj.color = '#4d55b2';
    //         obj['border-bottom'] = '2px solid #aaa';
    //     } else {
    //         obj.color = '#333';
    //         obj['border-bottom'] = 'none';
    //     }
    //     return obj;
    // };

    render() {
        const {
            // bound,
            // mapLoad,
            // name,
            // drawList,
            // DataDelete,
            check7,
            // factorArray,
            // _toggle7,
            // styleToggle,
            factorLoad
        } = this.props;
        const factorBox = [
            '상권형성',
            '재건축',
            '공공기관/문화/대형병원',
            '도로개통/확장',
            '지하철개통',
            '기타'
        ];
        return (
            <div id="filterContainer">
                <div className="filterBox">
                    {factorBox.map((factor, i) => {
                        return (
                            <div
                                className="filterBtn"
                                onClick={() => factorLoad(factor)}
                                onKeyPress={() => {}}
                                role="button"
                                tabIndex="0"
                                key={factor}
                                // style={() => styleToggle(check7())}
                            >
                                {'# '}
                                {factor}
                            </div>
                        );
                    })}
                </div>

                <div className="buttonBox">
                    <div
                        className="myInfoButton"
                        onClick={this._toggle7}
                        onKeyPress={this._toggle7}
                        role="button"
                        tabIndex="0"
                        style={{
                            color: check7 ? '#fff' : '#4d55b2',
                            backgroundColor: check7 ? '#4d55b2' : '#fff'
                        }}
                    >
                        내 정보 보기
                    </div>
                </div>
            </div>
        );
    }
}

export default Toolbox;
