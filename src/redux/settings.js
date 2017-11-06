import { createAction } from 'redux-actions'
import { createReducer } from 'redux-ramda'
import * as R from 'ramda'

// Action names.
// Do not user action names to dispatch, instead export action creators
export const INIT = 'APP/SETTINGS/INIT'
export const SET_READONLY = 'APP/SETTINGS/READONLY'

// Action creators
export const init = createAction(INIT)
export const setReadonly = createAction(SET_READONLY)

// State
const initialState = {}

// Reducers
export default createReducer(initialState, [
  [INIT, _ => R.always(initialState)],
  [SET_READONLY, R.assoc('readonly')]
])

// Selectors
export const getSimpleState = R.path(['settings', 'readonly'])
