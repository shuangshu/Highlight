/**
 * Created by csy on 2016/3/10.
 */

var myWeb = {
    socket : null,
    currentURL : null,
    currentTabID : null,

    open : function(onopen,onclose){
        "use strict";
        try{
            if(myWeb.socket == null){
                myWeb.socket = new WebSocket('ws://localhost:12001');
                myWeb.socket.onmessage = myWeb.onMessage;
                myWeb.socket.onopen = onopen;
                myWeb.socket.onclose = onclose;
            }
        }
        catch (e){
            myWeb.socket = null;
            console.log(e);
        }
    },
    close: function(){
        if(!myWeb.socket)
            return;
        myWeb.socket.close();
        myWeb.socket = null;
    },
    sendMsg : function(data){
        "use strict";
        if(myWeb.socket && myWeb.socket.readyState != 1) {
            myWeb.socket = null;
        }
        if(!myWeb.socket){
            myWeb.open(function(event){
                myWeb.socket.send(data);
            },function(event){
            });
        }
        else{
            myWeb.socket.send(data);
        }
    },
    queryURL:function(){
        "use strict";
        if(myWeb.currentURL == null){
            return;
        }
        var msg = {
            "key":"QUERY",
            "value": myWeb.currentURL
        };
        myWeb.sendMsg(JSON.stringify(msg));
    },
    onMessage : function(event){
        "use strict";
        if(!event.data || event.data.length == 0)
            return;
        try{
            var data = JSON.parse(event.data);
            switch (data.key){
                case "QUERY":
                    data.value = data.value.reverse();
                    data.value.forEach(function (val) {
                        var id = val.key;
                        if(val.value && val.value.length > 0){
                            var xpathRange = JSON.parse(val.value);
                            if(myWeb.currentTabID){
                                myTabs.sendCreateHighlightMessage(myWeb.currentTabID,
                                    xpathRange,
                                    myStringUtility.DEFAULT_HIGHLIGHT_CLASS_NAME,
                                    id,
                                    function(state){
                                        //TODO
                                    }
                                );
                            }
                        }
                    });
                    break;
                case "CREATE":
                    var obj = JSON.parse(data.value);
                    var xpathRange = JSON.parse(obj.xpath);
                    var text = obj.text;
                    var id = obj.id;
                    if(myWeb.currentTabID){
                        myTabs.sendCreateHighlightMessage(myWeb.currentTabID,
                            xpathRange,
                            myStringUtility.DEFAULT_HIGHLIGHT_CLASS_NAME,
                            id,
                            function(state){
                                //TODO
                            }
                        );
                    }
                    break;
                case "DELETE":
                    var id = data.value;
                    if(myWeb.currentTabID) {
                        myTabs.sendDeleteHighlightMessage(myWeb.currentTabID,
                            id,
                            function (state) {
                                //TODO
                            }
                        );
                    }
                    break;
            }
        }
        catch (error){
            console.log(error);
        }
    }
};