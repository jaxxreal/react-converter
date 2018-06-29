import * as React from 'react';
import * as cx from 'classnames';

export const TopMenu = ({ left = {}, center = {}, right = {}, className }: any) => (
    <div className={ cx('top-menu', className) }>
        <div className="top-menu__item">
            <button
                onClick={ left.action }
                className="btn btn_transparent top-menu__control"
            >
                { left.label }
            </button>
        </div>
        <div
            onClick={ center.action ? center.action : () => {} }
            className="top-menu__item"
        >
            { center.label }
        </div>
        <div className="top-menu__item">
            <button
                onClick={ right.action }
                className="btn btn_transparent top-menu__control"
            >
                { right.label }
            </button>
        </div>
    </div>
);
