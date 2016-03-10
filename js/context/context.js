/**
 * Created by gft060 on 2016/3/8.
 */

var myContext = {

    highlightClassName: null,

    initialize:function(){
        myContext.highlightClassName = myStringUtility.createUUID();
        chrome.storage.onChanged.addListener(myContext.onChanged);
        chrome.runtime.onMessage.addListener(myContext.onRuntimeMessage);
        $(document).on({
            mouseenter: myContext.onMouseEnterHighlight,
            mouseleave: myContext.onMouseLeaveHighlight
        }, "." + myContext.highlightClassName);
        $(document).ready(function(){
            var def = {
                "className" : "default-red-aa94e3d5-ab2f-4205-b74e-18ce31c7c0ce",
                "style" : {}
            }
            myStylesheet.setHighlightStyle(def);
        });
    },
    getHighlightId: function (element) {
        if (!element.prevSpan) {
            return;
        }
        return element.prevSpan.id;
    },
    onRuntimeMessage:function(message, sender, sendResponse){
        var response;
        switch (message.id){
            case "createHighlight":
                response = myContext.createHighlight(message.range, message.highlightId, message.className);
                break;
            case "updateHighlight":
                response = myContext.updateHighlight(message.highlightId, message.className);
                break;
            case "deleteHighlight":
                response = myContext.deleteHighlight(message.highlightId);
                break;
            case "selectHighlight":
                range = myContext.selectHighlight(message.highlightId);
                if (message.highlightId && range) {
                    response = myXPath.createXPathRangeByRange(range);
                }
                break;
            case "isHighlight":
                response = myContext.isHighlight(message.id);
                break;
            case "getSelectionRange":
                response = myXPath.createXPathRangeByRange(myContext.getSelectionRange());
                break;
            case "getRangeText":
                var range = myXPath.createRangeByXPathRange(message.range);
                response = range ? range.toString() : null;
                break;
            case "scrollTo":
                response = myContext.scrollTo("#" + message.fragment);
                break;
            default:
                throw ("invalid message id");
                break;
        }
        sendResponse(response);
    },
    onChanged: function (changes, namespace) {
        console.log("storage change");
    },
    onMouseEnterHighlight: function () {
        var id = myContext.getHighlightId(this);
        if (id) {
            console.log("onMouseEnterHighlight:" + id);
            chrome.runtime.sendMessage({
                id: "onMouseEnterHighlight",
                highlightId: id
            });
        }
    },
    onMouseLeaveHighlight: function () {
        var id =  myContext.getHighlightId(this);
        if (id) {
            console.log("onMouseLeaveHighlight:" + id);
            chrome.runtime.sendMessage({
                id: "onMouseLeaveHighlight",
                highlightId: id
            });
        }
    },
    getSelectionRange : function(){
        var range;
        var selection = window.getSelection();
        if (selection.isCollapsed) {
            range = new Range();
            range.collapse(false);
        }
        else {
            range = selection.getRangeAt(0);
        }
        return range;
    },
    isSelectionCollapsed: function () {
        return window.getSelection().isCollapsed;
    },
    createHighlight :function(xpathRange, id, className){
        var range;
        try {
            range = myXPath.createRangeByXPathRange(xpathRange);
        } catch (error) {
            return null;
        }
        if (!range) {
            return null;
        }
        return myHighlight.createHighlight(range, id, [myContext.highlightClassName, className]);
    },
    deleteHighlight: function (id) {
        return myHighlight.deleteHighlight(id);
    },
    selectHighlight: function (id) {
        var selection = window.getSelection();
        selection.removeAllRanges();
        if (id) {
            var range = myHighlight.getRange(id);
            selection.addRange(range);
            return range;
        }
    },
    updateHighlight: function (id, className) {
        return myHighlight.updateHighlight(id, [myContext.highlightClassName, className]);
    },
    isHighlight: function (id) {
        return $('#' + id).length === 1;
    },
    scrollTo: function (selector) {
        var $elm = $(selector);
        if ($elm) {
            $('body').animate({
                'scrollTop': $elm.offset().top
            }, 'slow');
        }
        return $elm !== null;
    },
};
myContext.initialize();