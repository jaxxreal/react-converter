import React from 'react';
import { render } from 'react-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';

// don't allow state modifications outside actions
configure({ enforceActions: true });

// app styles
import '../assets/styles/index.less';

import AppWrapper from './components/AppWrapper';
import exchangerStore from './stores/exchangerStore';

import configureHttpService from './http';

configureHttpService();

const stores = { exchangerStore };

render((
    <Provider { ...stores }>
        <AppWrapper/>
    </Provider>
), document.getElementById('root'));
