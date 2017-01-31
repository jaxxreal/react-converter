import { combineReducers } from 'redux-immutable';

import { reducer as exchanger } from '../containers/Exchanger';

const rootReducer = combineReducers({
    exchanger,
    // add here other reducers
});

export default rootReducer;
