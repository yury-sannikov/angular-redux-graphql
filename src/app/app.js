import angular from 'angular';
import 'muicss/dist/css/mui.css';
import '../style/app.css';
const mui = require('muicss/angular');
const MODULE_NAME = 'DemoApp';

// Directives
import mainView from './directives/mainView'
import naiveSettings from './directives/naiveSettings'
import settingsThunk from './directives/settingsThunk'
import settingsWatcher from './directives/settingsWatcher'

// Services
import epicSubscription from '../app/providers/epicSubscription'

// Redux
import rootReducer from '../redux';
import ngRedux from 'ng-redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { init as InitSettings } from '../redux/settings'


angular.module(MODULE_NAME, [mui, ngRedux])
  .provider('epicSubscription', epicSubscription)
  .config(($ngReduxProvider, epicSubscriptionProvider) => {
    const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    const middleware = reduxDevTools ? [reduxDevTools] : [];

    const epicMiddleware = epicSubscriptionProvider.setupEpicMiddleware()

    $ngReduxProvider.createStoreWith(rootReducer, [
      thunk,
      logger,
      epicMiddleware
    ], middleware);
  })
  .run(($ngRedux) => {
    $ngRedux.dispatch(InitSettings()) 
  })
  .directive('mainView', mainView)
  .directive('naiveSettings', naiveSettings)
  .directive('settingsThunk', settingsThunk)
  .directive('settingsWatcher', settingsWatcher)

export default MODULE_NAME;