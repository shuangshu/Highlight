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
        chrome.tabs.onUpdated.addListener(myEventPage.onTabUpdated);
        chrome.commands.onCommand.addListener(myEventPage.onCommandsCommand);
        chrome.contextMenus.onClicked.addListener(myContextMenu.onClicked);
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
                myContextMenu.setCurrentHighlightID(message.highlightId);
                break;
            case "onMouseLeaveHighlight":
                myContextMenu.setCurrentHighlightID(message.highlightId);
                break;
        }
    },
    onTabUpdated : function(tabId, changeInfo, tab){
        if(tab.url.indexOf("chrome://newtab/") >=0 ||
            tab.url.indexOf("chrome://extensions/") >=0){
            return;
        }
        myWeb.currentURL = tab.url;
        myWeb.currentTabID = tab.id;
        if(tab.status == "complete"){
            myTabs.insertCSS(tab.id,function(){
            });
            var scripts = 0;
            myTabs.executeScripts(tab.id, function (){
                scripts++;
                if(scripts == 8){
                    myWeb.close();
                    myWeb.open();
                }
            });
        }
    },
    onTabActivated: function (activeInfo) {
        myContextMenu.createMenus();
        myTabs.getTab(activeInfo.tabId, function (tab) {
            myWeb.currentURL = tab.url;
            myWeb.currentTabID = tab.id;
        });
    },
    onWebNavigationCompleted : function(details){
        //TODO
    },
    onCommandsCommand : function(command){
        //TODO
    }
};

myEventPage.initialize();