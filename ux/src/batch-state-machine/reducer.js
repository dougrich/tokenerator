import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { SET_LABEL, SET_COUNT, SET_TYPE, CLEAR } from './actions'

const labels = createReducer(
  {},
  {
    [SET_LABEL]: (set, { id, value }) => ({
      ...set,
      [id]: value
    }),
    [CLEAR]: () => ({})
  }
)

const count = createReducer(
  {},
  {
    [SET_COUNT]: (set, { id, value }) => ({
      ...set,
      [id]: value
    }),
    [CLEAR]: () => ({})
  }
)

const type = createReducer(
  'ZIP',
  {
    [SET_TYPE]: (_, { value }) => value,
    [CLEAR]: () => 'ZIP'
  }
)

export default combineReducers({
  labels,
  count,
  type
})
