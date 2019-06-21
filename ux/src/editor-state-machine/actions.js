import api from '../api'
import actionValue from '../action-value'
import Router from 'next/router'

export const SET_COLOR = 'set-color'
export const SET_CHANNEL = 'set-channel'
export const REMOVE_PART = 'remove-part'
export const ADD_PART = 'add-part'
export const SET_TITLE = 'set-title'
export const SET_DESCRIPTION = 'set-description'
export const SET_PRIVATE = 'set-private'
export const SAVE_TOKEN_START = 'save-token-start'
export const SAVE_TOKEN_END = 'save-token-end'
export const CLEAR_PARTS = 'clear-parts'
export const UNDO = 'undo'
export const REDO = 'redo'
export const SET_ADVANCED = 'set-advanced'
export const SWAP_PARTS = 'swap-parts'

export const dispatchers = {
  SET_COLOR: value => (dispatch, getState) => {
    const { present: { active } } = getState()
    dispatch({ type: SET_COLOR, value, active })
  },
  SET_CHANNEL: (index, channel) => (dispatch, getState) => {
    const { present: { parts } } = getState()
    dispatch({
      type: SET_CHANNEL,
      index,
      channel,
      activeColor: parts[index].channels[channel].color
    })
  },
  REMOVE_PART: (index) => (dispatch, getState) => {
    const { present: { active } } = getState()
    dispatch({ type: REMOVE_PART, index, isActive: active && active.index === index })
  },
  ADD_PART: (id, { z, slots, channels }) => (dispatch, getState) => {
    const { present: { isAdvanced } } = getState()
    dispatch({ type: ADD_PART, id, z, slots, channels, isAdvanced })
  },
  SET_TITLE: actionValue(SET_TITLE),
  SET_DESCRIPTION: actionValue(SET_DESCRIPTION),
  SET_PRIVATE: actionValue(SET_PRIVATE),
  SAVE_TOKEN: () => async (dispatch, getState) => {
    const {
      present: {
        title,
        description,
        isPrivate,
        parts
      }
    } = getState()
    const body = {
      title,
      description,
      'private': isPrivate,
      parts: parts.map(({ id, channels }) => ({ id, channels }))
    }
    dispatch({ type: SAVE_TOKEN_START })
    try {
      const [location, id] = await api.createToken(body)
      Router.push({
        pathname: '/token',
        query: { id }
      }, location)
    } catch (err) {
      dispatch({ type: SAVE_TOKEN_END, error: err })
    }
  },
  CLEAR_PARTS: () => ({ type: CLEAR_PARTS }),
  UNDO: () => ({ type: UNDO }),
  REDO: () => ({ type: REDO }),
  SET_ADVANCED: actionValue(SET_ADVANCED),
  SWAP_PARTS: (i, j) => ({ type: SWAP_PARTS, i, j }),
  DELETE_ACTIVE: () => (dispatch, getState) => {
    const { present: { active } } = getState()
    dispatch({ type: REMOVE_PART, index: active.index, isActive: true })
  }
}
