var options = document.getElementsByClassName('button');

for (var i = 0; i < options.length; i++) {
    options[i].onclick = function (e) {
        alert(e);
    }
}

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

function checkStorage(element, storage){
    if(localStorage[storage]){
        element[0].className = "pressed";
    }else{
        element[1].className = "pressed";
    }
}

function configLoop(element, min){
    element.onclick = function(){
        this.className = "pressed";
        localStorage.setItem('interval',min);
        for (var i = 0; i < loop.length; i++) {
            if(loop[i].innerHTML !== min+" min"){
                loop[i].className = '';
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
        localStorage.setItem(storage,true);
        this.className = "pressed";
        element[1].className = '';
    };
    element[1].onclick = function(){
        localStorage.removeItem(storage);
        this.className = "pressed";
        element[0].className = '';
    };
}

function mythReset(){
    localStorage.clear();
    localStorage.setItem('persist',true);
    localStorage.setItem('sound',true);
    localStorage.setItem('notify',true);
    localStorage.setItem('interval',1);
    window.location.reload();
}
