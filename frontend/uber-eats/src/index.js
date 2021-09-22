import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import { Provider } from 'react-redux';
import rootReducer from './redux/reducer/rootReducer';
import reportWebVitals from './reportWebVitals';
import 'tachyons';
import App from './App';

// const store = createStore(rootReducer, compose(applyMiddleware(thunk),
//   // eslint-disable-next-line no-underscore-dangle
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
//   // eslint-disable-next-line function-paren-newline
// ));

ReactDOM.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <App />
    {/* </Provider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
