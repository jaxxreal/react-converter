import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import { Map } from 'immutable';
// import _bindAll from 'lodash/bindAll';

import * as MainActionCreators from '../actions';
import CURRENCIES from '../../../currencies.json';
import arrowLeftIcon from '../../../../assets/icons/arrow_left.svg';
import addIcon from '../../../../assets/icons/add.svg';

// components
import { TopMenu } from '../../../components/TopMenu';

export class Rates extends PureComponent {

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
                )
            }
        };
    }

    render() {
        const { rates, isOpen } = this.props;
        const { left, center, right } = this.getTopMenu();
        return (
            <div className={ cx('rates-pane', { 'rates-pane_open': isOpen }) }>
                <TopMenu
                    left={ left }
                    center={ center }
                    right={ right }
                />
                <ul className="rates">
                    { rates.map(([base, rate]) => (
                        base === this.props.base
                            ? null
                            :
                            <li key={ rate } className="rates__item">
                                <span className="rates__base">1{ this.props.base }</span>
                                <div className="rates__rate">
                                    <div className="rates__rate-cost">
                                        <span className="rates__rate-cost-hundredth">
                                            { rate.toFixed(2) }
                                        </span>
                                        <span className="rates__rate-cost-thousandth">
                                            { rate.toFixed(4).substr(-2, 2) }
                                        </span>
                                    </div>
                                    <div className="rates__rate-desc">
                                        { CURRENCIES[base] }
                                    </div>
                                </div>
                            </li>
                    )) }
                </ul>
                <div className="rates-pane__footer rates-pane__footer_padded">
                    <button className="btn btn_outlined btn_rounded btn_transparent btn_uppercase btn_padded">
                        add new currency
                    </button>
                </div>
            </div>
        );
    }
}

Rates.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    base: PropTypes.string.isRequired,
    rates: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired,

    setRatesPaneVisibility: PropTypes.func.isRequired,
};

export default connect(
    state => {
        const base = state.getIn(['main', 'currencyExchangeFrom']);
        const [...rates] = state.getIn(['main', 'conversionRates', base], Map()).entries();
        return {
            base,
            rates,
            isOpen: state.getIn(['main', 'isRatesPaneOpened'])
        };
    },
    dispatch => bindActionCreators(MainActionCreators, dispatch)
)(Rates);
