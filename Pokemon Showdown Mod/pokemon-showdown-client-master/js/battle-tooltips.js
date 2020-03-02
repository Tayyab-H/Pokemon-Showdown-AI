/**
 * Pokemon Showdown Tooltips
 *
 * A file for generating tooltips for battles. This should be IE7+ and
 * use the DOM directly.
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var

ModifiableValue=function(){










function ModifiableValue(battle,pokemon,serverPokemon){this.value=0;this.maxValue=0;this.isAccuracy=false;
this.comment=[];
this.battle=battle;
this.pokemon=pokemon;
this.serverPokemon=serverPokemon;

this.itemName=Dex.getItem(serverPokemon.item).name;
var ability=serverPokemon.ability||(pokemon==null?void 0:pokemon.ability)||serverPokemon.baseAbility;
this.abilityName=Dex.getAbility(ability).name;
this.weatherName=Dex.getMove(battle.weather).exists?
Dex.getMove(battle.weather).name:Dex.getAbility(battle.weather).name;
}var _proto=ModifiableValue.prototype;_proto.
reset=function reset(){var value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var isAccuracy=arguments.length>1?arguments[1]:undefined;
this.value=value;
this.maxValue=0;
this.isAccuracy=!!isAccuracy;
this.comment=[];
};_proto.
tryItem=function tryItem(itemName){var _this$pokemon;
if(itemName!==this.itemName)return false;
if(this.battle.hasPseudoWeather('Magic Room')){
this.comment.push(" ("+itemName+" suppressed by Magic Room)");
return false;
}
if((_this$pokemon=this.pokemon)==null?void 0:_this$pokemon.volatiles['embargo']){
this.comment.push(" ("+itemName+" suppressed by Embargo)");
return false;
}
var ignoreKlutz=[
"Macho Brace","Power Anklet","Power Band","Power Belt","Power Bracer","Power Lens","Power Weight"];

if(this.tryAbility('Klutz')&&!ignoreKlutz.includes(itemName)){
this.comment.push(" ("+itemName+" suppressed by Klutz)");
return false;
}
return true;
};_proto.
tryAbility=function tryAbility(abilityName){var _this$pokemon2;
if(abilityName!==this.abilityName)return false;
if((_this$pokemon2=this.pokemon)==null?void 0:_this$pokemon2.volatiles['gastroacid']){
this.comment.push(" ("+abilityName+" suppressed by Gastro Acid)");
return false;
}
return true;
};_proto.
tryWeather=function tryWeather(weatherName){
if(!this.weatherName)return false;
if(!weatherName)weatherName=this.weatherName;else
if(weatherName!==this.weatherName)return false;for(var _i=0,_this$battle$sides=
this.battle.sides;_i<_this$battle$sides.length;_i++){var side=_this$battle$sides[_i];for(var _i2=0,_side$active=
side.active;_i2<_side$active.length;_i2++){var active=_side$active[_i2];
if(active&&['Air Lock','Cloud Nine'].includes(active.ability)){
this.comment.push(" ("+weatherName+" suppressed by "+active.ability+")");
return false;
}
}
}
return true;
};_proto.
itemModify=function itemModify(factor,itemName){
if(!itemName)itemName=this.itemName;
if(!itemName)return false;
if(!this.tryItem(itemName))return false;
return this.modify(factor,itemName);
};_proto.
abilityModify=function abilityModify(factor,abilityName){
if(!this.tryAbility(abilityName))return false;
return this.modify(factor,abilityName);
};_proto.
weatherModify=function weatherModify(factor,weatherName,name){
if(!weatherName)weatherName=this.weatherName;
if(!weatherName)return false;
if(!this.tryWeather(weatherName))return false;
return this.modify(factor,name||weatherName);
};_proto.
modify=function modify(factor,name){
if(factor===0){
if(name)this.comment.push(" ("+name+")");
this.value=0;
this.maxValue=0;
return true;
}
if(name)this.comment.push(" ("+this.round(factor)+"&times; from "+name+")");
this.value*=factor;
if(!(name==='Technician'&&this.maxValue>60))this.maxValue*=factor;
return true;
};_proto.
set=function set(value,reason){
if(reason)this.comment.push(" ("+reason+")");
this.value=value;
this.maxValue=0;
return true;
};_proto.
setRange=function setRange(value,maxValue,reason){
if(reason)this.comment.push(" ("+reason+")");
this.value=value;
this.maxValue=maxValue;
return true;
};_proto.
round=function round(value){
return value?Number(value.toFixed(2)):0;
};_proto.
toString=function toString(){
var valueString;
if(this.isAccuracy){
valueString=this.value?this.round(this.value)+"%":"can't miss";
}else{
valueString=this.value?""+this.round(this.value):"";
}
if(this.maxValue){
valueString+=" to "+this.round(this.maxValue)+(this.isAccuracy?'%':'');
}
return valueString+this.comment.join('');
};return ModifiableValue;}();var


BattleTooltips=function(){


function BattleTooltips(battle){var _this=this;this.












































































clickTooltipEvent=function(e){
if(BattleTooltips.isLocked){
e.preventDefault();
e.stopImmediatePropagation();
}
};this.





holdLockTooltipEvent=function(e){
if(BattleTooltips.isLocked)BattleTooltips.hideTooltip();
var target=e.currentTarget;
_this.showTooltip(target);
var factor=e.type==='mousedown'&&target.tagName==='BUTTON'?2:1;

BattleTooltips.longTapTimeout=setTimeout(function(){
BattleTooltips.longTapTimeout=0;
_this.lockTooltip();
},BattleTooltips.LONG_TAP_DELAY*factor);
};this.

showTooltipEvent=function(e){
if(BattleTooltips.isLocked)return;
_this.showTooltip(e.currentTarget);
};this.battle=battle;}BattleTooltips.hideTooltip=function hideTooltip(){if(!BattleTooltips.elem)return;BattleTooltips.cancelLongTap();BattleTooltips.elem.parentNode.removeChild(BattleTooltips.elem);BattleTooltips.elem=null;BattleTooltips.parentElem=null;BattleTooltips.isLocked=false;$('#tooltipwrapper').removeClass('tooltip-locked');};BattleTooltips.cancelLongTap=function cancelLongTap(){if(BattleTooltips.longTapTimeout){clearTimeout(BattleTooltips.longTapTimeout);BattleTooltips.longTapTimeout=0;}};var _proto2=BattleTooltips.prototype;_proto2.lockTooltip=function lockTooltip(){if(BattleTooltips.elem&&!BattleTooltips.isLocked){BattleTooltips.isLocked=true;if(BattleTooltips.isPressed){$(BattleTooltips.parentElem).removeClass('pressed');BattleTooltips.isPressed=false;}$('#tooltipwrapper').addClass('tooltip-locked');}};_proto2.handleTouchEnd=function handleTouchEnd(e){BattleTooltips.cancelLongTap();if(!BattleTooltips.isLocked)BattleTooltips.hideTooltip();};_proto2.listen=function listen(elem){var _this2=this;var $elem=$(elem);$elem.on('mouseover','.has-tooltip',this.showTooltipEvent);$elem.on('click','.has-tooltip',this.clickTooltipEvent);$elem.on('focus','.has-tooltip',this.showTooltipEvent);$elem.on('mouseout','.has-tooltip',BattleTooltips.unshowTooltip);$elem.on('mousedown','.has-tooltip',this.holdLockTooltipEvent);$elem.on('blur','.has-tooltip',BattleTooltips.unshowTooltip);$elem.on('mouseup','.has-tooltip',BattleTooltips.unshowTooltip);$elem.on('touchstart','.has-tooltip',function(e){e.preventDefault();_this2.holdLockTooltipEvent(e);if(e.currentTarget===BattleTooltips.parentElem&&BattleTooltips.parentElem.tagName==='BUTTON'){$(BattleTooltips.parentElem).addClass('pressed');BattleTooltips.isPressed=true;}});$elem.on('touchend','.has-tooltip',function(e){e.preventDefault();if(e.currentTarget===BattleTooltips.parentElem&&BattleTooltips.isPressed){BattleTooltips.parentElem.click();}BattleTooltips.unshowTooltip();});$elem.on('touchleave','.has-tooltip',BattleTooltips.unshowTooltip);$elem.on('touchcancel','.has-tooltip',BattleTooltips.unshowTooltip);};BattleTooltips.




unshowTooltip=function unshowTooltip(){
if(BattleTooltips.isLocked)return;
if(BattleTooltips.isPressed){
$(BattleTooltips.parentElem).removeClass('pressed');
BattleTooltips.isPressed=false;
}
BattleTooltips.hideTooltip();
};_proto2.

showTooltip=function showTooltip(elem){
var args=(elem.dataset.tooltip||'').split('|');var
type=args[0];





var ownHeight=!!elem.dataset.ownheight;

var buf;
switch(type){
case'move':
case'zmove':{
var move=this.battle.dex.getMove(args[1]);
var index=parseInt(args[2],10);
var pokemon=this.battle.mySide.active[index];
var serverPokemon=this.battle.myPokemon[index];
if(!pokemon)return false;
buf=this.showMoveTooltip(move,type==='zmove',pokemon,serverPokemon);
break;
}

case'pokemon':{


var sideIndex=parseInt(args[1],10);
var side=this.battle.sides[sideIndex];
var _pokemon=side.pokemon[parseInt(args[2],10)];
if(args[3]==='illusion'){
buf='';
var species=_pokemon.getBaseTemplate().baseSpecies;
var _index=1;for(var _i3=0,_side$pokemon=
side.pokemon;_i3<_side$pokemon.length;_i3++){var otherPokemon=_side$pokemon[_i3];
if(otherPokemon.getBaseTemplate().baseSpecies===species){
buf+=this.showPokemonTooltip(otherPokemon,null,false,_index);
_index++;
}
}
}else{
buf=this.showPokemonTooltip(_pokemon);
}
break;
}
case'activepokemon':{


var _sideIndex=parseInt(args[1],10);
var _side=this.battle.sides[_sideIndex];
var activeIndex=parseInt(args[2],10);
var _pokemon2=_side.active[activeIndex];
var _serverPokemon=null;
if(_sideIndex===0&&this.battle.myPokemon){
_serverPokemon=this.battle.myPokemon[activeIndex];
}
if(!_pokemon2)return false;
buf=this.showPokemonTooltip(_pokemon2,_serverPokemon,true);
break;
}
case'switchpokemon':{


var _side2=this.battle.sides[0];
var _activeIndex=parseInt(args[1],10);
var _pokemon3=null;
if(_activeIndex<_side2.active.length){
_pokemon3=_side2.active[_activeIndex];
}
var _serverPokemon2=this.battle.myPokemon[_activeIndex];
buf=this.showPokemonTooltip(_pokemon3,_serverPokemon2);
break;
}
default:
throw new Error("unrecognized type");}


var offset={
left:150,
top:500};

if(elem)offset=$(elem).offset();
var x=offset.left-2;
if(elem){
offset=(ownHeight?$(elem):$(elem).parent()).offset();
}
var y=offset.top-5;

if(y<140)y=140;

if(x>$(window).width()-305)x=Math.max($(window).width()-305,0);
if(x<0)x=0;

var $wrapper=$('#tooltipwrapper');
if(!$wrapper.length){
$wrapper=$("<div id=\"tooltipwrapper\" role=\"tooltip\"></div>");
$(document.body).append($wrapper);
$wrapper.on('click',function(e){
try{
var selection=window.getSelection();
if(selection.type==='Range')return;
}catch(err){}
BattleTooltips.hideTooltip();
});
}else{
$wrapper.removeClass('tooltip-locked');
}
$wrapper.css({
left:x,
top:y});

buf="<div class=\"tooltipinner\"><div class=\"tooltip\">"+buf+"</div></div>";
$wrapper.html(buf).appendTo(document.body);
BattleTooltips.elem=$wrapper.find('.tooltip')[0];
BattleTooltips.isLocked=false;
if(elem){
var height=$(BattleTooltips.elem).height();
if(height>y){
y+=height+10;
if(ownHeight)y+=$(elem).height();else
y+=$(elem).parent().height();
y=Math.min(y,document.documentElement.clientHeight);
$wrapper.css('top',y);
}
}
BattleTooltips.parentElem=elem;
return true;
};_proto2.

hideTooltip=function hideTooltip(){
BattleTooltips.hideTooltip();
};_proto2.










getStatusZMoveEffect=function getStatusZMoveEffect(move){
if(move.zMoveEffect in BattleTooltips.zMoveEffects){
return BattleTooltips.zMoveEffects[move.zMoveEffect];
}
var boostText='';
if(move.zMoveBoost){
var boosts=Object.keys(move.zMoveBoost);
boostText=boosts.map(function(stat){return(
BattleStats[stat]+' +'+move.zMoveBoost[stat]);}).
join(', ');
}
return boostText;
};_proto2.













































showMoveTooltip=function showMoveTooltip(move,isZ,pokemon,serverPokemon){
var text='';

var zEffect='';
var foeActive=pokemon.side.foe.active;

if(pokemon.ability==='(suppressed)')serverPokemon.ability='(suppressed)';
var ability=toID(serverPokemon.ability||pokemon.ability||serverPokemon.baseAbility);

var value=new ModifiableValue(this.battle,pokemon,serverPokemon);

if(isZ){
var item=this.battle.dex.getItem(serverPokemon.item);
if(item.zMoveFrom===move.name){
move=this.battle.dex.getMove(item.zMove);
}else if(move.category==='Status'){
move=new Move(move.id,"",Object.assign({},
move,{
name:'Z-'+move.name}));

zEffect=this.getStatusZMoveEffect(move);
}else{
var _moveid;
if(item.zMoveType){
_moveid=BattleTooltips.zMoveTable[item.zMoveType];
}else{
_moveid=BattleTooltips.maxMoveTable[move.type];
}
var zMove=this.battle.dex.getMove(_moveid);
var movePower=zMove.isZ?move.zMovePower:move.gmaxPower;

if(!movePower&&move.id.startsWith('hiddenpower')){
movePower=this.battle.dex.getMove('hiddenpower').zMovePower;
}
move=new Move(zMove.id,zMove.name,Object.assign({},
zMove,{
category:move.category,
basePower:movePower}));


}
}

text+='<h2>'+move.name+'<br />';var _this$getMoveType=


this.getMoveType(move,value),moveType=_this$getMoveType[0],category=_this$getMoveType[1];

text+=Dex.getTypeIcon(moveType);
text+=" <img src=\""+Dex.resourcePrefix+"sprites/categories/"+category+".png\" alt=\""+category+"\" /></h2>";


var showingMultipleBasePowers=false;
if(category!=='Status'&&foeActive.length>1){



var prevBasePower=null;
var basePower='';
var difference=false;
var basePowers=[];for(var _i4=0;_i4<
foeActive.length;_i4++){var active=foeActive[_i4];
if(!active)continue;
value=this.getMoveBasePower(move,moveType,value,active);
basePower=''+value;
if(prevBasePower===null)prevBasePower=basePower;
if(prevBasePower!==basePower)difference=true;
basePowers.push('Base power vs '+active.name+': '+basePower);
}
if(difference){
text+='<p>'+basePowers.join('<br />')+'</p>';
showingMultipleBasePowers=true;
}

}
if(!showingMultipleBasePowers&&category!=='Status'){
var activeTarget=foeActive[0]||foeActive[1]||foeActive[2];
value=this.getMoveBasePower(move,moveType,value,activeTarget);
text+='<p>Base power: '+value+'</p>';
}

var accuracy=this.getMoveAccuracy(move,value);


if(move.id==='naturepower'){
var calls;
if(this.battle.gen>5){
if(this.battle.hasPseudoWeather('Electric Terrain')){
calls='Thunderbolt';
}else if(this.battle.hasPseudoWeather('Grassy Terrain')){
calls='Energy Ball';
}else if(this.battle.hasPseudoWeather('Misty Terrain')){
calls='Moonblast';
}else if(this.battle.hasPseudoWeather('Psychic Terrain')){
calls='Psychic';
}else{
calls='Tri Attack';
}
}else if(this.battle.gen>3){

calls='Earthquake';
}else{

calls='Swift';
}
var calledMove=this.battle.dex.getMove(calls);
text+='Calls '+Dex.getTypeIcon(this.getMoveType(calledMove,value)[0])+' '+calledMove.name;
}

text+='<p>Accuracy: '+accuracy+'</p>';
if(zEffect)text+='<p>Z-Effect: '+zEffect+'</p>';

if(this.battle.gen<7||this.battle.hardcoreMode){
text+='<p class="section">'+move.shortDesc+'</p>';
}else{
text+='<p class="section">';
if(move.priority>1){
text+='Nearly always moves first <em>(priority +'+move.priority+')</em>.</p><p>';
}else if(move.priority<=-1){
text+='Nearly always moves last <em>(priority &minus;'+-move.priority+')</em>.</p><p>';
}else if(move.priority===1){
text+='Usually moves first <em>(priority +'+move.priority+')</em>.</p><p>';
}

text+=''+(move.desc||move.shortDesc)+'</p>';

if(this.battle.gameType==='doubles'){
if(move.target==='allAdjacent'){
text+='<p>&#x25ce; Hits both foes and ally.</p>';
}else if(move.target==='allAdjacentFoes'){
text+='<p>&#x25ce; Hits both foes.</p>';
}
}else if(this.battle.gameType==='triples'){
if(move.target==='allAdjacent'){
text+='<p>&#x25ce; Hits adjacent foes and allies.</p>';
}else if(move.target==='allAdjacentFoes'){
text+='<p>&#x25ce; Hits adjacent foes.</p>';
}else if(move.target==='any'){
text+='<p>&#x25ce; Can target distant Pok&eacute;mon in Triples.</p>';
}
}

if(move.flags.defrost){
text+="<p class=\"movetag\">The user thaws out if it is frozen.</p>";
}
if(!move.flags.protect&&!['self','allySide'].includes(move.target)){
text+="<p class=\"movetag\">Not blocked by Protect <small>(and Detect, King's Shield, Spiky Shield)</small></p>";
}
if(move.flags.authentic){
text+="<p class=\"movetag\">Bypasses Substitute <small>(but does not break it)</small></p>";
}
if(!move.flags.reflectable&&!['self','allySide'].includes(move.target)&&move.category==='Status'){
text+="<p class=\"movetag\">&#x2713; Not bounceable <small>(can't be bounced by Magic Coat/Bounce)</small></p>";
}

if(move.flags.contact){
text+="<p class=\"movetag\">&#x2713; Contact <small>(triggers Iron Barbs, Spiky Shield, etc)</small></p>";
}
if(move.flags.sound){
text+="<p class=\"movetag\">&#x2713; Sound <small>(doesn't affect Soundproof pokemon)</small></p>";
}
if(move.flags.powder){
text+="<p class=\"movetag\">&#x2713; Powder <small>(doesn't affect Grass, Overcoat, Safety Goggles)</small></p>";
}
if(move.flags.punch&&ability==='ironfist'){
text+="<p class=\"movetag\">&#x2713; Fist <small>(boosted by Iron Fist)</small></p>";
}
if(move.flags.pulse&&ability==='megalauncher'){
text+="<p class=\"movetag\">&#x2713; Pulse <small>(boosted by Mega Launcher)</small></p>";
}
if(move.flags.bite&&ability==='strongjaw'){
text+="<p class=\"movetag\">&#x2713; Bite <small>(boosted by Strong Jaw)</small></p>";
}
if((move.recoil||move.hasCustomRecoil)&&ability==='reckless'){
text+="<p class=\"movetag\">&#x2713; Recoil <small>(boosted by Reckless)</small></p>";
}
if(move.flags.bullet){
text+="<p class=\"movetag\">&#x2713; Bullet-like <small>(doesn't affect Bulletproof pokemon)</small></p>";
}
}
return text;
};_proto2.















showPokemonTooltip=function showPokemonTooltip(
clientPokemon,serverPokemon,isActive,illusionIndex)
{var _this3=this;
var pokemon=clientPokemon||serverPokemon;
var text='';
var genderBuf='';
if(pokemon.gender){
genderBuf=" <img src=\""+Dex.resourcePrefix+"fx/gender-"+pokemon.gender.toLowerCase()+".png\" alt=\""+pokemon.gender+"\" />";
}

var name=BattleLog.escapeHTML(pokemon.name);
if(pokemon.species!==pokemon.name){
name+=' <small>('+BattleLog.escapeHTML(pokemon.species)+')</small>';
}

var levelBuf=pokemon.level!==100?" <small>L"+pokemon.level+"</small>":"";
if(!illusionIndex||illusionIndex===1){
text+="<h2>"+name+genderBuf+(illusionIndex?'':levelBuf)+"<br />";

if(clientPokemon==null?void 0:clientPokemon.volatiles.formechange){
if(clientPokemon.volatiles.transform){
text+="<small>(Transformed into "+clientPokemon.volatiles.formechange[1]+")</small><br />";
}else{
text+="<small>(Changed forme: "+clientPokemon.volatiles.formechange[1]+")</small><br />";
}
}

var types=this.getPokemonTypes(pokemon);

if(clientPokemon&&(clientPokemon.volatiles.typechange||clientPokemon.volatiles.typeadd)){
text+="<small>(Type changed)</small><br />";
}
text+=types.map(function(type){return Dex.getTypeIcon(type);}).join(' ');
text+="</h2>";
}

if(illusionIndex){
text+="<p class=\"section\"><strong>Possible Illusion #"+illusionIndex+"</strong>"+levelBuf+"</p>";
}

if(pokemon.fainted){
text+='<p><small>HP:</small> (fainted)</p>';
}else if(this.battle.hardcoreMode){
if(serverPokemon){
text+='<p><small>HP:</small> '+serverPokemon.hp+'/'+serverPokemon.maxhp+(pokemon.status?' <span class="status '+pokemon.status+'">'+pokemon.status.toUpperCase()+'</span>':'')+'</p>';
}
}else{
var exacthp='';
if(serverPokemon){
exacthp=' ('+serverPokemon.hp+'/'+serverPokemon.maxhp+')';
}else if(pokemon.maxhp===48){
exacthp=' <small>('+pokemon.hp+'/'+pokemon.maxhp+' pixels)</small>';
}
text+='<p><small>HP:</small> '+Pokemon.getHPText(pokemon)+exacthp+(pokemon.status?' <span class="status '+pokemon.status+'">'+pokemon.status.toUpperCase()+'</span>':'');
if(clientPokemon){
if(pokemon.status==='tox'){
if(pokemon.ability==='Poison Heal'||pokemon.ability==='Magic Guard'){
text+=' <small>Would take if ability removed: '+Math.floor(100/16*Math.min(clientPokemon.statusData.toxicTurns+1,15))+'%</small>';
}else{
text+=' Next damage: '+Math.floor(100/16*Math.min(clientPokemon.statusData.toxicTurns+1,15))+'%';
}
}else if(pokemon.status==='slp'){
text+=' Turns asleep: '+clientPokemon.statusData.sleepTurns;
}
}
text+='</p>';
}

var supportsAbilities=this.battle.gen>2&&!this.battle.tier.includes("Let's Go");

var abilityText='';
if(supportsAbilities){
abilityText=this.getPokemonAbilityText(
clientPokemon,serverPokemon,isActive,!!illusionIndex&&illusionIndex>1);

}

var itemText='';
if(serverPokemon==null?void 0:serverPokemon.item){
itemText='<small>Item:</small> '+Dex.getItem(serverPokemon.item).name;
}else if(clientPokemon){
var item='';
var itemEffect=clientPokemon.itemEffect||'';
if(clientPokemon.prevItem){
item='None';
if(itemEffect)itemEffect+='; ';
var prevItem=Dex.getItem(clientPokemon.prevItem).name;
itemEffect+=clientPokemon.prevItemEffect?prevItem+' was '+clientPokemon.prevItemEffect:'was '+prevItem;
}
if(pokemon.item)item=Dex.getItem(pokemon.item).name;
if(itemEffect)itemEffect=' ('+itemEffect+')';
if(item)itemText='<small>Item:</small> '+item+itemEffect;
}

text+='<p>';
text+=abilityText;
if(itemText){

text+=!isActive&&serverPokemon?' / ':'</p><p>';
text+=itemText;
}
text+='</p>';

text+=this.renderStats(clientPokemon,serverPokemon,!isActive);

if(serverPokemon&&!isActive){

text+='<p class="section">';
var battlePokemon=this.battle.getPokemon(pokemon.ident,pokemon.details);for(var _i5=0,_serverPokemon$moves=
serverPokemon.moves;_i5<_serverPokemon$moves.length;_i5++){var _moveid2=_serverPokemon$moves[_i5];
var move=Dex.getMove(_moveid2);
var moveName='&#8226; '+move.name;
if(battlePokemon==null?void 0:battlePokemon.moveTrack){for(var _i6=0,_battlePokemon$moveTr=
battlePokemon.moveTrack;_i6<_battlePokemon$moveTr.length;_i6++){var row=_battlePokemon$moveTr[_i6];
if(moveName===row[0]){
moveName=this.getPPUseText(row,true);
break;
}
}
}
text+=moveName+'<br />';
}
text+='</p>';
}else if(!this.battle.hardcoreMode&&(clientPokemon==null?void 0:clientPokemon.moveTrack.length)){

text+='<p class="section">';for(var _i7=0,_clientPokemon$moveTr=
clientPokemon.moveTrack;_i7<_clientPokemon$moveTr.length;_i7++){var _row=_clientPokemon$moveTr[_i7];
text+=this.getPPUseText(_row)+'<br />';
}
if(clientPokemon.moveTrack.filter(function(_ref){var moveName=_ref[0];return(
moveName.charAt(0)!=='*'&&!_this3.battle.dex.getMove(moveName).isZ);}).
length>4){
text+='(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)';
}
if(this.battle.gen===3){
text+='(Pressure is not visible in Gen 3, so in certain situations, more PP may have been lost than shown here.)';
}
text+='</p>';
}
return text;
};_proto2.

calculateModifiedStats=function calculateModifiedStats(clientPokemon,serverPokemon){
var stats=Object.assign({},serverPokemon.stats);
var pokemon=clientPokemon||serverPokemon;
var isPowerTrick=clientPokemon==null?void 0:clientPokemon.volatiles['powertrick'];for(var _i8=0,_Dex$statNamesExceptH=
Dex.statNamesExceptHP;_i8<_Dex$statNamesExceptH.length;_i8++){var statName=_Dex$statNamesExceptH[_i8];
var sourceStatName=statName;
if(isPowerTrick){
if(statName==='atk')sourceStatName='def';
if(statName==='def')sourceStatName='atk';
}
stats[statName]=serverPokemon.stats[sourceStatName];
if(!clientPokemon)continue;

var clientStatName=clientPokemon.boosts.spc&&(statName==='spa'||statName==='spd')?'spc':statName;
var boostLevel=clientPokemon.boosts[clientStatName];
if(boostLevel){
var boostTable=[1,1.5,2,2.5,3,3.5,4];
if(boostLevel>0){
stats[statName]*=boostTable[boostLevel];
}else{
if(this.battle.gen<=2)boostTable=[1,100/66,2,2.5,100/33,100/28,4];
stats[statName]/=boostTable[-boostLevel];
}
stats[statName]=Math.floor(stats[statName]);
}
}

var ability=toID(serverPokemon.ability||pokemon.ability||serverPokemon.baseAbility);
if(clientPokemon&&'gastroacid'in clientPokemon.volatiles)ability='';


if(pokemon.status){
if(this.battle.gen>2&&ability==='guts'){
stats.atk=Math.floor(stats.atk*1.5);
}else if(pokemon.status==='brn'){
stats.atk=Math.floor(stats.atk*0.5);
}

if(this.battle.gen>2&&ability==='quickfeet'){
stats.spe=Math.floor(stats.spe*1.5);
}else if(pokemon.status==='par'){
if(this.battle.gen>6){
stats.spe=Math.floor(stats.spe*0.5);
}else{
stats.spe=Math.floor(stats.spe*0.25);
}
}
}


if(this.battle.gen<=1){for(var _i9=0,_Dex$statNamesExceptH2=
Dex.statNamesExceptHP;_i9<_Dex$statNamesExceptH2.length;_i9++){var _statName=_Dex$statNamesExceptH2[_i9];
if(stats[_statName]>999)stats[_statName]=999;
}
return stats;
}

var item=toID(serverPokemon.item);
if(ability==='klutz'&&item!=='machobrace')item='';
var species=Dex.getTemplate(clientPokemon?clientPokemon.getSpecies():serverPokemon.species).baseSpecies;



if(item==='lightball'&&species==='Pikachu'){
if(this.battle.gen>=4)stats.atk*=2;
stats.spa*=2;
}

if(item==='thickclub'){
if(species==='Marowak'||species==='Cubone'){
stats.atk*=2;
}
}

if(species==='Ditto'&&!(clientPokemon&&'transform'in clientPokemon.volatiles)){
if(item==='quickpowder'){
stats.spe*=2;
}
if(item==='metalpowder'){
if(this.battle.gen===2){
stats.def=Math.floor(stats.def*1.5);
stats.spd=Math.floor(stats.spd*1.5);
}else{
stats.def*=2;
}
}
}



if(this.battle.gen<=2){
return stats;
}

var weather=this.battle.weather;
if(weather){

outer:for(var _i10=0,_this$battle$sides2=this.battle.sides;_i10<_this$battle$sides2.length;_i10++){var side=_this$battle$sides2[_i10];for(var _i11=0,_side$active2=
side.active;_i11<_side$active2.length;_i11++){var active=_side$active2[_i11];
if(active&&['Air Lock','Cloud Nine'].includes(active.ability)){
weather='';
break outer;
}
}
}
}

if(item==='choiceband'&&!(clientPokemon==null?void 0:clientPokemon.volatiles['dynamax'])){
stats.atk=Math.floor(stats.atk*1.5);
}
if(ability==='purepower'||ability==='hugepower'){
stats.atk*=2;
}
if(ability==='hustle'||ability==='gorillatactics'&&!(clientPokemon==null?void 0:clientPokemon.volatiles['dynamax'])){
stats.atk=Math.floor(stats.atk*1.5);
}
if(weather){
if(this.battle.gen>=4&&this.pokemonHasType(serverPokemon,'Rock')&&weather==='sandstorm'){
stats.spd=Math.floor(stats.spd*1.5);
}
if(ability==='sandrush'&&weather==='sandstorm'){
stats.spe*=2;
}
if(ability==='slushrush'&&weather==='hail'){
stats.spe*=2;
}
if(item!=='utilityumbrella'){
if(weather==='sunnyday'||weather==='desolateland'){
if(ability==='solarpower'){
stats.spa=Math.floor(stats.spa*1.5);
}
var allyActive=clientPokemon==null?void 0:clientPokemon.side.active;
if(allyActive){for(var _i12=0;_i12<
allyActive.length;_i12++){var ally=allyActive[_i12];
if(!ally||ally.fainted)continue;
var allyAbility=this.getAllyAbility(ally);
if(allyAbility==='Flower Gift'&&(ally.getTemplate().baseSpecies==='Cherrim'||this.battle.gen<=4)){
stats.atk=Math.floor(stats.atk*1.5);
stats.spd=Math.floor(stats.spd*1.5);
}
}
}
}
if(ability==='chlorophyll'&&(weather==='sunnyday'||weather==='desolateland')){
stats.spe*=2;
}
if(ability==='swiftswim'&&(weather==='raindance'||weather==='primordialsea')){
stats.spe*=2;
}
}
}
if(ability==='defeatist'&&serverPokemon.hp<=serverPokemon.maxhp/2){
stats.atk=Math.floor(stats.atk*0.5);
stats.spa=Math.floor(stats.spa*0.5);
}
if(clientPokemon){
if('slowstart'in clientPokemon.volatiles){
stats.atk=Math.floor(stats.atk*0.5);
stats.spe=Math.floor(stats.spe*0.5);
}
if(ability==='unburden'&&'itemremoved'in clientPokemon.volatiles&&!item){
stats.spe*=2;
}
}
if(ability==='marvelscale'&&pokemon.status){
stats.def=Math.floor(stats.def*1.5);
}
if(item==='eviolite'&&Dex.getTemplate(pokemon.species).evos){
stats.def=Math.floor(stats.def*1.5);
stats.spd=Math.floor(stats.spd*1.5);
}
if(ability==='grasspelt'&&this.battle.hasPseudoWeather('Grassy Terrain')){
stats.def=Math.floor(stats.def*1.5);
}
if(ability==='surgesurfer'&&this.battle.hasPseudoWeather('Electric Terrain')){
stats.spe*=2;
}
if(item==='choicespecs'&&!(clientPokemon==null?void 0:clientPokemon.volatiles['dynamax'])){
stats.spa=Math.floor(stats.spa*1.5);
}
if(item==='deepseatooth'&&species==='Clamperl'){
stats.spa*=2;
}
if(item==='souldew'&&this.battle.gen<=6&&(species==='Latios'||species==='Latias')){
stats.spa=Math.floor(stats.spa*1.5);
stats.spd=Math.floor(stats.spd*1.5);
}
if(clientPokemon&&(ability==='plus'||ability==='minus')){
var _allyActive=clientPokemon.side.active;
if(_allyActive.length>1){
var abilityName=ability==='plus'?'Plus':'Minus';for(var _i13=0;_i13<
_allyActive.length;_i13++){var _ally=_allyActive[_i13];
if(!_ally||_ally===clientPokemon||_ally.fainted)continue;
var _allyAbility=this.getAllyAbility(_ally);
if(_allyAbility!=='Plus'&&_allyAbility!=='Minus')continue;
if(this.battle.gen<=4&&_allyAbility===abilityName)continue;
stats.spa=Math.floor(stats.spa*1.5);
break;
}
}
}
if(item==='assaultvest'){
stats.spd=Math.floor(stats.spd*1.5);
}
if(item==='deepseascale'&&species==='Clamperl'){
stats.spd*=2;
}
if(item==='choicescarf'&&!(clientPokemon==null?void 0:clientPokemon.volatiles['dynamax'])){
stats.spe=Math.floor(stats.spe*1.5);
}
if(item==='ironball'||item==='machobrace'||/power(?!herb)/.test(item)){
stats.spe=Math.floor(stats.spe*0.5);
}
if(ability==='furcoat'){
stats.def*=2;
}

return stats;
};_proto2.

renderStats=function renderStats(clientPokemon,serverPokemon,short){
var isTransformed=clientPokemon==null?void 0:clientPokemon.volatiles.transform;
if(!serverPokemon||isTransformed){
if(!clientPokemon)throw new Error('Must pass either clientPokemon or serverPokemon');var _this$getSpeedRange=
this.getSpeedRange(clientPokemon),min=_this$getSpeedRange[0],max=_this$getSpeedRange[1];
return'<p><small>Spe</small> '+min+' to '+max+' <small>(before items/abilities/modifiers)</small></p>';
}
var stats=serverPokemon.stats;
var modifiedStats=this.calculateModifiedStats(clientPokemon,serverPokemon);

var buf='<p>';

if(!short){
var hasModifiedStat=false;for(var _i14=0,_Dex$statNamesExceptH3=
Dex.statNamesExceptHP;_i14<_Dex$statNamesExceptH3.length;_i14++){var statName=_Dex$statNamesExceptH3[_i14];
if(this.battle.gen===1&&statName==='spd')continue;
var statLabel=this.battle.gen===1&&statName==='spa'?'spc':statName;
buf+=statName==='atk'?'<small>':'<small> / ';
buf+=''+BattleText[statLabel].statShortName+'&nbsp;</small>';
buf+=''+stats[statName];
if(modifiedStats[statName]!==stats[statName])hasModifiedStat=true;
}
buf+='</p>';

if(!hasModifiedStat)return buf;

buf+='<p><small>(After stat modifiers:)</small></p>';
buf+='<p>';
}for(var _i15=0,_Dex$statNamesExceptH4=

Dex.statNamesExceptHP;_i15<_Dex$statNamesExceptH4.length;_i15++){var _statName2=_Dex$statNamesExceptH4[_i15];
if(this.battle.gen===1&&_statName2==='spd')continue;
var _statLabel=this.battle.gen===1&&_statName2==='spa'?'spc':_statName2;
buf+=_statName2==='atk'?'<small>':'<small> / ';
buf+=''+BattleText[_statLabel].statShortName+'&nbsp;</small>';
if(modifiedStats[_statName2]===stats[_statName2]){
buf+=''+modifiedStats[_statName2];
}else if(modifiedStats[_statName2]<stats[_statName2]){
buf+='<strong class="stat-lowered">'+modifiedStats[_statName2]+'</strong>';
}else{
buf+='<strong class="stat-boosted">'+modifiedStats[_statName2]+'</strong>';
}
}
buf+='</p>';
return buf;
};_proto2.

getPPUseText=function getPPUseText(moveTrackRow,showKnown){var
moveName=moveTrackRow[0],ppUsed=moveTrackRow[1];
var move;
var maxpp;
if(moveName.charAt(0)==='*'){

move=this.battle.dex.getMove(moveName.substr(1));
maxpp=5;
}else{
move=this.battle.dex.getMove(moveName);
maxpp=move.noPPBoosts?move.pp:Math.floor(move.pp*8/5);
}
var bullet=moveName.charAt(0)==='*'||move.isZ?'<span style="color:#888">&#8226;</span>':'&#8226;';
if(ppUsed===Infinity){
return bullet+" "+move.name+" <small>(0/"+maxpp+")</small>";
}
if(ppUsed||moveName.charAt(0)==='*'){
return bullet+" "+move.name+" <small>("+(maxpp-ppUsed)+"/"+maxpp+")</small>";
}
return bullet+" "+move.name+" "+(showKnown?' <small>(revealed)</small>':'');
};_proto2.

ppUsed=function ppUsed(move,pokemon){for(var _i16=0,_pokemon$moveTrack=
pokemon.moveTrack;_i16<_pokemon$moveTrack.length;_i16++){var _ref2=_pokemon$moveTrack[_i16];var moveName=_ref2[0];var ppUsed=_ref2[1];
if(moveName.charAt(0)==='*')moveName=moveName.substr(1);
if(move.name===moveName)return ppUsed;
}
return 0;
};_proto2.




getSpeedRange=function getSpeedRange(pokemon){
var level=pokemon.level;
var baseSpe=pokemon.getTemplate().baseStats['spe'];
var tier=this.battle.tier;
var gen=this.battle.gen;
var isRandomBattle=tier.includes('Random Battle')||
tier.includes('Random')&&tier.includes('Battle')&&gen>=6;

var minNature=isRandomBattle||gen<3?1:0.9;
var maxNature=isRandomBattle||gen<3?1:1.1;
var maxIv=gen<3?30:31;

var min;
var max;
var tr=Math.trunc||Math.floor;
if(tier.includes("Let's Go")){
min=tr(tr(tr(2*baseSpe*level/100+5)*minNature)*tr((70/255/10+1)*100)/100);
max=tr(tr(tr((2*baseSpe+maxIv)*level/100+5)*maxNature)*tr((70/255/10+1)*100)/100);
if(tier.includes('No Restrictions'))max+=200;else
if(tier.includes('Random'))max+=20;
}else{
var maxIvEvOffset=maxIv+(isRandomBattle&&gen>=3?21:63);
min=tr(tr(2*baseSpe*level/100+5)*minNature);
max=tr(tr((2*baseSpe+maxIvEvOffset)*level/100+5)*maxNature);
}
return[min,max];
};_proto2.




getMoveType=function getMoveType(move,value){
var moveType=move.type;
var category=move.category;

if(!value.pokemon)return[moveType,category];

var pokemonTypes=value.pokemon.getTypeList(value.serverPokemon);
value.reset();
if(move.id==='revelationdance'){
moveType=pokemonTypes[0];
}

var item=Dex.getItem(value.itemName);
if(move.id==='multiattack'&&item.onMemory){
if(value.itemModify(0))moveType=item.onMemory;
}
if(move.id==='judgment'&&item.onPlate&&!item.zMoveType){
if(value.itemModify(0))moveType=item.onPlate;
}
if(move.id==='technoblast'&&item.onDrive){
if(value.itemModify(0))moveType=item.onDrive;
}
if(move.id==='naturalgift'&&item.naturalGift){
if(value.itemModify(0))moveType=item.naturalGift.type;
}

if(move.id==='weatherball'&&value.weatherModify(0)){
switch(this.battle.weather){
case'sunnyday':
case'desolateland':
if(item.id==='utilityumbrella')break;
moveType='Fire';
break;
case'raindance':
case'primordialsea':
if(item.id==='utilityumbrella')break;
moveType='Water';
break;
case'sandstorm':
moveType='Rock';
break;
case'hail':
moveType='Ice';
break;}

}


if(move.id==='aurawheel'&&value.pokemon.getTemplate().species==='Morpeko-Hangry'){
moveType='Dark';
}


var noTypeOverride=[
'judgment','multiattack','naturalgift','revelationdance','struggle','technoblast','weatherball'];

var allowTypeOverride=!noTypeOverride.includes(move.id);

if(allowTypeOverride&&move.flags['sound']&&value.abilityModify(0,'Liquid Voice')){
moveType='Water';
}
if(allowTypeOverride&&category!=='Status'){
if(moveType==='Normal'){
if(value.abilityModify(0,'Aerilate'))moveType='Flying';
if(value.abilityModify(0,'Galvanize'))moveType='Electric';
if(value.abilityModify(0,'Pixilate'))moveType='Fairy';
if(value.abilityModify(0,'Refrigerate'))moveType='Ice';
}
if(value.abilityModify(0,'Normalize'))moveType='Normal';
}
if(this.battle.gen<=3&&category!=='Status'){
category=Dex.getGen3Category(moveType);
}
return[moveType,category];
};_proto2.


getMoveAccuracy=function getMoveAccuracy(move,value,target){
value.reset(move.accuracy===true?0:move.accuracy,true);

var pokemon=value.pokemon;
if(move.id==='toxic'&&this.battle.gen>=6&&this.pokemonHasType(pokemon,'Poison')){
value.set(0,"Poison type");
return value;
}
if(move.id==='blizzard'){
value.weatherModify(0,'Hail');
}
if(move.id==='hurricane'||move.id==='thunder'){
value.weatherModify(0,'Rain Dance');
value.weatherModify(0,'Primordial Sea');
if(value.tryWeather('Sunny Day'))value.set(50,'Sunny Day');
if(value.tryWeather('Desolate Land'))value.set(50,'Desolate Land');
}
value.abilityModify(0,'No Guard');
if(!value.value)return value;
if(move.ohko){
if(this.battle.gen===1){
value.set(value.value,"fails if target's Speed is higher");
return value;
}
if(move.id==='sheercold'&&this.battle.gen>=7){
if(!this.pokemonHasType(pokemon,'Ice'))value.set(20,'not Ice-type');
}
if(target){
if(pokemon.level<target.level){
value.reset(0);
value.set(0,"FAILS: target's level is higher");
}else if(pokemon.level>target.level){
value.set(value.value+pokemon.level-target.level,"+1% per level above target");
}
}else{
if(pokemon.level<100)value.set(value.value,"fails if target's level is higher");
if(pokemon.level>1)value.set(value.value,"+1% per level above target");
}
return value;
}
if(pokemon==null?void 0:pokemon.boosts.accuracy){
if(pokemon.boosts.accuracy>0){
value.modify((pokemon.boosts.accuracy+3)/3);
}else{
value.modify(3/(3-pokemon.boosts.accuracy));
}
}
if(move.category==='Physical'){
value.abilityModify(0.8,"Hustle");
}
value.abilityModify(1.3,"Compound Eyes");for(var _i17=0,_pokemon$side$active=
pokemon.side.active;_i17<_pokemon$side$active.length;_i17++){var active=_pokemon$side$active[_i17];
if(!active||active.fainted)continue;
var ability=this.getAllyAbility(active);
if(ability==='Victory Star'){
value.modify(1.1,"Victory Star");
}
}
value.itemModify(1.1,"Wide Lens");
if(this.battle.hasPseudoWeather('Gravity')){
value.modify(5/3,"Gravity");
}
return value;
};_proto2.




getMoveBasePower=function getMoveBasePower(move,moveType,value){var target=arguments.length>3&&arguments[3]!==undefined?arguments[3]:null;
var pokemon=value.pokemon;
var serverPokemon=value.serverPokemon;


var modifiedStats=this.calculateModifiedStats(pokemon,serverPokemon);

value.reset(move.basePower);

if(move.id==='acrobatics'){
if(!serverPokemon.item){
value.modify(2,"Acrobatics + no item");
}
}
if(['crushgrip','wringout'].includes(move.id)&&target){
value.set(
Math.floor(Math.floor((120*(100*Math.floor(target.hp*4096/target.maxhp))+2048-1)/4096)/100)||1,
'approximate');

}
if(move.id==='brine'&&target&&target.hp*2<=target.maxhp){
value.modify(2,'Brine + target below half HP');
}
if(move.id==='eruption'||move.id==='waterspout'){
value.set(Math.floor(150*pokemon.hp/pokemon.maxhp)||1);
}
if(move.id==='facade'&&!['','slp','frz'].includes(pokemon.status)){
value.modify(2,'Facade + status');
}
if(move.id==='flail'||move.id==='reversal'){
var multiplier;
var ratios;
if(this.battle.gen>4){
multiplier=48;
ratios=[2,5,10,17,33];
}else{
multiplier=64;
ratios=[2,6,13,22,43];
}
var ratio=pokemon.hp*multiplier/pokemon.maxhp;
var basePower;
if(ratio<ratios[0])basePower=200;else
if(ratio<ratios[1])basePower=150;else
if(ratio<ratios[2])basePower=100;else
if(ratio<ratios[3])basePower=80;else
if(ratio<ratios[4])basePower=40;else
basePower=20;
value.set(basePower);
}
if(move.id==='hex'&&(target==null?void 0:target.status)){
value.modify(2,'Hex + status');
}
if(move.id==='punishment'&&target){
var boostCount=0;for(var _i18=0,_Object$values=
Object.values(target.boosts);_i18<_Object$values.length;_i18++){var boost=_Object$values[_i18];
if(boost>0)boostCount+=boost;
}
value.set(Math.min(60+20*boostCount,200));
}
if(move.id==='smellingsalts'&&target){
if(target.status==='par'){
value.modify(2,'Smelling Salts + Paralysis');
}
}
if(['storedpower','powertrip'].includes(move.id)&&target){
var _boostCount=0;for(var _i19=0,_Object$values2=
Object.values(pokemon.boosts);_i19<_Object$values2.length;_i19++){var _boost=_Object$values2[_i19];
if(_boost>0)_boostCount+=_boost;
}
value.set(20+20*_boostCount);
}
if(move.id==='trumpcard'){
var ppLeft=5-this.ppUsed(move,pokemon);
var _basePower=40;
if(ppLeft===1)_basePower=200;else
if(ppLeft===2)_basePower=80;else
if(ppLeft===3)_basePower=60;else
if(ppLeft===4)_basePower=50;
value.set(_basePower);
}
if(move.id==='venoshock'&&target){
if(['psn','tox'].includes(target.status)){
value.modify(2,'Venoshock + Poison');
}
}
if(move.id==='wakeupslap'&&target){
if(target.status==='slp'){
value.modify(2,'Wake-Up Slap + Sleep');
}
}
if(move.id==='weatherball'){
value.weatherModify(2);
}
if(move.id==='watershuriken'&&pokemon.getSpecies()==='Greninja-Ash'&&pokemon.ability==='Battle Bond'){
value.set(20,'Battle Bond');
}

if(move.id==='electroball'&&target){var _this$getSpeedRange2=
this.getSpeedRange(target),minSpe=_this$getSpeedRange2[0],maxSpe=_this$getSpeedRange2[1];
var minRatio=modifiedStats.spe/maxSpe;
var maxRatio=modifiedStats.spe/minSpe;
var min;
var max;

if(minRatio>=4)min=150;else
if(minRatio>=3)min=120;else
if(minRatio>=2)min=80;else
if(minRatio>=1)min=60;else
min=40;

if(maxRatio>=4)max=150;else
if(maxRatio>=3)max=120;else
if(maxRatio>=2)max=80;else
if(maxRatio>=1)max=60;else
max=40;

value.setRange(min,max);
}
if(move.id==='gyroball'&&target){var _this$getSpeedRange3=
this.getSpeedRange(target),_minSpe=_this$getSpeedRange3[0],_maxSpe=_this$getSpeedRange3[1];
var _min=Math.floor(25*_minSpe/modifiedStats.spe)||1;
if(_min>150)_min=150;
var _max=Math.floor(25*_maxSpe/modifiedStats.spe)||1;
if(_max>150)_max=150;
value.setRange(_min,_max);
}

if(serverPokemon.item){
var item=Dex.getItem(serverPokemon.item);
if(move.id==='fling'&&item.fling){
value.itemModify(item.fling.basePower);
}
if(move.id==='naturalgift'){
value.itemModify(item.naturalGift.basePower);
}
}

if(['lowkick','grassknot','heavyslam','heatcrash'].includes(move.id)){
var isGKLK=['lowkick','grassknot'].includes(move.id);
if(target){
var targetWeight=target.getWeightKg();
var pokemonWeight=pokemon.getWeightKg(serverPokemon);
var _basePower2;
if(isGKLK){
_basePower2=20;
if(targetWeight>=200)_basePower2=120;else
if(targetWeight>=100)_basePower2=100;else
if(targetWeight>=50)_basePower2=80;else
if(targetWeight>=25)_basePower2=60;else
if(targetWeight>=10)_basePower2=40;
}else{
_basePower2=40;
if(pokemonWeight>targetWeight*5)_basePower2=120;else
if(pokemonWeight>targetWeight*4)_basePower2=100;else
if(pokemonWeight>targetWeight*3)_basePower2=80;else
if(pokemonWeight>targetWeight*2)_basePower2=60;
}
if(target.volatiles['dynamax']){
value.set(0,'blocked by target\'s Dynamax');
}else{
value.set(_basePower2);
}
}else{
value.setRange(isGKLK?20:40,120);
}
}
if(!value.value)return value;


if(pokemon.status==='brn'&&move.category==='Special'){
value.abilityModify(1.5,"Flare Boost");
}
if(move.flags['pulse']){
value.abilityModify(1.5,"Mega Launcher");
}
if(move.flags['bite']){
value.abilityModify(1.5,"Strong Jaw");
}
if(value.value<=60){
value.abilityModify(1.5,"Technician");
}
if(['psn','tox'].includes(pokemon.status)&&move.category==='Physical'){
value.abilityModify(1.5,"Toxic Boost");
}
if(['Rock','Ground','Steel'].includes(moveType)&&this.battle.weather==='sandstorm'){
if(value.tryAbility("Sand Force"))value.weatherModify(1.3,"Sandstorm","Sand Force");
}
if(move.secondaries){
value.abilityModify(1.3,"Sheer Force");
}
if(move.flags['contact']){
value.abilityModify(1.3,"Tough Claws");
}
if(moveType==='Steel'){
value.abilityModify(1.5,"Steely Spirit");
}
if(move.flags['sound']){
value.abilityModify(1.3,"Punk Rock");
}
if(target){
if(["MF","FM"].includes(pokemon.gender+target.gender)){
value.abilityModify(0.75,"Rivalry");
}else if(["MM","FF"].includes(pokemon.gender+target.gender)){
value.abilityModify(1.25,"Rivalry");
}
}
var noTypeOverride=[
'judgment','multiattack','naturalgift','revelationdance','struggle','technoblast','weatherball'];

if(move.category!=='Status'&&!noTypeOverride.includes(move.id)){
if(move.type==='Normal'){
value.abilityModify(this.battle.gen>6?1.2:1.3,"Aerilate");
value.abilityModify(this.battle.gen>6?1.2:1.3,"Galvanize");
value.abilityModify(this.battle.gen>6?1.2:1.3,"Pixilate");
value.abilityModify(this.battle.gen>6?1.2:1.3,"Refrigerate");
}
if(this.battle.gen>6){
value.abilityModify(1.2,"Normalize");
}
}
if(move.flags['punch']){
value.abilityModify(1.2,'Iron Fist');
}
if(move.recoil||move.hasCustomRecoil){
value.abilityModify(1.2,'Reckless');
}

if(move.category!=='Status'){
var auraBoosted='';
var auraBroken=false;for(var _i20=0,_pokemon$side$active2=
pokemon.side.active;_i20<_pokemon$side$active2.length;_i20++){var ally=_pokemon$side$active2[_i20];
if(!ally||ally.fainted)continue;
var allyAbility=this.getAllyAbility(ally);
if(moveType==='Fairy'&&allyAbility==='Fairy Aura'){
auraBoosted='Fairy Aura';
}else if(moveType==='Dark'&&allyAbility==='Dark Aura'){
auraBoosted='Dark Aura';
}else if(allyAbility==='Aura Break'){
auraBroken=true;
}else if(allyAbility==='Battery'){
if(ally!==pokemon&&move.category==='Special'){
value.modify(1.3,'Battery');
}
}else if(allyAbility==='Power Spot'){
if(ally!==pokemon){
value.modify(1.3,'Power Spot');
}
}
}for(var _i21=0,_pokemon$side$foe$act=
pokemon.side.foe.active;_i21<_pokemon$side$foe$act.length;_i21++){var foe=_pokemon$side$foe$act[_i21];
if(!foe||foe.fainted)continue;
if(foe.ability==='Fairy Aura'){
if(moveType==='Fairy')auraBoosted='Fairy Aura';
}else if(foe.ability==='Dark Aura'){
if(moveType==='Dark')auraBoosted='Dark Aura';
}else if(foe.ability==='Aura Break'){
auraBroken=true;
}
}
if(auraBoosted){
if(auraBroken){
value.modify(0.75,auraBoosted+' + Aura Break');
}else{
value.modify(1.33,auraBoosted);
}
}
}


if(this.battle.hasPseudoWeather('Electric Terrain')&&moveType==='Electric'||
this.battle.hasPseudoWeather('Grassy Terrain')&&moveType==='Grass'||
this.battle.hasPseudoWeather('Psychic Terrain')&&moveType==='Psychic'){
if(pokemon.isGrounded(serverPokemon)){
value.modify(this.battle.gen>7?1.3:1.5,'Terrain boost');
}
}else if(this.battle.hasPseudoWeather('Misty Terrain')&&moveType==='Dragon'){
if(target?target.isGrounded():true){
value.modify(0.5,'Misty Terrain + grounded target');
}
}


value=this.getItemBoost(move,value,moveType);

return value;
};_proto2.















































getItemBoost=function getItemBoost(move,value,moveType){
var item=this.battle.dex.getItem(value.serverPokemon.item);
var itemName=item.name;
var moveName=move.name;


if(item.onPlate===moveType&&!item.zMove){
value.itemModify(1.2);
return value;
}


if(BattleTooltips.incenseTypes[item.name]===moveType){
value.itemModify(1.2);
return value;
}


if(BattleTooltips.itemTypes[item.name]===moveType){
value.itemModify(this.battle.gen<4?1.1:1.2);
return value;
}


if(item.name==='Soul Dew'&&this.battle.gen<7)return value;
if(BattleTooltips.orbUsers[Dex.getTemplate(value.serverPokemon.species).baseSpecies]===item.name&&
[BattleTooltips.orbTypes[item.name],'Dragon'].includes(moveType)){
value.itemModify(1.2);
return value;
}


if(BattleTooltips.noGemMoves.includes(moveName))return value;
if(itemName===moveType+' Gem'){
value.itemModify(this.battle.gen<6?1.5:1.3);
return value;
}

return value;
};_proto2.
getPokemonTypes=function getPokemonTypes(pokemon){
if(!pokemon.getTypes){
return this.battle.dex.getTemplate(pokemon.species).types;
}

return pokemon.getTypeList();
};_proto2.
pokemonHasType=function pokemonHasType(pokemon,type,types){
if(!types)types=this.getPokemonTypes(pokemon);for(var _i22=0,_types=
types;_i22<_types.length;_i22++){var curType=_types[_i22];
if(curType===type)return true;
}
return false;
};_proto2.
getAllyAbility=function getAllyAbility(ally){

var allyAbility=Dex.getAbility(ally.ability).name;

if(!allyAbility&&this.battle.myPokemon){
allyAbility=Dex.getAbility(this.battle.myPokemon[ally.slot].ability).name;
}
return allyAbility;
};_proto2.
getPokemonAbilityData=function getPokemonAbilityData(clientPokemon,serverPokemon){
var abilityData={
ability:'',baseAbility:'',possibilities:[]};

if(clientPokemon){
if(clientPokemon.ability){
abilityData.ability=clientPokemon.ability||clientPokemon.baseAbility;
if(clientPokemon.baseAbility){
abilityData.baseAbility=clientPokemon.baseAbility;
}
}else{
var species=clientPokemon.getSpecies()||(serverPokemon==null?void 0:serverPokemon.species)||'';
var template=this.battle.dex.getTemplate(species);
if(template.exists&&template.abilities){
abilityData.possibilities=[template.abilities['0']];
if(template.abilities['1'])abilityData.possibilities.push(template.abilities['1']);
if(template.abilities['H'])abilityData.possibilities.push(template.abilities['H']);
if(template.abilities['S'])abilityData.possibilities.push(template.abilities['S']);
}
}
}
if(serverPokemon){
if(!abilityData.ability)abilityData.ability=serverPokemon.ability||serverPokemon.baseAbility;
if(!abilityData.baseAbility&&serverPokemon.baseAbility){
abilityData.baseAbility=serverPokemon.baseAbility;
}
}
return abilityData;
};_proto2.
getPokemonAbilityText=function getPokemonAbilityText(
clientPokemon,
serverPokemon,
isActive,
hidePossible)
{
var text='';
var abilityData=this.getPokemonAbilityData(clientPokemon,serverPokemon);
if(!isActive){

var ability=abilityData.baseAbility||abilityData.ability;
if(ability)text='<small>Ability:</small> '+Dex.getAbility(ability).name;
}else{
if(abilityData.ability){
var abilityName=Dex.getAbility(abilityData.ability).name;
text='<small>Ability:</small> '+abilityName;
var baseAbilityName=Dex.getAbility(abilityData.baseAbility).name;
if(baseAbilityName&&baseAbilityName!==abilityName)text+=' (base: '+baseAbilityName+')';
}
}
if(!text&&abilityData.possibilities.length&&!hidePossible){
text='<small>Possible abilities:</small> '+abilityData.possibilities.join(', ');
}
return text;
};return BattleTooltips;}();BattleTooltips.LONG_TAP_DELAY=350;BattleTooltips.longTapTimeout=0;BattleTooltips.elem=null;BattleTooltips.parentElem=null;BattleTooltips.isLocked=false;BattleTooltips.isPressed=false;BattleTooltips.zMoveEffects={'clearnegativeboost':"Restores negative stat stages to 0",'crit2':"Crit ratio +2",'heal':"Restores HP 100%",'curse':"Restores HP 100% if user is Ghost type, otherwise Attack +1",'redirect':"Redirects opposing attacks to user",'healreplacement':"Restores replacement's HP 100%"};BattleTooltips.zMoveTable={Poison:"Acid Downpour",Fighting:"All-Out Pummeling",Dark:"Black Hole Eclipse",Grass:"Bloom Doom",Normal:"Breakneck Blitz",Rock:"Continental Crush",Steel:"Corkscrew Crash",Dragon:"Devastating Drake",Electric:"Gigavolt Havoc",Water:"Hydro Vortex",Fire:"Inferno Overdrive",Ghost:"Never-Ending Nightmare",Bug:"Savage Spin-Out",Psychic:"Shattered Psyche",Ice:"Subzero Slammer",Flying:"Supersonic Skystrike",Ground:"Tectonic Rage",Fairy:"Twinkle Tackle","???":""};BattleTooltips.maxMoveTable={Poison:"Max Ooze",Fighting:"Max Knuckle",Dark:"Max Darkness",Grass:"Max Overgrowth",Normal:"Max Strike",Rock:"Max Rockfall",Steel:"Max Steelspike",Dragon:"Max Wyrmwind",Electric:"Max Lightning",Water:"Max Geyser",Fire:"Max Flare",Ghost:"Max Phantasm",Bug:"Max Flutterby",Psychic:"Max Mindstorm",Ice:"Max Hailstorm",Flying:"Max Airstream",Ground:"Max Quake",Fairy:"Max Starfall","???":""};BattleTooltips.incenseTypes={'Odd Incense':'Psychic','Rock Incense':'Rock','Rose Incense':'Grass','Sea Incense':'Water','Wave Incense':'Water'};BattleTooltips.itemTypes={'Black Belt':'Fighting','Black Glasses':'Dark','Charcoal':'Fire','Dragon Fang':'Dragon','Hard Stone':'Rock','Magnet':'Electric','Metal Coat':'Steel','Miracle Seed':'Grass','Mystic Water':'Water','Never-Melt Ice':'Ice','Poison Barb':'Poison','Sharp Beak':'Flying','Silk Scarf':'Normal','SilverPowder':'Bug','Soft Sand':'Ground','Spell Tag':'Ghost','Twisted Spoon':'Psychic'};BattleTooltips.orbUsers={'Latias':'Soul Dew','Latios':'Soul Dew','Dialga':'Adamant Orb','Palkia':'Lustrous Orb','Giratina':'Griseous Orb'};BattleTooltips.orbTypes={'Soul Dew':'Psychic','Adamant Orb':'Steel','Lustrous Orb':'Water','Griseous Orb':'Ghost'};BattleTooltips.noGemMoves=['Fire Pledge','Fling','Grass Pledge','Struggle','Water Pledge'];var






































BattleStatGuesser=function(){









function BattleStatGuesser(formatid){this.moveCount=null;this.hasMove=null;
this.formatid=formatid;
this.dex=formatid?Dex.mod(formatid.slice(0,4)):Dex;
this.ignoreEVLimits=
this.dex.gen<3||
this.formatid.endsWith('hackmons')||
this.formatid==='gen8metronomebattle'||
this.formatid.endsWith('norestrictions');

this.supportsEVs=!this.formatid.startsWith('gen7letsgo');
this.supportsAVs=!this.supportsEVs&&this.formatid.endsWith('norestrictions');
}var _proto3=BattleStatGuesser.prototype;_proto3.
guess=function guess(set){
var role=this.guessRole(set);
var comboEVs=this.guessEVs(set,role);
var evs={hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
for(var stat in evs){
evs[stat]=comboEVs[stat]||0;
}
var plusStat=comboEVs.plusStat||'';
var minusStat=comboEVs.minusStat||'';
return{role:role,evs:evs,plusStat:plusStat,minusStat:minusStat,moveCount:this.moveCount,hasMove:this.hasMove};
};_proto3.
guessRole=function guessRole(set){
if(!set)return'?';
if(!set.moves)return'?';

var moveCount={
'Physical':0,
'Special':0,
'PhysicalAttack':0,
'SpecialAttack':0,
'PhysicalSetup':0,
'SpecialSetup':0,
'Support':0,
'Setup':0,
'Restoration':0,
'Offense':0,
'Stall':0,
'SpecialStall':0,
'PhysicalStall':0,
'Fast':0,
'Ultrafast':0,
'bulk':0,
'specialBulk':0,
'physicalBulk':0};

var hasMove={};
var itemid=toID(set.item);
var item=this.dex.getItem(itemid);
var abilityid=toID(set.ability);

var template=this.dex.getTemplate(set.species||set.name);
if(item.megaEvolves===template.species)template=this.dex.getTemplate(item.megaStone);
if(!template.exists)return'?';
var stats=template.baseStats;

if(set.moves.length<1)return'?';
var needsFourMoves=!['unown','ditto'].includes(template.id);
var moveids=set.moves.map(toID);
if(moveids.includes('lastresort'))needsFourMoves=false;
if(set.moves.length<4&&needsFourMoves&&this.formatid!=='gen8metronomebattle'){
return'?';
}

for(var i=0,len=set.moves.length;i<len;i++){
var move=Dex.getMove(set.moves[i]);
hasMove[move.id]=1;
if(move.category==='Status'){
if(['batonpass','healingwish','lunardance'].includes(move.id)){
moveCount['Support']++;
}else if(['metronome','assist','copycat','mefirst'].includes(move.id)){
moveCount['Physical']+=0.5;
moveCount['Special']+=0.5;
}else if(move.id==='naturepower'){
moveCount['Special']++;
}else if(['protect','detect','spikyshield','kingsshield'].includes(move.id)){
moveCount['Stall']++;
}else if(move.id==='wish'){
moveCount['Restoration']++;
moveCount['Stall']++;
moveCount['Support']++;
}else if(move.heal){
moveCount['Restoration']++;
moveCount['Stall']++;
}else if(move.target==='self'){
if(['agility','rockpolish','shellsmash','growth','workup'].includes(move.id)){
moveCount['PhysicalSetup']++;
moveCount['SpecialSetup']++;
}else if(['dragondance','swordsdance','coil','bulkup','curse','bellydrum'].includes(move.id)){
moveCount['PhysicalSetup']++;
}else if(['nastyplot','tailglow','quiverdance','calmmind','geomancy'].includes(move.id)){
moveCount['SpecialSetup']++;
}
if(move.id==='substitute')moveCount['Stall']++;
moveCount['Setup']++;
}else{
if(['toxic','leechseed','willowisp'].includes(move.id)){
moveCount['Stall']++;
}
moveCount['Support']++;
}
}else if(['counter','endeavor','metalburst','mirrorcoat','rapidspin'].includes(move.id)){
moveCount['Support']++;
}else if([
'nightshade','seismictoss','psywave','superfang','naturesmadness','foulplay','endeavor','finalgambit'].
includes(move.id)){
moveCount['Offense']++;
}else if(move.id==='fellstinger'){
moveCount['PhysicalSetup']++;
moveCount['Setup']++;
}else{
moveCount[move.category]++;
moveCount['Offense']++;
if(move.id==='knockoff'){
moveCount['Support']++;
}
if(['scald','voltswitch','uturn'].includes(move.id)){
moveCount[move.category]-=0.2;
}
}
}
if(hasMove['batonpass'])moveCount['Support']+=moveCount['Setup'];
moveCount['PhysicalAttack']=moveCount['Physical'];
moveCount['Physical']+=moveCount['PhysicalSetup'];
moveCount['SpecialAttack']=moveCount['Special'];
moveCount['Special']+=moveCount['SpecialSetup'];

if(hasMove['dragondance']||hasMove['quiverdance'])moveCount['Ultrafast']=1;

var isFast=stats.spe>=80;
var physicalBulk=(stats.hp+75)*(stats.def+87);
var specialBulk=(stats.hp+75)*(stats.spd+87);

if(hasMove['willowisp']||hasMove['acidarmor']||hasMove['irondefense']||hasMove['cottonguard']){
physicalBulk*=1.6;
moveCount['PhysicalStall']++;
}else if(hasMove['scald']||hasMove['bulkup']||hasMove['coil']||hasMove['cosmicpower']){
physicalBulk*=1.3;
if(hasMove['scald']){
moveCount['SpecialStall']++;
}else{
moveCount['PhysicalStall']++;
}
}
if(abilityid==='flamebody')physicalBulk*=1.1;

if(hasMove['calmmind']||hasMove['quiverdance']||hasMove['geomancy']){
specialBulk*=1.3;
moveCount['SpecialStall']++;
}
if(abilityid==='sandstream'&&template.types.includes('Rock')){
specialBulk*=1.5;
}

if(hasMove['bellydrum']){
physicalBulk*=0.6;
specialBulk*=0.6;
}
if(moveCount['Restoration']){
physicalBulk*=1.5;
specialBulk*=1.5;
}else if(hasMove['painsplit']&&hasMove['substitute']){

moveCount['Stall']--;
}else if(hasMove['painsplit']||hasMove['rest']){
physicalBulk*=1.4;
specialBulk*=1.4;
}
if((hasMove['bodyslam']||hasMove['thunder'])&&abilityid==='serenegrace'||hasMove['thunderwave']){
physicalBulk*=1.1;
specialBulk*=1.1;
}
if((hasMove['ironhead']||hasMove['airslash'])&&abilityid==='serenegrace'){
physicalBulk*=1.1;
specialBulk*=1.1;
}
if(hasMove['gigadrain']||hasMove['drainpunch']||hasMove['hornleech']){
physicalBulk*=1.15;
specialBulk*=1.15;
}
if(itemid==='leftovers'||itemid==='blacksludge'){
physicalBulk*=1+0.1*(1+moveCount['Stall']/1.5);
specialBulk*=1+0.1*(1+moveCount['Stall']/1.5);
}
if(hasMove['leechseed']){
physicalBulk*=1+0.1*(1+moveCount['Stall']/1.5);
specialBulk*=1+0.1*(1+moveCount['Stall']/1.5);
}
if((itemid==='flameorb'||itemid==='toxicorb')&&abilityid!=='magicguard'){
if(itemid==='toxicorb'&&abilityid==='poisonheal'){
physicalBulk*=1+0.1*(2+moveCount['Stall']);
specialBulk*=1+0.1*(2+moveCount['Stall']);
}else{
physicalBulk*=0.8;
specialBulk*=0.8;
}
}
if(itemid==='lifeorb'){
physicalBulk*=0.7;
specialBulk*=0.7;
}
if(abilityid==='multiscale'||abilityid==='magicguard'||abilityid==='regenerator'){
physicalBulk*=1.4;
specialBulk*=1.4;
}
if(itemid==='eviolite'){
physicalBulk*=1.5;
specialBulk*=1.5;
}
if(itemid==='assaultvest'){
specialBulk*=1.5;
}

var bulk=physicalBulk+specialBulk;
if(bulk<46000&&stats.spe>=70)isFast=true;
if(hasMove['trickroom'])isFast=false;
moveCount['bulk']=bulk;
moveCount['physicalBulk']=physicalBulk;
moveCount['specialBulk']=specialBulk;

if(
hasMove['agility']||hasMove['dragondance']||hasMove['quiverdance']||
hasMove['rockpolish']||hasMove['shellsmash']||hasMove['flamecharge'])
{
isFast=true;
}else if(abilityid==='unburden'||abilityid==='speedboost'||abilityid==='motordrive'){
isFast=true;
moveCount['Ultrafast']=1;
}else if(abilityid==='chlorophyll'||abilityid==='swiftswim'||abilityid==='sandrush'){
isFast=true;
moveCount['Ultrafast']=2;
}else if(itemid==='salacberry'){
isFast=true;
}
var ultrafast=hasMove['agility']||hasMove['shellsmash']||
hasMove['autotomize']||hasMove['shiftgear']||hasMove['rockpolish'];
if(ultrafast){
moveCount['Ultrafast']=2;
}
moveCount['Fast']=isFast?1:0;

this.moveCount=moveCount;
this.hasMove=hasMove;

if(template.id==='ditto')return abilityid==='imposter'?'Physically Defensive':'Fast Bulky Support';
if(template.id==='shedinja')return'Fast Physical Sweeper';

if(itemid==='choiceband'&&moveCount['PhysicalAttack']>=2){
if(!isFast)return'Bulky Band';
return'Fast Band';
}else if(itemid==='choicespecs'&&moveCount['SpecialAttack']>=2){
if(!isFast)return'Bulky Specs';
return'Fast Specs';
}else if(itemid==='choicescarf'){
if(moveCount['PhysicalAttack']===0)return'Special Scarf';
if(moveCount['SpecialAttack']===0)return'Physical Scarf';
if(moveCount['PhysicalAttack']>moveCount['SpecialAttack'])return'Physical Biased Mixed Scarf';
if(moveCount['PhysicalAttack']<moveCount['SpecialAttack'])return'Special Biased Mixed Scarf';
if(stats.atk<stats.spa)return'Special Biased Mixed Scarf';
return'Physical Biased Mixed Scarf';
}

if(template.id==='unown')return'Fast Special Sweeper';

if(moveCount['PhysicalStall']&&moveCount['Restoration']){
if(stats.spe>110&&abilityid!=='prankster')return'Fast Bulky Support';
return'Specially Defensive';
}
if(moveCount['SpecialStall']&&moveCount['Restoration']&&itemid!=='lifeorb'){
if(stats.spe>110&&abilityid!=='prankster')return'Fast Bulky Support';
return'Physically Defensive';
}

var offenseBias='Physical';
if(stats.spa>stats.atk&&moveCount['Special']>1)offenseBias='Special';else
if(stats.atk>stats.spa&&moveCount['Physical']>1)offenseBias='Physical';else
if(moveCount['Special']>moveCount['Physical'])offenseBias='Special';

if(moveCount['Stall']+moveCount['Support']/2<=2&&bulk<135000&&moveCount[offenseBias]>=1.5){
if(isFast){
if(bulk>80000&&!moveCount['Ultrafast'])return'Bulky '+offenseBias+' Sweeper';
return'Fast '+offenseBias+' Sweeper';
}else{
if(moveCount[offenseBias]>=3||moveCount['Stall']<=0){
return'Bulky '+offenseBias+' Sweeper';
}
}
}

if(isFast&&abilityid!=='prankster'){
if(stats.spe>100||bulk<55000||moveCount['Ultrafast']){
return'Fast Bulky Support';
}
}
if(moveCount['SpecialStall'])return'Physically Defensive';
if(moveCount['PhysicalStall'])return'Specially Defensive';
if(template.id==='blissey'||template.id==='chansey')return'Physically Defensive';
if(specialBulk>=physicalBulk)return'Specially Defensive';
return'Physically Defensive';
};_proto3.
ensureMinEVs=function ensureMinEVs(evs,stat,min,evTotal){
if(!evs[stat])evs[stat]=0;
var diff=min-evs[stat];
if(diff<=0)return evTotal;
if(evTotal<=504){
var change=Math.min(508-evTotal,diff);
evTotal+=change;
evs[stat]+=change;
diff-=change;
}
if(diff<=0)return evTotal;
var evPriority={def:1,spd:1,hp:1,atk:1,spa:1,spe:1};
var prioStat;
for(prioStat in evPriority){
if(prioStat===stat)continue;
if(evs[prioStat]&&evs[prioStat]>128){
evs[prioStat]-=diff;
evs[stat]+=diff;
return evTotal;
}
}
return evTotal;
};_proto3.
ensureMaxEVs=function ensureMaxEVs(evs,stat,min,evTotal){
if(!evs[stat])evs[stat]=0;
var diff=evs[stat]-min;
if(diff<=0)return evTotal;
evs[stat]-=diff;
evTotal-=diff;
return evTotal;
};_proto3.
guessEVs=function guessEVs(set,role){
if(!set)return{};
if(role==='?')return{};
var template=this.dex.getTemplate(set.species||set.name);
var stats=template.baseStats;

var hasMove=this.hasMove;
var moveCount=this.moveCount;

var evs={
hp:0,atk:0,def:0,spa:0,spd:0,spe:0};

var plusStat='';
var minusStat='';

var statChart={
'Bulky Band':['atk','hp'],
'Fast Band':['spe','atk'],
'Bulky Specs':['spa','hp'],
'Fast Specs':['spe','spa'],
'Physical Scarf':['spe','atk'],
'Special Scarf':['spe','spa'],
'Physical Biased Mixed Scarf':['spe','atk'],
'Special Biased Mixed Scarf':['spe','spa'],
'Fast Physical Sweeper':['spe','atk'],
'Fast Special Sweeper':['spe','spa'],
'Bulky Physical Sweeper':['atk','hp'],
'Bulky Special Sweeper':['spa','hp'],
'Fast Bulky Support':['spe','hp'],
'Physically Defensive':['def','hp'],
'Specially Defensive':['spd','hp']};


plusStat=statChart[role][0];
if(role==='Fast Bulky Support')moveCount['Ultrafast']=0;
if(plusStat==='spe'&&moveCount['Ultrafast']){
if(statChart[role][1]==='atk'||statChart[role][1]==='spa'){
plusStat=statChart[role][1];
}else if(moveCount['Physical']>=3){
plusStat='atk';
}else if(stats.spd>stats.def){
plusStat='spd';
}else{
plusStat='def';
}
}

if(this.supportsAVs){

evs={hp:200,atk:200,def:200,spa:200,spd:200,spe:200};
if(!moveCount['PhysicalAttack'])evs.atk=0;
if(!moveCount['SpecialAttack'])evs.spa=0;
if(hasMove['gyroball']||hasMove['trickroom'])evs.spe=0;
}else if(!this.supportsEVs){


}else if(this.ignoreEVLimits){

evs={hp:252,atk:252,def:252,spa:252,spd:252,spe:252};
if(!moveCount['PhysicalAttack'])evs.atk=0;
if(!moveCount['SpecialAttack']&&this.dex.gen>1)evs.spa=0;
if(hasMove['gyroball']||hasMove['trickroom'])evs.spe=0;
if(this.dex.gen===1)evs.spd=0;
if(this.dex.gen<3)return evs;
}else{

if(!statChart[role])return{};

var evTotal=0;

var primaryStat=statChart[role][0];
var stat=this.getStat(primaryStat,set,252,plusStat===primaryStat?1.1:1.0);
var ev=252;
while(ev>0&&stat<=this.getStat(primaryStat,set,ev-4,plusStat===primaryStat?1.1:1.0)){ev-=4;}
evs[primaryStat]=ev;
evTotal+=ev;

var secondaryStat=statChart[role][1];
if(secondaryStat==='hp'&&set.level&&set.level<20)secondaryStat='spd';
stat=this.getStat(secondaryStat,set,252,plusStat===secondaryStat?1.1:1.0);
ev=252;
while(ev>0&&stat<=this.getStat(secondaryStat,set,ev-4,plusStat===secondaryStat?1.1:1.0)){ev-=4;}
evs[secondaryStat]=ev;
evTotal+=ev;

var SRweaknesses=['Fire','Flying','Bug','Ice'];
var SRresistances=['Ground','Steel','Fighting'];
var SRweak=0;
if(set.ability!=='Magic Guard'&&set.ability!=='Mountaineer'){
if(SRweaknesses.indexOf(template.types[0])>=0){
SRweak++;
}else if(SRresistances.indexOf(template.types[0])>=0){
SRweak--;
}
if(SRweaknesses.indexOf(template.types[1])>=0){
SRweak++;
}else if(SRresistances.indexOf(template.types[1])>=0){
SRweak--;
}
}
var hpDivisibility=0;
var hpShouldBeDivisible=false;
var hp=evs['hp']||0;
stat=this.getStat('hp',set,hp,1);
if((set.item==='Leftovers'||set.item==='Black Sludge')&&hasMove['substitute']&&stat!==404){
hpDivisibility=4;
}else if(set.item==='Leftovers'||set.item==='Black Sludge'){
hpDivisibility=0;
}else if(hasMove['bellydrum']&&(set.item||'').slice(-5)==='Berry'){
hpDivisibility=2;
hpShouldBeDivisible=true;
}else if(hasMove['substitute']&&(set.item||'').slice(-5)==='Berry'){
hpDivisibility=4;
hpShouldBeDivisible=true;
}else if(SRweak>=2||hasMove['bellydrum']){
hpDivisibility=2;
}else if(SRweak>=1||hasMove['substitute']||hasMove['transform']){
hpDivisibility=4;
}else if(set.ability!=='Magic Guard'){
hpDivisibility=8;
}

if(hpDivisibility){
while(hp<252&&evTotal<508&&!(stat%hpDivisibility)!==hpShouldBeDivisible){
hp+=4;
stat=this.getStat('hp',set,hp,1);
evTotal+=4;
}
while(hp>0&&!(stat%hpDivisibility)!==hpShouldBeDivisible){
hp-=4;
stat=this.getStat('hp',set,hp,1);
evTotal-=4;
}
while(hp>0&&stat===this.getStat('hp',set,hp-4,1)){
hp-=4;
evTotal-=4;
}
if(hp||evs['hp'])evs['hp']=hp;
}

if(template.id==='tentacruel')evTotal=this.ensureMinEVs(evs,'spe',16,evTotal);
if(template.id==='skarmory')evTotal=this.ensureMinEVs(evs,'spe',24,evTotal);
if(template.id==='jirachi')evTotal=this.ensureMinEVs(evs,'spe',32,evTotal);
if(template.id==='celebi')evTotal=this.ensureMinEVs(evs,'spe',36,evTotal);
if(template.id==='volcarona')evTotal=this.ensureMinEVs(evs,'spe',52,evTotal);
if(template.id==='gliscor')evTotal=this.ensureMinEVs(evs,'spe',72,evTotal);
if(template.id==='dragonite'&&evs['hp'])evTotal=this.ensureMaxEVs(evs,'spe',220,evTotal);
if(evTotal<508){
var remaining=508-evTotal;
if(remaining>252)remaining=252;
secondaryStat=null;
if(!evs['atk']&&moveCount['PhysicalAttack']>=1){
secondaryStat='atk';
}else if(!evs['spa']&&moveCount['SpecialAttack']>=1){
secondaryStat='spa';
}else if(stats.hp===1&&!evs['def']){
secondaryStat='def';
}else if(stats.def===stats.spd&&!evs['spd']){
secondaryStat='spd';
}else if(!evs['spd']){
secondaryStat='spd';
}else if(!evs['def']){
secondaryStat='def';
}
if(secondaryStat){
ev=remaining;
stat=this.getStat(secondaryStat,set,ev);
while(ev>0&&stat===this.getStat(secondaryStat,set,ev-4)){ev-=4;}
if(ev)evs[secondaryStat]=ev;
remaining-=ev;
}
if(remaining&&!evs['spe']){
ev=remaining;
stat=this.getStat('spe',set,ev);
while(ev>0&&stat===this.getStat('spe',set,ev-4)){ev-=4;}
if(ev)evs['spe']=ev;
}
}

}

if(hasMove['gyroball']||hasMove['trickroom']){
minusStat='spe';
}else if(!moveCount['PhysicalAttack']){
minusStat='atk';
}else if(moveCount['SpecialAttack']<1&&!evs['spa']){
if(moveCount['SpecialAttack']<moveCount['PhysicalAttack']){
minusStat='spa';
}else if(!evs['atk']){
minusStat='atk';
}
}else if(moveCount['PhysicalAttack']<1&&!evs['atk']){
minusStat='atk';
}else if(stats.def>stats.spe&&stats.spd>stats.spe&&!evs['spe']){
minusStat='spe';
}else if(stats.def>stats.spd){
minusStat='spd';
}else{
minusStat='def';
}

if(plusStat===minusStat){
minusStat=plusStat==='spe'?'spd':'spe';
}

evs.plusStat=plusStat;
evs.minusStat=minusStat;

return evs;
};_proto3.

getStat=function getStat(stat,set,evOverride,natureOverride){var _BattleNatures,_BattleNatures2;
var template=this.dex.getTemplate(set.species);
if(!template.exists)return 0;

var level=set.level||100;

var baseStat=template.baseStats[stat];

var iv=set.ivs&&set.ivs[stat];
if(typeof iv!=='number')iv=31;
if(this.dex.gen<=2)iv&=30;

var ev=set.evs&&set.evs[stat];
if(typeof ev!=='number')ev=this.dex.gen>2?0:252;
if(evOverride!==undefined)ev=evOverride;

if(stat==='hp'){
if(baseStat===1)return 1;
if(!this.supportsEVs)return~~(~~(2*baseStat+iv+100)*level/100+10)+(this.supportsAVs?ev:0);
return~~(~~(2*baseStat+iv+~~(ev/4)+100)*level/100+10);
}
var val=~~(~~(2*baseStat+iv+~~(ev/4))*level/100+5);
if(!this.supportsEVs){
val=~~(~~(2*baseStat+iv)*level/100+5);
}
if(natureOverride){
val*=natureOverride;
}else if(((_BattleNatures=BattleNatures[set.nature])==null?void 0:_BattleNatures.plus)===stat){
val*=1.1;
}else if(((_BattleNatures2=BattleNatures[set.nature])==null?void 0:_BattleNatures2.minus)===stat){
val*=0.9;
}
if(!this.supportsEVs){
var friendshipValue=~~((70/255/10+1)*100);
val=~~val*friendshipValue/100+(this.supportsAVs?ev:0);
}
return~~val;
};return BattleStatGuesser;}();


if(typeof require==='function'){

global.BattleStatGuesser=BattleStatGuesser;
}