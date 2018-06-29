import axios from 'axios';

import { CONVERTER_URL, CONVERTER_APP_ID, Currency } from '../config';

const $http = axios.create();

interface CurrencyResponse {
    base: 'USD';
    disclaimer: string;
    license: string;
    timestamp: number;
    rates: {
        [key: string]: number;
    }
}

// https://openexchangerates.org/api/latest.json
export const getLatest = async () => {
    const { data }: { data: CurrencyResponse } = await $http.get(`${CONVERTER_URL}/latest.json?app_id=${CONVERTER_APP_ID}`);
    return data;
}

// https://openexchangerates.org/api/convert/:value/:from/:to
export const convertFromTo = (value: string | number, from: Currency, to: Currency) => (
    $http.get(`${CONVERTER_URL}/convert/${value}/${from}/${to}?app_id=${CONVERTER_APP_ID}`)
);
