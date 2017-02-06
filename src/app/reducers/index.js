import { combineReducers } from 'redux-immutable';

import { reducer as main } from '../containers/Main';

const rootReducer = combineReducers({
    main,
    // add here other reducers
});

export default rootReducer;
