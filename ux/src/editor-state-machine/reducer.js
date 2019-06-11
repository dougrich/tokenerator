import { SET_COLOR, SET_CHANNEL, REMOVE_PART, ADD_PART, SET_DESCRIPTION, SET_TITLE, SET_PRIVATE } from './actions'
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

const title = createReducer(
  '',
  {
    [SET_TITLE]: (_, { event }) => event.target.value
  }
)

const description = createReducer(
  '',
  {
    [SET_DESCRIPTION]: (_, { event }) => event.target.value
  }
)

const isPrivate = createReducer(
  false,
  {
    [SET_PRIVATE]: (_, { value }) => value
  }
)

const parts = createReducer(
  [],
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
    },
    [ADD_PART]: (current, { id, z, slots, channels }) => {
      const next = []
      for (let i = 0; i < current.length; i++) {
        const other = current[i]
        // if they collide
        if (slots & other.slots > 0) continue

        if (other.z > z) {
          next.push({ id, channels, z, slots })
          z = -1
        }

        next.push(other)
      }
      if (z >= 0) {
        next.push({ id, channels, z, slots })
      }
      return next
    }
  }
)

export default combineReducers({
  currentColor,
  title,
  description,
  isPrivate,
  parts,
  active
})
