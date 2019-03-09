import React, { Component } from 'react';
import './Filter.less';
import PropTypes from 'prop-types';

class FilterBox extends Component {
    static propTypes = {
        factor: PropTypes.string.isRequired,
        factorLoad: PropTypes.func.isRequired
    };

    render() {
        const { factor, factorLoad } = this.props;
        return (
            <div
                className="filterBtn"
                onClick={() => factorLoad(factor)}
                onKeyPress={() => factorLoad(factor)}
                role="button"
                tabIndex="0"
            >
                #
                {' '}
                {factor}
            </div>
        );
    }
}

export default FilterBox;
