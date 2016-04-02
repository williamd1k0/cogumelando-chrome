
window.onload = function () {
    var sounds = document.getElementsByName('sound'),
        notify = document.getElementsByName('notify'),
        loop = document.getElementsByName('loop'),
        reset = document.getElementById('reset'),
        minutes = [1,2,5,10,20,30];

    checkStorage(sounds,'sound');
    checkStorage(notify,'notify');
    checkLoop();
    configButton(sounds,'sound');
    configButton(notify,'notify');

    for (var i = 0; i < loop.length; i++) {
        configLoop(loop[i],minutes[i]);
    }

    reset.onclick = mythReset;

    document.querySelector('#extension-version').innerHTML = chrome.app.getDetails().version;

    function playSound(src) {
        new Howl({
            urls: [src]
        }).play();
    }

    function checkStorage(element, storage){
        if(localStorage[storage]){
            element[0].className = "pressed";
        }else{
            element[1].className = "pressed";
        }
    }

    function configLoop(element, min){
        element.onclick = function(){
            if(parseInt(localStorage.interval) == min){
                playSound('../assets/bump.ogg');
            }else {
                playSound('../assets/kick.ogg');
                this.className = "pressed";
                localStorage.setItem('interval',min);
                chrome.alarms.clearAll();
                chrome.alarms.create("mainLoop", {delayInMinutes: 0.3,periodInMinutes: min});
                for (var i = 0; i < loop.length; i++) {
                    if(loop[i].innerHTML !== min+" min"){
                        loop[i].className = '';
                    }
                }
            }
        }
    }

    function checkLoop(){
        var loopMin = parseInt(localStorage.interval);
        if(loopMin == 1){
            loop[0].className = "pressed";
        }else if(loopMin == 2){
            loop[1].className = "pressed";
        }else if(loopMin == 5){
            loop[2].className = "pressed";
        }else if(loopMin == 10){
            loop[3].className = "pressed";
        }else if(loopMin == 20){
            loop[4].className = "pressed";
        }else if(loopMin == 30){
            loop[5].className = "pressed";
        }
    }

    function configButton(element,storage){
        element[0].onclick = function(){
            if(localStorage[storage]){
                playSound('../assets/bump.ogg');
            }else {
                playSound('../assets/kick.ogg');
                localStorage.setItem(storage,true);
                this.className = "pressed";
                element[1].className = '';
            }
        };
        element[1].onclick = function(){
            if(localStorage[storage]){
                playSound('../assets/kick.ogg');
                localStorage.removeItem(storage);
                this.className = "pressed";
                element[0].className = '';
            }else {
                playSound('../assets/bump.ogg');
            }
        };
    }

    function mythReset(){
        chrome.alarms.clearAll();
        chrome.alarms.create("mainLoop", {delayInMinutes: 0.3,periodInMinutes: 1});
        localStorage.setItem('persist',true);
        localStorage.setItem('sound',true);
        localStorage.setItem('notify',true);
        localStorage.setItem('interval',1);
        playSound('../assets/pow.ogg');
        setTimeout(function () {
            window.location.reload();
        }, 400);
    }
}
