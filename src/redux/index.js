import { combineReducers } from 'redux';
import settings from './settings';
import settingsThunk from './settingsThunk';

const rootReducer = combineReducers({
  settings,
  settingsThunk
});
export default rootReducer;