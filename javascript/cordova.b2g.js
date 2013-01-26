//Hacked, should be replaced with results from cordova-js
setTimeout(function () {
    var evt = document.createEvent('Events');
    evt.init("deviceready", false , false);
    document.dispatchEvent(evt);
}, 10);
