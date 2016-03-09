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
        console.log("onRuntimeInstalled: " + JSON.stringify(details));
        alert("onRuntimeInstalled");
        myContextMenu.createMenus();
    },

    onRuntimeStartup:function(){
        console.log("onRuntimeStartup");
    },

    onRuntimeMessage: function (message, sender, sendResponse) {
        console.log("onRuntimeMessage");
        switch(message.id){
            case "onMouseEnterHighlight":
                break;
            case "onMouseLeaveHighlight":
                break;
        }
    },

    onTabActivated: function (activeInfo) {
        console.log("onTabActivated");
        myContextMenu.createMenus();
    },

    onWebNavigationCompleted : function(details){
        if (details.frameId !== 0) {
            return;
        }
        myTabs.executeScripts(details.tabId, false, function (){
            console.log("executeScript-ok");
        });
    },

    onCommandsCommand : function(command){
        console.log(command);
    }
};

myEventPage.initialize();