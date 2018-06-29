import * as React from 'react';

export const SvgIcon = (props: { className: string, svg: { id: string, viewBox: string, content: string } }) => (
    <svg className={ props.className } viewBox={props.svg.viewBox}>
        <use xlinkHref={ `#${props.svg.id}` }/>
    </svg>
);
