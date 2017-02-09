import React, { PureComponent, PropTypes } from 'react';

import CURRENCIES from '../../../currencies.json';

export default class UserRatesItem extends PureComponent {
    render() {
        const { rate, baseFrom, baseTo } = this.props;

        return (
            <li className="rates__item">
                <span className="rates__base">1{ baseFrom }</span>
                <div className="rates__rate">
                    <div className="rates__rate-cost">
                        <span className="rates__rate-cost-hundredth">
                            { rate.toFixed(2) }
                        </span>
                        <span className="rates__rate-cost-thousandth">
                            { rate.toFixed(4).substr(-2, 2) }
                        </span>
                    </div>
                    <div className="rates__rate-desc">
                        { CURRENCIES[baseTo] }
                    </div>
                </div>
            </li>
        );
    }
}

UserRatesItem.propTypes = {
    rate: PropTypes.number.isRequired,
    baseFrom: PropTypes.string.isRequired,
    baseTo: PropTypes.string.isRequired,
};
