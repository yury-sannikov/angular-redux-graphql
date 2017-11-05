import { getSimpleState, setReadonly } from '../../../redux/settings'

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
        controller: ['$ngRedux', '$scope', Controller],
        controllerAs: 'vm',
        bindToController: true
    }
}

const mapStateToThis = state => ({
    simpleValue: getSimpleState(state)
})

const mapDispatchToScope = {
    setReadonly
}

function Controller($ngRedux, $scope) {
    let unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToScope)(this);
    $scope.$on('$destroy', unsubscribe);
}