import React, { PureComponent, PropTypes } from 'react';
import { Map } from 'immutable';

export class Account extends PureComponent {
    getAmountParts() {
        const amountStr = this.props.account.get('amount', 0).toFixed(2);
        return amountStr.split('.');
    }

    render() {
        const [int, frac] = this.getAmountParts();
        const { account: acc } = this.props;
        return (
            <div className="account">
                <div className="account__main">
                    <span className="account__sign">{ acc.get('sign') }</span>
                    <span className="account__int">{ int }.</span>
                    <span className="account__float">{ frac }</span>
                </div>
                <div className="account__legend">
                    { acc.get('legend') }
                </div>
            </div>
        );
    }
}

Account.propTypes = {
    account: PropTypes.instanceOf(Map).isRequired
};
