import { SET_COLOR, SET_CHANNEL, REMOVE_PART, ADD_PART, SET_DESCRIPTION, SET_TITLE, SET_PRIVATE, CLEAR_PARTS } from './actions'
import Color from 'color'
import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import valueReducer from '../reducer-value'

const currentColor = createReducer(
  null,
  {
    [SET_COLOR]: valueReducer,
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
    },
    [ADD_PART]: () => null
  }
)

const title = createReducer('', { [SET_TITLE]: valueReducer })

const description = createReducer('', { [SET_DESCRIPTION]: valueReducer })

const isPrivate = createReducer(false, { [SET_PRIVATE]: valueReducer })

const parts = createReducer(
  [],
  {
    [SET_COLOR]: (current, { active, value }) => {
      if (!active) return current
      const { index, channel } = active
      const updated = current.slice()
      const part = updated[index] = { ...updated[index] }
      part.channels = {
        ...part.channels,
        [channel]: {
          color: value.hex().toString()
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
        if ((slots & other.slots) > 0) continue

        if (other.z > z) {
          next.push({ id, channels, z, slots })
          z = Infinity
        }

        next.push(other)
      }
      if (z < Infinity) {
        next.push({ id, channels, z, slots })
      }
      return next
    },
    [CLEAR_PARTS]: (current) => ([])
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
