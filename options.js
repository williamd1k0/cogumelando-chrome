var options = document.getElementsByClassName('button');

for (var i = 0; i < options.length; i++) {
    options[i].onclick = function (e) {
        alert(e);
    }
}

var sounds = document.getElementsByName('sound');
var notify = document.getElementsByName('notify');

checkStorage(sounds,'sound');
checkStorage(notify,'notify');

configButton(sounds,'sound');
configButton(notify,'notify');

function checkStorage(element, storage){
    if(localStorage[storage]){
        element[0].className = "pressed";
    }else{
        element[1].className = "pressed";
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
