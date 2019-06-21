import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { SET_LABEL, SET_COUNT, SET_TYPE, SET_OPTION, SET_STATUS } from './actions'
import valueReducer from '../reducer-value'
import keyvalueReducer from '../reducer-keyvalue'

const labels = createReducer({}, { [SET_LABEL]: keyvalueReducer })

const count = createReducer({}, { [SET_COUNT]: keyvalueReducer })

const type = createReducer('ZIP', { [SET_TYPE]: valueReducer })

const status = createReducer(null, { [SET_STATUS]: valueReducer })

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
  type,
  status
})
