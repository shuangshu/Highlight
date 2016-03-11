/**
 * Created by gft060 on 2016/3/8.
 */
var myContextMenu = {

    currentHighlightId : null,

    setCurrentHighlightId: function (id) {
        myContextMenu.currentHighlightId = id;
    },

    removeMenus:function(){
        chrome.contextMenus.removeAll();
    },

    removeMenu : function(id){
        chrome.contextMenus.remove(id);
    },

    enableMenus:function(flag){
        chrome.commands.getAll(function (commands) {
            commands.forEach(function(command){
                var id = command.name+".default";
                chrome.contextMenus.update(id,{
                    parentId : '6A7D6A59C4BF4908B3310F97C529B366',
                    enabled : flag
                },null);
            });
        });
    },

    createMenus:function(){
        chrome.contextMenus.removeAll();
        var parentId = chrome.contextMenus.create({
            "id": "6A7D6A59C4BF4908B3310F97C529B366",
            "title": chrome.runtime.getManifest().name,
            "contexts": ["selection"]
        });
        chrome.commands.getAll(function (commands) {
            commands.forEach(function(command){
                var option = {
                    type: "normal",
                    id: command.name+".default",
                    parentId: '6A7D6A59C4BF4908B3310F97C529B366',
                    title: command.description,
                    contexts:['selection'],
                    enabled : true
                }
                addMenuId = chrome.contextMenus.create(option);
            });
        });
    },

    onClicked: function (info,tab) {
        var regExp = new RegExp("^(.+)\\.(.+)");
        var result = regExp.exec(info.menuItemId);
        if(result && result.length ==3){
            var command = result[1];
            var className = result[2];
            switch (command){
                case 'addHighlight':
                    myTabs.sendGetSelectionRangeMessage(tab.id,function(response){
                        if (response &&
                            response.xpathRange &&
                            !response.xpathRange.collapsed){
                            myTabs.sendCreateHighlightMessage(tab.id,
                                response.xpathRange,
                                className,
                                myStringUtility.createUUID(),
                                function(state){
                                    var data = {
                                        xpath : JSON.stringify(response.xpathRange),
                                        text : response.rangeText,
                                        url : myWeb.currentURL
                                    };
                                    var msg = {
                                        key : "CREATE",
                                        value : JSON.stringify(data)
                                    }
                                    myWeb.sendMsg(JSON.stringify(msg));
                                }
                            );
                        }
                    });
                    break;
                case 'updateHighlight':
                    if(myContextMenu.currentHighlightId){
                        myTabs.sendUpdateHighlightMessage(tab.id,
                            myContextMenu.currentHighlightId,
                            className,
                            function(state){
                            }
                        );
                    }
                    break;
                case 'removeHighlight':
                    if(myContextMenu.currentHighlightId){
                        myTabs.sendDeleteHighlightMessage(tab.id,
                            myContextMenu.currentHighlightId,
                            function(state){
                                var msg = {
                                    key : "DELETE",
                                    value : myContextMenu.currentHighlightId
                                }
                                myWeb.sendMsg(JSON.stringify(msg));
                            }
                        );
                    }
                    break;
            }
        }
    },
}