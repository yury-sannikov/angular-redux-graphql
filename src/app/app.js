import angular from 'angular';
import 'muicss/dist/css/mui.css';

import rootReducer from '../redux';
//import loggingMiddleware from './loggingMiddleware';
import ngRedux from 'ng-redux';
import logger from 'redux-logger'

const mui = require('muicss/angular');

let mainView = () => {
  return {
    template: require('./mainView.html'),
    controller: 'AppCtrl',
    controllerAs: 'vm'
  }
};

class AppCtrl {
  constructor($ngRedux) {
    this.url = 'https://github.com/preboot/angular-webpack';
    this.input1 = true;
    $ngRedux.dispatch({type: 'APP/SETTINGS/READONLY', payload: true})
    $ngRedux.dispatch({type: 'APP/SETTINGS/INIT', payload: true})
  }
}

const MODULE_NAME = 'DemoApp';

angular.module(MODULE_NAME, [mui, ngRedux])
  .config(($ngReduxProvider) => {
    const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    const middleware = reduxDevTools ? [reduxDevTools] : [];
    $ngReduxProvider.createStoreWith(rootReducer, [logger], middleware);
  })
  .directive('mainView', mainView)
  .controller('AppCtrl', ['$ngRedux', AppCtrl]);

export default MODULE_NAME;