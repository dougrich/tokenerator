import api from '../api'
import actionValue from '../action-value'
import actionKeyValue from '../action-keyvalue'
import { constants } from './constants'

export const SET_LABEL = 'set-label'
export const SET_COUNT = 'set-count'
export const SET_TYPE = 'set-type'
export const SET_OPTION = 'set-option'
export const SET_STATUS = 'set-status'
export const SET_TRIM = 'set-trim'
export const SET_PLACEHOLDER = 'set-placeholder'
export const SET_PLACEHOLDER_NAME = 'set-placeholder-name'
export const ADD = 'add'
export const REMOVE = 'remove'

const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

export const dispatchers = {
  SET_LABEL: actionKeyValue(SET_LABEL),
  SET_COUNT: actionKeyValue(SET_COUNT),
  SET_TRIM: actionKeyValue(SET_TRIM),
  SET_TYPE: actionValue(SET_TYPE),
  SET_OPTION: actionKeyValue(SET_OPTION),
  SET_PLACEHOLDER: actionKeyValue(SET_PLACEHOLDER),
  SET_PLACEHOLDER_NAME: actionKeyValue(SET_PLACEHOLDER_NAME),
  ADD: actionKeyValue(ADD),
  REMOVE: actionKeyValue(REMOVE),
  DOWNLOAD: () => async (dispatch, getState) => {
    const status = (v, meta = null) => dispatch({ type: SET_STATUS,
      value: {
        state: v,
        meta
      } })
    const state = getState()
    const options = {...state.options}
    if (state.type === constants.FORMAT_PDF) {
      delete options.size
    }
    const tokens = []
    for (const k in state.tokens) {
      tokens.push({
        id: !state.tokens[k].placeholder ? k : undefined,
        ...state.tokens[k],
        trim: state.tokens[k].trim || undefined,
        placeholder: state.tokens[k].placeholder || undefined
      })
    }
    const batch = {
      type: state.type,
      params: options,
      tokens
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
