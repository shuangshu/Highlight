/**
 * Created by gft060 on 2016/3/8.
 * http://stackoverflow.com/questions/3454526/how-to-calculate-the-_xpath-position-of-an-element-using-javascript
 */
var myXPath = {
    getXPathByNode :function(node){
        "use strict";
        var paths = [];
        for (; node && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE); node = node.parentNode)
        {
            var index = 0;
            //if (node.id)
            //{
            //    var selector = '[id="' + node.id + '"]';
            //    var length = document.querySelectorAll(selector).length;
            //    if (length === 1) {
            //        paths.splice(0, 0, '/*[@id="' + node.id + '"][1]');
            //        break;
            //    }
            //}
            for (var sibling = node.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
                    continue;
                }
                if (sibling.nodeName === node.nodeName) {
                    index++;
                }
            }
            var tagName = (node.nodeType === Node.ELEMENT_NODE ? node.nodeName.toLowerCase() : "text()");
            var pathIndex = (index ? "[" + (index+1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }
        return paths.length ? "/" + paths.join("/") : null;
    },
    createXPathRangeByRange: function (range) {
        var xpathRange = {
            startContainerPath: this.getXPathByNode(range.startContainer),
            startOffset: range.startOffset,
            endContainerPath: this.getXPathByNode(range.endContainer),
            endOffset: range.endOffset,
            collapsed: range.collapsed
        }
        var title = "";
        var tagTitle = document.getElementsByTagName("title")[0];
        if(tagTitle && tagTitle.innerText){
            title = tagTitle.innerText.substring(0,100);
        }
        return{
            xpathRange : xpathRange,
            rangeText : range.toString(),
            title: title
        };
    },
    createRangeByXPathRange: function (xpathRange) {
        "use strict";
        var startContainer, endContainer, endOffset, evaluator = new XPathEvaluator();
        startContainer = evaluator.evaluate(xpathRange.startContainerPath,
            document.documentElement,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null);
        if (!startContainer.singleNodeValue) {
            return null;
        }
        if (xpathRange.collapsed || !xpathRange.endContainerPath) {
            endContainer = startContainer;
            endOffset = xpathRange.startOffset;
        }
        else {
            endContainer = evaluator.evaluate(xpathRange.endContainerPath,
                document.documentElement,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null);
            if (!endContainer.singleNodeValue) {
                return null;
            }
            endOffset = xpathRange.endOffset;
        }
        var range = document.createRange();
        range.setStart(startContainer.singleNodeValue, xpathRange.startOffset);
        range.setEnd(endContainer.singleNodeValue, endOffset);
        return range;
    }
};