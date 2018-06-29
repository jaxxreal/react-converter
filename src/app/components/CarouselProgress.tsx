import React from 'react';
import cx from 'classnames';
import _uniqueId from 'lodash/uniqueId';

interface CarouselProgressProps {
    size: number;
    selectedIdx: number;
}

export const CarouselProgress = ({ size, selectedIdx }: CarouselProgressProps) => (
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
