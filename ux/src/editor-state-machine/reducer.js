import { SET_COLOR, SET_CHANNEL, REMOVE_PART, ADD_PART, SET_DESCRIPTION, SET_TITLE, SET_PRIVATE, CLEAR_PARTS, UNDO, REDO, SAVE_TOKEN_START, SAVE_TOKEN_END, SET_ADVANCED, SWAP_PARTS } from './actions'
import Color from 'color'
import { combineReducers } from 'redux'
import createReducer from '../create-reducer'
import valueReducer from '../reducer-value'
import undoable, { groupByActionTypes, excludeAction } from 'redux-undo'

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
    [ADD_PART]: (current, { id, z, slots, channels, isAdvanced }) => {
      const next = []

      if (isAdvanced) {
        next.push(...current)
        next.push({ id, channels, z, slots })
        return next
      }

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
    [SWAP_PARTS]: (current, { i, j }) => {
      const next = current.slice()
      const original = next[i]
      next[i] = next[j]
      next[j] = original
      return next
    },
    [CLEAR_PARTS]: () => ([])
  }
)

const isSaving = createReducer(
  false,
  {
    [SAVE_TOKEN_START]: () => true,
    [SAVE_TOKEN_END]: () => false
  }
)

const isAdvanced = createReducer(false, { [SET_ADVANCED]: valueReducer })

const saveError = createReducer(
  null,
  {
    [SAVE_TOKEN_START]: () => null,
    [SAVE_TOKEN_END]: (_, { error }) => error.message
  }
)

export default undoable(
  combineReducers({
    currentColor,
    title,
    description,
    isPrivate,
    parts,
    active,
    isSaving,
    saveError,
    isAdvanced
  }),
  {
    undoType: UNDO,
    redoType: REDO,
    groupBy: groupByActionTypes([
      SET_COLOR,
      SET_TITLE,
      SET_DESCRIPTION
    ]),
    filter: excludeAction([
      SAVE_TOKEN_START,
      SAVE_TOKEN_END
    ])
  }
)
