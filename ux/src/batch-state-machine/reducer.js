import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { SET_LABEL, SET_COUNT, SET_TYPE, SET_OPTION, SET_STATUS } from './actions'
import valueReducer from '../reducer-value'
import keyvalueReducer from '../reducer-keyvalue'
import { constants } from './constants'

const labels = createReducer({}, { [SET_LABEL]: keyvalueReducer })

const count = createReducer({}, {
  [SET_COUNT]: keyvalueReducer,
  [SET_LABEL]: (current, { key, value }) => {
    if (!current[key] || current[key] < constants.maxCount[value]) {
      return current
    }
    return {
      ...current,
      [key]: constants.maxCount[value]
    }
  }
})

const type = createReducer(constants.FORMAT_ZIP, { [SET_TYPE]: valueReducer })

const status = createReducer(null, { [SET_STATUS]: valueReducer })

const options = createReducer(
  {
    name: '',
    page: constants.PAGE_LETTER,
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
