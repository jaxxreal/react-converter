import { fromJS, List, Map } from 'immutable';
import * as ActionTypes from './actionTypes';
import { TARGET_CURRENCIES, CURRENCY_DESCRIPTIONS } from '../../config';

const balance = (Math.random() * 200).toFixed(2);
const operations = JSON.parse(window.localStorage.getItem('operations') || '[]');
const INITIAL_STATE = fromJS({
    base: 'USD',
    date: '',
    rates: {},
    operations,
    balance: parseFloat(balance),
    balances: [],
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
            const { base, date, rates } = action.payload;
            const balances = TARGET_CURRENCIES.map(([curr, sign]) => {
                const amount = (state.get('balance') * rates[curr]).toFixed(2);
                const [int, float] = amount.split('.');
                return Map({
                    sign,
                    base: curr,
                    amount: parseFloat(amount),
                    int,
                    float,
                    legend: `${curr} - ${CURRENCY_DESCRIPTIONS[curr]}`,
                });
            });
            return state
                .set('base', base)
                .set('date', date)
                .set('rates', rates)
                .set('balances', List(balances));
        }
        default:
            return state;
    }
}
