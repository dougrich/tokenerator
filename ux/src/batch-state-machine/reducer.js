import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { SET_LABEL, SET_COUNT, SET_TYPE, SET_OPTION, CLEAR } from './actions'

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

const options = createReducer(
  {
    name: '',
    page: 'letter',
    size: 140
  },
  {
    [SET_OPTION]: (state, { key, value }) => ({
      ...state,
      [key]: value
    })
  }
)

export default combineReducers({
  labels,
  options,
  count,
  type
})
