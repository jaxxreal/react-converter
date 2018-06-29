import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import { TARGET_CURRENCIES } from '../../../config';
import cachedIcon from '../../../../assets/icons/cached.svg';

export const Operations = ({ operations }) => (
    <ul className="main__history">
        { operations.map((op) => (
            <li key={ op.get('createdAt') } className="main__history-item">
                <div className="operation">
                    <div className="operation__icon">
                        <svg className="icon icon_cached">
                            <use xlinkHref={ cachedIcon }/>
                        </svg>
                    </div>
                    <div className="operation__details">
                        <div className="operation__legend">
                            Exchanged from { op.get('outcomeCurrency') } to { op.get('incomeCurrency') }
                        </div>
                        <div className="operation__time">
                            { op.get('createdAt').getHours() }:{ getMinutes(op.get('createdAt')) }
                        </div>
                    </div>
                    <div className="operation__amount">
                        <div className="operation__income">
                            <span className="operation__amount-prefix">
                                + { getSign(op.get('incomeCurrency')) }
                            </span>
                            { op.get('income') }
                        </div>
                        <div className="operation__outcome">
                            <span className="operation__amount-prefix">
                                - { getSign(op.get('outcomeCurrency')) }
                            </span>
                            { op.get('outcome') }
                        </div>
                    </div>
                </div>
            </li>
        ))}
        { operations.isEmpty() ?
            <li className="main__history-item main__history-item_empty">
                You have no operations. Nice chance to try, isn&#39;t it?
            </li>
            : null }
    </ul>
);

Operations.propTypes = {
    operations: PropTypes.instanceOf(List).isRequired,
};

export default connect(
    state => ({
        operations: state.getIn(['main', 'operations'], new List()),
    }),
)(Operations);

function getMinutes(date) {
    return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
}

function getSign(base) {
    return TARGET_CURRENCIES.find(v => v[0] === base)[1];
}
