import React, { PureComponent, PropTypes } from 'react';

export default class FilterListItem extends PureComponent {
    constructor(props) {
        super(props);
        this.clickItem = this.clickItem.bind(this);
    }
    clickItem() {
        this.props.clickItem(this.props.id);
    }
    render() {
        return (
            <li
                onClick={ this.clickItem }
                className="rates__item rates__item_clickable"
            >
                { this.props.desc }
            </li>
        );
    }
}

FilterListItem.propTypes = {
    desc: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    clickItem: PropTypes.func.isRequired,
};
