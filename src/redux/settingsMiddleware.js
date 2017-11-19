import { createAction } from 'redux-actions'
import { createReducer } from 'redux-ramda'
import * as R from 'ramda'
import { asOptimisticReject, fakeFetch, serviceCallFactory, withSideEffectsAdapter } from './utils'

// Action names
export const SET_READONLY_THUNK = 'APP/SETTINGS_MIDDLEWARE/SET_READONLY'
const SET_READONLY_THUNK_REJECT = asOptimisticReject(SET_READONLY_THUNK)

// State
const initialState = {readonly: false}

// Reducers
export default createReducer(initialState, [
    [SET_READONLY_THUNK, R.assoc('readonly')],
    [SET_READONLY_THUNK_REJECT, R.assoc('readonly')]
])

// Selectors
export const getSimpleState = R.path(['settingsMiddleware', 'readonly'])

const SETTINGS_SERVICE_NAME = 'settingsService'
const TOAST_SERVICE_NAME = 'settingsService'
const SHOW_TOAST = 'SHOW_TOAST'

export const showToast = createAction(
  SHOW_TOAST,
  null,
  serviceCallFactory(TOAST_SERVICE_NAME, 'showToast')
);

const rejectSettingsAction = createAction(SET_READONLY_THUNK_REJECT, readonly => !readonly)

// Action creators
// Create an action to revert 

export const setReadonly = withSideEffectsAdapter(
  createAction(
    SET_READONLY_THUNK, null, serviceCallFactory(SETTINGS_SERVICE_NAME, 'setReadonly')
  ),
  showToast('Settings has been updated'),
  [showToast('Settings update error'), rejectSettingsAction]
)

const simulateSuccessAdapter = actionCreator => payload => {
  const action = actionCreator(payload)
  action.meta.fakeResult = payload
  return action
}

export const setReadonlySuccess = simulateSuccessAdapter(setReadonly)
  

