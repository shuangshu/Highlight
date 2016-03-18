/**
 * Created by gft060 on 2016/3/8.
 */

var myContext = {
    highlightClassName: null,
    initialize : function(){
        myContext.highlightClassName = myStringUtility.createUUID();
        chrome.storage.onChanged.addListener(myContext.onChanged);
        chrome.runtime.onMessage.addListener(myContext.onRuntimeMessage);
        $(document).on({
            mouseenter: myContext.onMouseEnterHighlight,
            mouseleave: myContext.onMouseLeaveHighlight
        }, "." + myContext.highlightClassName);
    },
    getHighlightID : function (element) {
        if (!element.firstSpan) {
            return null;
        }
        return element.firstSpan.id;
    },
    onRuntimeMessage : function(message, sender, sendResponse){
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
            case "getHighlightTextByID":
                response = myContext.getHighlightTextByID(message.highlightId);
                break;
            case "getHighlightTextByClass":
                response = myContext.getHighlightTextByClass(message.className);
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
            case "isFocus":
                response = myContext.isFocus(message.highlightId);
                break;
            case "setFocus":
                response = myContext.setFocus(message.highlightId,message.className);
                break;
            case "getFocus":
                response = myContext.getFocus();
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
    onChanged : function (changes, namespace) {
        console.log("storage change");
    },
    onMouseEnterHighlight : function () {
        var id = myContext.getHighlightID(this);
        chrome.runtime.sendMessage({
            id: "onMouseLeaveHighlight",
            highlightId: id
        });
    },
    onMouseLeaveHighlight : function () {
        var id =  myContext.getHighlightID(this);
        chrome.runtime.sendMessage({
            id: "onMouseLeaveHighlight",
            highlightId: id
        });
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
    //Begin Highlight
    createHighlight : function(xpathRange, id, className){
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
    deleteHighlight : function (id) {
        return myHighlight.deleteHighlight(id);
    },
    selectHighlight : function (id) {
        var selection = window.getSelection();
        selection.removeAllRanges();
        if (id) {
            var range = myHighlight.getRange(id);
            selection.addRange(range);
            return range;
        }
    },
    updateHighlight : function (id, className) {
        return myHighlight.updateHighlight(id, [myContext.highlightClassName, className]);
    },
    isHighlight : function (id) {
        return $('#' + id).length === 1;
    },
    getHighlightTextByID : function(highlightId){
        return myHighlight.getHighlightTextByID(highlightId);
    },
    getHighlightTextByClass : function(className){
        return myHighlight.getHighlightTextByClass(className);
    },
    //End Highlight
    //Begin Focus
    isFocus : function(highlightId,className){
        return myFocus.isFocus(highlightId,className)
    },
    setFocus : function(highlightId,className){
        myFocus.setFocus(highlightId,className);
    },
    getFocus : function(className){
        return myFocus.getFocus(className);
    },
    //End Focus
    scrollTo : function (selector) {
        var $elm = $(selector);
        if ($elm) {
            $('body').animate({
                'scrollTop': $elm.offset().top
            }, 'slow');
        }
        return $elm !== null;
    }
};
myContext.initialize();