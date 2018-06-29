import * as React from 'react';
import { CURRENCIES } from '../../../config';

export const UserRatesItem = ({ rate, baseFrom, baseTo }: { rate: number, baseFrom: string, baseTo: string }) => (
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
