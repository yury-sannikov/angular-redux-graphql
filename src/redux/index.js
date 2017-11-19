import { combineReducers } from 'redux';
import settings from './settings';
import settingsThunk from './settingsThunk';
import settingsMiddleware from './settingsMiddleware';

const rootReducer = combineReducers({
  settings,
  settingsThunk,
  settingsMiddleware
});
export default rootReducer;