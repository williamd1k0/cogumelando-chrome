// elementos para os botões e o input do disableSound
var buttons = document.getElementsByClassName('corolho'),
    menu = document.getElementById('menu'),
    buttonsHelp = ['Canal do Twitch','Página do Facebook','Página do Twitter','Site oficial','Opções'],
    disableSound = document.getElementById('sound');
// força o botão do twitch a ser somente da classe corolho
buttons[0].className = 'corolho';

// é executado somente se estiver ao vivo
if(localStorage.onStream){
    // recebe as informações da live
    var stream = JSON.parse(localStorage.channel),
        twitchView = document.getElementsByClassName('twitch');
    // insere coisas da live no popup (título,nome do jogo, screenshot)
    buttons[0].className = 'corolho live';
    buttons[0].focus();
    twitchView[0].innerHTML = '<p>'+stream.game+'</p>';
    twitchView[1].innerHTML = `
        <p>
            <img style="width:95%" src="http://static-cdn.jtvnw.net/previews-ttv/live_user_cogumelandooficial-320x180.jpg">
        </p>`;
    twitchView[2].innerHTML = '<p>'+stream.channel.status+'</p>';
}

// loop para criar os eventos de hover dos botões
for (var i = 0; i < buttons.length; i++) {
    setCursorEvent(buttons[i],buttonsHelp[i]);
}

// Método para inserir os textos dos botões
function setCursorEvent(element, help){
    element.onmouseover = function(){
        menu.innerHTML = '<small>'+help+'</small>';
    }
    element.onmouseout = function(){
        menu.innerHTML = '';
    }
}

// checkbox do disableSound
disableSound.checked = localStorage.sound ? false : true;
disableSound.onchange = function(){
    if(this.checked){
        localStorage.removeItem('sound');
    }else{
        localStorage.setItem('sound',true);
    }
}
