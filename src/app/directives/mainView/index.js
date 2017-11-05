export default [
    directive
]

const template = require('./mainView.html');

function directive() {
    return {
        template,
        
        controller: ['$scope', '$ngRedux', MainViewController],
    }
}

function MainViewController($scope, $ngRedux) {

    // $ngRedux.dispatch({type: 'APP/SETTINGS/READONLY', payload: true})
    //setTimeout(() => $ngRedux.dispatch({type: 'APP/SETTINGS/READONLY', payload: true}), 2000);
}