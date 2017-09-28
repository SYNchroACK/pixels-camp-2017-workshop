import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import todoReducer from './reducers/todo';

const reducer = combineReducers({
    todo: todoReducer
});

export default createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);
