import React, { Component } from 'react';
import './Filter.less';
import PropTypes from 'prop-types';
import FilterBox from './FilterBox';

class Toolbox extends Component {
    static propTypes = {
        check7: PropTypes.func.isRequired,
        _toggle7: PropTypes.func.isRequired,
        factorLoad: PropTypes.func.isRequired
    };

    render() {
        const { check7, factorLoad, _toggle7 } = this.props;
        const factorBox = [
            '상권',
            '재개발/신축',
            '업무지구',
            '교육',
            '주택단지',
            '도로개통/확장',
            '지하철개통',
            '기타'
        ];
        return (
            <div id="filterContainer">
                <div className="filterBox">
                    {factorBox.map((factor, index) => (
                        <FilterBox
                            factorLoad={factorLoad}
                            factor={factor}
                            idx={index}
                            key={factor}
                        />
                    ))}
                </div>

                <div className="buttonBox">
                    <div
                        className="myInfoButton"
                        onClick={_toggle7}
                        onKeyPress={_toggle7}
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
