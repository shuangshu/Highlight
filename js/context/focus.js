/**
 * Created by gft060 on 2016/3/18.
 */

var myFocus = {
    isFocus : function(id,className){
        var el = $('#' + id);
        if(el.length === 1 &&
            el.className === className){
            return true;
        }
        return false;
    },
    setFocus : function(id,className){
        myHighlight.updateHighlight(id,className);
    },
    getFocus : function(className){
        var array = [];
        $("."+className).each(function(index,element){
            array.push(element);
        });
        return array;
    }
};