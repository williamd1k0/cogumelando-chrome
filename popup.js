var alarms = {
    createLoop: function(e) {
                    chrome.alarms.create("myAlarm", {delayInMinutes: 0.01});
                }
}

document.addEventListener('DOMContentLoaded', function () {
    alarms.createLoop();
});
