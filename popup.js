var mythTwitch = chrome.extension.getBackgroundPage();
console.log("Retorno do background "+mythTwitch);
var stream = mythTwitch.twitch.getChannel();
console.log("Stream "+stream);
if(stream){
    console.log("integração popup/background");
}
