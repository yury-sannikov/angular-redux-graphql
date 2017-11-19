import { createAction } from 'redux-actions'
import { createReducer } from 'redux-ramda'
import * as R from 'ramda'
import { serviceCallFactory, withSideEffectsAdapter } from './utils'
import { showToast } from './settingsMiddleware'
import { createSelector } from 'reselect'

const GRAPHQL_SERVICE_NAME = 'qraphQLService'

// Action names.
export const SUBSCRIBE = 'APP/GRAPHQL/SUBSCRIBE'
export const UPDATE = 'APP/GRAPHQL/UPDATE'

// Action creators
export const subscribe = withSideEffectsAdapter(
  createAction(
    SUBSCRIBE, null, serviceCallFactory(GRAPHQL_SERVICE_NAME, 'subscribe')
  ),
  [/* do noting on success */],
  [showToast('Unable to subscribe to graph.cool service')]
)

export const update = createAction(UPDATE)

// State
const initialState = {
  data: [],
  loading: false
}

// Reducers
export default createReducer(initialState, [
  [UPDATE, payload => R.compose(
    R.assoc('data', payload.data),
    R.assoc('loading', payload.loading)
  )]
])

// Selectors
export const getData = R.path(['graphql', 'data'])
export const getLoading = R.path(['graphql', 'loading'])

export const getEventList = createSelector(
  [ getData, getLoading ],
  (data) => {
    //heavyComputationCall();
    return data;
  }
)
