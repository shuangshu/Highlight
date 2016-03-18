/**
 * Created by gft060 on 2016/3/8.
 */
var myHighlight = {
    getRange : function (id) {
        var span = document.getElementById(id);
        var range = document.createRange();
        while (this.isHighlight(span)) {
            if (range.collapsed) {
                range.setStartBefore(span);
            }
            range.setEndAfter(span);
            span = span.lastSpan;
        }
        return range;
    },
    createHighlight : function(range, id, className) {
        var span = document.createElement("SPAN");
        span.className = (className instanceof Array ? className.join(" ") : className);
        var spanNode = {
            firstSpan: null,
            lastSpan: null
        };
        function _doCreate(range, spanNode, createCallback) {
            if (range.collapsed) {
                return;
            }
            var startSide = range.startContainer, endSide = range.endContainer,
                ancestor = range.commonAncestorContainer, IsLeaf = true;

            if (range.endOffset === 0) {
                while (!endSide.previousSibling && endSide.parentNode !== ancestor) {
                    endSide = endSide.parentNode;
                }

                endSide = endSide.previousSibling;
            } else if (endSide.nodeType === Node.TEXT_NODE) {
                if (range.endOffset < endSide.nodeValue.length) {
                    endSide.splitText(range.endOffset);
                }
            } else if (range.endOffset > 0) {
                endSide = endSide.childNodes.item(range.endOffset - 1);
            }
            if (startSide.nodeType === Node.TEXT_NODE) {
                if (range.startOffset === startSide.nodeValue.length) {
                    IsLeaf = false;
                } else if (range.startOffset > 0) {
                    startSide = startSide.splitText(range.startOffset);

                    if (endSide === startSide.previousSibling) {
                        endSide = startSide;
                    }
                }
            } else if (range.startOffset < startSide.childNodes.length) {
                startSide = startSide.childNodes.item(range.startOffset);
            } else {
                IsLeaf = false;
            }
            range.setStart(range.startContainer, 0);
            range.setEnd(range.startContainer, 0);
            var done = false, node = startSide;
            do {
                if (IsLeaf && node.nodeType === Node.TEXT_NODE &&
                    !(node.parentNode instanceof HTMLTableElement) &&
                    !(node.parentNode instanceof HTMLTableRowElement) &&
                    !(node.parentNode instanceof HTMLTableColElement) &&
                    !(node.parentNode instanceof HTMLTableSectionElement)) {
                    var wrap = node.previousSibling;

                    if (!wrap || wrap !== spanNode.lastSpan) {
                        wrap = createCallback(node);
                        node.parentNode.insertBefore(wrap, node);
                    }
                    wrap.appendChild(node);
                    node = wrap.lastChild;
                    IsLeaf = false;
                }

                if (node === endSide && (!endSide.hasChildNodes() || !IsLeaf)) {
                    done = true;
                }

                if (node instanceof HTMLScriptElement ||
                    node instanceof HTMLStyleElement ||
                    node instanceof HTMLSelectElement) {
                    IsLeaf = false;
                }

                if (IsLeaf && node.hasChildNodes()) {
                    node = node.firstChild;
                } else if (node.nextSibling !== null) {
                    node = node.nextSibling;
                    IsLeaf = true;
                } else if (node.nextSibling === null) {
                    node = node.parentNode;
                    IsLeaf = false;
                }
            } while (!done);
        }
        _doCreate(range, spanNode, function () {
            var newSpan = span.cloneNode(false);
            if (!spanNode.firstSpan) {
                spanNode.firstSpan = newSpan;
                spanNode.firstSpan.id = id;
            }
            if (spanNode.lastSpan) {
                spanNode.lastSpan.nextSpan = newSpan;
            }
            spanNode.lastSpan = newSpan;
            newSpan.firstSpan = spanNode.firstSpan;
            return newSpan;
        });
        return spanNode.firstSpan;
    },
    updateHighlight : function (id, className) {
        var span = document.getElementById(id);
        if (!this.isHighlight(span)) {
            return false;
        }
        className = (className instanceof Array ? className.join(" ") : className);
        do {
            span.className = className;
            span = span.nextSpan;
        } while (this.isHighlight(span));

        return true;
    },
    deleteHighlight : function (id) {
        var span = document.getElementById(id);
        if (!this.isHighlight(span)) {
            return false;
        }
        function _merge(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.nextSibling && node.nextSibling.nodeType === Node.TEXT_NODE) {
                    node.textContent += node.nextSibling.textContent;
                    node.nextSibling.parentNode.removeChild(node.nextSibling);
                }
                if (node.previousSibling && node.previousSibling.nodeType === Node.TEXT_NODE) {
                    node.previousSibling.textContent += node.textContent;
                    node.parentNode.removeChild(node);
                }
            }
        }
        while (this.isHighlight(span)) {
            while (span.hasChildNodes()) {
                var nodeNew = span.parentNode.insertBefore(span.firstChild, span);
                _merge(nodeNew);
            }
            var nodeRemovedPreviousSibling = span.previousSibling;
            var nodeRemoved = span.parentNode.removeChild(span);
            if (nodeRemovedPreviousSibling) {
                _merge(nodeRemovedPreviousSibling);
            }
            span = nodeRemoved.nextSpan;
        }
        return true;
    },
    isHighlight : function (node) {
        return node &&
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "SPAN" &&
            node.firstSpan !== undefined;
    },
    getHighlightTextByID : function(highlightId){
        var text = "";
        if(highlightId){
            text = myHighlight.getRange(highlightId).toString();
        }
        return text;
    },
    getHighlightTextByClass : function(className){
        var text = "";
        $("."+className).each(function(index,element){
            text += element.innerText;
            text += " ";
        });
        return text;
    }
};