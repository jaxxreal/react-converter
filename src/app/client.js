import 'babel-polyfill';

// app styles
import '../assets/styles/index.less';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

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
