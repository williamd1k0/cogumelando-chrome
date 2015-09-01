
var twitch = {
    name: 'Cogumelando',
    username: 'cogumelandooficial',
    ajaxInterval: 1//300000 // 5 minutos

}

chrome.runtime.onStartup.addListener(function () {
    chrome.alarms.create("mainLoop", {delayInMinutes: 0.1,periodInMinutes: 1});
});
$.ajaxSetup({cache:false});
noConnect();

/*@deprecated
twitch.createLoop();
getTwitch(twitch.username);
twitch.mainLoop = setInterval(function(){
    getTwitch(twitch.username);
},twitch.ajaxInterval);
*/

chrome.alarms.onAlarm.addListener(function(alarm) {
    getTwitch(twitch.username);
});

function mythTwitch(twitchJson){
    twitch.channel = twitchJson;

    if(twitch.channel.stream){
        twitch.game = twitch.channel.stream.game;
        twitch.onStream = true;
        chrome.browserAction.setBadgeText({text:"LIVE"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#0d0"});
        chrome.browserAction.setTitle({title:twitch.name+' | '+twitch.game});
        console.log("Stream");
    }else{
        chrome.browserAction.setBadgeText({text:"OFF"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#d00"});
        chrome.browserAction.setTitle({title:twitch.name+' | Off-air'});
        console.log("Off-air");
    }
}

function getTwitch(username){
    $.ajax({
        url:'https://api.twitch.tv/kraken/streams/'+username,
        success:function(channel) {
            console.log('Objeto recebido');
            mythTwitch(channel);
        },
        error:function() {
            console.log('Sem conexão');
            noConnect();
        }
    });
}

function noConnect(){
    chrome.browserAction.setBadgeText({text:"..."});
    chrome.browserAction.setBadgeBackgroundColor({color: "#999"});
}
