import * as React from 'react';

import { ExchangeDirection, DIGIT_WIDTH } from '../constants';
import { CurrencySign } from '../../../config';

interface CurrencyProps {
    base: string;
    amount: number;
    direction: ExchangeDirection;
    readOnly?: boolean;
    exchangeAmount: string;
    sign: CurrencySign;
    rate?: string;
    onChangeExchangeAmount?: React.EventHandler<any>;
}

const noop = () => { };

export const Currency = ({ base, amount, rate, direction, readOnly, exchangeAmount = '', sign, onChangeExchangeAmount }: CurrencyProps) => (
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
                    onChange={ readOnly ? noop : onChangeExchangeAmount }
                    type="number"
                    min="0"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="currency__input"
                    readOnly={ readOnly }
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
