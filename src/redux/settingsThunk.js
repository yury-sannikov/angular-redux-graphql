import { createAction } from 'redux-actions'
import { createReducer } from 'redux-ramda'
import * as R from 'ramda'
import { asRequest, asResponse, asError, fakeFetch } from './utils'

// Action names.
export const SET_READONLY_THUNK = 'APP/SETTINGS_THUNK/SET_READONLY'
const SET_READONLY_THUNK_REQUEST = asRequest(SET_READONLY_THUNK)
const SET_READONLY_THUNK_RESPONSE = asResponse(SET_READONLY_THUNK)
const SET_READONLY_THUNK_ERROR = asError(SET_READONLY_THUNK)

// State
const initialState = {readonly: false}

// Reducers
export default createReducer(initialState, [
    [
        SET_READONLY_THUNK_REQUEST,  R.compose(
            R.assoc('fetching'),
            R.always(true)
        )
    ],
    [
        SET_READONLY_THUNK_RESPONSE, payload => R.compose(
            R.assoc('readonly', payload),
            R.assoc('fetching', false)
        )
    ],
    [
        SET_READONLY_THUNK_ERROR,  R.compose(
            R.assoc('fetching'),
            R.always(false)
        )
    ]
])

// Selectors
export const getSimpleState = R.path(['settingsThunk', 'readonly'])
export const getFetchingState = R.path(['settingsThunk', 'fetching'])

const API_URL_THUNK = 'http://localhost:2020/api'
const setReadonlyRequestAction = createAction(SET_READONLY_THUNK_REQUEST)
const setReadonlyResponseAction = createAction(SET_READONLY_THUNK_RESPONSE)
const setReadonlyErrorAction = createAction(SET_READONLY_THUNK_ERROR)

const setReadonlyThunkFn = feedback => result => readonly => dispatch => {
    feedback && dispatch(setReadonlyRequestAction(readonly))
    return fakeFetch(API_URL_THUNK, {method: 'POST',body: {readonly}}, result(readonly))
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => dispatch(setReadonlyResponseAction(data)))
        .catch(error => dispatch(setReadonlyErrorAction(error)));
}

// Action creators
export const setReadonlyThunk = setReadonlyThunkFn(false)(() => undefined)
export const setReadonlyThunkSuccess = setReadonlyThunkFn(false)(r => r)
export const setReadonlyThunkWithFeedback = setReadonlyThunkFn(true)(() => undefined)
export const setReadonlyThunkWithFeedbackSuccess = setReadonlyThunkFn(true)(r => r)