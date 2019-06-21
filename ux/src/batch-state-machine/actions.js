import api from '../api'
import actionValue from '../action-value'

export const SET_LABEL = 'set-label'
export const SET_COUNT = 'set-count'
export const SET_TYPE = 'set-type'
export const SET_OPTION = 'set-option'
export const CLEAR = 'clear'

export const dispatchers = {
  SET_LABEL: actionValue(SET_LABEL),
  SET_COUNT: actionValue(SET_COUNT),
  SET_TYPE: actionValue(SET_TYPE),
  SET_OPTION: (key, value) => ({ type: SET_OPTION, key, value }),
  CLEAR: () => ({ type: CLEAR }),
  DOWNLOAD: (ids) => async (dispatch, getState) => {
    const state = getState()
    const batch = {
      type: state.type,
      params: state.options,
      tokens: ids.map(id => ({
        id,
        count: parseInt(state.count[id]) || 1,
        label: state.labels[id] || 'none'
      }))
    }
    const batchid = await api.createBatch(batch)
    let tryCount = 0
    while (!await api.checkBatch(batchid) && (tryCount++) < 5);
    const url = api.checkBatch.route(batchid)
    const atag = document.createElement('a')
    atag.href = url
    atag.download = 'batch'
    atag.click()
  }
}
