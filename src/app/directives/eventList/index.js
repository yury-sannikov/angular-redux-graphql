import { 
  subscribe,
  getData
} from '../../../redux/graphql'

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
  events: {
      data: getData(state)
  }
})

const mapDispatchToScope = {
  subscribe
}

function Controller($ngRedux) {
  this.$onDestroy = $ngRedux.connect(mapStateToThis, mapDispatchToScope)(this)
  this.subscribe()
}