
window.addEventListener('load', function (event) {

    var sounds = document.getElementsByName('sound'),
        notify = document.getElementsByName('notify'),
        loopTimers = document.getElementsByName('loop'),
        reset = document.getElementById('reset');

    checkStorage(sounds, 'sound');
    checkStorage(notify, 'notify');
    checkLoopTimers();
    configButton(sounds, 'sound');
    configButton(notify, 'notify');

    function playSound(src) {
        if (localStorage['sound']){
            new Howl({
                urls: [src]
            }).play();
        }
    }

    function checkStorage(elements, storage){
        if(localStorage[storage]){
            elements[0].classList.add('pressed');
        }else{
            elements[1].classList.add('pressed');
        }
    }

    function configLoopTimers(element){
        element.addEventListener('click', function(event){
            var min = parseInt(this.dataset.time);
            if(parseInt(localStorage.interval) == min){
                playSound('../assets/bump.ogg');
            }else {
                playSound('../assets/kick.ogg');
                this.classList.add('pressed');
                document.querySelector(
                    'button[data-time="'+localStorage.interval+'"]'
                ).classList.remove('pressed');
                localStorage.setItem('interval', min);
                chrome.alarms.clearAll();
                chrome.alarms.create("mainLoop", {
                    delayInMinutes: 1,
                    periodInMinutes: min
                });
            }
        });
    }

    function checkLoopTimers(){
        document.querySelector(
            'button[data-time="'+localStorage.interval+'"]'
        ).classList.add('pressed');
    }

    function configButton(elements, storage){
        elements[0].addEventListener('click', function(event){
            if(localStorage[storage]){
                playSound('../assets/bump.ogg');
            }else {
                localStorage.setItem(storage, true);
                playSound('../assets/kick.ogg');
                this.classList.add('pressed');
                elements[1].classList.remove('pressed');
            }
        });
        elements[1].addEventListener('click', function(event){
            if(localStorage[storage]){
                localStorage.removeItem(storage);
                playSound('../assets/kick.ogg');
                this.classList.add('pressed');
                elements[0].classList.remove('pressed');
            }else {
                playSound('../assets/bump.ogg');
            }
        });
    }

    function resetData(){
        chrome.alarms.clearAll();
        chrome.alarms.create("mainLoop", {
            delayInMinutes: 1,
            periodInMinutes: 1
        });
        localStorage.setItem('persist', true);
        localStorage.setItem('sound', true);
        localStorage.setItem('notify', true);
        localStorage.setItem('interval', 1);
        playSound('../assets/pow.ogg');
        setTimeout(function() {
            window.location.reload();
        }, 400);
    }

    for (loop of loopTimers) {
        configLoopTimers(loop);
    }

    document.querySelector('#extension-version').appendChild(
        new Text(chrome.app.getDetails().version)
    );
    reset.addEventListener('click', resetData);

});
