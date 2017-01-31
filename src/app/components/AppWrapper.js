import React, { Component } from 'react';
import { Exchanger } from '../containers/Exchanger';

// rendered once, when app started, never will be unmount
export default class AppWrapper extends Component {

    componentWillMount() {
        console.log('AppWrapper mounted!');
    }

    render() {
        return (
            <div className="layout">
                <main>
                    <Exchanger/>
                </main>
            </div>
        );
    }
}
