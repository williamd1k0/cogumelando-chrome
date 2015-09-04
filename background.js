// objeto com os dados mais importantes (não persistentes)
var twitch = {
    name: 'Cogumelando',
    username: 'cogumelandooficial',
    streamTitle: 'LIVE',
    offAirTitle: 'OFF',
    offAirMessage: 'Off-air',
    notifySfx: 'adanado.ogg'
}

// inicialização do chrome
chrome.runtime.onStartup.addListener(function (){
    // força o estado da live pra Off-air por causa do popup
    localStorage.removeItem('onStream');
    // primeira inicialização
    if(localStorage.length == 0){
        // cria os dados persistentes
        localStorage.setItem('persist',true);
        localStorage.setItem('sound',true);
        localStorage.setItem('notify',true);
        localStorage.setItem('interval',1);
    }
    // altera o botão do popup
    noConnect();
    // cria o evento de alarm (loop principal de checagem)
    // delayInMinutes: tempo antes da primeira checagem
    // periodInMinutes: tempo entre uma checagem e outra
    chrome.alarms.create("mainLoop", {delayInMinutes: 0.3,periodInMinutes: 1});
});

// força a desativação do cache do ajax
$.ajaxSetup({cache:false});

/*@deprecated
 * Evento de loop principal, não funciona em background
 * pois ela morre depois de alguns segundo em idle
getTwitch(twitch.username);
twitch.mainLoop = setInterval(function(){
    getTwitch(twitch.username);
},twitch.ajaxInterval);
*/

// bloco que será executado a cada X minutos
chrome.alarms.onAlarm.addListener(function(alarm) {
    // checagem do canal do twitch
    getTwitch(twitch.username);
});

// Método que se executa caso o request ajax tenha sucesso
// @twitchJson: o retorno do request ajax
function mythTwitch(twitchJson){
    // checa se está acontecendo uma live
    if(twitchJson.stream){ // live acontecendo
        // muda o estado de live para true
        localStorage.setItem('onStream',true);
        // joga todos os dados da live nos dados persistentes
        localStorage.setItem('channel',JSON.stringify(twitchJson.stream));
        // cria um link para o nome do jogo
        twitch.game = twitchJson.stream.game;

        // obtem o titulo do botão e executa um callback
        chrome.browserAction.getBadgeText({},function(e){
            console.log(e);
            // faz uma checagem psa saber se no loop anterior já estava em live
            if(e != twitch.streamTitle){
                // se as notificações etiverem ativadas
                if(localStorage.notify){
                    var liveNotify = new Notification('ADANADO!!', {
                          icon: 'icon128.png',
                          body: "É TEMPO! Começando "+twitch.game+" ao vivo agora!",
                          silent: true
                        });

                    liveNotify.onclick = function(){
                        chrome.tabs.create({'url': 'http://www.twitch.tv/cogumelandooficial/'}, function(tab){/*callback*/});
                    };
                    setTimeout(function(){
                        liveNotify.close();
                    },10000);
                }
                // se as notificações sonoras estiverem ativadas
                if (localStorage.sound) {
                    // toca o ADANADO
                    var notify = new Howl({
                        urls: [twitch.notifySfx]
                    }).play();
                }
            }
        });

        // altera as informações do botão
        chrome.browserAction.setBadgeBackgroundColor({color: "#0d0"}); // cor
        chrome.browserAction.setBadgeText({text:twitch.streamTitle}); // título
        chrome.browserAction.setTitle({title:twitch.name+' | '+twitch.game}); // tooltip
        console.log("Stream");

    }else{ // canal offline
        // altera o estado de stream pra offline
        localStorage.removeItem('onStream');
        // altera as informações do botão (parecido com o que está acima)
        chrome.browserAction.setBadgeBackgroundColor({color: "#d00"});
        chrome.browserAction.setBadgeText({text:twitch.offAirTitle});
        chrome.browserAction.setTitle({title:twitch.name+' | '+twitch.offAirMessage});
        console.log("Off-air");
    }
}

// Método que faz o request ajax no canal do twitch
// @username: usuário do twitch
function getTwitch(username){
    $.ajax({
        url:'https://api.twitch.tv/kraken/streams/'+username,
        success:function(channel) {
            console.log('Objeto recebido');
            // método executado se o ajax tiver sucesso
            mythTwitch(channel);
        },
        error:function() {
            console.log('Sem conexão');
            // método executado caso não tenha sucesso
            // isso pode acontecer caso esteja sem internet
            // ou alguma issue da extensão ou do navegador
            noConnect();
        }
    });
}

// Método que altera o botão para o caso do ajax falhar
function noConnect(){
    chrome.browserAction.setBadgeText({text:"..."});
    chrome.browserAction.setBadgeBackgroundColor({color: "#999"});
    chrome.browserAction.setTitle({title:twitch.name});
}
