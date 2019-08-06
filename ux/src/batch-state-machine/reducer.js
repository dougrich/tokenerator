import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import { SET_LABEL, SET_TRIM, SET_COUNT, SET_TYPE, SET_OPTION, SET_STATUS, ADD, REMOVE, SET_PLACEHOLDER, SET_PLACEHOLDER_NAME } from './actions'
import valueReducer from '../reducer-value'
import keyvalueReducer from '../reducer-keyvalue'
import { constants } from './constants'
import createDictionaryReducer from '../create-dictionary-reducer'
import { filterActions } from 'redux-ignore'

const label = createReducer('none', { [SET_LABEL]: valueReducer })
const trim = createReducer('', { [SET_TRIM]: valueReducer })
const placeholder = createReducer('', { [SET_PLACEHOLDER]: valueReducer, [ADD]: (_, { value }) => value === 'hatched' ? 'hatched' : '' })
const placeholderName = createReducer('', { [SET_PLACEHOLDER_NAME]: valueReducer })

const count = createReducer(1, {
  [SET_COUNT]: valueReducer,
  [SET_LABEL]: (current, { value }) => {
    if (current < constants.maxCount[value]) {
      return current
    }
    return constants.maxCount[value]
  }
})

const tokens = filterActions(createDictionaryReducer(combineReducers({ label, trim, count, placeholder, placeholderName }), ADD, REMOVE), [
  ADD,
  REMOVE,
  SET_LABEL,
  SET_TRIM,
  SET_PLACEHOLDER,
  SET_PLACEHOLDER_NAME,
  SET_COUNT
])

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
  tokens,
  type,
  options,
  status
})
