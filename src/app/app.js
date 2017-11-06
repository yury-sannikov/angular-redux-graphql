import angular from 'angular';
import 'muicss/dist/css/mui.css';
const mui = require('muicss/angular');
const MODULE_NAME = 'DemoApp';

// Directives
import mainView from './directives/mainView'
import naiveSettings from './directives/naiveSettings'

// Services
import epicSubscription from '../app/providers/epicSubscription'

// Redux
import rootReducer from '../redux';
import ngRedux from 'ng-redux';
import logger from 'redux-logger'
import { init as InitSettings } from '../redux/settings'


angular.module(MODULE_NAME, [mui, ngRedux])
  .provider('epicSubscription', epicSubscription)
  .config(($ngReduxProvider, epicSubscriptionProvider) => {
    const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    const middleware = reduxDevTools ? [reduxDevTools] : [];

    const epicMiddleware = epicSubscriptionProvider.setupEpicMiddleware()

    $ngReduxProvider.createStoreWith(rootReducer, [logger, epicMiddleware], middleware);
  })
  .run(($ngRedux) => {
    $ngRedux.dispatch(InitSettings())
  })
  .directive('mainView', mainView)
  .directive('naiveSettings', naiveSettings)

export default MODULE_NAME;