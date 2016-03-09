/**
 * Created by gft060 on 2016/3/8.
 */
var myHighlight = {

    createHighlight : function(range, id, className){
        function _create(range, record, createCallback) {
            if (range.collapsed) {
                return;
            }
            var startSide = range.startContainer, endSide = range.endContainer, ancestor = range.commonAncestorContainer, isNodeLeaf = true;
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
                    isNodeLeaf = false;
                } else if (range.startOffset > 0) {
                    startSide = startSide.splitText(range.startOffset);
                    if (endSide === startSide.previousSibling) {
                        endSide = startSide;
                    }
                }
            } else if (range.startOffset < startSide.childNodes.length) {
                startSide = startSide.childNodes.item(range.startOffset);
            } else {
                isNodeLeaf = false;
            }
            range.setStart(range.startContainer, 0);
            range.setEnd(range.startContainer, 0);
            var done = false, node = startSide;
            do {
                if (isNodeLeaf && node.nodeType === Node.TEXT_NODE &&
                    !(node.parentNode instanceof HTMLTableElement) &&
                    !(node.parentNode instanceof HTMLTableRowElement) &&
                    !(node.parentNode instanceof HTMLTableColElement) &&
                    !(node.parentNode instanceof HTMLTableSectionElement)) {
                    var wrap = node.previousSibling;
                    if (!wrap || wrap !== record.nextSpan) {
                        wrap = createCallback(node);
                        node.parentNode.insertBefore(wrap, node);
                    }
                    wrap.appendChild(node);
                    node = wrap.lastChild;
                    isNodeLeaf = false;
                }

                if (node === endSide && (!endSide.hasChildNodes() || !isNodeLeaf)) {
                    done = true;
                }

                if (node instanceof HTMLScriptElement ||
                    node instanceof HTMLStyleElement ||
                    node instanceof HTMLSelectElement) {
                    isNodeLeaf = false;
                }

                if (isNodeLeaf && node.hasChildNodes()) {
                    node = node.firstChild;
                } else if (node.nextSibling !== null) {
                    node = node.nextSibling;
                    isNodeLeaf = true;
                } else if (node.nextSibling === null) {
                    node = node.parentNode;
                    isNodeLeaf = false;
                }
            } while (!done);
        }
        var span = document.createElement("SPAN");
        span.className = (className instanceof Array ? className.join(" ") : className);
        var spanNode = {
            prevSpan: null,
            nextSpan: null
        };
        _create(range, spanNode, function () {
            var newSpan = span.cloneNode(false);
            if (!spanNode.prevSpan) {
                spanNode.prevSpan = newSpan;
                spanNode.prevSpan.id = id;
            }
            if (spanNode.nextSpan) {
                spanNode.nextSpan.nextSpan = newSpan;
            }
            spanNode.nextSpan = newSpan;
            newSpan.prevSpan = spanNode.prevSpan;
            return newSpan;
        });
        return spanNode.prevSpan;
    },
    updateHighlight: function (id, className) {
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
    deleteHighlight: function (id) {
        var span = document.getElementById(id);
        if (!this.isHighlight(span)) {
            return false;
        }
        function _merge(n) {
            if (n.nodeType === Node.TEXT_NODE) {
                if (n.nextSibling && n.nextSibling.nodeType === Node.TEXT_NODE) {
                    n.textContent += n.nextSibling.textContent;
                    n.nextSibling.parentNode.removeChild(n.nextSibling);
                }
                if (n.previousSibling && n.previousSibling.nodeType === Node.TEXT_NODE) {
                    n.previousSibling.textContent += n.textContent;
                    n.parentNode.removeChild(n);
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
    getRange: function (id) {
        var span = document.getElementById(id);
        var range = document.createRange();
        while (this.isHighlight(span)) {
            if (range.collapsed) {
                range.setStartBefore(span);
            }
            range.setEndAfter(span);
            span = span.nextSpan;
        }
        return range;
    },
    isHighlight: function (node) {
        return node &&
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "SPAN" &&
            node.prevSpan !== undefined;
    }
};