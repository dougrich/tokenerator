import api from '../api'
import actionValue from '../action-value'
import actionKeyValue from '../action-keyvalue'
import { constants } from './constants'

export const SET_LABEL = 'set-label'
export const SET_COUNT = 'set-count'
export const SET_TYPE = 'set-type'
export const SET_OPTION = 'set-option'
export const SET_STATUS = 'set-status'

const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

export const dispatchers = {
  SET_LABEL: actionKeyValue(SET_LABEL),
  SET_COUNT: actionKeyValue(SET_COUNT),
  SET_TYPE: actionValue(SET_TYPE),
  SET_OPTION: actionKeyValue(SET_OPTION),
  DOWNLOAD: (ids) => async (dispatch, getState) => {
    const status = (v, meta = null) => dispatch({ type: SET_STATUS,
      value: {
        state: v,
        meta
      } })
    const state = getState()
    const batch = {
      type: state.type,
      params: state.options,
      tokens: ids.map(id => ({
        id,
        count: parseInt(state.count[id]) || 1,
        label: state.labels[id] || constants.LABEL_NONE
      }))
    }
    status(constants.STATE_POST)
    let batchid
    try {
      batchid = await api.createBatch(batch)
      let tryCount = 1
      while (true) {
        status(constants.STATE_CHECK, tryCount)
        const exists = await api.checkBatch(batchid)
        await delay(1000)
        if (exists) {
          break
        }
        tryCount++
      }
    } catch (error) {
      status(constants.STATE_ERROR, error.message)
      return
    }
    const url = api.checkBatch.route(batchid)
    status(constants.STATE_DONE, url)
    const atag = document.createElement('a')
    atag.href = url
    atag.download = 'batch'
    atag.click()
  }
}
