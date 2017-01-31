import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

export const Operations = ({ operations }) => (
    <ul className="exchanger__history">
        { operations.map((op) => (
            <li key={ op.createdAt } className="exchanger__history-item">
                <div className="operation">
                    <div className="operation__icon"/>
                    <div className="operation__details">
                        <div className="operation__legend">
                            Exchanged from { op.outcomeCurrency }
                        </div>
                        <div className="operation__time">
                            { op.createdAt.getHours() }:{ op.createdAt.getMinutes() }
                        </div>
                    </div>
                    <ul className="operation__amount">
                        <li className="operation__amount-item operation__amount-item_income">
                            + { op.income }
                        </li>
                        <li className="operation__amount-item operation__amount-item_outcome">
                            - { op.outcome }
                        </li>
                    </ul>
                </div>
            </li>
        ))}
        { operations.isEmpty() ? (
            <li className="exchanger__history-item exchanger__history-item_empty">
                You have no operations. Nice chance to try, isn&#39;t it?
            </li>
        ) : null }
    </ul>
);

Operations.propTypes = {
    operations: PropTypes.instanceOf(List).isRequired,
};

export default connect(
    state => ({
        operations: state.getIn(['exchanger', 'operations'], new List()),
    }),
)(Operations);
