import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import { List, Map } from 'immutable';
import _bindAll from 'lodash/bindAll';
import _capitalize from 'lodash/capitalize';
import ReactSwipe from 'react-swipe';

import * as MainActionCreators from '../actions';
import { ExchangeDirection } from '../constants';
import { getAmount } from '../reducer';

import { TopMenu } from '../../../components/TopMenu';
import { CarouselProgress } from '../../../components/CarouselProgress';
import { Currency } from '../components/Currency';

export class ExchangePane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fromBaseIdx: 0,
            toBaseIdx: 0
        };
        _bindAll(this, ['selectFromBase', 'selectToBase', 'setExchangeAmount']);
    }

    getCurrencySelect() {
        const { accounts, conversionRates } = this.props;
        const { fromBaseIdx, toBaseIdx } = this.state;
        const fromBase = accounts.getIn([fromBaseIdx, 'base']);
        const fromSign = accounts.getIn([fromBaseIdx, 'sign']);

        const toBase = accounts.getIn([toBaseIdx, 'base']);
        const toSign = accounts.getIn([toBaseIdx, 'sign']);

        const rate = (conversionRates.getIn([fromBase, toBase], 0)).toFixed(4);

        return (
            <button className="btn btn_outlined btn_rounded top-menu__control" name="currency-select">
                { `${fromSign}1 = ${toSign}${rate}` }
            </button>
        );
    }

    getSwipeOptions(direction) {
        return {
            callback: this[`select${_capitalize(direction)}Base`],
        };
    }

    getTopMenuConfig() {
        return {
            left: {
                label: 'Cancel',
                action: () => this.props.setExchangePaneVisibility(false)
            },
            center: {
                label: this.getCurrencySelect(),
                action: () => this.props.setRatesPaneVisibility(true)
            },
            right: {
                label: 'Exchange',
                action: this.props.exchangeAmountFrom ? this.props.exchangeCurrency : () => {}
            }
        };
    }

    setExchangeAmount(ev) {
        const { value } = ev.target;
        this.props.setExchangeAmount({ amount: value });
    }

    getExchangeRate() {
        const { accounts, conversionRates } = this.props;
        const fromBase = accounts.getIn([this.state.fromBaseIdx, 'base']);
        const fromSign = accounts.getIn([this.state.fromBaseIdx, 'sign']);
        const toBase = accounts.getIn([this.state.toBaseIdx, 'base']);

        return `${fromSign}${(conversionRates.getIn([fromBase, toBase], 0)).toFixed(2)}`;
    }

    redoConvertion() {
        this.setExchangeAmount({ target: { value: this.props.exchangeAmountFrom } });
    }

    selectFromBase(fromBaseIdx) {
        const { accounts } = this.props;
        this.props.setCurrencyExchangeFrom(accounts.getIn([fromBaseIdx, 'base']));
        this.setState({ fromBaseIdx }, () => this.redoConvertion());
    }

    selectToBase(toBaseIdx) {
        const { accounts } = this.props;
        this.props.setCurrencyExchangeTo(accounts.getIn([toBaseIdx, 'base']));
        this.setState({ toBaseIdx }, () => this.redoConvertion());
    }

    render() {
        const { isOpen, accounts, exchangeAmountTo, exchangeAmountFrom } = this.props;
        const { fromBaseIdx, toBaseIdx } = this.state;
        const { left, center, right } = this.getTopMenuConfig();

        return (
            <div className={ cx('exchanger-pane', { 'exchanger-pane_open': isOpen }) }>
                <TopMenu
                    left={ left }
                    center={ center }
                    right={ right }
                />
                <div className="exchanger-pane__content">
                    <div className="exchanger-pane__content-item">
                        <ReactSwipe
                            className="exchanger-pane__carousel"
                            swipeOptions={ this.getSwipeOptions('from') }
                        >
                            { accounts.map(acc => (
                                <div
                                    key={ acc.get('base') }
                                    className="exchanger-pane__carousel-item"
                                >
                                    <Currency
                                        onChangeExchangeAmount={ this.setExchangeAmount }
                                        exchangeAmount={ exchangeAmountFrom }
                                        direction={ ExchangeDirection.Outcome }
                                        amount={ acc.get('amount') }
                                        base={ acc.get('base') }
                                        sign={ acc.get('sign') }
                                    />
                                </div>
                            ))}
                        </ReactSwipe>
                        <CarouselProgress
                            size={ accounts.size }
                            selectedIdx={ fromBaseIdx }
                        />
                    </div>
                    <div className="exchanger-pane__content-item">
                        <ReactSwipe
                            className="exchanger-pane__carousel"
                            swipeOptions={ this.getSwipeOptions('to') }
                        >
                            { accounts.map(acc => (
                                <div
                                    key={ acc.get('base') }
                                    className="exchanger-pane__carousel-item"
                                >
                                    <Currency
                                        exchangeAmount={ exchangeAmountTo }
                                        direction={ ExchangeDirection.Income }
                                        amount={ acc.get('amount') }
                                        base={ acc.get('base') }
                                        rate={ this.getExchangeRate() }
                                        sign={ acc.get('sign') }
                                        readonly
                                    />
                                </div>
                            ))}
                        </ReactSwipe>
                        <CarouselProgress
                            size={ accounts.size }
                            selectedIdx={ toBaseIdx }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ExchangePane.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
    conversionRates: PropTypes.instanceOf(Map).isRequired,
    isOpen: PropTypes.bool.isRequired,
    exchangeAmountFrom: PropTypes.string.isRequired,
    exchangeAmountTo: PropTypes.string.isRequired,

    setExchangePaneVisibility: PropTypes.func.isRequired,
    exchangeCurrency: PropTypes.func.isRequired,
    setExchangeAmount: PropTypes.func.isRequired,
    setCurrencyExchangeFrom: PropTypes.func.isRequired,
    setCurrencyExchangeTo: PropTypes.func.isRequired,
    setRatesPaneVisibility: PropTypes.func.isRequired,
};

export default connect(
    state => {
        const { exchangeAmountFrom, exchangeAmountTo } = getAmount(
            state.get('main'),
            state.getIn(['main', 'exchangeAmountFrom'])
        );
        return {
            conversionRates: state.getIn(['main', 'conversionRates']),
            accounts: state.getIn(['main', 'accounts']),
            isOpen: state.getIn(['main', 'isExchangePaneOpened']),
            exchangeAmountFrom,
            exchangeAmountTo,
        };
    },
    dispatch => bindActionCreators(MainActionCreators, dispatch),
)(ExchangePane);
