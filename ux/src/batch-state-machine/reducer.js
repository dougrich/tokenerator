import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { SET_LABEL, SET_COUNT, SET_TYPE, SET_OPTION, CLEAR } from './actions'
import valueReducer from '../reducer-value'
import keyvalueReducer from '../reducer-keyvalue'

const clearable = (others, value) => createReducer(
  value(),
  {
    ...others,
    [CLEAR]: value
  }
)

const labels = clearable({ [SET_LABEL]: keyvalueReducer }, () => ({}))

const count = clearable({ [SET_COUNT]: keyvalueReducer }, () => ({}))

const type = clearable({ [SET_TYPE]: valueReducer }, () => 'ZIP')

const options = createReducer(
  {
    name: '',
    page: 'letter',
    size: 140
  },
  {
    [SET_OPTION]: keyvalueReducer
  }
)

export default combineReducers({
  labels,
  options,
  count,
  type
})
