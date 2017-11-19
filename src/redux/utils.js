const _ = require('lodash');
import { withSideEffects } from 'redux-action-side-effects';

export const asRequest = actionName => `${actionName}_REQUEST`
export const asResponse = actionName => `${actionName}_RESPONSE`
export const asError = actionName => `${actionName}_ERROR`
export const asOptimisticReject = actionName => `${actionName}_REJECT`

export const fakeFetch = (url, params, fakeResult) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (fakeResult !== undefined) {
      resolve({
        ok: true,
        json: () => fakeResult
      });
    } else {
      reject(new Error('fetch failed'));
    }
  }, 1000);
})

// Meta creator which adds a meta information to perform service call
export const serviceCallFactory = (service, sel) => _ => ({
  serviceCall: {
    service,
    sel
  }
})


export const withSideEffectsAdapter = (actionCreator, ...sideEffect) => (...callArgs) => {
  const sideEffectMapper = effect => {
      if (typeof effect == 'function') {
        let result = effect(...callArgs);
        return (typeof result == 'function') ? result() : result;
      } else if (_.isArray(effect)) {
        return _.map(effect, sideEffectMapper);
      }
      return effect;
  }

  let mappedSideEffects = _.map(sideEffect, sideEffectMapper);
  return withSideEffects(actionCreator(...callArgs), ...mappedSideEffects);
}
