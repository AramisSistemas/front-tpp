import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'   
import messagesReducer from './messagesducks';
import operationsReducer from './operationsducks';
import liquidacionesReducer from './liquidacionesducks';
import usersReducer, {userisactive} from './usersducks'  

const rootReducer = combineReducers({ 
    users: usersReducer ,
    messages: messagesReducer,
    operations: operationsReducer,
    liquidaciones:liquidacionesReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(){
    const store = createStore( rootReducer,  composeEnhancers( applyMiddleware(thunk) ))
    userisactive()(store.dispatch)
    return store;
}