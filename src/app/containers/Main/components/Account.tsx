import React, { PureComponent } from 'react';
import { IAccount } from '../../../stores/exchangerStore';

export class Account extends PureComponent<{ account: IAccount }, React.ComponentState> {
    getAmountParts() {
        const amountStr = this.props.account.amount.toFixed(2);
        return amountStr.split('.');
    }

    render() {
        const [int, frac] = this.getAmountParts();
        const { account: acc } = this.props;
        return (
            <div className="account">
                <div className="account__main">
                    <span className="account__sign">{ acc.sign }</span>
                    <span className="account__int">{ int }.</span>
                    <span className="account__float">{ frac }</span>
                </div>
                <div className="account__legend">
                    { acc.legend }
                </div>
            </div>
        );
    }
}
