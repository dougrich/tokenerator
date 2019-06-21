
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
export { dispatchers } from './actions'

export default (initial) => createStore(reducer, initial, applyMiddleware(thunk))
