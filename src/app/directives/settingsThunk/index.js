import {
    getSimpleState,
    getFetchingState,
    setReadonlyThunk,
    setReadonlyThunkSuccess,
    setReadonlyThunkWithFeedback,
    setReadonlyThunkWithFeedbackSuccess,
} from '../../../redux/settingsThunk'

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
    fetching: getFetchingState(state),
    settingObj: {
        simpleValue: getSimpleState(state)
    }
})

const mapDispatchToScope = {
    setReadonlyThunk,
    setReadonlyThunkSuccess,
    setReadonlyThunkWithFeedback,
    setReadonlyThunkWithFeedbackSuccess
}

function Controller($ngRedux) {
    this.$onDestroy = $ngRedux.connect(mapStateToThis, mapDispatchToScope)(this)
}