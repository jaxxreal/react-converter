import React from 'react';
import cx from 'classnames';
import _capitalize from 'lodash/capitalize';
import ReactSwipe from 'react-swipe';
import { observable, computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import { ExchangeDirection } from '../constants';
import { ExchangerStore } from '../../../stores/exchangerStore';

import { TopMenu } from '../../../components/TopMenu';
import { CarouselProgress } from '../../../components/CarouselProgress';
import { Currency } from '../components/Currency';

interface ExchangePaneProps {
    exchangerStore?: ExchangerStore;
}

@inject('exchangerStore') @observer
export class ExchangePane extends React.Component<ExchangePaneProps, React.ComponentState> {
    @observable fromBaseIdx = 0;
    @observable toBaseIdx = 0;

    @computed get isOpen() {
        return this.props.exchangerStore.state.isExchangePaneOpened;
    }

    @computed get accounts() {
        return this.props.exchangerStore.state.accounts;
    }

    @computed get conversionRates() {
        return this.props.exchangerStore.state.conversionRates;
    }

    @computed get exchangeAmountTo() {
        return this.props.exchangerStore.amount.exchangeAmountTo;
    }
    @computed get exchangeAmountFrom() {
        return this.props.exchangerStore.amount.exchangeAmountFrom;
    }
    @computed get fromBase() {
        return this.accounts[this.fromBaseIdx]['base'];
    }
    @computed get fromSign() {
        return this.accounts[this.fromBaseIdx]['sign'];
    }
    @computed get toBase() {
        return this.accounts[this.toBaseIdx]['base'];
    }
    @computed get toSign() {
        return this.accounts[this.toBaseIdx]['sign'];
    }
    @computed get baseRate() {
        return this.conversionRates[this.fromBase];
    }

    @computed get exchangeRate() {
        return `${this.fromSign}${(this.baseRate ? this.baseRate[this.toBase] : 0).toFixed(2)}`;
    }

    getCurrencySelect() {
        const rate = this.baseRate ? this.baseRate[this.toBase].toFixed(4) : '0.0000';

        return (
            <button className="btn btn_outlined btn_rounded top-menu__control" name="currency-select">
                { `${this.fromSign}1 = ${this.toSign}${rate}` }
            </button>
        );
    }

    getSwipeOptions(direction: 'from' | 'to') {
        return {
            callback: (this as any)[`select${_capitalize(direction)}Base`],
        };
    }

    getTopMenuConfig() {
        return {
            left: {
                label: 'Cancel',
                action: () => this.props.exchangerStore.setExchangePaneVisibility(false)
            },
            center: {
                label: this.getCurrencySelect(),
                action: () => this.props.exchangerStore.setRatesPaneVisibility(true)
            },
            right: {
                label: 'Exchange',
                action: this.props.exchangerStore.amount.exchangeAmountFrom ? this.props.exchangerStore.exchangeCurrency : () => {}
            }
        };
    }

    setExchangeAmount(ev: any) {
        this.props.exchangerStore.setExchangeAmount(ev.target.value);
    }

    redoConvertion() {
        this.setExchangeAmount({ target: { value: this.props.exchangerStore.amount.exchangeAmountFrom } });
    }

    selectFromBase = (fromBaseIdx: number) => {
        this.props.exchangerStore.setCurrencyExchangeFrom(this.accounts[fromBaseIdx].base);
        this.fromBaseIdx = fromBaseIdx;
        this.redoConvertion();
    }

    selectToBase = (toBaseIdx: number) => {
        this.props.exchangerStore.setCurrencyExchangeTo(this.accounts[toBaseIdx].base);
        this.toBaseIdx = toBaseIdx;
        this.redoConvertion();
    }

    render() {
        const { left, center, right } = this.getTopMenuConfig();

        return (
            <div className={ cx('exchanger-pane', { 'exchanger-pane_open': this.props.exchangerStore.state.isExchangePaneOpened }) }>
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
                            { this.accounts.map(acc => (
                                <div
                                    key={ acc.base }
                                    className="exchanger-pane__carousel-item"
                                >
                                    <Currency
                                        onChangeExchangeAmount={ this.setExchangeAmount }
                                        exchangeAmount={ this.exchangeAmountFrom }
                                        direction={ ExchangeDirection.Outcome }
                                        amount={ acc.amount }
                                        base={ acc.base }
                                        sign={ acc.sign }
                                    />
                                </div>
                            ))}
                        </ReactSwipe>
                        <CarouselProgress
                            size={ this.accounts.length }
                            selectedIdx={ this.fromBaseIdx }
                        />
                    </div>
                    <div className="exchanger-pane__content-item">
                        <ReactSwipe
                            className="exchanger-pane__carousel"
                            swipeOptions={ this.getSwipeOptions('to') }
                        >
                            { this.accounts.map(acc => (
                                <div
                                    key={ acc.base }
                                    className="exchanger-pane__carousel-item"
                                >
                                    <Currency
                                        exchangeAmount={ this.exchangeAmountTo }
                                        direction={ ExchangeDirection.Income }
                                        amount={ acc.amount }
                                        base={ acc.base }
                                        rate={ this.exchangeRate }
                                        sign={ acc.sign }
                                        readOnly
                                    />
                                </div>
                            ))}
                        </ReactSwipe>
                        <CarouselProgress
                            size={ this.accounts.length }
                            selectedIdx={ this.toBaseIdx }
                        />
                    </div>
                </div>
            </div>
        );
    }
}
