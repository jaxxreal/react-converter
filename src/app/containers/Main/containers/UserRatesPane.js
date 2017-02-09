import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import { Map, List } from 'immutable';
import _bindAll from 'lodash/bindAll';

import * as MainActionCreators from '../actions';
import arrowLeftIcon from '../../../../assets/icons/arrow_left.svg';
import addIcon from '../../../../assets/icons/add.svg';

// components
import { TopMenu } from '../../../components/TopMenu';
import UserRatesItem from '../components/UserRatesItem';

export class UserRatesPane extends PureComponent {

    constructor(props) {
        super(props);
        _bindAll(this, ['addNewRate']);
    }

    getTopMenu() {
        return {
            left: {
                label: (
                    <span className="btn__content">
                        <svg className="icon icon_arrow-left">
                            <use xlinkHref={ arrowLeftIcon }/>
                        </svg>
                        Back
                    </span>
                ),
                action: () => this.props.setRatesPaneVisibility(false)
            },
            center: {
                label: <span>Rates</span>
            },
            right: {
                label: (
                    <span>
                        <svg className="icon icon_add">
                            <use xlinkHref={ addIcon }/>
                        </svg>
                    </span>
                ),
                action: () => this.props.setRatesFilterPaneVisibility(true)
            }
        };
    }

    addNewRate() {
        this.props.setRatesFilterPaneVisibility(true);
    }

    render() {
        const { isOpen, ratesComparisonList, conversionRates } = this.props;
        const { left, center, right } = this.getTopMenu();
        return (
            <div className={ cx('rates-pane', { 'rates-pane_open': isOpen }) }>
                <TopMenu
                    left={ left }
                    center={ center }
                    right={ right }
                />
                <ul className="rates rates_scroll">
                    { ratesComparisonList.map(base => (
                        base === this.props.base
                            ? null
                            : <UserRatesItem
                                key={ base }
                                baseTo={ base }
                                baseFrom={ this.props.base }
                                rate={ conversionRates.getIn([this.props.base, base], 0) }
                            />
                    )) }
                </ul>
                <div className="rates-pane__footer rates-pane__footer_padded">
                    <button
                        onClick={ this.addNewRate }
                        className="btn btn_outlined btn_rounded btn_transparent btn_uppercase btn_padded"
                    >
                        add new currency
                    </button>
                </div>
            </div>
        );
    }
}

UserRatesPane.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    base: PropTypes.string.isRequired,
    conversionRates: PropTypes.instanceOf(Map).isRequired,
    ratesComparisonList: PropTypes.instanceOf(List).isRequired,

    setRatesPaneVisibility: PropTypes.func.isRequired,
    setRatesFilterPaneVisibility: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        base: state.getIn(['main', 'currencyExchangeFrom']),
        conversionRates: state.getIn(['main', 'conversionRates'], Map()),
        ratesComparisonList: state.getIn(['main', 'ratesComparisonList'], List()),
        isOpen: state.getIn(['main', 'isRatesPaneOpened'])
    }),
    dispatch => bindActionCreators(MainActionCreators, dispatch)
)(UserRatesPane);
