export class BounceSideEffectsService {
  constructor($timeout, $ngRedux) {
    this.$timeout = $timeout
    this.$ngRedux = $ngRedux
  }

  bounce(action, sideEffects) {
    this.$timeout( () => {
      _.forEach(sideEffects, (item) => this.$ngRedux.dispatch(item));
    }, 0);
  }
}

BounceSideEffectsService.$inject = ['$timeout', '$ngRedux'];

