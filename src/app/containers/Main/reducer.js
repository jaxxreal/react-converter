import { fromJS, Map } from 'immutable';
import _pick from 'lodash/pick';

import * as ActionTypes from './types';
import { TARGET_CURRENCIES, CURRENCY_DESCRIPTIONS } from '../../config';

function getBalanceShape([base, sign], amount) {
    return Map({
        sign,
        base,
        amount,
        legend: `${base} - ${CURRENCY_DESCRIPTIONS[base]}`,
    });
}

const operations = JSON.parse(window.localStorage.getItem('operations') || '[]');

const INITIAL_STATE = fromJS({
    exchangeAmountFrom: '',
    exchangeAmountTo: '',
    date: '',
    rates: {},
    conversionRates: {},
    accounts: TARGET_CURRENCIES.map(curr => getBalanceShape(curr, (Math.random() * 200))),
    targetRates: [],
    operations: operations.map(o => Object.assign(o, { createdAt: new Date(o.createdAt) })),
    balances: [],
    isPaneOpened: false,
    currencyExchangeFrom: 'USD',
    currencyExchangeTo: 'USD',
});

/** operation shape
 {
    createdAt: Date
    income: number;
    outcome: number;
    incomeCurrency: string;
    outcomeCurrency: string;
 }
 */

export default function reducer(state = INITIAL_STATE, action = { type: null, payload: null }) {
    switch (action.type) {
        case ActionTypes.SET_RATE: {
            const { date, rates } = action.payload;

            const conversionRates = TARGET_CURRENCIES.reduce((result, curr) => {
                const rate = rates[curr[0]]; // eur

                result[curr[0]] = TARGET_CURRENCIES.reduce((res, cur) => {
                    res[cur[0]] = rates[cur[0]] / rate; // gbp
                    return res;
                }, {});
                return result;
            }, {});

            return state
                .set('date', date)
                .set('rates', fromJS(_pick(rates, TARGET_CURRENCIES.map(([base]) => base))))
                .set('conversionRates', fromJS(conversionRates));
        }
        case ActionTypes.TOGGLE_EXCHANGE_PANE: {
            return state.set('isPaneOpened', !state.get('isPaneOpened'));
        }
        case ActionTypes.SET_EXCHANGE_PANE_VISIBILITY: {
            return state.set('isPaneOpened', action.payload);
        }
        case ActionTypes.SET_CURRENCY_EXCHANGE_FROM: {
            return state.set('currencyExchangeFrom', action.payload);
        }
        case ActionTypes.SET_CURRENCY_EXCHANGE_TO: {
            return state.set('currencyExchangeTo', action.payload);
        }
        case ActionTypes.SET_EXCHANGE_AMOUNT: {
            return state.set('exchangeAmountFrom', action.payload.amount);
        }
        case ActionTypes.PERFORM_EXCHANGE_CURRENCY: {
            const fromBase = state.get('currencyExchangeFrom');
            const toBase = state.get('currencyExchangeTo');
            const exchangeAmountFrom = parseInt(state.get('exchangeAmountFrom'), 10);
            const rate = state.getIn(['conversionRates', fromBase, toBase]);
            const exchangeAmountTo = exchangeAmountFrom * rate;

            const fromIdx = state.get('accounts').findIndex(v => v.get('base') === fromBase);
            const toIdx = state.get('accounts').findIndex(v => v.get('base') === toBase);

            const fromPath = ['accounts', fromIdx, 'amount'];
            const toPath = ['accounts', toIdx, 'amount'];
            const newState = state
                .setIn(
                    fromPath,
                    state.getIn(fromPath) - parseInt(exchangeAmountFrom, 10)
                );

            return newState.setIn(
                toPath,
                newState.getIn(toPath) + parseFloat(exchangeAmountTo)
            );
        }
        case ActionTypes.LOG_EXCHANGE_OPERATION: {
            const log = state.get('operations');
            return state.set('operations', log.unshift(fromJS(action.payload)));
        }
        default:
            return state;
    }
}

export function getAmount(state, amount) {
    if (amount === '') {
        return { exchangeAmountFrom: '', exchangeAmountTo: '' };
    }
    const fromBase = state.get('currencyExchangeFrom');
    const toBase = state.get('currencyExchangeTo');

    const currentBalance = state.get('accounts').find(v => v.get('base') === fromBase).get('amount');
    let exchangeAmountFrom = parseInt(amount, 10);

    if (exchangeAmountFrom > currentBalance) {
        exchangeAmountFrom = currentBalance;
    }
    const rate = state.getIn(['conversionRates', fromBase, toBase]);

    const exchangeAmountTo = (exchangeAmountFrom * rate).toFixed(2);

    return { exchangeAmountFrom: exchangeAmountFrom.toFixed(0), exchangeAmountTo };
}
