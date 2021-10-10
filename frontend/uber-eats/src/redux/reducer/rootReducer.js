import { combineReducers } from "redux";
import authReducer from "./authReducer";
import ordersReducer from "./ordersReducer";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import deliveryReducer from "./deliveryReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  order: ordersReducer,
  delivery: deliveryReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  compose(
    applyMiddleware(thunk),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    // eslint-disable-next-line function-paren-newline
  )
);

const persistor = persistStore(store);

export { store, persistor };
