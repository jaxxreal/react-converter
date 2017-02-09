import React, { Component } from 'react';
import { Main } from '../containers/Main';

// rendered once, when app started, never will be unmount
export default class AppWrapper extends Component {

    componentWillMount() {
        console.log('AppWrapper mounted!');
    }

    render() {
        return (
            <div className="layout">
                <Main/>
            </div>
        );
    }
}
