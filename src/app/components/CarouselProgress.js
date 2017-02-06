import React, { PropTypes } from 'react';
import cx from 'classnames';
import _uniqueId from 'lodash/uniqueId';

export const CarouselProgress = ({ size, selectedIdx }) => (
    <div className="carousel-progress">
        <div className="carousel-progress__inner">
            { Array(size).fill(Math.random()).map((key, idx) => (
                <div
                    key={ _uniqueId('progress_item_') }
                    className={ cx('carousel-progress__item', {
                        'carousel-progress__item_active': idx === selectedIdx,
                    }) }
                />
            )) }
        </div>
    </div>
);

CarouselProgress.propTypes = {
    selectedIdx: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
};
