
chrome.runtime.onInstalled.addListener(function(details){
    chrome.alarms.create("mainLoop", {
        delayInMinutes: 1,
        periodInMinutes: 1
    });
    backgroundInit();
});


// inicialização do chrome
chrome.runtime.onStartup.addListener(function (){
    // força o estado da live pra Off-air por causa do popup
    localStorage.removeItem('onStream');
    // primeira inicialização
    backgroundInit();
    // altera o botão do popup
    noConnect();
    // cria o evento de alarm (loop principal de checagem)
    // delayInMinutes: tempo antes da primeira checagem
    // periodInMinutes: tempo entre uma checagem e outra
    chrome.alarms.create("mainLoop", {
        delayInMinutes: 1,
        periodInMinutes: parseInt(localStorage.interval)
    });
});

// bloco que será executado a cada X minutos
chrome.alarms.onAlarm.addListener(function(alarm) {
    // checagem do canal do twitch
    twitchProcess(CONFIG.username, CONFIG.clientId);
});
