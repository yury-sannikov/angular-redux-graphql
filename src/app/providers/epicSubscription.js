import { combineEpics, createEpicMiddleware } from 'redux-observable';
import Rx from 'rxjs/Rx';

export default function EpicSubscriptionProvider() {
    
    this.setupEpicMiddleware = (staticEpics) => {
        this.staticEpics = combineEpics(staticEpics);
        this.dynamicEpic$ = new Rx.BehaviorSubject(this.staticEpics);
        this.rootEpic = (action$, store) => this.dynamicEpic$.mergeMap(epic => epic(action$, store));
        this.dynamicEpic$.next($nullEpic => $nullEpic.filter( _ => false));
        return createEpicMiddleware(this.rootEpic);
    }

    this.$get = [function EpicSubscriptionFactory() {
        return new EpicSubscription(this)
    }];
}

class EpicSubscription {
    constructor(provider) {
        this.provider = provider;
    }

    registerEpic($epic) {
        this.provider.dynamicEpic$.next($epic)
    }

    deregisterEpic($epic) {
        $epic.complete();
        //TODO: 
    }
    

}
