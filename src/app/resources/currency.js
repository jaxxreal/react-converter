import axios from 'axios';

import { CONVERTER_URL, CONVERTER_APP_ID } from '../config';

const $http = axios.create();

// https://openexchangerates.org/api/latest.json
export const getLatest = () => $http.get(`${CONVERTER_URL}/latest.json?app_id=${CONVERTER_APP_ID}`);

// https://openexchangerates.org/api/convert/:value/:from/:to
export const convertFromTo = (value, from, to) => (
    $http.get(`${CONVERTER_URL}/convert/${value}/${from}/${to}?app_id=${CONVERTER_APP_ID}`)
);
