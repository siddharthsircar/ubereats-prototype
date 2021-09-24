import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    auth: authReducer,
});


const store = createStore(rootReducer, compose(applyMiddleware(thunk),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    // eslint-disable-next-line function-paren-newline
));


export default store;
