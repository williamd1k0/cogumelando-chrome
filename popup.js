/* @deprecated
var mythTwitch = chrome.extension.getBackgroundPage();
console.log("Retorno do background "+mythTwitch);

try{
    var stream = mythTwitch.twitch.getChannel();
    console.log("Stream "+stream);
    if(stream){
        console.log("integração popup/background");
    }
}catch(e){}
*/

if(localStorage.onStream){
    var stream = JSON.parse(localStorage.channel);
    var twitchView = document.getElementsByClassName('twitch');
    twitchView[0].innerHTML = '<p>'+stream.game+'</p>';
    twitchView[1].innerHTML = `
        <p>
            <img style="width:95%" src="http://static-cdn.jtvnw.net/previews-ttv/live_user_cogumelandooficial-320x180.jpg">
        </p>`;
    twitchView[2].innerHTML = '<p><small>'+stream.channel.status+'</small></p>';
}
var disableSound = document.getElementById('sound');
disableSound.checked = localStorage.sound ? false : true;
disableSound.onchange = function(){
    if(this.checked){
        localStorage.removeItem('sound');
    }else{
        localStorage.setItem('sound',true);
    }
}
