import * as React from 'react';
import cx from 'classnames';
import ReactSwipe from 'react-swipe';
import { action, observable } from 'mobx';
import { observer, inject } from 'mobx-react';

// images
const addIcon = require('../../../assets/icons/add.svg');
const arrowForwardIcon = require('../../../assets/icons/arrow_forward.svg');
const cachedIcon = require('../../../assets/icons/cached.svg');

// import Operations from './containers/Operations';
import { ExchangePane } from './containers/ExchangePane';
import { UserRatesPane } from './containers/UserRatesPane';
import { RatesFilterPane } from './containers/RatesFilterPane';

import { CarouselProgress } from '../../components/CarouselProgress';
import { Account } from './components/Account';
import { CURRENCIES_UPDATE_INTERVAL } from '../../config';
import { SvgIcon } from '../../components/Icon';
import { ExchangerStore, IAccount } from '../../stores/exchangerStore';


interface MainProps {
    exchangerStore?: ExchangerStore;
}

@inject('exchangerStore') @observer
export class Main extends React.Component<MainProps, React.ComponentState> {
    interval: any;

    @observable selectedIdx = 0;

    constructor(props: MainProps) {
        super(props);
        this.props.exchangerStore.setRate();

        this.interval = setInterval(() => {
            this.props.exchangerStore.setRate();
        }, CURRENCIES_UPDATE_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    @action selectBase = (selectedIdx: number) => {
        this.selectedIdx = selectedIdx;
    }

    render() {
        const swipeOptions = {
            callback: this.selectBase
        };

        return (
            <div className="main">
                <div className="main__inner">
                    <div className="main__carousel">
                        <ReactSwipe
                            className="main__carousel-body"
                            // key={ accounts.hashCode() }
                            key="1234"
                            swipeOptions={ swipeOptions }
                        >
                            { this.props.exchangerStore.state.accounts.map((acc, idx) => (
                                <div
                                    key={ acc.amount }
                                    className={ cx('main__carousel-item', {
                                        'main__carousel-item_active': idx === this.selectedIdx,
                                    }) }
                                >
                                    <Account account={ acc }/>
                                </div>
                            ))}
                        </ReactSwipe>
                        <CarouselProgress
                            size={ this.props.exchangerStore.state.accounts.length }
                            selectedIdx={ this.selectedIdx }
                        />
                    </div>
                    <ul className="main__actions">
                        <li className="main__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <SvgIcon className="icon icon_add" svg={addIcon.default}/>
                                </span>
                            </button>
                            <span className="main__actions-legend">
                                Top Up
                            </span>
                        </li>
                        <li className="main__actions-item">
                            <button
                                onClick={ () => this.props.exchangerStore.toggleExchangePane() }
                                className="btn btn_round btn_transparent btn_40"
                            >
                                <span className="btn__content">
                                    <SvgIcon className="icon icon_cached" svg={cachedIcon.default}/>
                                </span>
                            </button>
                            <span className="main__actions-legend">
                                Exchange
                            </span>
                        </li>
                        <li className="main__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <SvgIcon className="icon icon_arrow-forward" svg={arrowForwardIcon.default}/>
                                </span>
                            </button>
                            <span className="main__actions-legend">
                                Bank
                            </span>
                        </li>
                    </ul>
                </div>
                {/* <Operations/>
                */}
                <ExchangePane/>
                <UserRatesPane/>
                <RatesFilterPane/>
            </div>
        );
    }

}
