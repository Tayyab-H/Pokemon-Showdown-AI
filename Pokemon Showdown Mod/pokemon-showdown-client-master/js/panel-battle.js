function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Battle panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var








BattlesRoom=function(_PSRoom){_inheritsLoose(BattlesRoom,_PSRoom);




function BattlesRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='battles';_this.format='';_this.battles=null;
_this.refresh();return _this;
}var _proto=BattlesRoom.prototype;_proto.
setFormat=function setFormat(format){
if(format===this.format)return this.refresh();
this.battles=null;
this.format=format;
this.update('');
this.refresh();
};_proto.
refresh=function refresh(){
PS.send("|/cmd roomlist "+toID(this.format));
};return BattlesRoom;}(PSRoom);var


BattlesPanel=function(_PSRoomPanel){_inheritsLoose(BattlesPanel,_PSRoomPanel);function BattlesPanel(){var _this2;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this2=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this2.
refresh=function(){
_this2.props.room.refresh();
};_this2.
changeFormat=function(e){
var value=e.target.value;
_this2.props.room.setFormat(value);
};return _this2;}var _proto2=BattlesPanel.prototype;_proto2.
renderBattleLink=function renderBattleLink(battle){
var format=battle.id.split('-')[1];
var minEloMessage=typeof battle.minElo==='number'?"rated "+battle.minElo:battle.minElo;
return preact.h("div",null,preact.h("a",{href:"/"+battle.id,"class":"ilink"},
minEloMessage&&preact.h("small",{style:"float:right"},"(",minEloMessage,")"),
preact.h("small",null,"[",format,"]"),preact.h("br",null),
preact.h("em",{"class":"p1"},battle.p1)," ",preact.h("small",{"class":"vs"},"vs.")," ",preact.h("em",{"class":"p2"},battle.p2)));

};_proto2.
render=function render(){var _this3=this;
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},preact.h("div",{"class":"pad"},
preact.h("button",{"class":"button",style:"float:right;font-size:10pt;margin-top:3px",name:"close"},preact.h("i",{"class":"fa fa-times"})," Close"),
preact.h("div",{"class":"roomlist"},
preact.h("p",null,
preact.h("button",{"class":"button",name:"refresh",onClick:this.refresh},preact.h("i",{"class":"fa fa-refresh"})," Refresh")," ",preact.h("span",{style:Dex.getPokemonIcon('meloetta-pirouette')+';display:inline-block;vertical-align:middle',"class":"picon",title:"Meloetta is PS's mascot! The Pirouette forme is Fighting-type, and represents our battles."})),


preact.h("p",null,
preact.h("label",{"class":"label"},"Format:"),preact.h(FormatDropdown,{onChange:this.changeFormat})),








preact.h("div",{"class":"list"},!room.battles?
preact.h("p",null,"Loading..."):
!room.battles.length?
preact.h("p",null,"No battles are going on"):

room.battles.map(function(battle){return _this3.renderBattleLink(battle);})))));



};return BattlesPanel;}(PSRoomPanel);var


BattleRoom=function(_ChatRoom){_inheritsLoose(BattleRoom,_ChatRoom);function BattleRoom(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_ChatRoom.call.apply(_ChatRoom,[this].concat(args))||this;_this4.
classType='battle';_this4.








battle=null;return _this4;}var _proto3=BattleRoom.prototype;_proto3.



handleMessage=function handleMessage(line){
if(!line.startsWith('/')||line.startsWith('//'))return false;
var spaceIndex=line.indexOf(' ');
var cmd=spaceIndex>=0?line.slice(1,spaceIndex):line.slice(1);
var target=spaceIndex>=0?line.slice(spaceIndex+1):'';
switch(cmd){
case'play':{
this.battle.play();
this.update('');
return true;
}case'pause':{
this.battle.pause();
this.update('');
return true;
}case'ffto':case'fastfowardto':{
var turnNum=Number(target);
if(target.charAt(0)==='+'||turnNum<0){
turnNum+=this.battle.turn;
if(turnNum<0)turnNum=0;
}else if(target==='end'){
turnNum=-1;
}
if(isNaN(turnNum)){
this.receive("|error|/ffto - Invalid turn number: "+target);
return true;
}
this.battle.fastForwardTo(turnNum);
this.update('');
return true;
}case'switchsides':{
this.battle.switchSides();
return true;
}}
return _ChatRoom.prototype.handleMessage.call(this,line);
};return BattleRoom;}(ChatRoom);var


BattleDiv=function(_preact$Component){_inheritsLoose(BattleDiv,_preact$Component);function BattleDiv(){return _preact$Component.apply(this,arguments)||this;}var _proto4=BattleDiv.prototype;_proto4.
shouldComponentUpdate=function shouldComponentUpdate(){
return false;
};_proto4.
render=function render(){
return preact.h("div",{"class":"battle"});
};return BattleDiv;}(preact.Component);var


BattlePanel=function(_PSRoomPanel2){_inheritsLoose(BattlePanel,_PSRoomPanel2);function BattlePanel(){var _this5;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this5=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this5.
send=function(text){
_this5.props.room.send(text);
};_this5.



focusIfNoSelection=function(){
var selection=window.getSelection();
if(selection.type==='Range')return;
_this5.focus();
};_this5.
onKey=function(e){
if(e.keyCode===33){
var chatLog=_this5.base.getElementsByClassName('chat-log')[0];
chatLog.scrollTop=chatLog.scrollTop-chatLog.offsetHeight+60;
return true;
}else if(e.keyCode===34){
var _chatLog=_this5.base.getElementsByClassName('chat-log')[0];
_chatLog.scrollTop=_chatLog.scrollTop+_chatLog.offsetHeight-60;
return true;
}
return false;
};return _this5;}var _proto5=BattlePanel.prototype;_proto5.focus=function focus(){this.base.querySelector('textarea').focus();};_proto5.
componentDidMount=function componentDidMount(){var _this6=this;
var battle=new Battle($(this.base).find('.battle'),$(this.base).find('.battle-log'));
this.props.room.battle=battle;
battle.endCallback=function(){return _this6.forceUpdate();};
battle.play();
_PSRoomPanel2.prototype.componentDidMount.call(this);
};_proto5.
receive=function receive(line){
if(line==="|initdone"){
this.props.room.battle.fastForwardTo(-1);
return;
}
this.props.room.battle.add(line);
};_proto5.
renderControls=function renderControls(){
var battle=this.props.room.battle;
if(!battle)return null;
var atEnd=battle.playbackState===Playback.Finished;
return preact.h("div",{"class":"battle-controls",role:"complementary","aria-label":"Battle Controls",style:"top: 370px;"},
preact.h("p",null,
atEnd?
preact.h("button",{"class":"button disabled",name:"cmd",value:"/play"},preact.h("i",{"class":"fa fa-play"}),preact.h("br",null),"Play"):
battle.paused?
preact.h("button",{"class":"button",name:"cmd",value:"/play"},preact.h("i",{"class":"fa fa-play"}),preact.h("br",null),"Play"):

preact.h("button",{"class":"button",name:"cmd",value:"/pause"},preact.h("i",{"class":"fa fa-pause"}),preact.h("br",null),"Pause")," ",

preact.h("button",{"class":"button",name:"cmd",value:"/ffto -1"},preact.h("i",{"class":"fa fa-step-backward"}),preact.h("br",null),"Last turn"),
preact.h("button",{"class":"button"+(atEnd?" disabled":""),name:"cmd",value:"/ffto +1"},preact.h("i",{"class":"fa fa-step-forward"}),preact.h("br",null),"Skip turn")," ",
preact.h("button",{"class":"button",name:"cmd",value:"/ffto 0"},preact.h("i",{"class":"fa fa-undo"}),preact.h("br",null),"First turn"),
preact.h("button",{"class":"button"+(atEnd?" disabled":""),name:"cmd",value:"/ffto end"},preact.h("i",{"class":"fa fa-fast-forward"}),preact.h("br",null),"Skip to end")),

preact.h("p",null,
preact.h("button",{"class":"button",name:"cmd",value:"/switchsides"},preact.h("i",{"class":"fa fa-random"})," Switch sides")));


};_proto5.
render=function render(){
var room=this.props.room;

return preact.h(PSPanelWrapper,{room:room},
preact.h(BattleDiv,null),
preact.h(ChatLog,{"class":"battle-log hasuserlist",room:this.props.room,onClick:this.focusIfNoSelection,left:640,noSubscription:true}),


preact.h(ChatTextEntry,{room:this.props.room,onMessage:this.send,onKey:this.onKey,left:640}),
preact.h(ChatUserList,{room:this.props.room,left:640,minimized:true}),
this.renderControls());

};return BattlePanel;}(PSRoomPanel);


PS.roomTypes['battle']={
Model:BattleRoom,
Component:BattlePanel};

PS.roomTypes['battles']={
Model:BattlesRoom,
Component:BattlesPanel};

PS.updateRoomTypes();