export const SET_COLOR = 'set-color'
export const SET_CHANNEL = 'set-channel'
export const REMOVE_PART = 'remove-part'

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
  }
}
