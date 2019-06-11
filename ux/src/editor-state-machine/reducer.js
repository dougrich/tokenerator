import { SET_COLOR, SET_CHANNEL, REMOVE_PART } from './actions'
import Color from 'color'
import { combineReducers } from 'redux'

/**
 * createReducer creates a map reducer
 * taken from https://redux.js.org/recipes/reducing-boilerplate#generating-reducers
 */
function createReducer (initial, handlers) {
  return function reducer (state = initial, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

const currentColor = createReducer(
  null,
  {
    [SET_COLOR]: (_, { color }) => {
      return color
    },
    [SET_CHANNEL]: (_, { activeColor }) => {
      return Color(activeColor).hsl()
    },
    [REMOVE_PART]: (current, { isActive }) => {
      return isActive ? null : current
    }
  }
)

const active = createReducer(
  null,
  {
    [SET_CHANNEL]: (_, { index, channel }) => {
      return { index, channel }
    },
    [REMOVE_PART]: (current, { isActive }) => {
      return isActive ? null : current
    }
  }
)

const parts = createReducer(
  [
    { 'channels': { 'body': { 'color': '#FFFFFF' } }, 'id': 'elf' },
    { 'channels': { 'hair': { 'color': '#9e8fa5' } }, 'id': 'twin-strand-hair' },
    { 'channels': { 'harp': { 'color': '#713514' } }, 'id': 'harp-left' }
  ],
  {
    [SET_COLOR]: (current, { active, color }) => {
      if (!active) return current
      const { index, channel } = active
      const updated = current.slice()
      const part = updated[index] = { ...updated[index] }
      part.channels = {
        ...part.channels,
        [channel]: {
          color: color.hex().toString()
        }
      }
      return updated
    },
    [REMOVE_PART]: (current, { index }) => {
      const updated = current.slice()
      updated.splice(index, 1)
      return updated
    }
  }
)

export default combineReducers({
  currentColor,
  parts,
  active
})
