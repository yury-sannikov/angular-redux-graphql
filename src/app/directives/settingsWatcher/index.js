import Rx from 'rxjs/Rx';
import {SET_READONLY} from '../../../redux/settings'
export default [
    directive
]

function directive() {
    return {
        restrict: 'AE',
        controller: ['$scope', 'epicSubscription', '$element', Controller],
        controllerAs: 'vm',
        bindToController: true
    }
}

function Controller($scope, epicSubscription, $element) {
    const pingEpic = action$ =>
    action$.filter(action => action.type === SET_READONLY)
      .delay(100)
      .map(action => action.payload)
      .do(isReadonly => {
        if (isReadonly) {
          angular.element($element.children()[0]).addClass('ar-readonly');
        } else {
          angular.element($element.children()[0]).removeClass('ar-readonly');
        }
      })
      .mergeMap(_ => Rx.Observable.empty())



    epicSubscription.registerEpic(pingEpic);

    $scope.$on('$destroy', () => {
        epicSubscription.deregisterEpic(pingEpic);
    });

}