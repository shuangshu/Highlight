/**
 * Created by gft060 on 2016/3/8.
 */
var myContextMenu = {
    currentHighlightID : null,
    currentFocusID : null,
    setCurrentHighlightID: function (id) {
        "use strict";
        myContextMenu.currentHighlightID = id;
    },
    setFocusID : function(id){
        "use strict";
        myContextMenu.currentFocusID = id;
    },
    removeMenus:function(){
        "use strict";
        chrome.contextMenus.removeAll();
    },
    removeMenu : function(id){
        "use strict";
        chrome.contextMenus.remove(id);
    },
    enableMenus:function(enable){
        "use strict";
        chrome.commands.getAll(function (commands) {
            commands.forEach(function(command){
                var id = command.name+"."+myStringUtility.DEFAULT_HIGHLIGHT_CLASS_NAME;
                chrome.contextMenus.update(id,{
                    parentId : '6A7D6A59C4BF4908B3310F97C529B366',
                    enabled : enable
                },null);
            });
        });
    },
    createMenus:function(){
        "use strict";
        chrome.contextMenus.removeAll();
        var parentId = chrome.contextMenus.create({
            "id": "6A7D6A59C4BF4908B3310F97C529B366",
            "title": chrome.runtime.getManifest().name,
            "contexts": ["all"]
        });
        chrome.commands.getAll(function (commands) {
            commands.forEach(function(command){
                if(command.description.length > 0){
                    var option = {
                        type: "normal",
                        id: command.name +"."+ myStringUtility.DEFAULT_HIGHLIGHT_CLASS_NAME,
                        parentId: '6A7D6A59C4BF4908B3310F97C529B366',
                        title: command.description,
                        contexts:['all'],
                        enabled : true
                    }
                    chrome.contextMenus.create(option);
                }
            });
        });
    },
    onClicked:function (info,tab) {
        "use strict";
        myWeb.currentURL = tab.url;
        myWeb.currentTabID = tab.id;
        var regExp = new RegExp("^(.+)\\.(.+)");
        var result = regExp.exec(info.menuItemId);
        if(result && result.length ==3){
            var command = result[1];
            var className = result[2];
            switch (command){
                case myStringUtility.COMMON_CREATE:
                    if(info.editable){
                        return;
                    }
                    myTabs.sendGetSelectionRangeMessage(tab.id,function(response){
                        if (response &&
                            response.xpathRange &&
                            !response.xpathRange.collapsed){
                            var data = {
                                xpath : JSON.stringify(response.xpathRange),
                                text : response.rangeText,
                                title : response.title.length > 0 ? response.title : tab.url.substring(0,100),
                                url : tab.url
                            };
                            var msg = {
                                key : command,
                                value : JSON.stringify(data)
                            }
                            myWeb.sendMsg(JSON.stringify(msg));
                        }
                    });
                    break;
                case myStringUtility.COMMON_DELETE:
                    if(myContextMenu.currentHighlightID){
                        var msg = {
                            key : command,
                            value : myContextMenu.currentHighlightID
                        }
                        myWeb.sendMsg(JSON.stringify(msg));
                    }
                    break;
                case myStringUtility.COMMON_SEARCH:
                    if(myContextMenu.currentHighlightID){
                        myTabs.sendGetHighlightTextByIDMessage(tab.id,myContextMenu.currentHighlightID,function(response){
                            if (!myStringUtility.isEmpty(response)){
                                var rangeText = response;
                                var properties = {
                                    url : "http://116.236.181.98:31415/list?search=" + rangeText
                                };
                                myTabs.createTab(properties,function(tab){
                                    console.log(tab);
                                });
                            }
                        });
                    }
                    break;
                case myStringUtility.COMMON_SEARCHALL:
                    myTabs.sendGetHighlightTextByClassMessage(tab.id, className,function(response){
                        if (!myStringUtility.isEmpty(response)){
                            var properties = {
                                url : "http://116.236.181.98:31415/list?search=" + response
                            };
                            myTabs.createTab(properties,function(tab){
                                console.log(tab);
                            });
                        }
                    });
                    break;
                case myStringUtility.COMMON_FOCUS:
                    if(myContextMenu.currentHighlightID){
                        myTabs.sendSetFocusMessage(tab.id, myContextMenu.currentHighlightID, myStringUtility.DEFAULT_FOCUS_CLASS_NAME ,function(response){
                        });
                    }
                    break;
            }
        }
    }
}