/**
 * createReducer creates a map reducer
 * taken from https://redux.js.org/recipes/reducing-boilerplate#generating-reducers
 */
export default function createReducer (initial, handlers) {
  return function reducer (state = initial, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
