import apiclient from '../api'

export const PIN_TOKEN = 'pin-token'
export const UNPIN_TOKEN = 'unpin-token'
export const CLEAR = 'clear'
export const LOAD_MORE_START = 'load-more-start'
export const LOAD_MORE_DONE = 'load-more-done'
export const LOAD_MORE_ERROR = 'load-more-error'
export const SET_FILTER_START = 'set-filter'

const load = async (filter, isAppend, continuation, dispatch) => {
  try {
    const { documents, next } = await apiclient.browseTokens(filter, continuation)
    dispatch({ type: LOAD_MORE_DONE, documents, next, isAppend })
  } catch (error) {
    dispatch({ type: LOAD_MORE_ERROR, error })
  }
}

export const dispatchers = {
  PIN_TOKEN: id => ({ type: PIN_TOKEN, id }),
  UNPIN_TOKEN: id => ({ type: UNPIN_TOKEN, id }),
  LOAD_MORE: () => async (dispatch, getState) => {
    const { filter, tokens } = getState()
    if (tokens.isLoading) return
    dispatch({ type: LOAD_MORE_START })
    await load(filter, true, tokens.next, dispatch)
  },
  SET_FILTER: (e) => async (dispatch, getState) => {
    const { tokens } = getState()
    if (tokens.isLoading) return
    dispatch({ type: SET_FILTER_START, value: e.target.value })
    await load(e.target.value, false, null, dispatch)
  },
  CLEAR: () => ({ type: CLEAR })
}
