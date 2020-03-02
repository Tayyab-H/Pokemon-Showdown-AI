var _temp;/**
 * Pokemon Showdown Dex
 *
 * Roughly equivalent to sim/dex.js in a Pokemon Showdown server, but
 * designed for use in browsers rather than in Node.
 *
 * This is a generic utility library for Pokemon Showdown code: any
 * code shared between the replay viewer and the client usually ends up
 * here.
 *
 * Licensing note: PS's client has complicated licensing:
 * - The client as a whole is AGPLv3
 * - The battle replay/animation engine (battle-*.ts) by itself is MIT
 *
 * Compiled into battledata.js which includes all dependencies
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */




if(!Array.prototype.indexOf){
Array.prototype.indexOf=function indexOf(searchElement,fromIndex){
for(var i=fromIndex||0;i<this.length;i++){
if(this[i]===searchElement)return i;
}
return-1;
};
}
if(!Array.prototype.includes){
Array.prototype.includes=function includes(thing){
return this.indexOf(thing)!==-1;
};
}
if(!Array.isArray){
Array.isArray=function isArray(thing){
return Object.prototype.toString.call(thing)==='[object Array]';
};
}
if(!String.prototype.includes){
String.prototype.includes=function includes(thing){
return this.indexOf(thing)!==-1;
};
}
if(!String.prototype.startsWith){
String.prototype.startsWith=function startsWith(thing){
return this.slice(0,thing.length)===thing;
};
}
if(!String.prototype.endsWith){
String.prototype.endsWith=function endsWith(thing){
return this.slice(-thing.length)===thing;
};
}
if(!String.prototype.trim){
String.prototype.trim=function trim(){
return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
};
}
if(!Object.assign){
Object.assign=function assign(thing,rest){
for(var i=1;i<arguments.length;i++){
var source=arguments[i];
for(var _k in source){
thing[_k]=source[_k];
}
}
return thing;
};
}
if(!Object.values){
Object.values=function values(thing){
var out=[];
for(var _k2 in thing){
out.push(thing[_k2]);
}
return out;
};
}
if(!Object.keys){
Object.keys=function keys(thing){
var out=[];
for(var _k3 in thing){
out.push(_k3);
}
return out;
};
}
if(!Object.entries){
Object.entries=function entries(thing){
var out=[];
for(var _k4 in thing){
out.push([_k4,thing[_k4]]);
}
return out;
};
}
if(!Object.create){
Object.create=function(proto){
function F(){}
F.prototype=proto;
return new F();
};
}

if(typeof window==='undefined'){

global.window=global;
}else{

window.exports=window;
}

if(window.soundManager){
soundManager.setup({url:'https://play.pokemonshowdown.com/swf/'});
if(window.Replays)soundManager.onready(window.Replays.soundReady);
soundManager.onready(function(){
soundManager.createSound({
id:'notif',
url:'https://play.pokemonshowdown.com/audio/notification.wav'});

});
}


window.nodewebkit=!!(typeof process!=='undefined'&&process.versions&&process.versions['node-webkit']);

function getString(str){
if(typeof str==='string'||typeof str==='number')return''+str;
return'';
}

function toID(text){var _text,_text2;
if((_text=text)==null?void 0:_text.id){
text=text.id;
}else if((_text2=text)==null?void 0:_text2.userid){
text=text.userid;
}
if(typeof text!=='string'&&typeof text!=='number')return'';
return(''+text).toLowerCase().replace(/[^a-z0-9]+/g,'');
}

function toUserid(text){
return toID(text);
}











function splitFirst(str,delimiter){var limit=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1;
var splitStr=[];
while(splitStr.length<limit){
var delimiterIndex=str.indexOf(delimiter);
if(delimiterIndex>=0){
splitStr.push(str.slice(0,delimiterIndex));
str=str.slice(delimiterIndex+delimiter.length);
}else{
splitStr.push(str);
str='';
}
}
splitStr.push(str);
return splitStr;
}





function toRoomid(roomid){
return roomid.replace(/[^a-zA-Z0-9-]+/g,'').toLowerCase();
}

function toName(name){
if(typeof name!=='string'&&typeof name!=='number')return'';
name=(''+name).replace(/[\|\s\[\]\,\u202e]+/g,' ').trim();
if(name.length>18)name=name.substr(0,18).trim();


name=name.replace(
/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
'');

name=name.replace(/[\u239b-\u23b9]/g,'');

return name;
}














var Dex=new(_temp=function(){function _temp(){this.
gen=8;this.
modid='gen8';this.
cache=null;this.

statNames=['hp','atk','def','spa','spd','spe'];this.
statNamesExceptHP=['atk','def','spa','spd','spe'];this.

pokeballs=null;this.

resourcePrefix=function(){var _window$document,_window$document$loca;
var prefix='';
if(((_window$document=window.document)==null?void 0:(_window$document$loca=_window$document.location)==null?void 0:_window$document$loca.protocol)!=='http:')prefix='https:';
return prefix+"//play.pokemonshowdown.com/";
}();this.

fxPrefix=function(){var _window$document2,_window$document2$loc;
if(((_window$document2=window.document)==null?void 0:(_window$document2$loc=_window$document2.location)==null?void 0:_window$document2$loc.protocol)==='file:'){
if(window.Replays)return"https://play.pokemonshowdown.com/fx/";
return"fx/";
}
return"//play.pokemonshowdown.com/fx/";
}();this.

loadedSpriteData={xy:1,bw:0};this.
moddedDexes={};}var _proto=_temp.prototype;_proto.

mod=function mod(modid){
if(modid==='gen8')return this;
if(!window.BattleTeambuilderTable)return this;
if(modid in this.moddedDexes){
return this.moddedDexes[modid];
}
this.moddedDexes[modid]=new ModdedDex(modid);
return this.moddedDexes[modid];
};_proto.
forGen=function forGen(gen){
if(!gen)return this;
return this.mod("gen"+gen);
};_proto.

resolveAvatar=function resolveAvatar(avatar){var _window$Config,_window$Config$server;
if(window.BattleAvatarNumbers&&avatar in BattleAvatarNumbers){
avatar=BattleAvatarNumbers[avatar];
}
if(avatar.charAt(0)==='#'){
return Dex.resourcePrefix+'sprites/trainers-custom/'+toID(avatar.substr(1))+'.png';
}
if(avatar.includes('.')&&((_window$Config=window.Config)==null?void 0:(_window$Config$server=_window$Config.server)==null?void 0:_window$Config$server.registered)){

var protocol=Config.server.port===443?'https':'http';
return protocol+'://'+Config.server.host+':'+Config.server.port+
'/avatars/'+encodeURIComponent(avatar).replace(/\%3F/g,'?');
}
return Dex.resourcePrefix+'sprites/trainers/'+Dex.sanitizeName(avatar||'unknown')+'.png';
};_proto.












sanitizeName=function sanitizeName(name){
if(!name)return'';
return(''+name).
replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').
slice(0,50);
};_proto.

prefs=function prefs(prop,value,save){var _window$Storage;

return(_window$Storage=window.Storage)==null?void 0:_window$Storage.prefs==null?void 0:_window$Storage.prefs(prop,value,save);
};_proto.

getShortName=function getShortName(name){
var shortName=name.replace(/[^A-Za-z0-9]+$/,'');
if(shortName.indexOf('(')>=0){
shortName+=name.slice(shortName.length).replace(/[^\(\)]+/g,'').replace(/\(\)/g,'');
}
return shortName;
};_proto.

getEffect=function getEffect(name){
name=(name||'').trim();
if(name.substr(0,5)==='item:'){
return Dex.getItem(name.substr(5).trim());
}else if(name.substr(0,8)==='ability:'){
return Dex.getAbility(name.substr(8).trim());
}else if(name.substr(0,5)==='move:'){
return Dex.getMove(name.substr(5).trim());
}
var id=toID(name);
return new PureEffect(id,name);
};_proto.

getMove=function getMove(nameOrMove){
if(nameOrMove&&typeof nameOrMove!=='string'){

return nameOrMove;
}
var name=nameOrMove||'';
var id=toID(nameOrMove);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleMovedex)window.BattleMovedex={};
var data=window.BattleMovedex[id];
if(data&&typeof data.exists==='boolean')return data;

if(!data&&id.substr(0,11)==='hiddenpower'&&id.length>11){var _ref=
/([a-z]*)([0-9]*)/.exec(id),hpWithType=_ref[1],hpPower=_ref[2];
data=Object.assign({},
window.BattleMovedex[hpWithType]||{},{
basePower:Number(hpPower)||60});

}
if(!data&&id.substr(0,6)==='return'&&id.length>6){
data=Object.assign({},
window.BattleMovedex['return']||{},{
basePower:Number(id.slice(6))});

}
if(!data&&id.substr(0,11)==='frustration'&&id.length>11){
data=Object.assign({},
window.BattleMovedex['frustration']||{},{
basePower:Number(id.slice(11))});

}

if(!data)data={exists:false};
var move=new Move(id,name,data);
window.BattleMovedex[id]=move;
return move;
};_proto.

getGen3Category=function getGen3Category(type){
return[
'Fire','Water','Grass','Electric','Ice','Psychic','Dark','Dragon'].
includes(type)?'Special':'Physical';
};_proto.

getItem=function getItem(nameOrItem){
if(nameOrItem&&typeof nameOrItem!=='string'){

return nameOrItem;
}
var name=nameOrItem||'';
var id=toID(nameOrItem);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleItems)window.BattleItems={};
var data=window.BattleItems[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var item=new Item(id,name,data);
window.BattleItems[id]=item;
return item;
};_proto.

getAbility=function getAbility(nameOrAbility){
if(nameOrAbility&&typeof nameOrAbility!=='string'){

return nameOrAbility;
}
var name=nameOrAbility||'';
var id=toID(nameOrAbility);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattleAbilities)window.BattleAbilities={};
var data=window.BattleAbilities[id];
if(data&&typeof data.exists==='boolean')return data;
if(!data)data={exists:false};
var ability=new Ability(id,name,data);
window.BattleAbilities[id]=ability;
return ability;
};_proto.

getTemplate=function getTemplate(nameOrTemplate){
if(nameOrTemplate&&typeof nameOrTemplate!=='string'){

return nameOrTemplate;
}
var name=nameOrTemplate||'';
var id=toID(nameOrTemplate);
var formid=id;
if(!window.BattlePokedexAltForms)window.BattlePokedexAltForms={};
if(formid in window.BattlePokedexAltForms)return window.BattlePokedexAltForms[formid];
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(!window.BattlePokedex)window.BattlePokedex={};
var data=window.BattlePokedex[id];

var template;
if(data&&typeof data.exists==='boolean'){
template=data;
}else{
if(!data)data={exists:false};
if(!data.tier&&id.slice(-5)==='totem'){
data.tier=this.getTemplate(id.slice(0,-5)).tier;
}
if(!data.tier&&data.baseSpecies&&toID(data.baseSpecies)!==id){
data.tier=this.getTemplate(data.baseSpecies).tier;
}
template=new Template(id,name,data);
window.BattlePokedex[id]=template;
}

if(formid===id||!template.otherForms||!template.otherForms.includes(formid)){
return template;
}
var forme=formid.slice(id.length);
forme=forme[0].toUpperCase()+forme.slice(1);
name=template.baseSpecies+(forme?'-'+forme:'');

template=window.BattlePokedexAltForms[formid]=new Template(formid,name,Object.assign({},
template,{
name:name,
forme:forme}));

return template;
};_proto.


getTier=function getTier(pokemon){var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:7;var isDoubles=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
if(gen<8)pokemon=this.forGen(gen).getTemplate(pokemon.id);
if(!isDoubles)return pokemon.tier;
var table=window.BattleTeambuilderTable;
if(table&&table["gen"+this.gen+"doubles"]){
table=table["gen"+this.gen+"doubles"];
}
if(!table)return pokemon.tier;

var id=pokemon.id;
if(id in table.overrideTier){
return table.overrideTier[id];
}
if(id.slice(-5)==='totem'&&id.slice(0,-5)in table.overrideTier){
return table.overrideTier[id.slice(0,-5)];
}
id=toID(pokemon.baseSpecies);
if(id in table.overrideTier){
return table.overrideTier[id];
}

return pokemon.tier;
};_proto.

getType=function getType(type){
if(!type||typeof type==='string'){
var id=toID(type);
id=id.substr(0,1).toUpperCase()+id.substr(1);
type=window.BattleTypeChart&&window.BattleTypeChart[id]||{};
if(type.damageTaken)type.exists=true;
if(!type.id)type.id=id;
if(!type.name)type.name=id;
if(!type.effectType){
type.effectType='Type';
}
}
return type;
};_proto.

hasAbility=function hasAbility(template,ability){
for(var i in template.abilities){

if(ability===template.abilities[i])return true;
}
return false;
};_proto.

loadSpriteData=function loadSpriteData(gen){
if(this.loadedSpriteData[gen])return;
this.loadedSpriteData[gen]=1;

var path=$('script[src*="pokedex-mini.js"]').attr('src')||'';
var qs='?'+(path.split('?')[1]||'');
path=(path.match(/.+?(?=data\/pokedex-mini\.js)/)||[])[0]||'';

var el=document.createElement('script');
el.src=path+'data/pokedex-mini-bw.js'+qs;
document.getElementsByTagName('body')[0].appendChild(el);
};_proto.
getSpriteData=function getSpriteData(pokemon,siden)

{var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{gen:6};
var mechanicsGen=options.gen||6;
var isDynamax=false;
if(pokemon instanceof Pokemon){
if(pokemon.volatiles.transform){
options.shiny=pokemon.volatiles.transform[2];
options.gender=pokemon.volatiles.transform[3];
}else{
options.shiny=pokemon.shiny;
options.gender=pokemon.gender;
}
if(pokemon.volatiles.dynamax)isDynamax=true;
pokemon=pokemon.getSpecies();
}
var template=Dex.getTemplate(pokemon);
var spriteData={
gen:mechanicsGen,
w:96,
h:96,
y:0,
url:Dex.resourcePrefix+'sprites/',
pixelated:true,
isBackSprite:false,
cryurl:'',
shiny:options.shiny};

var name=template.spriteid;
var dir;
var facing;
if(siden){
dir='';
facing='front';
}else{
spriteData.isBackSprite=true;
dir='-back';
facing='back';
}












var graphicsGen=mechanicsGen;
if(Dex.prefs('nopastgens'))graphicsGen=6;
if(Dex.prefs('bwgfx')&&graphicsGen>=6)graphicsGen=5;
spriteData.gen=Math.max(graphicsGen,Math.min(template.gen,5));
var baseDir=['','gen1','gen2','gen3','gen4','gen5','','',''][spriteData.gen];

var animationData=null;
var miscData=null;
var speciesid=template.speciesid;
if(template.isTotem)speciesid=toID(name);
if(baseDir===''&&window.BattlePokemonSprites){
animationData=BattlePokemonSprites[speciesid];
}
if(baseDir==='gen5'&&window.BattlePokemonSpritesBW){
animationData=BattlePokemonSpritesBW[speciesid];
}
if(window.BattlePokemonSprites)miscData=BattlePokemonSprites[speciesid];
if(!miscData&&window.BattlePokemonSpritesBW)miscData=BattlePokemonSpritesBW[speciesid];
if(!animationData)animationData={};
if(!miscData)miscData={};

if(miscData.num>0){
var baseSpeciesid=toID(template.baseSpecies);
spriteData.cryurl='audio/cries/'+baseSpeciesid;
var formeid=template.formeid;
if(template.isMega||formeid&&(
formeid==='-sky'||
formeid==='-therian'||
formeid==='-primal'||
formeid==='-eternal'||
baseSpeciesid==='kyurem'||
baseSpeciesid==='necrozma'||
formeid==='-super'||
formeid==='-unbound'||
formeid==='-midnight'||
formeid==='-school'||
baseSpeciesid==='oricorio'||
baseSpeciesid==='zygarde'))
{
spriteData.cryurl+=formeid;
}
spriteData.cryurl+=window.nodewebkit?'.ogg':'.mp3';
}

if(options.shiny&&mechanicsGen>1)dir+='-shiny';


if(window.Config&&Config.server&&Config.server.afd||options.afd){
dir='afd'+dir;
spriteData.url+=dir+'/'+name+'.png';
return spriteData;
}


if(options.mod){
spriteData.cryurl="sprites/"+options.mod+"/audio/"+toID(template.baseSpecies);
spriteData.cryurl+=window.nodewebkit?'.ogg':'.mp3';
}

if(animationData[facing+'f']&&options.gender==='F')facing+='f';
var allowAnim=!Dex.prefs('noanim')&&!Dex.prefs('nogif');
if(allowAnim&&spriteData.gen>=6)spriteData.pixelated=false;
if(allowAnim&&animationData[facing]&&spriteData.gen>=5){
if(facing.slice(-1)==='f')name+='-f';
dir=baseDir+'ani'+dir;

spriteData.w=animationData[facing].w;
spriteData.h=animationData[facing].h;
spriteData.url+=dir+'/'+name+'.gif';
}else{


dir=(baseDir||'gen5')+dir;



if(spriteData.gen>=4&&miscData['frontf']&&options.gender==='F'){
name+='-f';
}

spriteData.url+=dir+'/'+name+'.png';
}

if(!options.noScale){
if(graphicsGen>4){

}else if(!spriteData.isBackSprite){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-16;
}else{

spriteData.w*=2/1.5;
spriteData.h*=2/1.5;
spriteData.y+=-11;
}
if(spriteData.gen<=2)spriteData.y+=2;
}
if(isDynamax&&!options.noScale){
spriteData.w*=2;
spriteData.h*=2;
spriteData.y+=-22;
}else if((template.isTotem||isDynamax)&&!options.noScale){
spriteData.w*=1.5;
spriteData.h*=1.5;
spriteData.y+=-11;
}

return spriteData;
};_proto.

getPokemonIconNum=function getPokemonIconNum(id,isFemale,facingLeft){var _window$BattlePokemon,_window$BattlePokemon2,_window$BattlePokedex,_window$BattlePokedex2,_window$BattlePokemon3;
var num=0;
if((_window$BattlePokemon=window.BattlePokemonSprites)==null?void 0:(_window$BattlePokemon2=_window$BattlePokemon[id])==null?void 0:_window$BattlePokemon2.num){
num=BattlePokemonSprites[id].num;
}else if((_window$BattlePokedex=window.BattlePokedex)==null?void 0:(_window$BattlePokedex2=_window$BattlePokedex[id])==null?void 0:_window$BattlePokedex2.num){
num=BattlePokedex[id].num;
}
if(num<0)num=0;
if(num>890)num=0;

if((_window$BattlePokemon3=window.BattlePokemonIconIndexes)==null?void 0:_window$BattlePokemon3[id]){
num=BattlePokemonIconIndexes[id];
}

if(isFemale){
if(['unfezant','frillish','jellicent','meowstic','pyroar'].includes(id)){
num=BattlePokemonIconIndexes[id+'f'];
}
}
if(facingLeft){
if(BattlePokemonIconIndexesLeft[id]){
num=BattlePokemonIconIndexesLeft[id];
}
}
return num;
};_proto.

getPokemonIcon=function getPokemonIcon(pokemon,facingLeft){var _pokemon$volatiles;
if(pokemon==='pokeball'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -0px 4px";
}else if(pokemon==='pokeball-statused'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -40px 4px";
}else if(pokemon==='pokeball-fainted'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px;opacity:.4;filter:contrast(0)";
}else if(pokemon==='pokeball-none'){
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-pokeball-sheet.png) no-repeat scroll -80px 4px";
}

var id=toID(pokemon);
if(pokemon==null?void 0:pokemon.species)id=toID(pokemon.species);
if((pokemon==null?void 0:(_pokemon$volatiles=pokemon.volatiles)==null?void 0:_pokemon$volatiles.formechange)&&!pokemon.volatiles.transform){
id=toID(pokemon.volatiles.formechange[1]);
}
var num=this.getPokemonIconNum(id,(pokemon==null?void 0:pokemon.gender)==='F',facingLeft);

var top=Math.floor(num/12)*30;
var left=num%12*40;
var fainted=(pokemon==null?void 0:pokemon.fainted)?";opacity:.3;filter:grayscale(100%) brightness(.5)":"";
return"background:transparent url("+Dex.resourcePrefix+"sprites/pokemonicons-sheet.png?g8) no-repeat scroll -"+left+"px -"+top+"px"+fainted;
};_proto.

getTeambuilderSprite=function getTeambuilderSprite(pokemon){var gen=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;
if(!pokemon)return'';
var id=toID(pokemon.species);
var spriteid=pokemon.spriteid;
var template=Dex.getTemplate(pokemon.species);
if(pokemon.species&&!spriteid){
spriteid=template.spriteid||toID(pokemon.species);
}
if(template.exists===false){
return'background-image:url('+Dex.resourcePrefix+'sprites/gen5/0.png);background-position:10px 5px;background-repeat:no-repeat';
}
var shiny=pokemon.shiny?'-shiny':'';











if(Dex.prefs('nopastgens'))gen=6;
var spriteDir=Dex.resourcePrefix+'sprites/dex';
var xydexExists=!template.isNonstandard||template.isNonstandard==='Past'||[
"pikachustarter","eeveestarter","meltan","melmetal","fidgit","stratagem","tomohawk","mollux","crucibelle","crucibellemega","kerfluffle","pajantom","jumbao","caribolt","smokomodo","snaelstrom","equilibra","scratchet","pluffle","smogecko","pokestarufo","pokestarufo2","pokestarbrycenman","pokestarmt","pokestarmt2","pokestargiant","pokestarhumanoid","pokestarmonster","pokestarf00","pokestarf002","pokestarspirit"].
includes(template.id);
if(template.gen===8)xydexExists=false;
if((!gen||gen>=6)&&xydexExists&&!Dex.prefs('bwgfx')){
var offset='-2px -3px';
if(template.gen>=7)offset='-6px -7px';
if(id.substr(0,6)==='arceus')offset='-2px 7px';
if(id==='garchomp')offset='-2px 2px';
if(id==='garchompmega')offset='-2px 0px';
return'background-image:url('+spriteDir+shiny+'/'+spriteid+'.png);background-position:'+offset+';background-repeat:no-repeat';
}
spriteDir=Dex.resourcePrefix+'sprites/gen5';
if(gen<=1&&template.gen<=1)spriteDir=Dex.resourcePrefix+'sprites/gen1';else
if(gen<=2&&template.gen<=2)spriteDir=Dex.resourcePrefix+'sprites/gen2';else
if(gen<=3&&template.gen<=3)spriteDir=Dex.resourcePrefix+'sprites/gen3';else
if(gen<=4&&template.gen<=4)spriteDir=Dex.resourcePrefix+'sprites/gen4';
return'background-image:url('+spriteDir+shiny+'/'+spriteid+'.png);background-position:10px 5px;background-repeat:no-repeat';
};_proto.

getItemIcon=function getItemIcon(item){var _item;
var num=0;
if(typeof item==='string'&&exports.BattleItems)item=exports.BattleItems[toID(item)];
if((_item=item)==null?void 0:_item.spritenum)num=item.spritenum;

var top=Math.floor(num/16)*24;
var left=num%16*24;
return'background:transparent url('+Dex.resourcePrefix+'sprites/itemicons-sheet.png?g8) no-repeat scroll -'+left+'px -'+top+'px';
};_proto.

getTypeIcon=function getTypeIcon(type,b){
if(!type)return'';
var sanitizedType=type.replace(/\?/g,'%3f');
return'<img src="'+Dex.resourcePrefix+'sprites/types/'+sanitizedType+'.png" alt="'+type+'" height="14" width="32"'+(b?' class="b"':'')+' />';
};_proto.

getPokeballs=function getPokeballs(){
if(this.pokeballs)return this.pokeballs;
this.pokeballs=[];
if(!window.BattleItems)window.BattleItems={};for(var _i=0,_ref2=
Object.values(window.BattleItems);_i<_ref2.length;_i++){var data=_ref2[_i];
if(!data.isPokeball)continue;
this.pokeballs.push(data.name);
}
return this.pokeballs;
};return _temp;}(),_temp)();var


ModdedDex=function(){









function ModdedDex(modid){this.cache={Moves:{},Items:{},Abilities:{},Templates:{}};this.pokeballs=null;
this.modid=modid;
var gen=parseInt(modid.slice(3),10);
if(!modid.startsWith('gen')||!gen)throw new Error("Unsupported modid");
this.gen=gen;
}var _proto2=ModdedDex.prototype;_proto2.
getMove=function getMove(name){
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(this.cache.Moves.hasOwnProperty(id))return this.cache.Moves[id];

var data=Object.assign({},Dex.getMove(name));

var table=window.BattleTeambuilderTable[this.modid];
if(id in table.overrideAcc)data.accuracy=table.overrideAcc[id];
if(id in table.overrideBP)data.basePower=table.overrideBP[id];
if(id in table.overridePP)data.pp=table.overridePP[id];
if(id in table.overrideMoveType)data.type=table.overrideMoveType[id];
for(var i=this.gen;i<8;i++){
if(id in window.BattleTeambuilderTable['gen'+i].overrideMoveDesc){
data.shortDesc=window.BattleTeambuilderTable['gen'+i].overrideMoveDesc[id];
break;
}
}
if(this.gen<=3&&data.category!=='Status'){
data.category=Dex.getGen3Category(data.type);
}

var move=new Move(id,name,data);
this.cache.Moves[id]=move;
return move;
};_proto2.
getItem=function getItem(name){
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(this.cache.Items.hasOwnProperty(id))return this.cache.Items[id];

var data=Object.assign({},Dex.getItem(name));

for(var i=this.gen;i<8;i++){
if(id in window.BattleTeambuilderTable['gen'+i].overrideItemDesc){
data.shortDesc=window.BattleTeambuilderTable['gen'+i].overrideItemDesc[id];
break;
}
}

var item=new Item(id,name,data);
this.cache.Items[id]=item;
return item;
};_proto2.
getAbility=function getAbility(name){
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(this.cache.Abilities.hasOwnProperty(id))return this.cache.Abilities[id];

var data=Object.assign({},Dex.getAbility(name));

for(var i=this.gen;i<8;i++){
if(id in window.BattleTeambuilderTable['gen'+i].overrideAbilityDesc){
data.shortDesc=window.BattleTeambuilderTable['gen'+i].overrideAbilityDesc[id];
break;
}
}

var ability=new Ability(id,name,data);
this.cache.Abilities[id]=ability;
return ability;
};_proto2.
getTemplate=function getTemplate(name){
var id=toID(name);
if(window.BattleAliases&&id in BattleAliases){
name=BattleAliases[id];
id=toID(name);
}
if(this.cache.Templates.hasOwnProperty(id))return this.cache.Templates[id];

var data=Object.assign({},Dex.getTemplate(name));

var table=window.BattleTeambuilderTable[this.modid];
if(this.gen<3){
data.abilities={0:"None"};
}else{
var abilities=Object.assign({},data.abilities);
if(id in table.overrideAbility){
abilities['0']=table.overrideAbility[id];
}
if(id in table.removeSecondAbility){
delete abilities['1'];
}
if(id in table.overrideHiddenAbility){
abilities['H']=table.overrideHiddenAbility[id];
}
if(this.gen<5)delete abilities['H'];
if(this.gen<7)delete abilities['S'];

data.abilities=abilities;
}
if(id in table.overrideStats){
data.baseStats=Object.assign({},data.baseStats,{},table.overrideStats[id]);
}
if(id in table.overrideType)data.types=table.overrideType[id].split('/');

if(id in table.overrideTier)data.tier=table.overrideTier[id];
if(!data.tier&&id.slice(-5)==='totem'){
data.tier=this.getTemplate(id.slice(0,-5)).tier;
}
if(!data.tier&&data.baseSpecies&&toID(data.baseSpecies)!==id){
data.tier=this.getTemplate(data.baseSpecies).tier;
}
if(data.gen>this.gen)data.tier='Illegal';

var template=new Template(id,name,data);
this.cache.Templates[id]=template;
return template;
};_proto2.

getPokeballs=function getPokeballs(){
if(this.pokeballs)return this.pokeballs;
this.pokeballs=[];
if(!window.BattleItems)window.BattleItems={};for(var _i2=0,_ref3=
Object.values(window.BattleItems);_i2<_ref3.length;_i2++){var data=_ref3[_i2];
if(data.gen&&data.gen>this.gen)continue;
if(!data.isPokeball)continue;
this.pokeballs.push(data.name);
}
return this.pokeballs;
};return ModdedDex;}();


if(typeof require==='function'){

global.Dex=Dex;
global.toID=toID;
}