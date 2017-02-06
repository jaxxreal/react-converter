import React, { PureComponent, PropTypes } from 'react';

import { ExchangeDirection, DIGIT_WIDTH } from '../constants';

export class Currency extends PureComponent {
    render() {
        const { base, amount, rate, direction, readonly, exchangeAmount = '', sign } = this.props;

        return (
            <div className="currency">
                <div className="currency__row">
                    <div className="currency__base">
                        { base }
                    </div>
                    <div className="currency__input-wrapper">
                        { exchangeAmount.length
                            ? <span>{ direction === ExchangeDirection.Income ? '+' : '-' }</span>
                            : null
                        }
                        <input
                            style={ { width: `${DIGIT_WIDTH * exchangeAmount.length}px` } }
                            value={ exchangeAmount }
                            onChange={ this.props.onChangeExchangeAmount }
                            type="number"
                            min="0"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="currency__input"
                            readOnly={ readonly }
                        />
                    </div>
                </div>
                <div className="currency__row currency__row_pt20">
                    <div className="currency__balance">
                        You have { sign }{ amount && amount.toFixed(2) }
                    </div>
                    { rate ?
                        <div className="currency__rate">
                            { sign }1 = { rate }
                        </div>
                        : null }
                </div>
            </div>
        );
    }
}

Currency.propTypes = {
    sign: PropTypes.string.isRequired,
    base: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    onChangeExchangeAmount: PropTypes.func,
    rate: PropTypes.string,
    direction: PropTypes.oneOf([
        ExchangeDirection.Income,
        ExchangeDirection.Outcome,
    ]).isRequired,
    readonly: PropTypes.bool,
    exchangeAmount: PropTypes.string,
};
