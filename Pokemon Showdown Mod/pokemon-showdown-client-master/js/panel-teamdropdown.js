function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype);subClass.prototype.constructor=subClass;subClass.__proto__=superClass;}/**
 * Team Selector Panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var

PSTeambuilder=function(){function PSTeambuilder(){}PSTeambuilder.
packTeam=function packTeam(team){
var buf='';
if(!team)return'';for(var _i=0;_i<

team.length;_i++){var set=team[_i];
var hasHP='';
if(buf)buf+=']';


buf+=set.name||set.species;


var _id=toID(set.species);
buf+='|'+(toID(set.name||set.species)===_id?'':_id);


buf+='|'+toID(set.item);


var template=Dex.getTemplate(set.species||set.name);
var abilities=template.abilities;
_id=toID(set.ability);
if(abilities){
if(_id===toID(abilities['0'])){
buf+='|';
}else if(_id===toID(abilities['1'])){
buf+='|1';
}else if(_id===toID(abilities['H'])){
buf+='|H';
}else{
buf+='|'+_id;
}
}else{
buf+='|'+_id;
}


buf+='|';
if(set.moves){
for(var j=0;j<set.moves.length;j++){
var moveid=toID(set.moves[j]);
if(j&&!moveid)continue;
buf+=(j?',':'')+moveid;
if(moveid.substr(0,11)==='hiddenpower'&&moveid.length>11){
hasHP=moveid.slice(11);
}
}
}


buf+='|'+(set.nature||'');


if(set.evs){
buf+='|'+(set.evs['hp']||'')+','+(
set.evs['atk']||'')+','+(
set.evs['def']||'')+','+(
set.evs['spa']||'')+','+(
set.evs['spd']||'')+','+(
set.evs['spe']||'');
}else{
buf+='|';
}


if(set.gender&&set.gender!==template.gender){
buf+='|'+set.gender;
}else{
buf+='|';
}


if(set.ivs){
buf+='|'+(set.ivs['hp']===31?'':set.ivs['hp'])+','+(
set.ivs['atk']===31?'':set.ivs['atk'])+','+(
set.ivs['def']===31?'':set.ivs['def'])+','+(
set.ivs['spa']===31?'':set.ivs['spa'])+','+(
set.ivs['spd']===31?'':set.ivs['spd'])+','+(
set.ivs['spe']===31?'':set.ivs['spe']);
}else{
buf+='|';
}


if(set.shiny){
buf+='|S';
}else{
buf+='|';
}


if(set.level){
buf+='|'+set.level;
}else{
buf+='|';
}


if(set.happiness!==undefined){
buf+='|'+set.happiness;
}else{
buf+='|';
}

if(set.pokeball||set.hpType&&toID(set.hpType)!==hasHP){
buf+=','+(set.hpType||'');
buf+=','+toID(set.pokeball);
}
}

return buf;
};PSTeambuilder.

unpackTeam=function unpackTeam(buf){
if(!buf)return[];

var team=[];
var i=0;
var j=0;

while(true){
var set={species:'',moves:[]};
team.push(set);


j=buf.indexOf('|',i);
set.name=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
set.species=Dex.getTemplate(buf.substring(i,j)).species||set.name;
i=j+1;


j=buf.indexOf('|',i);
set.item=Dex.getItem(buf.substring(i,j)).name;
i=j+1;


j=buf.indexOf('|',i);
var ability=Dex.getAbility(buf.substring(i,j)).name;
var template=Dex.getTemplate(set.species);
if(template.baseSpecies==='Zygarde'&&ability==='H')ability='Power Construct';
set.ability=['','0','1','H','S'].includes(ability)?
template.abilities[ability||'0']||(ability===''?'':'!!!ERROR!!!'):
ability;
i=j+1;


j=buf.indexOf('|',i);
set.moves=buf.substring(i,j).split(',').map(function(moveid){return(
Dex.getMove(moveid).name);});

i=j+1;


j=buf.indexOf('|',i);
set.nature=buf.substring(i,j);
if(set.nature==='undefined')set.nature=undefined;
i=j+1;


j=buf.indexOf('|',i);
if(j!==i){
var evstring=buf.substring(i,j);
if(evstring.length>5){
var evs=evstring.split(',');
set.evs={
hp:Number(evs[0])||0,
atk:Number(evs[1])||0,
def:Number(evs[2])||0,
spa:Number(evs[3])||0,
spd:Number(evs[4])||0,
spe:Number(evs[5])||0};

}else if(evstring==='0'){
set.evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
}
}
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.gender=buf.substring(i,j);
i=j+1;


j=buf.indexOf('|',i);
if(j!==i){
var ivs=buf.substring(i,j).split(',');
set.ivs={
hp:ivs[0]===''?31:Number(ivs[0]),
atk:ivs[1]===''?31:Number(ivs[1]),
def:ivs[2]===''?31:Number(ivs[2]),
spa:ivs[3]===''?31:Number(ivs[3]),
spd:ivs[4]===''?31:Number(ivs[4]),
spe:ivs[5]===''?31:Number(ivs[5])};

}
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.shiny=true;
i=j+1;


j=buf.indexOf('|',i);
if(i!==j)set.level=parseInt(buf.substring(i,j),10);
i=j+1;


j=buf.indexOf(']',i);
var misc=undefined;
if(j<0){
if(i<buf.length)misc=buf.substring(i).split(',',3);
}else{
if(i!==j)misc=buf.substring(i,j).split(',',3);
}
if(misc){
set.happiness=misc[0]?Number(misc[0]):undefined;
set.hpType=misc[1];
set.pokeball=misc[2];
}
if(j<0)break;
i=j+1;
}

return team;
};PSTeambuilder.




exportSet=function exportSet(set){
var text='';


if(set.name&&set.name!==set.species){
text+=set.name+" ("+set.species+")";
}else{
text+=""+set.species;
}
if(set.gender==='M')text+=" (M)";
if(set.gender==='F')text+=" (F)";
if(set.item){
text+=" @ "+set.item;
}
text+="  \n";
if(set.ability){
text+="Ability: "+set.ability+"  \n";
}
if(set.moves){for(var _i2=0,_set$moves=
set.moves;_i2<_set$moves.length;_i2++){var move=_set$moves[_i2];
if(move.substr(0,13)==='Hidden Power '){
var hpType=move.slice(13);
move=move.slice(0,13);
move=move+"["+hpType+"]";
}
if(move){
text+="- "+move+"  \n";
}
}
}


var first=true;
if(set.evs){for(var _i3=0,_Dex$statNames=
Dex.statNames;_i3<_Dex$statNames.length;_i3++){var stat=_Dex$statNames[_i3];
if(!set.evs[stat])continue;
if(first){
text+="EVs: ";
first=false;
}else{
text+=" / ";
}
text+=set.evs[stat]+" "+BattleStatNames[stat];
}
}
if(!first){
text+="  \n";
}
if(set.nature){
text+=set.nature+" Nature  \n";
}
first=true;
if(set.ivs){for(var _i4=0,_Dex$statNames2=
Dex.statNames;_i4<_Dex$statNames2.length;_i4++){var _stat=_Dex$statNames2[_i4];
if(set.ivs[_stat]===undefined||isNaN(set.ivs[_stat])||set.ivs[_stat]===31)continue;
if(first){
text+="IVs: ";
first=false;
}else{
text+=" / ";
}
text+=set.ivs[_stat]+" "+BattleStatNames[_stat];
}
}
if(!first){
text+="  \n";
}


if(set.level&&set.level!==100){
text+="Level: "+set.level+"  \n";
}
if(set.shiny){
text+="Shiny: Yes  \n";
}
if(typeof set.happiness==='number'&&set.happiness!==255&&!isNaN(set.happiness)){
text+="Happiness: "+set.happiness+"  \n";
}

text+="\n";
return text;
};PSTeambuilder.
exportTeam=function exportTeam(sets){
var text='';for(var _i5=0;_i5<
sets.length;_i5++){var set=sets[_i5];

text+=PSTeambuilder.exportSet(set);
}
return text;
};PSTeambuilder.

packedTeamNames=function packedTeamNames(buf){
if(!buf)return[];

var team=[];
var i=0;

while(true){
var name=buf.slice(i,buf.indexOf('|',i));
i=buf.indexOf('|',i)+1;

team.push(buf.slice(i,buf.indexOf('|',i))||name);

for(var k=0;k<9;k++){
i=buf.indexOf('|',i)+1;
}

i=buf.indexOf(']',i)+1;

if(i<1)break;
}

return team;
};return PSTeambuilder;}();


function TeamFolder(props){


if(props.cur){
return preact.h("div",{"class":"folder cur"},preact.h("div",{"class":"folderhack3"},
preact.h("div",{"class":"folderhack1"}),preact.h("div",{"class":"folderhack2"}),
preact.h("div",{"class":"selectFolder","data-value":props.value},props.children)));

}
return preact.h("div",{"class":"folder"},
preact.h("div",{"class":"selectFolder","data-value":props.value},props.children));

}

function TeamBox(props){
var team=props.team;
var contents;
if(team){
var icons=team.iconCache;
if(!icons){
if(!team.packedTeam){
icons=preact.h("em",null,"(empty team)");
}else{
icons=PSTeambuilder.packedTeamNames(team.packedTeam).map(function(species){return(
preact.h("span",{"class":"picon",style:Dex.getPokemonIcon(species)}));});

}
team.iconCache=icons;
}
var format=team.format;
if(format.startsWith('gen7'))format=format.slice(4);
format=(format?"["+format+"] ":"")+(team.folder?team.folder+"/":"");
contents=[
preact.h("strong",null,format&&preact.h("span",null,format),team.name),
preact.h("small",null,icons)];

}else{
contents=[
preact.h("em",null,"Select a team")];

}
if(props.button){
return preact.h("button",{"class":"team",value:PS.teams.getKey(team)},
contents);

}
return preact.h("div",{"data-href":props.noLink?'':"/team-"+PS.teams.getKey(team),"class":"team",draggable:true},
contents);

}var





TeamDropdownPanel=function(_PSRoomPanel){_inheritsLoose(TeamDropdownPanel,_PSRoomPanel);function TeamDropdownPanel(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_PSRoomPanel.call.apply(_PSRoomPanel,[this].concat(args))||this;_this.
gen='';_this.
format=null;_this.








setFormat=function(e){
var target=e.currentTarget;
_this.format=target.name==='format'&&target.value||'';
_this.gen=target.name==='gen'&&target.value||'';
_this.forceUpdate();
};_this.
click=function(e){
var curTarget=e.target;
var target;
while(curTarget&&curTarget!==e.currentTarget){
if(curTarget.tagName==='BUTTON'){
target=curTarget;
}
curTarget=curTarget.parentElement;
}
if(!target)return;

_this.chooseParentValue(target.value);
};return _this;}var _proto=TeamDropdownPanel.prototype;_proto.getTeams=function getTeams(){var _this2=this;if(!this.format&&!this.gen)return PS.teams.list;return PS.teams.list.filter(function(team){if(_this2.gen&&!team.format.startsWith(_this2.gen))return false;if(_this2.format&&team.format!==_this2.format)return false;return true;});};_proto.
render=function render(){var _this3=this;
var room=this.props.room;
if(!room.parentElem){
return preact.h(PSPanelWrapper,{room:room},
preact.h("p",null,"Error: You tried to open a team selector, but you have nothing to select a team for."));

}
var baseFormat=room.parentElem.getAttribute('data-format')||Dex.modid;
var isFirstLoad=this.format===null;
if(isFirstLoad){
this.format=baseFormat;
}
var teams=this.getTeams();
if(!teams.length&&this.format&&isFirstLoad){
this.gen=this.format.slice(0,4);
this.format='';
teams=this.getTeams();
}
if(!teams.length&&this.gen&&isFirstLoad){
this.gen='';
teams=this.getTeams();
}

var availableWidth=document.body.offsetWidth;
var width=307;
if(availableWidth>636)width=613;
if(availableWidth>945)width=919;

var teamBuckets={};for(var _i6=0,_teams=
teams;_i6<_teams.length;_i6++){var team=_teams[_i6];
var list=teamBuckets[team.folder]||(teamBuckets[team.folder]=[]);
list.push(team);
}

var teamList=[];

var baseGen=baseFormat.slice(0,4);
var genList=[];for(var _i7=0,_PS$teams$list=
PS.teams.list;_i7<_PS$teams$list.length;_i7++){var _team=_PS$teams$list[_i7];
var gen=_team.format.slice(0,4);
if(gen&&!genList.includes(gen))genList.push(gen);
}
var hasOtherGens=genList.length>1||genList[0]!==baseGen;

teamList.push(preact.h("p",null,
baseFormat.length>4&&preact.h("button",{"class":'button'+(baseFormat===this.format?' disabled':''),onClick:this.setFormat,name:"format",value:baseFormat},
preact.h("i",{"class":"fa fa-folder-o"})," [",baseFormat.slice(0,4),"] ",baseFormat.slice(4))," ",
preact.h("button",{"class":'button'+(baseGen===this.format?' disabled':''),onClick:this.setFormat,name:"format",value:baseGen},
preact.h("i",{"class":"fa fa-folder-o"})," [",baseGen,"] ",preact.h("em",null,"(uncategorized)"))," ",
preact.h("button",{"class":'button'+(baseGen===this.gen?' disabled':''),onClick:this.setFormat,name:"gen",value:baseGen},
preact.h("i",{"class":"fa fa-folder-o"})," [",baseGen,"] ",preact.h("em",null,"(all)"))," ",
hasOtherGens&&!this.gen&&preact.h("button",{"class":"button",onClick:this.setFormat,name:"gen",value:baseGen},"Other gens")));


if(hasOtherGens&&this.gen){
teamList.push(preact.h("h2",null,"Other gens"));
teamList.push(preact.h("p",null,genList.sort().map(function(gen){return[
preact.h("button",{"class":'button'+(gen===_this3.gen?' disabled':''),onClick:_this3.setFormat,name:"gen",value:gen},
preact.h("i",{"class":"fa fa-folder-o"})," [",gen,"] ",preact.h("em",null,"(all)")),

" "];})));

}

var isEmpty=true;
for(var _folder in teamBuckets){
if(_folder&&(this.gen||this.format)){
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open"})," ",_folder," + ",
preact.h("i",{"class":"fa fa-folder-open-o"})," ",this.format||this.gen));

}else if(_folder){
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open"})," ",_folder));

}else if(this.gen||this.format){
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open-o"})," ",this.format||this.gen));

}else{
teamList.push(preact.h("h2",null,
preact.h("i",{"class":"fa fa-folder-open-o"})," Teams not in any folders"));

}
teamList.push(preact.h("ul",{"class":"teamdropdown",onClick:this.click},
teamBuckets[_folder].map(function(team){return preact.h("li",{key:PS.teams.getKey(team),style:"display:inline-block"},
preact.h(TeamBox,{team:team,button:true}));})));


isEmpty=false;
}

return preact.h(PSPanelWrapper,{room:room,width:width},
teamList,
isEmpty&&preact.h("p",null,preact.h("em",null,"No teams found")));

};return TeamDropdownPanel;}(PSRoomPanel);var





















FormatDropdownPanel=function(_PSRoomPanel2){_inheritsLoose(FormatDropdownPanel,_PSRoomPanel2);function FormatDropdownPanel(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_PSRoomPanel2.call.apply(_PSRoomPanel2,[this].concat(args))||this;_this4.
gen='';_this4.
format=null;_this4.
click=function(e){
var curTarget=e.target;
var target;
while(curTarget&&curTarget!==e.currentTarget){
if(curTarget.tagName==='BUTTON'){
target=curTarget;
}
curTarget=curTarget.parentElement;
}
if(!target)return;

_this4.chooseParentValue(target.value);
};return _this4;}var _proto2=FormatDropdownPanel.prototype;_proto2.
render=function render(){
var room=this.props.room;
if(!room.parentElem){
return preact.h(PSPanelWrapper,{room:room},
preact.h("p",null,"Error: You tried to open a format selector, but you have nothing to select a format for."));

}

var formatsLoaded=!!window.BattleFormats;
if(formatsLoaded){
formatsLoaded=false;
for(var i in window.BattleFormats){
formatsLoaded=true;
break;
}
}
if(!formatsLoaded){
return preact.h(PSPanelWrapper,{room:room},
preact.h("p",null,"Loading..."));

}






var selectType=
room.parentElem.getAttribute('data-selecttype')||'challenge';


var formats=Object.values(BattleFormats).filter(function(format){
if(selectType==='challenge'&&format.challengeShow===false)return false;
if(selectType==='search'&&format.searchShow===false)return false;
return true;
});

return preact.h(PSPanelWrapper,{room:room,width:320},
preact.h("ul",{onClick:this.click},
formats.map(function(format){return preact.h("li",null,preact.h("button",{value:format.name},
format.name));})));



};return FormatDropdownPanel;}(PSRoomPanel);


PS.roomTypes['teamdropdown']={
Component:TeamDropdownPanel};


PS.roomTypes['formatdropdown']={
Component:FormatDropdownPanel};