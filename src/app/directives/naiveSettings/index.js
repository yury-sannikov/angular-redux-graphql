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
    let unsubscribe = $ngRedux.connect(mapStateToThis, mapDispatchToScope)(this);

    
    const pingEpic = action$ =>
    action$.filter(action => action.type === 'APP/SETTINGS/READONLY')
      .delay(1000)
      .mapTo({ type: 'PONG dir' });    
    
    epicSubscription.registerEpic(pingEpic);

    $scope.$on('$destroy', () => {
        unsubscribe();
        epicSubscription.deregisterEpic(pingEpic);
    });

}