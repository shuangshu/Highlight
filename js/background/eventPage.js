/**
 * Created by gft060 on 2016/3/8.
 */

var myEventPage = {

    initialize:function(){
        chrome.runtime.onInstalled.addListener(myEventPage.onRuntimeInstalled);
        chrome.runtime.onStartup.addListener(myEventPage.onRuntimeStartup);
        chrome.runtime.onMessage.addListener(myEventPage.onRuntimeMessage);
        chrome.webNavigation.onCompleted.addListener(myEventPage.onWebNavigationCompleted);
        chrome.tabs.onActivated.addListener(myEventPage.onTabActivated);
        chrome.contextMenus.onClicked.addListener(myContextMenu.onClicked);
        chrome.commands.onCommand.addListener(myEventPage.onCommandsCommand);
    },

    onRuntimeInstalled : function(details){
        console.log(details);
    },

    onRuntimeStartup:function(){
        console.log(details);
    },

    onRuntimeMessage: function (message, sender, sendResponse) {
        switch(message.id){
            case "onMouseEnterHighlight":
                myContextMenu.setCurrentHighlightId(message.highlightId);
                break;
            case "onMouseLeaveHighlight":
                myContextMenu.setCurrentHighlightId(message.highlightId);
                break;
        }
    },

    onTabActivated: function (activeInfo) {
        myContextMenu.createMenus();
    },

    onWebNavigationCompleted : function(details){

        if (details.frameId !== 0) {
            return;
        }
        var scripts = 0;
        myTabs.executeScripts(details.tabId, false, function (){
            scripts++;
            if(scripts == 7){
                myWeb.currentURL = details.url;
                myWeb.open();
            }
        });
    },

    onCommandsCommand : function(command){
        //TODO
    }
};

myEventPage.initialize();