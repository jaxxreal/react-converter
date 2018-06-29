import * as React from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';
import { inject, observer } from 'mobx-react';
import { observable, computed } from 'mobx';

const CURRENCIES = require('../../../currencies.json');

// components
import { TopMenu } from '../../../components/TopMenu';
import FilterListItem from '../components/FilterListItem';
import { ExchangerStore } from '../../../stores/exchangerStore';

interface RatesFilterPaneProps {
    exchangerStore?: ExchangerStore;
}

@inject('exchangerStore') @observer
export class RatesFilterPane extends React.Component<RatesFilterPaneProps, {}> {
    @observable query = '';
    input: Element | Text;

    @computed get isOpen() {
        return this.props.exchangerStore.state.isRatesFilterPaneOpened;
    }

    @computed get availableCurrencies() {
        return this.props.exchangerStore.state.availableCurrencies.map((base: any) => `${base} - ${CURRENCIES[base]}`);
    }

    componentWillReceiveProps(nextProps: RatesFilterPaneProps) {
        if (!nextProps.exchangerStore.state.isRatesFilterPaneOpened) {
            this.setState({ query: '' });
        }
    }

    // componentDidUpdate() {
    //     if (this.isOpen && this.input) {
    //         this.input.focus();
    //     }
    // }

    // getInput(ref) {
    //     this.input = findDOMNode(ref);
    // }

    getTopMenu() {
        return {
            left: {
                label: (
                    <span className="btn__content">
                        Cancel
                    </span>
                ),
                action: () => this.props.exchangerStore.setRatesFilterPaneVisibility(false)
            },
            center: {
                label: <span>Select Currency</span>
            },
        };
    }

    filterList(ev: any) {
        this.query = ev.target.value;
    }

    filterByQuery = (curr: string) => {
        return (new RegExp(`${this.query}`, 'ig')).test(curr);
    }

    selectCurrency = (idx: number) => {
        const base = this.props.exchangerStore.state.availableCurrencies[idx];

        this.props.exchangerStore.addNewRateToComparison(base);
        this.props.exchangerStore.setRatesFilterPaneVisibility(false);
    }

    render() {
        const { left, center } = this.getTopMenu();

        return (
            <div className={ cx('rates-pane', { 'rates-pane_open': this.isOpen }) }>
                <TopMenu
                    left={ left }
                    center={ center }
                />
                <div className="rates-pane__filter">
                    <input
                        // ref={ this.getInput }
                        value={ this.query }
                        onChange={ this.filterList }
                        type="search"
                        className="rates-pane__filter-input"
                    />
                </div>
                <ul className="rates rates_scroll">
                    { this.availableCurrencies.filter(this.filterByQuery).map((desc, idx) => (
                        <FilterListItem
                            id={ idx }
                            key={ desc }
                            desc={ desc }
                            clickItem={ this.selectCurrency }
                        />
                    )) }
                </ul>
            </div>
        );
    }
}
