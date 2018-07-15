import * as React from 'react';
import cx from 'classnames';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

const arrowLeftIcon = require('../../../../assets/icons/arrow_left.svg');
const addIcon = require('../../../../assets/icons/add.svg');

// components
import { TopMenu } from '../../../components/TopMenu';
import { UserRatesItem } from '../components/UserRatesItem';
import { ExchangerStore } from '../../../stores/exchangerStore';
import { SvgIcon } from '../../../components/Icon';

interface UserRatesPaneProps {
    exchangerStore?: ExchangerStore;
}

@inject('exchangerStore') @observer
export class UserRatesPane extends React.Component<UserRatesPaneProps, React.ComponentState> {

    constructor(props:UserRatesPaneProps){
        super(props);
        this.addNewRate = this.addNewRate.bind(this);
    }

    @computed get isOpen() {
        return this.props.exchangerStore.state.isRatesPaneOpened;
    }

    @computed get base() {
        return this.props.exchangerStore.state.currencyExchangeFrom;
    }

    getTopMenu() {
        return {
            left: {
                label: (
                    <span className="btn__content">
                        <SvgIcon className="icon icon_arrow-left" svg={arrowLeftIcon.default} />
                        Back
                    </span>
                ),
                action: () => this.props.exchangerStore.setRatesPaneVisibility(false)
            },
            center: {
                label: <span>Rates</span>
            },
            right: {
                label: (
                    <span>
                        <SvgIcon className="icon icon_add" svg={addIcon.default} />
                    </span>
                ),
                action: () => this.props.exchangerStore.setRatesFilterPaneVisibility(true)
            }
        };
    }

    addNewRate() {
        console.log(this);
        this.props.exchangerStore.setRatesFilterPaneVisibility(true);
    }

    getRate(base: string) {
        const baseRate = this.props.exchangerStore.state.conversionRates[this.base];

        if (!baseRate) {
            return 0;
        }

        return baseRate[base];
    }

    render() {
        const { left, center, right } = this.getTopMenu();

        return (
            <div className={ cx('rates-pane', { 'rates-pane_open': this.isOpen }) }>
                <TopMenu
                    left={ left }
                    center={ center }
                    right={ right }
                />
                <ul className="rates rates_scroll">
                    { this.props.exchangerStore.state.ratesComparisonList.map(base => (
                        base === this.base
                            ? null
                            : <UserRatesItem
                                key={ base }
                                baseTo={ base }
                                baseFrom={ this.base }
                                rate={ this.getRate(base) }
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
