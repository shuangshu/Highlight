/**
 * Created by gft060 on 2016/3/18.
 */

var myFocus = {

    focusClassName : "default-Focus-C1ED9F669907455394ED16E821796071",

    isFocus : function(id){
        var el = $('#' + id);
        if(el.length === 1 &&
            el.className === focusClassName){
            return true;
        }
        return false;
    },

    setFocus : function(id){
        myHighlight.updateHighlight(id,focusClassName);
    },

    getFocus : function(){
        var array = [];
        $("."+className).each(function(index,element){
            array.push(element);
        });
        return array;
    }
};