
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
export { dispatchers } from './actions'
export { constants } from './constants'

export default () => createStore(reducer, applyMiddleware(thunk))
