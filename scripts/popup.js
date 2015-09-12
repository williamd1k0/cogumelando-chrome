// elementos para os botões e o input do disableSound
var buttons = document.getElementsByClassName('corolho'),
    menu = document.getElementById('menu'),
    buttonsHelp = ['Canal do Twitch','Página do Facebook','Página do Twitter','Site oficial','Opções'],
    buttonsUrl = ['http://www.twitch.tv/cogumelandooficial/','https://www.facebook.com/Cogumelando','https://twitter.com/cogumelandosite','http://www.cogumelando.com.br/','../pages/options.html'],
    disableSound = document.getElementById('sound');

// força o botão do twitch a ser somente da classe corolho
buttons[0].className = 'corolho';

// é executado somente se estiver ao vivo
if(localStorage.onStream){
    // recebe as informações da live
    var stream = JSON.parse(localStorage.channel),
        twitchView = document.getElementsByClassName('twitch');
        liveType = document.getElementsByTagName('img')[0];
    // insere coisas da live no popup (título,nome do jogo, screenshot)
    buttons[0].className = 'corolho live';
    buttons[0].focus();

    var liveTitle = stream.channel.status;
    if(liveTitle.search("DAFM") !== -1){
        liveType.className = 'live-type';
        liveType.src = 'dafm.png';
    }else if(liveTitle.search("Game Quest") !== -1){
        liveType.className = 'live-type';
        liveType.src = 'cogugq.png';
    }

    twitchView[0].innerHTML = stream.game != null ? '<p>'+stream.game+'</p>' : '';
    twitchView[1].innerHTML = `
        <p>
            <img style="width:95%" src="${stream.preview.medium}">
        </p>`;
    twitchView[2].innerHTML = '<p>'+liveTitle+'</p>';
}

buttons[0].onclick = function(){
    chrome.tabs.create({'url': buttonsUrl[0]});
};
buttons[1].onclick = function(){
    chrome.tabs.create({'url': buttonsUrl[1]});
};
buttons[2].onclick = function(){
    chrome.tabs.create({'url': buttonsUrl[2]});
};
buttons[3].onclick = function(){
    chrome.tabs.create({'url': buttonsUrl[3]});
};
buttons[4].onclick = function(){
    chrome.tabs.create({'url': buttonsUrl[4]});
};

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
