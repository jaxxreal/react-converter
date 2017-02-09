import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';
import _bindAll from 'lodash/bindAll';
import ReactSwipe from 'react-swipe';

// images
import addIcon from '../../../assets/icons/add.svg';
import arrowForwardIcon from '../../../assets/icons/arrow_forward.svg';
import cachedIcon from '../../../assets/icons/cached.svg';

import * as ExchangeActionCreators from './actions';

import Operations from './containers/Operations';
import ExchangePane from './containers/ExchangePane';
import UserRatesPane from './containers/UserRatesPane';
import RatesFilterPane from './containers/RatesFilterPane';

import { CarouselProgress } from '../../components/CarouselProgress';
import { Account } from './components/Account';
import { CURRENCIES_UPDATE_INTERVAL } from '../../config';

export class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIdx: 0
        };
        props.loadRate();
        this.interval = setInterval(() => props.loadRate(), CURRENCIES_UPDATE_INTERVAL);
        _bindAll(this, ['selectBase']);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    selectBase(selectedIdx) {
        this.setState({ selectedIdx });
    }

    render() {
        const { selectedIdx } = this.state;
        const { accounts } = this.props;
        const swipeOptions = {
            callback: this.selectBase
        };
        return (
            <div className="main">
                <div className="main__inner">
                    <div className="main__carousel">
                        <ReactSwipe
                            className="main__carousel-body"
                            key={ accounts.hashCode() }
                            swipeOptions={ swipeOptions }
                        >
                            { accounts.map((acc, idx) => (
                                <div
                                    key={ acc.get('amount') }
                                    className={ cx('main__carousel-item', {
                                        'main__carousel-item_active': idx === selectedIdx,
                                    }) }
                                >
                                    <Account account={ acc }/>
                                </div>
                            ))}
                        </ReactSwipe>
                        <CarouselProgress
                            size={ accounts.size }
                            selectedIdx={ selectedIdx }
                        />
                    </div>
                    <ul className="main__actions">
                        <li className="main__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <svg className="icon icon_add">
                                        <use xlinkHref={ addIcon }/>
                                    </svg>
                                </span>
                            </button>
                            <span className="main__actions-legend">
                                Top Up
                            </span>
                        </li>
                        <li className="main__actions-item">
                            <button
                                onClick={ () => this.props.toggleExchangePane() }
                                className="btn btn_round btn_transparent btn_40"
                            >
                                <span className="btn__content">
                                    <svg className="icon icon_cached">
                                        <use xlinkHref={ cachedIcon }/>
                                    </svg>
                                </span>
                            </button>
                            <span className="main__actions-legend">
                                Exchange
                            </span>
                        </li>
                        <li className="main__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <svg className="icon icon_arrow-forward">
                                        <use xlinkHref={ arrowForwardIcon }/>
                                    </svg>
                                </span>
                            </button>
                            <span className="main__actions-legend">
                                Bank
                            </span>
                        </li>
                    </ul>
                </div>
                <Operations/>
                <ExchangePane/>
                <UserRatesPane/>
                <RatesFilterPane/>
            </div>
        );
    }

}

Main.propTypes = {
    accounts: PropTypes.instanceOf(List).isRequired,
    loadRate: PropTypes.func.isRequired,
    toggleExchangePane: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        accounts: state.getIn(['main', 'accounts']),
    }),
    dispatch => bindActionCreators(ExchangeActionCreators, dispatch),
)(Main);
