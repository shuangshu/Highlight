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
    COMMON_SEARCH : "SEARCH",
    COMMON_SEARCHALL : "SEARCHALL",
    COMMON_FOCUS : "FOCUS"
}