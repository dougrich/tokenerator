import createReducer from './create-reducer'
import valueReducer from './reducer-value'
import createDictionaryReducer from './create-dictionary-reducer'
import { expect } from 'chai'
import { combineReducers } from 'redux'

describe('dictionary-reducer', () => {
  const SET_COUNT = 'set-count'
  const SET_LABEL = 'set-label'
  const ADD = 'add'
  const REMOVE = 'remove'
  const count = createReducer(1, { [SET_COUNT]: valueReducer })
  const label = createReducer('', { [SET_LABEL]: valueReducer })
  const entry = combineReducers({
    count,
    label
  })
  const set = createDictionaryReducer(entry, ADD, REMOVE)
  it('defaults to an empty set', () => {
    const initial = set()
    expect(initial).to.deep.equal({})
  })
  it('adds correctly', () => {
    const next = set({}, {
      type: ADD,
      key: '1234'
    })
    expect(next).to.deep.equal({ '1234': { count: 1, label: '' } })
  })
  it('removes correctly', () => {
    const next = set({
      '1234': { count: 1, label: '' }
    }, {
      type: REMOVE,
      key: '1234'
    })
    expect(next).to.deep.equal({})
  })
  it('fires sub reducers correctly', () => {
    const next = set({
      '1234': { count: 1, label: '' }
    }, {
      type: SET_COUNT,
      key: '1234',
      value: 4
    })
    expect(next).to.deep.equal({ '1234': { count: 4, label: '' } })
  })
  it('preserves references correctly', () => {
    const side = { count: 4, label: '1234' }
    const main = { count: 1, label: '' }
    const initial = {
      '4321': side,
      '1234': main
    }
    const next = set(initial, {
      type: SET_COUNT,
      key: '1234',
      value: 4
    })
    expect(next).not.to.equal(initial)
    expect(next['4321']).to.equal(side)
    expect(next['1234']).not.to.equal(initial.main)
  })
})
