/**
 * Created by csy on 2016/3/10.
 */

var myWeb = {

    socket : null,

    open : function(){
        try{
            socket = new WebSocket('ws://localhost:12001');
            socket.onopen = this.onOpen;
            socket.onclose = this.onClose;
            socket.onmessage = this.onMessage;
            socket.onerror = this.onError;
        }
        catch (e){
            socket = null;
            console.log(e);
        }
    },

    close: function(){
        if(!socket && socket.readyState != 1)
            return;
        socket.close();
    },

    sendMsg : function(data){
        if(!socket && socket.readyState != 1)
            return;
        socket.send(data);
    },

    onOpen : function(event){
        console.log('onclose',event);
    },

    onClose : function(event){
        console.log('onClose',event);
    },

    onMessage : function(event){
        console.log('onMessage',event);
    },

    onError: function(event){
        console.log('onError',event);
    }
};