import angular from 'angular';
import 'muicss/dist/css/mui.css';
import '../style/app.css';
const mui = require('muicss/angular');
const toastr = require('angular-toastr');
const angularAnimate = require('angular-animate');
const MODULE_NAME = 'DemoApp';

// Directives
import mainView from './directives/mainView'
import naiveSettings from './directives/naiveSettings'
import settingsThunk from './directives/settingsThunk'
import settingsMiddleware from './directives/settingsMiddleware'
import settingsWatcher from './directives/settingsWatcher'

// Services
import epicSubscription from '../app/providers/epicSubscription'
import { SettingsService } from '../app/services/settingsService'
import { BounceSideEffectsService } from '../app/services/bounceSideEffectsService'

// Redux
import rootReducer from '../redux';
import ngRedux from 'ng-redux';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { processSideEffects } from 'redux-action-side-effects';
import { init as InitSettings } from '../redux/settings'
import { serviceMiddleware } from '../redux/middleware/serviceCall'
import { bounceSideEffects } from '../redux/middleware/sideEffects'


function serviceResolver(serviceName) {
  const injector = angular.element(document.body).injector();
  return injector.has(serviceName) ? injector.get(serviceName) : null;
}

angular.module(MODULE_NAME, [mui, ngRedux, angularAnimate, toastr])
  .provider('epicSubscription', epicSubscription)
  .service('settingsService', SettingsService)
  .service('bounceSideEffectsService', BounceSideEffectsService)
  .config(($ngReduxProvider, epicSubscriptionProvider) => {
    const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    let middleware = reduxDevTools ? [reduxDevTools] : [];
    middleware.push(processSideEffects);
    middleware.push(bounceSideEffects(serviceResolver));

    const epicMiddleware = epicSubscriptionProvider.setupEpicMiddleware()

    $ngReduxProvider.createStoreWith(rootReducer, [
      thunk,
      serviceMiddleware(serviceResolver),
      logger,
      epicMiddleware,
    ], middleware);
  })
  .run(($ngRedux) => {
    $ngRedux.dispatch(InitSettings()) 
  })
  .directive('mainView', mainView)
  .directive('naiveSettings', naiveSettings)
  .directive('settingsThunk', settingsThunk)
  .directive('settingsMiddleware', settingsMiddleware)
  .directive('settingsWatcher', settingsWatcher)

export default MODULE_NAME;