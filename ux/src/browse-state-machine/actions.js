export const PIN_TOKEN = 'pin-token'
export const UNPIN_TOKEN = 'unpin-token'
export const CLEAR = 'clear'

export const dispatchers = {
  PIN_TOKEN: id => ({ type: PIN_TOKEN, id }),
  UNPIN_TOKEN: id => ({ type: UNPIN_TOKEN, id }),
  CLEAR: () => ({ type: CLEAR })
}
