import { SET_COLOR, SET_CHANNEL } from './actions'
import Color from 'color'

const defaultState = {
  currentColor: null,
  parts: [
    { 'channels': { 'body': { 'color': '#FFFFFF' } }, 'id': 'elf' },
    { 'channels': { 'hair': { 'color': '#9e8fa5' } }, 'id': 'twin-strand-hair' },
    { 'channels': { 'harp': { 'color': '#713514' } }, 'id': 'harp-left' }
  ],
  active: null
}

export default (
  state = defaultState,
  action
) => {
  const { type } = action
  switch (type) {
    case SET_COLOR:
      const { color } = action
      const intermediate = {
        ...state,
        currentColor: color
      }

      if (state.active) {
        const { index, channel } = state.active
        intermediate.parts = intermediate.parts.slice()
        const part = intermediate.parts[index] = { ...intermediate.parts[index] }
        part.channels = {
          ...part.channels,
          [channel]: {
            color: color.hex().toString()
          }
        }
      }
      return intermediate

    case SET_CHANNEL:
      const { index, channel } = action
      return {
        ...state,
        active: {
          index,
          channel
        },
        currentColor: Color(state.parts[index].channels[channel].color).hsl()
      }
  }
  return state
}
