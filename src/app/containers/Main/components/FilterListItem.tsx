import * as React from 'react';

interface FilterListItemProps {
    clickItem: any;
    id: any;
    desc: string;
}
export default class FilterListItem extends React.PureComponent<FilterListItemProps, {}> {
    clickItem = () => {
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
