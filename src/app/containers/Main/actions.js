import * as ActionTypes from './types';
import { currency } from '../../resources';
import { getAmount } from './reducer';

export const setRate = (payload) => ({
    type: ActionTypes.SET_RATE,
    payload,
});

export const loadRate = () => dispatch => currency
    .getLatest()
    .then(({ data }) => dispatch(setRate(data)));

export const setExchangePaneVisibility = (isVisible) => ({
    type: ActionTypes.SET_EXCHANGE_PANE_VISIBILITY,
    payload: isVisible,
});

export const toggleExchangePane = () => ({
    type: ActionTypes.TOGGLE_EXCHANGE_PANE
});

export const setExchangeAmount = ({ amount }) => ({
    type: ActionTypes.SET_EXCHANGE_AMOUNT,
    payload: { amount },
});

export const setCurrencyExchangeFrom = (base) => ({
    type: ActionTypes.SET_CURRENCY_EXCHANGE_FROM,
    payload: base,
});

export const setCurrencyExchangeTo = (base) => ({
    type: ActionTypes.SET_CURRENCY_EXCHANGE_TO,
    payload: base,
});

export const logOperation = (operaion) => ({
    type: ActionTypes.LOG_EXCHANGE_OPERATION,
    payload: operaion,
});

export const performCleanup = () => dispatch => {
    dispatch(setExchangeAmount({ amount: '' }));
    dispatch(setExchangePaneVisibility(false));
};

export const performLogOperation = () => (dispatch, getState) => {
    const state = getState();
    const { exchangeAmountFrom, exchangeAmountTo } = getAmount(
        state.get('main'),
        state.getIn(['main', 'exchangeAmountFrom'])
    );
    const fromBase = state.getIn(['main', 'currencyExchangeFrom']);
    const toBase = state.getIn(['main', 'currencyExchangeTo']);

    dispatch(logOperation({
        createdAt: new Date(),
        income: exchangeAmountTo,
        outcome: exchangeAmountFrom,
        incomeCurrency: toBase,
        outcomeCurrency: fromBase,
    }));
};

export const performExchange = () => ({
    type: ActionTypes.PERFORM_EXCHANGE_CURRENCY,
});

export const exchangeCurrency = () => (dispatch) => {
    dispatch(performExchange());
    dispatch(performLogOperation());
    dispatch(performCleanup());
};

export const setRatesPaneVisibility = (isVisible) => ({
    type: ActionTypes.SET_RATES_PANE_VISIBILITY,
    payload: isVisible
});
