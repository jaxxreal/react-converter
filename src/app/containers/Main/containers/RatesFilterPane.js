import React, { PureComponent, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';
import { List } from 'immutable';
import _bindAll from 'lodash/bindAll';

import * as MainActionCreators from '../actions';
import CURRENCIES from '../../../currencies.json';

// components
import { TopMenu } from '../../../components/TopMenu';
import FilterListItem from '../components/FilterListItem';

export class UserRatesPane extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            query: ''
        };
        _bindAll(this, ['filterList', 'filterByQuery', 'selectCurrency', 'getInput']);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isOpen) {
            this.setState({ query: '' });
        }
    }

    componentDidUpdate() {
        if (this.props.isOpen && this.input) {
            this.input.focus();
        }
    }

    getInput(ref) {
        this.input = findDOMNode(ref);
    }

    getTopMenu() {
        return {
            left: {
                label: (
                    <span className="btn__content">
                        Cancel
                    </span>
                ),
                action: () => this.props.setRatesFilterPaneVisibility(false)
            },
            center: {
                label: <span>Select Currency</span>
            },
        };
    }

    filterList(ev) {
        const { value } = ev.target;
        this.setState({ query: value });
    }

    filterByQuery(curr) {
        return (new RegExp(`${this.state.query}`, 'ig')).test(curr);
    }

    selectCurrency(idx) {
        const base = this.props.availableBases.get(idx);
        this.props.addNewRateToComparison(base);
        this.props.setRatesFilterPaneVisibility(false);
    }

    render() {
        const { availableCurrencies, isOpen } = this.props;
        const { left, center } = this.getTopMenu();
        return (
            <div className={ cx('rates-pane', { 'rates-pane_open': isOpen }) }>
                <TopMenu
                    left={ left }
                    center={ center }
                />
                <div className="rates-pane__filter">
                    <input
                        ref={ this.getInput }
                        value={ this.state.query }
                        onChange={ this.filterList }
                        type="search"
                        className="rates-pane__filter-input"
                    />
                </div>
                <ul className="rates rates_scroll">
                    { availableCurrencies.filter(this.filterByQuery).map((desc, idx) => (
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

UserRatesPane.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    availableCurrencies: PropTypes.instanceOf(List).isRequired,
    availableBases: PropTypes.instanceOf(List).isRequired,

    setRatesFilterPaneVisibility: PropTypes.func.isRequired,
    addNewRateToComparison: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        availableCurrencies: state.getIn(['main', 'availableCurrencies']).map(base => `${base} - ${CURRENCIES[base]}`),
        availableBases: state.getIn(['main', 'availableCurrencies']),
        isOpen: state.getIn(['main', 'isRatesFilterPaneOpened'])
    }),
    dispatch => bindActionCreators(MainActionCreators, dispatch)
)(UserRatesPane);
