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
        controller: ['$ngRedux', '$scope', 'epicSubscription', Controller],
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

function Controller($ngRedux, $scope, epicSubscription) {
    $scope.$on('$destroy',
        $ngRedux.connect(mapStateToThis, mapDispatchToScope)(this)
    );

}