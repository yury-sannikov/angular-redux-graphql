import { createAction } from 'redux-actions'
import { createReducer } from 'redux-ramda'
import * as R from 'ramda'


const INIT = 'APP/SETTINGS/INIT'
const SET_READONLY = 'APP/SETTINGS/READONLY'

// Actions
export const setReadonly = createAction(SET_READONLY)

// State
const initialState = {}

// Reducers
export default createReducer(initialState, [
  [INIT, _ => R.always(initialState)],
  [SET_READONLY, R.assoc('readonly')]
])

// Selectors
export const getReadonly = (state) => state.readonly

/*
import { createSelector } from 'reselect'

const getVisibilityFilter = state => state.visibilityFilter
const getTodos = state => state.todos

export const getVisibleTodos = createSelector(
  [getVisibilityFilter, getTodos],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)
*/