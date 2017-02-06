import React, { PropTypes } from 'react';
import cx from 'classnames';

export const TopMenu = ({ left, center, right, className }) => (
    <div className={ cx('top-menu', className) }>
        <button
            onClick={ left.action }
            className="btn btn_transparent top-menu__control"
        >
            { left.label }
        </button>
        <div
            onClick={ center.action ? center.action : () => {} }
            className="top-menu__item"
        >
            { center.label }
        </div>
        <button
            onClick={ right.action }
            className="btn btn_transparent top-menu__control"
        >
            { right.label }
        </button>
    </div>
);

const itemType = PropTypes.shape({
    action: PropTypes.func.isRequried,
    label: PropTypes.oneOf([
        PropTypes.node.isRequreied,
        PropTypes.element.isRequreied,
        PropTypes.string.isRequreied,
    ]).isRequried,
});

TopMenu.propTypes = {
    className: PropTypes.string,
    left: itemType,
    center: PropTypes.shape({
        action: PropTypes.func,
        label: PropTypes.oneOf([
            PropTypes.node.isRequreied,
            PropTypes.element.isRequreied,
            PropTypes.string.isRequreied,
        ]).isRequried,
    }),
    right: itemType,
};
