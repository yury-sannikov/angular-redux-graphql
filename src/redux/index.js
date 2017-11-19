import { combineReducers } from 'redux';
import settings from './settings';
import settingsThunk from './settingsThunk';
import settingsMiddleware from './settingsMiddleware';
import graphql from './graphql'

const rootReducer = combineReducers({
  settings,
  settingsThunk,
  settingsMiddleware,
  graphql
});
export default rootReducer;