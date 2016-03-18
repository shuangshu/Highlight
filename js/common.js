/**
 * Created by gft060 on 2016/3/8.
 */
var myStringUtility = {
    createUUID: function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c, index) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });
    },
    isEmpty : function(val){
        if(val ==null ||
            val ==undefined ||
            val.length <= 0){
            return true;
        }
        return false;
    },
    COMMON_CREATE : "CREATE",
    COMMON_DELETE : "DELETE",
    COMMON_UPDATE : "UPDATE",
    COMMON_FOCUS : "FOCUS",
    COMMON_SEARCH : "SEARCH",
    COMMON_SEARCHALL : "SEARCHALL",
    DEFAULT_HIGHLIGHT_CLASS_NAME : "default-4B8192F5FBC945A49212026FF891A28B",
    DEFAULT_FOCUS_CLASS_NAME : "default-Focus-C1ED9F669907455394ED16E821796071",
}