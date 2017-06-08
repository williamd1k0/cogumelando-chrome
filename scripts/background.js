
// objeto com os dados mais importantes (não persistentes)
var CONFIG = {
    name: 'Cogumelando',
    username: 'cogumelando',
    streamTitle: 'LIVE',
    offAirTitle: 'OFF',
    offAirMessage: 'Aguarde e Xonfie',
    clientId: '8d7703jd1y4lw4s23n7nf71l8l0gmm',
    sfx: {
        notify: '../assets/adanado.ogg',
        bump: '../assets/bump.ogg',
        kick: '../assets/kick.ogg',
        pow: '../assets/pow.ogg'
    },
    urls: {
        twitch: 'http://www.twitch.tv/cogumelando/',
        facebook: 'https://www.facebook.com/Cogumelando',
        twitter: 'https://twitter.com/cogumelandosite',
        site: 'http://www.cogumelando.com.br/'
    }
};

// força a desativação do cache do ajax
$.ajaxSetup({cache: false});

function playSound(src) {
    if (localStorage['sound']){
        new Howl({
            urls: [src]
        }).play();
    }
}

// Método que inicializa os dados persistentes
function backgroundInit(){
    if(localStorage.length == 0){
        // cria os dados persistentes
        localStorage.setItem('persist', true);
        localStorage.setItem('sound', true);
        localStorage.setItem('notify', true);
        localStorage.setItem('interval', 1);
        // notificação inicial
        var notificationId = "init";
        chrome.notifications.create(
            notificationId,
            {
                type: "basic",
                isClickable: true,
                iconUrl: "../assets/icon128.png",
                title: "Cogumelando",
                message: "Notificações sonoras estão ativadas, você pode desativá-las nas opções."
            }, function(){}
        );

        chrome.notifications.onClicked.addListener(function(notificationId){
            chrome.tabs.create({'url': '../pages/options.html'}, function(tab){/*callback*/});
        });
    }
}

// Método que se executa caso o request ajax tenha sucesso
// @twitchJson: o retorno do request ajax
function TwitchResponse(twitchJson){
    // checa se está acontecendo uma live
    if(twitchJson.stream){ // live acontecendo
        // joga todos os dados da live nos dados persistentes
        localStorage.setItem('channel', JSON.stringify(twitchJson.stream));
        // cria um link para o nome do jogo
        CONFIG.game = twitchJson.stream.game;

        // faz uma checagem pra saber se no loop anterior já estava em live
        if(!localStorage.onStream){
            // muda o estado de live para true
            localStorage.setItem('onStream', true);

            // se as notificações estiverem ativadas
            if(localStorage.notify){
                var liveGame = CONFIG.game != null ? CONFIG.game : "live";

                var notificationId = "live";
                chrome.notifications.create(
                    notificationId,
                    {
                        type: "basic",
                        isClickable:true,
                        iconUrl: "../assets/icon128.png",
                        title: "ADANADO!!",
                        message: "É TEMPO! Começando "+liveGame+" ao vivo agora!"
                    },function(){}
                );

                chrome.notifications.onClicked.addListener(function(notificationId){
                    chrome.tabs.create({'url': CONFIG.urls.twitch}, function(tab){/*callback*/});
                });

            }
            // se as notificações sonoras estiverem ativadas
            // toca o ADANADO
            playSound(CONFIG.sfx.notify);
        }
        // altera as informações do botão
        var label = CONFIG.name+' 🎮 '; // 🎮
        if(CONFIG.game) label += CONFIG.game;
        setBadgeInfo(label, CONFIG.streamTitle, '#0d0');

    }else{ // canal offline
        // altera o estado de stream pra offline
        localStorage.removeItem('onStream');
        // altera as informações do botão (parecido com o que está acima)
        setBadgeInfo(
            CONFIG.name+' ☕ '+CONFIG.offAirMessage, // ☕
            CONFIG.offAirTitle, '#d00'
        );
    }
}

// Método que faz o request ajax no canal do twitch
// @username: usuário do twitch
function twitchProcess(username, clientid, callback){
    callback = callback || function () {};
    $.ajax({
        url:'https://api.twitch.tv/kraken/streams/'+username,
        headers: {
            'Client-ID': clientid
        },
        success: function(channel) {
            // método executado se o ajax tiver sucesso
            TwitchResponse(channel);
            callback(channel);
        },
        error: function() {
            // método executado caso não tenha sucesso
            // isso pode acontecer caso esteja sem internet
            // ou alguma issue da extensão ou do navegador
            noConnect();
        }
    });
}

function setBadgeInfo(title, text, color){
    chrome.browserAction.setBadgeText({text: text});
    chrome.browserAction.setBadgeBackgroundColor({color: color});
    chrome.browserAction.setTitle({title: title});
}

// Método que altera o botão para o caso do ajax falhar
function noConnect(){
    setBadgeInfo(CONFIG.name+' 🔁', '...', '#999'); // 🔁
}
