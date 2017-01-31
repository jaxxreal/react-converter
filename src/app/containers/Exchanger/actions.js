import * as ActionTypes from './actionTypes';
import { currency } from '../../resources';

export const setRate = (payload) => ({
    type: ActionTypes.SET_RATE,
    payload,
});

export const loadRate = () => dispatch => currency
    .getLatest()
    .then(({ data }) => dispatch(setRate(data)));
