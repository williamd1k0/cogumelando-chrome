var imgLoader = new ImageLoader();

// elementos para os botões e o input do disableSound
var buttons = document.getElementsByClassName('corolho'),
    menu = document.querySelector('#menu small'),
    buttonsHelp = [
        'Canal do Twitch',
        'Página do Facebook',
        'Página do Twitter',
        'Site oficial',
        'Opções'
    ],
    buttonsUrl = [
        'http://www.twitch.tv/cogumelandooficial/',
        'https://www.facebook.com/Cogumelando',
        'https://twitter.com/cogumelandosite',
        'http://www.cogumelando.com.br/',
        '../pages/options.html'
    ],
    disableSound = document.getElementById('sound'),
    twitchView = document.querySelectorAll('.twitch p');

var twitchTop = twitchView[0];
var twitchMid = twitchView[1];
var twitchBottom = twitchView[2];

Element.prototype.clear = function(){
    while(this.firstChild){
        this.removeChild(this.firstChild);
    }
};

window.onload = function () {
    // força o botão do twitch a ser somente da classe corolho
    buttons[0].className = 'corolho';

    // checagem do canal do twitch
    getTwitch(twitch.username, twitch.clientId, function () {
        // é executado somente se estiver ao vivo
        if(localStorage.onStream){
            showStreamInfo();
        }else{
            showStreamSuggestion();
        }
    });

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

    // checkbox do disableSound
    disableSound.checked = localStorage.sound ? false : true;
    disableSound.onchange = function(){
        if(this.checked){
            localStorage.removeItem('sound');
        }else{
            localStorage.setItem('sound', true);
        }
    };

    // loop para criar os eventos de hover dos botões
    for (var i = 0; i < buttons.length; i++) {
        setCursorEvent(buttons[i],buttonsHelp[i]);
    }

    // Método para inserir os textos dos botões
    function setCursorEvent(element, help){
        element.onmouseover = function(){
            menu.innerHTML = help;
        }
        element.onmouseout = function(){
            menu.clear();
        }
    }

    function getTwitchSuggestions(options, callback) {
        callback = callback || function () {};
        $.ajax(
            {
                url:'https://api.twitch.tv/kraken/channels/cogumelandooficial/videos/?'+options,
                headers: {
                    'Client-ID': twitch.clientId
                },
                success:function(result){
                    callback(result);
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    callback(false);
                }
            }
        );
    }

    function showStreamInfo() {
        // recebe as informações da live
        var stream = JSON.parse(localStorage.channel);
        var liveType = document.getElementsByTagName('img')[0];
        // insere coisas da live no popup (título,nome do jogo, screenshot)
        buttons[0].className = 'corolho live';
        buttons[0].focus();

        // Força o recarregamento da imagem
        var imageForce = btoa(new Date().toJSON());

        var liveTitle = stream.channel.status;
        if(liveTitle.search("DAFM") !== -1){
            liveType.className = 'live-type';
            liveType.src = '../assets/dafm.png';
        }else if(liveTitle.search("Game Quest") !== -1 || liveTitle.search("CGQ") !== -1){
            liveType.className = 'live-type';
            liveType.src = '../assets/cogugq.png';
        }

        twitchTop.innerHTML = stream.game != null ? stream.game : '';

        var streamDefault = imgLoader.load('../assets/coguinfo.png', {'class':'stream-preview', 'draggable':false});
        imgLoader.onload(function () {
            twitchMid.appendChild(streamDefault);

            var streamImg = imgLoader.load(stream.preview.medium+'?force='+imageForce, {'draggable':false});
            imgLoader.onload(function () {
                twitchMid.clear();
                streamImg.className = 'stream-preview';
                twitchMid.appendChild(streamImg);
            });
        });

        twitchBottom.innerHTML = liveTitle;
    }

    function showStreamSuggestion() {
        var videos = [];
        getTwitchSuggestions('limit=10',function (result) {
            if (result) {
                videos = videos.concat(result.videos);
                getTwitchSuggestions('broadcasts=true',function (result) {
                    if (result) {
                        videos = videos.concat(result.videos);
                        var rand = randomInt(0, videos.length-1);

                        twitchTop.className = 'click';
                        twitchTop.innerHTML = 'Veja também: '+videos[rand].game;
                        twitchTop.onclick = function(){
                            chrome.tabs.create({'url': videos[rand].url});
                        };
                    }else{
                        removeLoadingImage();
                    }
                });
            }else{
                removeLoadingImage();
            }
        });
    }

    function removeLoadingImage() {
        twitchTop.clear();
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

};
