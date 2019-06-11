
import { createStore } from 'redux'
import reducer from './reducer'
export { dispatchers } from './actions'

export default createStore(reducer)
