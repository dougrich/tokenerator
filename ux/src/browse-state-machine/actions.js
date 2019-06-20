import apiclient from '../api'

export const PIN_TOKEN = 'pin-token'
export const UNPIN_TOKEN = 'unpin-token'
export const CLEAR = 'clear'
export const LOAD_MORE_START = 'load-more-start'
export const LOAD_MORE_DONE = 'load-more-done'
export const LOAD_MORE_ERROR = 'load-more-error'

export const dispatchers = {
  PIN_TOKEN: id => ({ type: PIN_TOKEN, id }),
  UNPIN_TOKEN: id => ({ type: UNPIN_TOKEN, id }),
  LOAD_MORE: () => async (dispatch, getState) => {
    const { tokens } = getState()
    if (tokens.isLoading) return
    dispatch({ type: LOAD_MORE_START })
    try {
      const { documents, next } = await apiclient.browseTokens(tokens.next)
      dispatch({ type: LOAD_MORE_DONE, documents, next })
    } catch (error) {
      dispatch({ type: LOAD_MORE_ERROR, error })
    }
  },
  CLEAR: () => ({ type: CLEAR })
}
