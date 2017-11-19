const _ = require('lodash');

const BOUNCE_SERVICE_NAME = 'bounceSideEffectsService';

let bounceService = null;
let resolver = null;

const bounceServiceGetter = () => {
  if (!bounceService) {
    bounceService = resolver(BOUNCE_SERVICE_NAME);
  }
  return bounceService;
}

export const bounceSideEffects = serviceResolver => next => {
  resolver = serviceResolver
  return (reducer, initialState) => {
    let store = next((state, action) => {
      const { meta: { sideEffects } = {} } = action;
      action = sideEffects ? convertSideEffects(action, sideEffects) : action
      return reducer(state, action);
    }, initialState);
    return store;
  };
}

const convertSideEffect = (action, sideEffect) => {
  const meta = Object.assign({}, sideEffect.meta || {}, {bounced: true, origin: action});
  return Object.assign({}, sideEffect, { meta })
}

const sideEffectFabric = (action) => (sideEffect) => (dispatch) => {
  const sideEffects = _.isArray(sideEffect) ? sideEffect : [sideEffect]

  bounceServiceGetter().bounce(action, _.map(sideEffects, (effect) => {
    return convertSideEffect(action, effect)
  }));
}

function convertSideEffects(action, sideEffects) {
  const functionalSideEffects = _.map(sideEffects, sideEffectFabric(action));

  const meta = Object.assign({}, action.meta, {sideEffects : functionalSideEffects});

  return Object.assign({}, action, { meta });
}
