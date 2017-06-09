
Element.prototype.clear = function(){
    while(this.firstChild){
        this.removeChild(this.firstChild);
    }
};

window.addEventListener('load', function (event) {

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
            CONFIG.urls.twitch,
            CONFIG.urls.facebook,
            CONFIG.urls.twitter,
            CONFIG.urls.site,
            '../pages/options.html'
        ],
        disableSound = document.getElementById('sound'),
        twitchView = document.querySelectorAll('.twitch p');

    var twitchTop = twitchView[0];
    var twitchMid = twitchView[1];
    var twitchBottom = twitchView[2];


    function removeLoadingImage() {
        twitchTop.clear();
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setTabEvent(element, url){
        element.addEventListener('click', function(event){
            chrome.tabs.create({'url': url});
        });
    }

    // Método para inserir os textos dos botões
    function setCursorEvent(element, help){
        element.addEventListener('mouseover', function(event){
            menu.appendChild(new Text(help));
        });
        element.addEventListener('mouseout', function(event){
            menu.clear();
        });
    }

    function getTwitchSuggestions(options, callback) {
        callback = callback || function () {};
        $.ajax({
            url: 'https://api.twitch.tv/kraken/channels/'+CONFIG.username+'/videos/?'+options,
            headers: {
                'Client-ID': CONFIG.clientId
            },
            success: function(result){
                callback(result);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                callback(false);
            }
        });
    }

    function showStreamInfo() {
        removeLoadingImage();
        // recebe as informações da live
        var stream = JSON.parse(localStorage.channel);
        var liveType = document.getElementsByTagName('img')[0];
        // insere coisas da live no popup (título,nome do jogo, screenshot)
        buttons[0].classList.add('live');
        buttons[0].focus();

        // Força o recarregamento da imagem
        var imageForce = btoa(new Date().toJSON());

        var liveTitle = stream.channel.status;
        if(liveTitle.search("DAFM") !== -1){
            liveType.classList.add('live-type');
            liveType.src = '../assets/dafm.png';
        }else if(liveTitle.search("Game Quest") !== -1 || liveTitle.search("CGQ") !== -1){
            liveType.classList.add('live-type');
            liveType.src = '../assets/cogugq.png';
        }

        twitchTop.appendChild(new Text(stream.game != null ? stream.game : ''));

        var streamDefault = imgLoader.load('../assets/coguinfo.png', {'class':'stream-preview', 'draggable':false});
        imgLoader.onload(function () {
            twitchMid.appendChild(streamDefault);

            var streamImg = imgLoader.load(stream.preview.medium+'?force='+imageForce, {'draggable':false});
            imgLoader.onload(function () {
                twitchMid.clear();
                streamImg.classList.add('stream-preview');
                twitchMid.appendChild(streamImg);
            });
        });

        twitchBottom.appendChild(new Text(liveTitle));
    }

    function showStreamSuggestion() {
        var videos = [];
        getTwitchSuggestions('limit=10', function(result) {
            if (result) {
                videos = videos.concat(result.videos);
                getTwitchSuggestions('broadcasts=true', function(result) {
                    removeLoadingImage();
                    if (result) {
                        videos = videos.concat(result.videos);
                        var rand = randomInt(0, videos.length-1);

                        twitchTop.className = 'click';
                        twitchTop.appendChild(new Text('Veja também: '+videos[rand].game));
                        twitchTop.onclick = function(){
                            chrome.tabs.create({'url': videos[rand].url});
                        };
                    }
                });
            }else{
                removeLoadingImage();
            }
        });
    }


    // checagem do canal do twitch
    twitchProcess(CONFIG.username, CONFIG.clientId, function () {
        // é executado somente se estiver ao vivo
        if(localStorage.onStream){
            showStreamInfo();
        }else{
            showStreamSuggestion();
        }
    });

    for (var i=0; i < buttons.length; i++){
        setCursorEvent(buttons[i], buttonsHelp[i]);
        setTabEvent(buttons[i], buttonsUrl[i]);
    }

    // checkbox do disableSound
    disableSound.checked = localStorage.sound ? false : true;
    disableSound.addEventListener('change', function(event){
        if(this.checked){
            localStorage.removeItem('sound');
        }else{
            localStorage.setItem('sound', true);
        }
    });

});
