/**
 * Created by csy on 2016/3/10.
 */

var myWeb = {
    socket : null,
    currentURL : null,
    currentTabID : null,
    open : function(){
        try{
            if(myWeb.socket == null){
                myWeb.socket = new WebSocket('ws://localhost:12001');
                myWeb.socket.onerror = myWeb.onError;
                myWeb.socket.onopen = myWeb.onOpen;
                myWeb.socket.onclose = myWeb.onClose;
                myWeb.socket.onmessage = myWeb.onMessage;
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
        if(!myWeb.socket || myWeb.socket.readyState != 1){
            myWeb.close();//try again
            myWeb.open();
        }
        if(myWeb.socket.readyState != 1){
            setTimeout(function(){
                myWeb.socket.send(data);
            },1000);
        }else {
            myWeb.socket.send(data);
        }
    },
    onOpen : function(event){
        if(myWeb.currentURL == null)
            return;
        var msg = {
            "key":"QUERY",
            "value": myWeb.currentURL
        };
        myWeb.sendMsg(JSON.stringify(msg));
    },
    onClose : function(event){
        console.log('onClose',event);
    },
    onMessage : function(event){
        if(!event.data || event.data.length == 0)
            return;
        try{
            var data = JSON.parse(event.data);
            switch (data.key){
                case "QUERY":
                    data.value.forEach(function (val) {
                        var id = val.key;
                        if(val.value && val.value.length > 0){
                            var xpathRange = JSON.parse(val.value);
                            myTabs.sendCreateHighlightMessage(myWeb.currentTabID,
                                xpathRange,
                                myStringUtility.DEFAULT_HIGHLIGHT_CLASS_NAME,
                                id,
                                function(state){
                                });
                        }
                    });
                    break;
                case "CREATE":
                    var obj = JSON.parse(data.value);
                    var xpathRange = JSON.parse(obj.xpath);
                    var text = obj.text;
                    var id = obj.id;
                    myTabs.sendCreateHighlightMessage(myWeb.currentTabID, xpathRange,  myStringUtility.DEFAULT_HIGHLIGHT_CLASS_NAME, id,
                        function(state){
                        }
                    );
                    break;
                case "DELETE":
                    var id = data.value;
                    myTabs.sendDeleteHighlightMessage(myWeb.currentTabID, id,
                        function(state){
                        }
                    );
                    break;
            }
        }
        catch (error){
            console.log(error);
        }
    },
    onError: function(event){
        console.log('onError',event);
    }
};