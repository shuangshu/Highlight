/**
 * Created by csy on 2016/3/10.
 */

var myWeb = {

    socket : null,

    currentURL : null,

    open : function(){
        try{
            if(this.socket == null){
                this.socket = new WebSocket('ws://localhost:12001');
                this.socket.onopen = this.onOpen;
                this.socket.onclose = this.onClose;
                this.socket.onmessage = this.onMessage;
                this.socket.onerror = this.onError;
            }
        }
        catch (e){
            this.socket = null;
            console.log(e);
        }
    },

    close: function(){
        if(!this.socket || this.socket.readyState != 1)
            return;
        this.socket.close();
        this.socket = null;
    },

    sendMsg : function(data){
        if(!this.socket || this.socket.readyState != 1)
            return;
        this.socket.send(data);
    },

    onOpen : function(event){
        if(this.currentURL == null)
            return;
        var msg = {
            "key":"QUERY",
            "value": myWeb.currentURL
        };
        this.sendMsg(JSON.stringify(msg));
    },

    onClose : function(event){
        console.log('onClose',event);
    },

    onMessage : function(event){
        if(!event.data || event.data.length == 0)
            return;
        var data = JSON.parse(event.data);
        switch (data.key){
            case "QUERY":
                data.value.forEach(function (val) {
                    console.log(val);
                });
                break;
        }
    },

    onError: function(event){
        console.log('onError',event);
    }
};