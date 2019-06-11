import api from '../api'
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

export const dispatchers = {
  SET_COLOR: color => (dispatch, getState) => {
    const { active } = getState()
    dispatch({ type: SET_COLOR, color, active })
  },
  SET_CHANNEL: (index, channel) => (dispatch, getState) => {
    const { parts } = getState()
    dispatch({
      type: SET_CHANNEL,
      index,
      channel,
      activeColor: parts[index].channels[channel].color
    })
  },
  REMOVE_PART: (index) => (dispatch, getState) => {
    const { active } = getState()
    dispatch({ type: REMOVE_PART, index, isActive: active && active.index === index })
  },
  ADD_PART: (id, { z, slots, channels }) => ({ type: ADD_PART, id, z, slots, channels }),
  SET_TITLE: (event) => ({ type: SET_TITLE, event }),
  SET_DESCRIPTION: (event) => ({ type: SET_DESCRIPTION, event }),
  SET_PRIVATE: (value) => ({ type: SET_PRIVATE, value }),
  SAVE_TOKEN: () => async (dispatch, getState) => {
    const {
      title,
      description,
      isPrivate,
      parts
    } = getState()
    const body = {
      title,
      description,
      'private': isPrivate,
      parts: parts.map(({ id, channels }) => ({ id, channels }))
    }
    dispatch({ type: SAVE_TOKEN_START })
    try {
      const location = await api.createToken(body)
      const [id] = location.slice(1).split('/')[1]
      Router.push({
        pathname: '/token',
        query: { id }
      }, location)
    } catch (err) {
      dispatch({ type: SAVE_TOKEN_END, error: err })
    }
  }
}
