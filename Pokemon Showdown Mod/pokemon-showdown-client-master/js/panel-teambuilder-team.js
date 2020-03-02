function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Teambuilder team panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var

TeamTextbox=function(_preact$Component){_inheritsLoose(TeamTextbox,_preact$Component);function TeamTextbox(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this.
setInfo=


[];_this.
textbox=null;_this.
heightTester=null;_this.
activeType='';_this.
activeOffsetY=-1;_this.
search=new BattleSearch();_this.





input=function(){return _this.update();};_this.
select=function(){return _this.update(true);};_this.
update=function(cursorOnly){
var textbox=_this.textbox;
_this.heightTester.style.width=textbox.offsetWidth+"px";
var value=textbox.value;

var index=0;
var setIndex=-1;
if(!cursorOnly)_this.setInfo=[];
_this.activeOffsetY=-1;
_this.activeType='';

var selectionStart=textbox.selectionStart||0;
var selectionEnd=textbox.selectionEnd||0;


var parseState=0;
while(index<value.length){
var nlIndex=value.indexOf('\n',index);
if(nlIndex<0)nlIndex=value.length;
var line=value.slice(index,nlIndex).trim();

if(!line){
parseState=0;
index=nlIndex+1;
continue;
}

if(parseState===0&&index&&!cursorOnly){
_this.setInfo[_this.setInfo.length-1].bottomY=_this.getYAt(index-1,value);
}

if(parseState===0){
if(!cursorOnly){
var atIndex=line.indexOf('@');
var species=atIndex>=0?line.slice(0,atIndex).trim():line;
if(species.endsWith(')')){
var parenIndex=species.lastIndexOf(' (');
if(parenIndex>=0){
species=species.slice(parenIndex+2,-1);
}
}
_this.setInfo.push({
species:species,
bottomY:-1});

}
parseState=1;
setIndex++;
}

var selectionEndCutoff=selectionStart===selectionEnd?nlIndex:nlIndex+1;
if(index<=selectionStart&&selectionEnd<=selectionEndCutoff){

_this.activeOffsetY=_this.getYAt(index-1,value);

var lcLine=line.toLowerCase().trim();
if(lcLine.startsWith('ability:')){
_this.activeType='ability';
}else if(lcLine.startsWith('-')){
_this.activeType='move';
}else if(
!lcLine||lcLine.startsWith('ivs:')||lcLine.startsWith('evs:')||
lcLine.startsWith('level:')||lcLine.startsWith('gender:')||
lcLine.endsWith(' nature')||lcLine.startsWith('shiny:'))
{

}else{
_this.activeType='pokemon';
}
_this.search.setType(_this.activeType,'gen7ou',_this.props.sets[setIndex]);
_this.search.find('');
}

index=nlIndex+1;
}
if(!cursorOnly){
var bottomY=_this.getYAt(value.length,value);
if(_this.setInfo.length){
_this.setInfo[_this.setInfo.length-1].bottomY=bottomY;
}

textbox.style.height=bottomY+100+"px";
}
_this.forceUpdate();
};return _this;}var _proto=TeamTextbox.prototype;_proto.getYAt=function getYAt(index,value){if(index<0)return 10;this.heightTester.value=value.slice(0,index);return this.heightTester.scrollHeight;};_proto.
componentDidMount=function componentDidMount(){
this.textbox=this.base.getElementsByClassName('teamtextbox')[0];
this.heightTester=this.base.getElementsByClassName('heighttester')[0];

var exportedTeam=PSTeambuilder.exportTeam(this.props.sets);
this.textbox.value=exportedTeam;
this.update();
};_proto.
componentWillUnmount=function componentWillUnmount(){
this.textbox=null;
this.heightTester=null;
};_proto.
render=function render(){var _this2=this;
return preact.h("div",{"class":"teameditor"},
preact.h("textarea",{"class":"textbox teamtextbox",onInput:this.input,onSelect:this.select,onClick:this.select,onKeyUp:this.select}),
preact.h("textarea",{
"class":"textbox teamtextbox heighttester",style:"visibility:hidden",tabIndex:-1,"aria-hidden":true}),

preact.h("div",{"class":"teamoverlays"},
this.setInfo.slice(0,-1).map(function(info){return(
preact.h("hr",{style:"top:"+(info.bottomY-18)+"px"}));}),

this.setInfo.map(function(info,i){
if(!info.species)return null;
var prevOffset=i===0?8:_this2.setInfo[i-1].bottomY;
var species=info.species;
var num=Dex.getPokemonIconNum(toID(species));
if(!num)return null;

var top=Math.floor(num/12)*30;
var left=num%12*40;
var iconStyle="background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-sheet.png) no-repeat scroll -"+left+"px -"+top+"px";

return preact.h("span",{"class":"picon",style:"top:"+(
prevOffset+1)+"px;left:50px;position:absolute;"+iconStyle});

}),
this.activeOffsetY>=0&&
preact.h("div",{"class":"teaminnertextbox",style:{top:this.activeOffsetY-1}})),


this.activeType&&preact.h(PSSearchResults,{search:this.search}));

};return TeamTextbox;}(preact.Component);var


TeamPanel=function(_PSRoomPanel){_inheritsLoose(TeamPanel,_PSRoomPanel);function TeamPanel(){var _this3;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this3=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this3.
sets=null;_this3.
backToList=function(){
PS.removeRoom(_this3.props.room);
PS.join('teambuilder');
};return _this3;}var _proto2=TeamPanel.prototype;_proto2.
render=function render(){
var room=this.props.room;
var team=PS.teams.byKey[room.id.slice(5)];
if(!team){
return preact.h(PSPanelWrapper,{room:room},
preact.h("button",{"class":"button",onClick:this.backToList},
preact.h("i",{"class":"fa fa-chevron-left"})," List"),

preact.h("p",{"class":"error"},"Team doesn't exist"));



}

var sets=this.sets||PSTeambuilder.unpackTeam(team.packedTeam);
if(!this.sets)this.sets=sets;
return preact.h(PSPanelWrapper,{room:room,scrollable:true},
preact.h("div",{"class":"pad"},
preact.h("button",{"class":"button",onClick:this.backToList},
preact.h("i",{"class":"fa fa-chevron-left"})," List"),

preact.h("h2",null,
team.name),

preact.h(TeamTextbox,{sets:sets})));


};return TeamPanel;}(PSRoomPanel);


PS.roomTypes['team']={
Component:TeamPanel,
title:"Team"};

PS.updateRoomTypes();