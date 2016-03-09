/**
 * Created by gft060 on 2016/3/8.
 */
var myTabs = {

    executeScripts : function(tabId, allFrames, callback){
        if (allFrames ===  undefined || allFrames === null) {
            allFrames = false;
        }
        var array = [];
        [
            "static/js/jquery-2.1.1.min.js",
            "static/js/jquery.stylesheet.min.js",
            "js/common.js",
            "js/context/stylesheet.js",
            "js/context/xpath.js",
            "js/context/highlight.js",
            "js/context/context.js"
        ].forEach(function (file) {
            var detail = {
                file: file,
                allFrames: allFrames
            }
            chrome.tabs.executeScript(tabId, detail, callback);
        });
    },
    sendMessage:function(tabId, message, responseCallback){
        chrome.tabs.sendMessage(tabId, message, function (response){
            if (responseCallback) {
                responseCallback(response);
            }
        });
    },
    sendCreateHighlightMessage: function (tabId, range, className, documentId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "createHighlight",
            range: range,
            highlightId: documentId,
            className: className
        }, responseCallback);
    },
    sendUpdateHighlightMessage: function (tabId, documentId, className, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "updateHighlight",
            highlightId: documentId,
            className: className
        }, responseCallback);
    },
    sendDeleteHighlightMessage: function (tabId, documentId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "deleteHighlight",
            highlightId: documentId
        }, responseCallback);
    },
    sendGetSelectionRangeMessage: function (tabId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "getSelectionRange"
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
    sendIsHighlightMessage: function (tabId, documentId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "isHighlight",
            highlightId: documentId
        }, responseCallback);
    },
    sendScrollToMessage: function (tabId, documentId, responseCallback) {
        myTabs.sendMessage(tabId, {
            id: "scrollTo",
            fragment: documentId
        }, responseCallback);
    }
};