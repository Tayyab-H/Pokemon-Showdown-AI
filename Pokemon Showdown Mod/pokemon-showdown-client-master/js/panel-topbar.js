function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Topbar Panel
 *
 * Topbar view - handles the topbar and some generic popups.
 *
 * Also sets up global event listeners.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var

PSHeader=function(_preact$Component){_inheritsLoose(PSHeader,_preact$Component);function PSHeader(){return _preact$Component.apply(this,arguments)||this;}var _proto=PSHeader.prototype;_proto.
renderRoomTab=function renderRoomTab(id){
var room=PS.rooms[id];
var closable=id===''||id==='rooms'?'':' closable';
var cur=PS.isVisible(room)?' cur':'';
var className="roomtab button"+room.notifying+closable+cur;
var icon=null;
var title=room.title;
var closeButton=null;
switch(room.type){
case'':
case'mainmenu':
icon=preact.h("i",{"class":"fa fa-home"});
break;
case'teambuilder':
icon=preact.h("i",{"class":"fa fa-pencil-square-o"});
break;
case'ladder':
icon=preact.h("i",{"class":"fa fa-list-ol"});
break;
case'battles':
icon=preact.h("i",{"class":"fa fa-caret-square-o-right"});
break;
case'rooms':
icon=preact.h("i",{"class":"fa fa-plus",style:"margin:7px auto -6px auto"});
title='';
break;
case'battle':
var idChunks=id.substr(7).split('-');
var formatid;

if(idChunks.length<=1){
if(idChunks[0]==='uploadedreplay')formatid='Uploaded Replay';
}else{
formatid=idChunks[idChunks.length-2];
}
if(!title){var _battle$p,_battle$p2;
var battle=room.battle;
var p1=(battle==null?void 0:(_battle$p=battle.p1)==null?void 0:_battle$p.name)||'';
var p2=(battle==null?void 0:(_battle$p2=battle.p2)==null?void 0:_battle$p2.name)||'';
if(p1&&p2){
title=p1+" v. "+p2;
}else if(p1||p2){
title=""+p1+p2;
}else{
title="(empty room)";
}
}
icon=preact.h("i",{"class":"text"},formatid);
break;
case'chat':
icon=preact.h("i",{"class":"fa fa-comment-o"});
break;
case'html':
default:
if(title.charAt(0)==='['){
var closeBracketIndex=title.indexOf(']');
if(closeBracketIndex>0){
icon=preact.h("i",{"class":"text"},title.slice(1,closeBracketIndex));
title=title.slice(closeBracketIndex+1);
break;
}
}
icon=preact.h("i",{"class":"fa fa-file-text-o"});
break;}

if(closable){
closeButton=preact.h("button",{"class":"closebutton",name:"closeRoom",value:id,"aria-label":"Close"},
preact.h("i",{"class":"fa fa-times-circle"}));

}
return preact.h("li",null,preact.h("a",{"class":className,href:"/"+id,draggable:true},icon," ",preact.h("span",null,title)),closeButton);
};_proto.
render=function render(){var _this=this;
var userColor=window.BattleLog&&{color:BattleLog.usernameColor(PS.user.userid)};
return preact.h("div",{id:"header","class":"header",style:this.props.style},
preact.h("img",{
"class":"logo",
src:"https://play.pokemonshowdown.com/pokemonshowdownbeta.png",
srcset:"https://play.pokemonshowdown.com/pokemonshowdownbeta@2x.png 2x",
alt:"Pok\xE9mon Showdown! (beta)",
width:"146",height:"44"}),

preact.h("div",{"class":"maintabbarbottom"}),
preact.h("div",{"class":"tabbar maintabbar"},preact.h("div",{"class":"inner"},
preact.h("ul",null,
this.renderRoomTab('')),

preact.h("ul",null,
PS.leftRoomList.slice(1).map(function(roomid){return _this.renderRoomTab(roomid);})),

preact.h("ul",{"class":"siderooms",style:{"float":'none',marginLeft:PS.leftRoomWidth-144}},
PS.rightRoomList.map(function(roomid){return _this.renderRoomTab(roomid);})))),


preact.h("div",{"class":"userbar"},
preact.h("span",{"class":"username","data-name":PS.user.name,style:userColor},
preact.h("i",{"class":"fa fa-user",style:"color:#779EC5"})," ",PS.user.name)," ",

preact.h("button",{"class":"icon button disabled",name:"joinRoom",value:"volume",title:"Sound","aria-label":"Sound"},
preact.h("i",{"class":"fa fa-volume-up"}))," ",

preact.h("button",{"class":"icon button disabled",name:"joinRoom",value:"options",title:"Options","aria-label":"Options"},
preact.h("i",{"class":"fa fa-cog"}))));



};return PSHeader;}(preact.Component);


preact.render(preact.h(PSMain,null),document.body,document.getElementById('ps-frame'));var





UserRoom=function(_PSRoom){_inheritsLoose(UserRoom,_PSRoom);




function UserRoom(options){var _this2;
_this2=_PSRoom.call(this,options)||this;_this2.classType='user';
_this2.userid=_this2.id.slice(5);
_this2.isSelf=_this2.userid===PS.user.userid;
_this2.name=options.username||_this2.userid;
if(/[a-zA-Z0-9]/.test(_this2.name.charAt(0)))_this2.name=' '+_this2.name;
PS.send("|/cmd userdetails "+_this2.userid);return _this2;
}return UserRoom;}(PSRoom);var


UserPanel=function(_PSRoomPanel){_inheritsLoose(UserPanel,_PSRoomPanel);function UserPanel(){return _PSRoomPanel.apply(this,arguments)||this;}var _proto2=UserPanel.prototype;_proto2.
render=function render(){
var room=this.props.room;
var user=PS.mainmenu.userdetailsCache[room.userid]||{userid:room.userid,avatar:'[loading]'};
var name=room.name.slice(1);

var group=PS.server.getGroup(room.name);
var groupName=group.name||null;
if(group.type==='punishment'){
groupName=preact.h("span",{style:"color:#777777"},groupName);
}

var globalGroup=PS.server.getGroup(user.group);
var globalGroupName=globalGroup.name&&"Global "+globalGroup.name||null;
if(globalGroup.type==='punishment'){
globalGroupName=preact.h("span",{style:"color:#777777"},globalGroupName);
}
if(globalGroup.name===group.name)groupName=null;

var roomsList=null;
if(user.rooms){
var battlebuf=[];
var chatbuf=[];
var privatebuf=[];
for(var roomid in user.rooms){
if(roomid==='global')continue;
var curRoom=user.rooms[roomid];
var roomrank=null;
if(!/[A-Za-z0-9]/.test(roomid.charAt(0))){
roomrank=preact.h("small",{style:"color: #888; font-size: 100%"},roomid.charAt(0));
}
roomid=toRoomid(roomid);

if(roomid.substr(0,7)==='battle-'){
var p1=curRoom.p1.substr(1);
var p2=curRoom.p2.substr(1);
var ownBattle=PS.user.userid===toUserid(p1)||PS.user.userid===toUserid(p2);
var roomLink=preact.h("a",{href:"/"+roomid,"class":'ilink'+(ownBattle||roomid in PS.rooms?' yours':''),
title:(p1||'?')+" v. "+(p2||'?')},
roomrank,roomid.substr(7));
if(curRoom.isPrivate){
if(privatebuf.length)privatebuf.push(', ');
privatebuf.push(roomLink);
}else{
if(battlebuf.length)battlebuf.push(', ');
battlebuf.push(roomLink);
}
}else{
var _roomLink=preact.h("a",{href:"/"+roomid,"class":'ilink'+(roomid in PS.rooms?' yours':'')},
roomrank,roomid);

if(curRoom.isPrivate){
if(privatebuf.length)privatebuf.push(", ");
privatebuf.push(_roomLink);
}else{
if(chatbuf.length)chatbuf.push(', ');
chatbuf.push(_roomLink);
}
}
}
if(battlebuf.length)battlebuf.unshift(preact.h("br",null),preact.h("em",null,"Battles:")," ");
if(chatbuf.length)chatbuf.unshift(preact.h("br",null),preact.h("em",null,"Chatrooms:")," ");
if(privatebuf.length)privatebuf.unshift(preact.h("br",null),preact.h("em",null,"Private rooms:")," ");
if(battlebuf.length||chatbuf.length||privatebuf.length){
roomsList=preact.h("small",{"class":"rooms"},battlebuf,chatbuf,privatebuf);
}
}else if(user.rooms===false){
roomsList=preact.h("strong",{"class":"offline"},"OFFLINE");
}

var isSelf=user.userid===PS.user.userid;

return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"userdetails"},
user.avatar!=='[loading]'&&
preact.h("img",{
"class":'trainersprite'+(room.isSelf?' yours':''),
src:Dex.resolveAvatar(''+(user.avatar||'unknown'))}),


preact.h("strong",null,preact.h("a",{href:"//pokemonshowdown.com/users/"+user.userid,target:"_blank"},name)),preact.h("br",null),
groupName&&preact.h("small",null,groupName),
groupName&&globalGroupName&&preact.h("br",null),
globalGroupName&&preact.h("small",null,globalGroupName),
roomsList),

isSelf||!PS.user.named?
preact.h("p",{"class":"buttonbar"},
preact.h("button",{"class":"button disabled",disabled:true},"Challenge")," ",
preact.h("button",{"class":"button disabled",disabled:true},"Chat")):


preact.h("p",{"class":"buttonbar"},
preact.h("button",{"class":"button","data-href":"/challenge-"+user.userid},"Challenge")," ",
preact.h("button",{"class":"button","data-href":"/pm-"+user.userid},"Chat")," ",
preact.h("button",{"class":"button disabled",name:"userOptions"},"\u2026")),


isSelf&&preact.h("hr",null),
isSelf&&preact.h("p",{"class":"buttonbar",style:"text-align: right"},
preact.h("button",{"class":"button disabled",name:"login"},preact.h("i",{"class":"fa fa-pencil"})," Change name")," ",
preact.h("button",{"class":"button disabled",name:"logout"},preact.h("i",{"class":"fa fa-power-off"})," Log out")));


};return UserPanel;}(PSRoomPanel);


PS.roomTypes['user']={
Model:UserRoom,
Component:UserPanel};