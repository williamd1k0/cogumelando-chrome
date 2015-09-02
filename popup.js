
var mythTwitch = chrome.extension.getBackgroundPage();
console.log("Retorno do background "+mythTwitch);

try{
    var stream = mythTwitch.twitch.getChannel();
    console.log("Stream "+stream);
    if(stream){
        console.log("integração popup/background");
    }
}catch(e){

}

var twitchView = document.getElementById('twitch');
//twitchView.innerHTML = `<img src="static-cdn.jtvnw.net/previews-ttv/live_user_cogumelandooficial-320x180.jpg">`;
//twitchView.innerHTML = `<p><img style="width:95%" src="http://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg"></p>`;

var disableSound = document.getElementById('sound');
disableSound.checked = localStorage.sound ? false : true;
disableSound.onchange = function(){
    if(this.checked){
        localStorage.removeItem('sound');
    }else{
        localStorage.setItem('sound',true);
    }
}
