/**
 * Created by gft060 on 2016/3/9.
 */

var myStylesheet = {

    setHighlightStyle:function(definition){
        var $ss = $.stylesheet('.' + definition.className);
        $ss.css(null);
        var style = jQuery.extend(true, {}, definition.style);
        style["background-color"] = "rgba(255, 128, 128, 0.8)";
        style["color"] = "rgb(0, 0, 0)";
        style["font-style"] = "inherit";
        style["box-shadow"] = "rgb(255, 128, 128) 0px 0px 8px";
        style["transition-duration"] = "0.1s, 0.1s, 0.1s";
        style["transition-property"] = "color, background-color, box-shadow";
        style["transition-timing-function"] = "linear, linear, linear";
        style["border-radius"] = "0.2em";
        $ss.css(null).css(style);
    },

    clearHighlightStyle : function(className){
        $.stylesheet('.' + className).css(null);
    }
};