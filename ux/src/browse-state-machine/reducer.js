import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import valueReducer from '../reducer-value'
import { PIN_TOKEN, UNPIN_TOKEN, CLEAR, LOAD_MORE_START, LOAD_MORE_DONE, LOAD_MORE_ERROR, SET_FILTER_START } from './actions'

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

const tokens = createReducer(
  {
    set: [],
    isLoading: false,
    next: null,
    error: null
  },
  {
    [LOAD_MORE_START]: (state) => ({
      set: state.set,
      next: state.next,
      isLoading: true,
      error: null
    }),
    [SET_FILTER_START]: (state) => ({
      set: state.set,
      next: null,
      isLoading: true,
      error: null
    }),
    [LOAD_MORE_DONE]: (state, { documents, next, isAppend }) => ({
      set: isAppend ? [...state.set, ...documents] : documents,
      next,
      isLoading: false,
      error: null
    }),
    [LOAD_MORE_ERROR]: (state, { error }) => ({
      set: state.set,
      next: state.next,
      isLoading: false,
      error: error.message
    })
  }
)

const filter = createReducer(
  'all',
  {
    [SET_FILTER_START]: valueReducer
  }
)

export default combineReducers({
  pinned,
  tokens,
  filter
})
