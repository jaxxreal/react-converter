import { action, computed, toJS, observable, runInAction} from 'mobx';

import { TARGET_CURRENCIES, CURRENCY_DESCRIPTIONS, Currency, CurrencySign } from '../config';
import { currency } from '../resources';

function getBalanceShape([base, sign]: [Currency, CurrencySign], amount: number) {
    return {
        sign,
        base,
        amount,
        legend: `${base} - ${CURRENCY_DESCRIPTIONS[base as any]}`,
    };
}

export interface Operation {
    createdAt: Date
    income: number;
    outcome: number;
    incomeCurrency: string;
    outcomeCurrency: string;
}

export interface IAccount {
    sign: CurrencySign;
    base: string;
    amount: number;
    legend: string;
}

const operations: Operation[] = JSON.parse(window.localStorage.getItem('operations') || '[]');

interface ExchangerState {
    date: any;
    exchangeAmountFrom: string;
    exchangeAmountTo: string;
    rates: any;
    conversionRates: any;
    accounts: IAccount[],
    targetRates: any[],
    operations: Operation[],
    isExchangePaneOpened: boolean,
    isRatesPaneOpened: boolean, // TODO temp
    isRatesFilterPaneOpened: boolean, // TODO temp
    currencyExchangeFrom: string;
    currencyExchangeTo: string;
    availableCurrencies: any[];
    ratesComparisonList: string[];
};

const INITIAL_STATE = localStorage.getItem('operations') || {
    exchangeAmountFrom: '',
    exchangeAmountTo: '',
    rates: {},
    conversionRates: {},
    accounts: TARGET_CURRENCIES.map(curr => getBalanceShape(curr, (Math.random() * 200))),
    targetRates: [] as any,
    operations: operations.map(o => Object.assign(o, { createdAt: new Date(o.createdAt) })),
    isExchangePaneOpened: false,
    isRatesPaneOpened: false, // TODO temp
    isRatesFilterPaneOpened: false, // TODO temp
    currencyExchangeFrom: 'USD',
    currencyExchangeTo: 'USD',
    availableCurrencies: [] as any,
    ratesComparisonList: TARGET_CURRENCIES.map(v => v[0]),
};

export class ExchangerStore {
    @observable state: ExchangerState;

    @computed get amount() {
        const amount = this.state.exchangeAmountFrom;

        if (amount === '') {
            return { exchangeAmountFrom: '', exchangeAmountTo: '' };
        }
        const fromBase = this.state.currencyExchangeFrom;
        const toBase = this.state.currencyExchangeTo;

        const currentBalance = this.state.accounts.find(v => v.base === fromBase).amount;
        let exchangeAmountFrom = parseInt(amount, 10);

        if (exchangeAmountFrom > currentBalance) {
            exchangeAmountFrom = currentBalance;
        }

        const rate = this.state.conversionRates[fromBase][toBase];

        const exchangeAmountTo = (exchangeAmountFrom * rate).toFixed(2);

        return { exchangeAmountFrom: exchangeAmountFrom.toFixed(0), exchangeAmountTo };
    }

    constructor(state: any) {
        this.state = state;

        window.onbeforeunload = () => {
            // localStorage.setItem('operations', JSON.stringify(toJS(this.state)));
        };
    }

    @action async setRate() {
        const { rates, timestamp } = await currency.getLatest();

        const currencies = Object.keys(rates);

        const conversionRates = currencies.reduce((result, curr) => {
            const rate = rates[curr];
            result[curr] = currencies.reduce((res, cur) => {
                res[cur] = rates[cur] / rate;
                return res;
            }, {} as any);
            return result;
        }, {} as any);
        runInAction('set rate', ()=> {
            this.state.date = new Date(timestamp);
            this.state.rates = rates;
            this.state.availableCurrencies = currencies;
            this.state.conversionRates = conversionRates;
        });
    }

    @action toggleExchangePane() {
        return this.state.isExchangePaneOpened = !this.state.isExchangePaneOpened;
    }

    @action setExchangePaneVisibility(isExchangePaneOpened: boolean) {
        return this.state.isExchangePaneOpened = isExchangePaneOpened;
    }

    @action setRatesPaneVisibility(isRatesPaneOpened: boolean) {
        return this.state.isRatesPaneOpened = isRatesPaneOpened;
    }

    @action setRatesFilterPaneVisibility(isRatesFilterPaneOpened: boolean) {
        return this.state.isRatesFilterPaneOpened = isRatesFilterPaneOpened;
    }

    @action setCurrencyExchangeFrom(currencyExchangeFrom: string) {
        return this.state.currencyExchangeFrom = currencyExchangeFrom;
    }

    @action setCurrencyExchangeTo(currencyExchangeTo: string) {
        return this.state.currencyExchangeTo = currencyExchangeTo;
    }

    @action setExchangeAmount(amount: string) {
        return this.state.exchangeAmountFrom = amount;
    }

    @action exchangeCurrency() {
        const fromBase = this.state.currencyExchangeFrom;
        const toBase = this.state.currencyExchangeTo;
        const exchangeAmountFrom = parseInt(this.state.exchangeAmountFrom, 10);

        if (isNaN(exchangeAmountFrom)) {
            return;
        }

        const rate = this.state.conversionRates.fromBase.toBase;
        const exchangeAmountTo = exchangeAmountFrom * rate;

        const fromIdx = this.state.accounts.findIndex(v => v.base === fromBase);
        const toIdx = this.state.accounts.findIndex(v => v.base === toBase);

        this.state.accounts[fromIdx].amount = this.state.accounts[fromIdx].amount - exchangeAmountFrom;

        this.state.accounts[toIdx].amount = this.state.accounts[toIdx].amount + exchangeAmountTo;

        this.logExchangeOperation();
        this.setExchangeAmount('');
        this.setExchangePaneVisibility(false);
    }

    @action logExchangeOperation() {
        const operation: Operation = {
            createdAt: new Date(),
            income: parseFloat(this.amount.exchangeAmountTo),
            outcome: parseFloat(this.amount.exchangeAmountFrom),
            incomeCurrency: this.state.currencyExchangeTo,
            outcomeCurrency: this.state.currencyExchangeFrom,
        };

        this.state.operations.unshift(operation);
    }

    @action addNewRateToComparison(rate: string) {
        this.state.ratesComparisonList.push(rate);
    }
}

export default new ExchangerStore(INITIAL_STATE);
