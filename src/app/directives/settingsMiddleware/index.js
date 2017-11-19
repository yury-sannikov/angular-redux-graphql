import { 
  getSimpleState,
  setReadonly,
  setReadonlySuccess
} from '../../../redux/settingsMiddleware'

export default [
  directive
]

const template = require('./template.html');

function directive() {
  return {
      restrict: 'E',
      template,
      scope: {
      },
      controller: ['$ngRedux', Controller],
      controllerAs: 'vm',
      bindToController: true
  }
}

const mapStateToThis = state => ({
  settingObj: {
      simpleValue: getSimpleState(state)
  }
})

const mapDispatchToScope = {
  setReadonly,
  setReadonlySuccess
}

function Controller($ngRedux) {

  this.$onDestroy = $ngRedux.connect(mapStateToThis, mapDispatchToScope)(this)
}