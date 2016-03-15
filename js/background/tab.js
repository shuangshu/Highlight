/**
 * Created by gft060 on 2016/3/8.
 */
var myTabs = {

    executeScripts : function(tabId, callback){
        var array = [];
        [
            "static/js/jquery-2.1.1.min.js",
            "static/js/jquery.stylesheet.min.js",
            "static/js/bootstrap.min.js",
            "js/common.js",
            "js/context/stylesheet.js",
            "js/context/xpath.js",
            "js/context/context.js",
            "js/context/highlight.js"
        ].forEach(function (file) {
            var detail = {
                file : file,
                allFrames : false
            }
            chrome.tabs.executeScript(tabId, detail, callback);
        });
    },
    insertCSS : function(tabId,callback){
        var array = [];
        [
            "css/highlight.css",
            "css/bootstrap.min.css"
        ].forEach(function (file) {
            var detail = {
                file : "css/highlight.css",
                allFrames : false
            }
            chrome.tabs.insertCSS(tabId, detail, callback);
        });
    },
    isTab : function(tabId,query,callback){
        chrome.tabs.query(query,function(tabs){
            for(var i = 0; i < tabs.length; i++){
                if(tabs[i].id == tabId){
                    if(callback){
                        callback();
                    }
                    return;
                }
            };
        });
    },
    getTab : function(tabId,callback){
        chrome.tabs.get(tabId,function(tab){
            if(callback){
                callback(tab);
            }
        });
    },
    createTab : function(createProperties,callback){
        chrome.tabs.create(createProperties,function(tab){
            if(callback){
                callback(tab);
            }
        });
    },
    sendMessage:function(tabId, message, responseCallback){
        chrome.tabs.sendMessage(tabId, message, function (response){
            if (responseCallback) {
                responseCallback(response);
            }
        });
    },
    sendCreateHighlightMessage: function (tabId, range, className, highlightId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "createHighlight",
            range: range,
            highlightId: highlightId,
            className: className
        }, responseCallback);
    },
    sendUpdateHighlightMessage: function (tabId, highlightId, className, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "updateHighlight",
            highlightId: highlightId,
            className: className
        }, responseCallback);
    },
    sendDeleteHighlightMessage: function (tabId, highlightId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "deleteHighlight",
            highlightId: highlightId
        }, responseCallback);
    },
    sendGetSelectionRangeMessage: function (tabId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "getSelectionRange"
        }, responseCallback);
    },
    sendGetHighlightTextByIDMessage: function (tabId, highlightId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "getHighlightTextByID",
            highlightId: highlightId
        }, responseCallback);
    },
    sendGetHighlightTextByClassMessage: function (tabId,className, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "getHighlightTextByClass",
            className: className
        }, responseCallback);
    },
    sendGetRangeTextMessage: function (tabId, xpathRange, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "getRangeText",
            range: xpathRange
        }, responseCallback);
    },
    sendSelectHighlightMessage: function (tabId, documentId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "selectHighlight",
            highlightId: documentId,
        }, responseCallback);
    },
    sendIsHighlightMessage: function (tabId, highlightId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "isHighlight",
            highlightId: highlightId
        }, responseCallback);
    },
    sendScrollToMessage: function (tabId, highlightId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "scrollTo",
            fragment: highlightId
        }, responseCallback);
    }
};