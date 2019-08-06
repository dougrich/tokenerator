/**
 *
 * @param {Function} reducer for a leaf element
 * @param {string} ADD_TYPE is the type for an add action - default value is that of a dictionary and passed to reducer
 * @param {string} REMOVE_TYPE is the type for a remove action
 */
export default function (reducer, ADD_TYPE, REMOVE_TYPE) {
  return (state = {}, action) => {
    if (!action || !action.key) {
      return state
    } else if (action.type === ADD_TYPE) {
      return {
        ...state,
        [action.key]: reducer({}, action)
      }
    } else if (action.type === REMOVE_TYPE) {
      const next = { ...state }
      delete next[action.key]
      return next
    } else {
      const leaf = state[action.key]
      const next = reducer(leaf, action)
      return {
        ...state,
        [action.key]: next
      }
    }
  }
}
