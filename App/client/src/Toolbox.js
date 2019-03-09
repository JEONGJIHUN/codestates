import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Filter from './Filter';
import Drawing from './Drawing';
import './Toolbox.less';

class Toolbox extends Component {
    static propTypes = {
        drawingData: PropTypes.array.isRequired,
        mapLoad: PropTypes.object.isRequired,
        check7: PropTypes.func.isRequired,
        _toggle7: PropTypes.func.isRequired,
        factorLoad: PropTypes.func.isRequired
    };

    state = {
        onFilter: true,
        onDrawing: false,
        backgroundBlueForFilterTab: '#4d55b2',
        backgroundBlueForDrawingTab: '#ffffff',
        filterColor: '#fff',
        drawingColor: '#333'
    };

    handleOnFilter = value => {
        this.setState({
            onDrawing: false,
            onFilter: value,
            backgroundBlueForFilterTab: '#4d55b2',
            backgroundBlueForDrawingTab: '#fff',
            filterColor: '#fff',
            drawingColor: '#333'
        });
    };

    handleOnDrawing = value => {
        this.setState({
            onFilter: false,
            onDrawing: value,
            backgroundBlueForFilterTab: '#fff',
            backgroundBlueForDrawingTab: '#4d55b2',
            filterColor: '#333',
            drawingColor: '#fff'
        });
    };

    render() {
        const {
            drawingData,
            mapLoad,
            check7,
            _toggle7,
            factorLoad
        } = this.props;
        const {
            backgroundBlueForFilterTab,
            backgroundBlueForDrawingTab,
            onFilter,
            onDrawing,
            filterColor,
            drawingColor
        } = this.state;
        return (
            <div id="toolbox">
                <div id="tabMenu">
                    <div
                        className="eachTabMenu"
                        style={{
                            backgroundColor: backgroundBlueForFilterTab,
                            color: filterColor
                        }}
                        onClick={() => {
                            this.handleOnFilter(true);
                        }}
                        onKeyPress={() => {}}
                        role="button"
                        tabIndex="0"
                    >
                        {`필터`}
                    </div>
                    <div
                        className="eachTabMenu drawing"
                        style={{
                            backgroundColor: backgroundBlueForDrawingTab,
                            color: drawingColor
                        }}
                        onClick={() => {
                            this.handleOnDrawing(true);
                        }}
                        onKeyPress={() => {}}
                        role="button"
                        tabIndex="0"
                    >
                        {`그리기`}
                    </div>
                </div>
                <div>
                    {onFilter ? (
                        <Filter
                            check7={check7}
                            _toggle7={_toggle7}
                            factorLoad={factorLoad}
                        />
                    ) : null}
                    {onDrawing ? (
                        <Drawing map={mapLoad} drawingData={drawingData} />
                    ) : null}
                </div>
            </div>
        );
    }
}

export default Toolbox;
