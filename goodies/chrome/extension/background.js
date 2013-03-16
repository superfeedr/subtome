chrome.browserAction.onClicked.addListener(function(tab) {
    var script = "(function(){var z=document.createElement('script');z.src='https://s3.amazonaws.com/www.subtome.com/load.js';document.body.appendChild(z);})()"
    chrome.tabs.executeScript(tab.id, {code: script});
});
