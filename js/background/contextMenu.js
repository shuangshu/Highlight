/**
 * Created by gft060 on 2016/3/8.
 */
var myContextMenu = {

    currentHighlightId : null,

    setCurrentHighlightId: function (id) {
        myContextMenu.currentHighlightId = id;
    },

    createMenus:function(){
        chrome.contextMenus.removeAll();
        var parentID = chrome.contextMenus.create({
            "id": "da7cb902-89c6-46fe-b0e7-d3b35aaf237a",
            "title": chrome.runtime.getManifest().name,
            "contexts": ["selection"]
        });
        chrome.commands.getAll(function (commands) {
            commands.forEach(function(command){
                var option = {
                    type: "normal",
                    id: command.name+".default-red-aa94e3d5-ab2f-4205-b74e-18ce31c7c0ce",//command + className
                    parentId: parentID,
                    title: command.description,
                    contexts:["selection"]
                }
                chrome.contextMenus.create(option);
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
                case "addHighlight":
                    myTabs.sendGetSelectionRangeMessage(tab.id,function(xpathRange){
                        if (xpathRange && !xpathRange.collapsed){
                            myTabs.sendCreateHighlightMessage(tab.id,
                                xpathRange,
                                className,
                                myStringUtility.createUUID(),
                                function(state){
                                    console.log("addHighlight:"+state);
                                }
                            );
                        }
                    });
                    break;
                case "updateHighlight":
                    if(myContextMenu.currentHighlightId){
                        myTabs.sendUpdateHighlightMessage(tab.id,
                            myContextMenu.currentHighlightId,
                            className,
                            function(state){
                                console.log("updateHighlight:"+state);
                            }
                        );
                    }
                    break;
                case "removeHighlight":
                    if(myContextMenu.currentHighlightId){
                        myTabs.sendDeleteHighlightMessage(tab.id,
                            myContextMenu.currentHighlightId,
                            function(state){
                                console.log("removeHighlight:"+state);
                            }
                        );
                    }
                    break;
            }
        }
    },

}