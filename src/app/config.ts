export const APP_ROOT = '/';
export const API_URL = 'http://localhost:3004';
export const CONVERTER_URL = 'https://openexchangerates.org/api';
export const CONVERTER_APP_ID = '55eddbe2da0b494a8555825944f3cb2e';

export const CURRENCIES: { [key: string]: string } = require('./currencies.json');

export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}

export enum CurrencySign {
    USD = '$',
    EUR = '€',
    GBP = '£',
}

export const TARGET_CURRENCIES: Array<[Currency, CurrencySign]> = [
    [Currency.USD, CurrencySign.USD],
    [Currency.EUR, CurrencySign.EUR],
    [Currency.GBP, CurrencySign.GBP],
];


export enum CURRENCY_DESCRIPTIONS {
    USD = 'United States Dollar',
    EUR = 'Euro Member Countries',
    GBP = 'United Kingdom Pound',
};

export const CURRENCIES_UPDATE_INTERVAL = 30000;
