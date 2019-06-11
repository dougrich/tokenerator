export const SET_COLOR = 'set-color'
export const SET_CHANNEL = 'set-channel'

export const dispatchers = {
  SET_COLOR: color => ({ type: SET_COLOR, color }),
  SET_CHANNEL: (index, channel) => ({ type: SET_CHANNEL, index, channel })
}
