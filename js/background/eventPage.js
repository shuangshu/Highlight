/**
 * Created by gft060 on 2016/3/8.
 */

var myEventPage = {
    initialize:function(){
        "use strict";
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
        "use strict";
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
        "use strict";
        if(tab.url.indexOf("chrome://newtab/") >=0 ||
            tab.url.indexOf("chrome://extensions/") >=0){
            return;
        }
        myWeb.currentURL = tab.url;
        myWeb.currentTabID = tab.id;
        if(changeInfo.status === "complete"){
            myTabs.insertCSS(tab.id,function(){
            });
            var scripts = 0;
            myTabs.executeScripts(tab.id, function (){
                scripts++;
                if(scripts == 9){
                    myWeb.queryURL();
                }
            });
        }
    },
    onTabActivated: function (activeInfo) {
        "use strict";
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
    },
    setBrowserActions : function(tabId){
        "use strict";
        chrome.browserAction.onClicked.addListener(function(tab){
            console.log("browserAction-click");
        });
    }
};

myEventPage.initialize();