import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { PIN_TOKEN, UNPIN_TOKEN, CLEAR } from './actions'

const setOp = (onMatch, onMismatch) => (set, { id }) => {
  const next = set.slice()
  const params = { next, set, id }
  for (let i = 0; i < set.length; i++) {
    if (next[i] === id) return onMatch(params, i)
  }
  return onMismatch(params)
}

const noop = ({ set }) => set

const pinned = createReducer(
  [],
  {
    [PIN_TOKEN]: setOp(
      noop,
      ({ next, id }) => {
        next.push(id)
        return next
      }),
    [UNPIN_TOKEN]: setOp(
      ({ next }, i) => {
        next.splice(i, 1)
        return next
      },
      noop
    ),
    [CLEAR]: () => ([])
  }
)

export default combineReducers({
  pinned
})
