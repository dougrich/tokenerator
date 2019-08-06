
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
import { dispatchers } from './actions'
export { dispatchers }
export { constants } from './constants'

export default (ids) => {
  const store = createStore(reducer, applyMiddleware(thunk))
  for (const id of ids) {
    store.dispatch(dispatchers.ADD(id))
  }
  return store
}
