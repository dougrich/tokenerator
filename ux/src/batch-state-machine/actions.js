import api from '../api'

export const SET_LABEL = 'set-label'
export const SET_COUNT = 'set-count'
export const SET_TYPE = 'set-type'
export const CLEAR = 'clear'

export const dispatchers = {
  SET_LABEL: (id, value) => ({ type: SET_LABEL, id, value }),
  SET_COUNT: (id, value) => ({ type: SET_COUNT, id, value }),
  SET_TYPE: (value) => ({ type: SET_TYPE, value }),
  CLEAR: () => ({ type: CLEAR }),
  DOWNLOAD: (ids) => async (dispatch, getState) => {
    const state = getState()
    const batch = {
      type: state.type,
      params: {},
      tokens: ids.map(id => ({
        id,
        count: parseInt(state.count[id]) || 1,
        label: state.labels[id] || 'none'
      }))
    }
    const batchid = await api.createBatch(batch)
    while (!await api.checkBatch(batchid));
    const url = api.checkBatch.route(batchid)
    const atag = document.createElement('a')
    atag.href = url
    atag.download = 'batch'
    atag.click()
  }
}
