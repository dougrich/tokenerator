import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { PIN_TOKEN, UNPIN_TOKEN } from './actions'

const pinned = createReducer(
  [],
  {
    [PIN_TOKEN]: (set, { id }) => {
      const next = set.slice()
      for (let i = 0; i < set.length; i++) {
        if (next[i] === id) return set
      }
      next.push(id)
      return next
    },
    [UNPIN_TOKEN]: (set, { id }) => {
      const next = set.slice()
      for (let i = 0; i < set.length; i++) {
        if (next[i] === id) {
          next.splice(i, 1)
          return next
        }
      }
      return set
    }
  }
)

export default combineReducers({
  pinned
})
