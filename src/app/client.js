import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// app styles
import '../assets/styles/index.less';

import configureStore from './store/configureStore';
import AppWrapper from './components/AppWrapper';

import configureHttpService from './http';

const store = configureStore();

configureHttpService(store);

render((
    <Provider store={ store }>
        <AppWrapper/>
    </Provider>
), document.getElementById('root'));

window.onbeforeunload = () => {
    const state = store.getState();
    localStorage.setItem('operations', JSON.stringify(state.getIn(['main', 'operations']).toJS()));
};
