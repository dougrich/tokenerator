/**
 * This is just a common function that unwraps a key value
 */
export default (state, { key, value }) => ({
  ...state,
  [key]: value
})
