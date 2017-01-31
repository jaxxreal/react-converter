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

export class Exchanger extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIdx: 0
        };
        props.loadRate();
        _bindAll(this, ['selectBase']);
    }

    selectBase(selectedIdx) {
        this.setState({ selectedIdx });
    }

    render() {
        const { selectedIdx } = this.state;
        const { balances } = this.props;
        const swipeOptions = {
            callback: this.selectBase
        };
        return (
            <div className="exchanger">
                <div className="exchanger__inner">
                    <div className="exchanger__carousel">
                        { balances.isEmpty() ? null : (
                            <ReactSwipe className="exchanger__carousel-body" swipeOptions={ swipeOptions }>
                                { balances.map((bal, idx) => (
                                    <div
                                        key={ bal.get('base') }
                                        className={ cx('exchanger__carousel-item', {
                                            'exchanger__carousel-item_active': idx === selectedIdx,
                                        }) }
                                    >
                                        <div className="balance">
                                            <div className="balance__main">
                                                <span className="balance__sign">{ bal.get('sign') }</span>
                                                <span className="balance__int">{ bal.get('int') }.</span>
                                                <span className="balance__float">{ bal.get('float') }</span>
                                            </div>
                                            <div className="balance__legend">
                                                { bal.get('legend') }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ReactSwipe>
                        )}
                        <div className="carousel-progress">
                            <div className="carousel-progress__inner">
                                { balances.map((bal, idx) => (
                                    <div
                                        key={ bal.get('base') }
                                        className={ cx('carousel-progress__item', {
                                            'carousel-progress__item_active': idx === selectedIdx,
                                        }) }
                                    />
                                )) }
                            </div>
                        </div>
                    </div>
                    <ul className="exchanger__actions">
                        <li className="exchanger__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <svg className="icon icon_add">
                                        <use xlinkHref={ addIcon }/>
                                    </svg>
                                </span>
                            </button>
                            <span className="exchanger__actions-legend">
                                Top Up
                            </span>
                        </li>
                        <li className="exchanger__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <svg className="icon icon_cached">
                                        <use xlinkHref={ cachedIcon }/>
                                    </svg>
                                </span>
                            </button>
                            <span className="exchanger__actions-legend">
                                Exchange
                            </span>
                        </li>
                        <li className="exchanger__actions-item">
                            <button className="btn btn_round btn_transparent btn_40">
                                <span className="btn__content">
                                    <svg className="icon icon_arrow-forward">
                                        <use xlinkHref={ arrowForwardIcon }/>
                                    </svg>
                                </span>
                            </button>
                            <span className="exchanger__actions-legend">
                                Bank
                            </span>
                        </li>
                    </ul>
                </div>
                <Operations/>
            </div>
        );
    }

}

Exchanger.propTypes = {
    balances: PropTypes.instanceOf(List).isRequired,
    loadRate: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        balances: state.getIn(['exchanger', 'balances']),
    }),
    dispatch => bindActionCreators(ExchangeActionCreators, dispatch),
)(Exchanger);
