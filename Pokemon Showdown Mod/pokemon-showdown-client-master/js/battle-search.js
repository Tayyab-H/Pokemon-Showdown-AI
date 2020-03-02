/**
 * Search
 *
 * Code for searching for dex information, used by the Dex and
 * Teambuilder.
 *
 * Dependencies: battledata, search-index
 * Optional dependencies: pokedex, moves, items, abilities
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var














BattleSearch=function(){




















































function BattleSearch(){var qType=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';var formatid=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var set=arguments.length>2?arguments[2]:undefined;this.q=undefined;this.qType='';this.defaultResults=null;this.legalityFilter=null;this.legalityLabel="Illegal";this.exactMatch=false;this.results=null;this.filters=null;this.sortCol=null;this.cur=[];this.gen=8;this.dex=Dex;this.isDoubles=false;this.isLetsGo=false;this.urlRoot='//dex.pokemonshowdown.com/';
this.qType=qType;
if(set){
this.setType(qType,formatid,set);
}
}var _proto=BattleSearch.prototype;_proto.

find=function find(query){
query=toID(query);

if(query===this.q){
return false;
}
this.q=query;
this.results=null;
this.exactMatch=false;
var qType=this.qType;

if(!query){


if(!this.filters&&!this.sortCol&&this.defaultResults){
this.results=this.defaultResults;
return true;
}
if(qType==='pokemon'){
this.allPokemon();
return true;
}else if(qType==='move'){
this.allMoves();
return true;
}
return true;
}




var qTypeIndex=qType?BattleSearch.typeTable[qType]:-1;

var qFilterType='';
if(query.slice(-4)==='type'){
if(query.charAt(0).toUpperCase()+query.slice(1,-4)in window.BattleTypeChart){
query=query.slice(0,-4);
qFilterType='type';
}
}


var i=BattleSearch.getClosest(query);
this.exactMatch=BattleSearchIndex[i][0]===query;







var passType='';


















var searchPasses=[['normal',i,query]];



if(query.length>1)searchPasses.push(['alias',i,query]);





var queryAlias;
if(query in BattleAliases){
if(['sub','tr'].includes(query)||toID(BattleAliases[query]).slice(0,query.length)!==query){
queryAlias=toID(BattleAliases[query]);
var aliasPassType=queryAlias==='hiddenpower'?'exact':'normal';
searchPasses.unshift([aliasPassType,BattleSearch.getClosest(queryAlias),queryAlias]);
}
this.exactMatch=true;
}



if(!this.exactMatch&&BattleSearchIndex[i][0].substr(0,query.length)!==query){

var matchLength=query.length-1;
if(!i)i++;
while(matchLength&&
BattleSearchIndex[i][0].substr(0,matchLength)!==query.substr(0,matchLength)&&
BattleSearchIndex[i-1][0].substr(0,matchLength)!==query.substr(0,matchLength)){
matchLength--;
}
var matchQuery=query.substr(0,matchLength);
while(i>=1&&BattleSearchIndex[i-1][0].substr(0,matchLength)===matchQuery){i--;}
searchPasses.push(['fuzzy',i,'']);
}











var bufs=[[],[],[],[],[],[],[],[],[],[]];
var topbufIndex=-1;

var count=0;
var nearMatch=false;


var instafilter=null;
var instafilterSort=[0,1,2,5,4,3,6,7,8];


for(i=0;i<BattleSearchIndex.length;i++){
if(!passType){
var searchPass=searchPasses.shift();
if(!searchPass)break;
passType=searchPass[0];
i=searchPass[1];
query=searchPass[2];
}

var entry=BattleSearchIndex[i];
var _id=entry[0];
var type=entry[1];

if(!_id)break;

if(passType==='fuzzy'){

if(count>=2){
passType='';
continue;
}
nearMatch=true;
}else if(passType==='exact'){

if(count>=1){
passType='';
continue;
}
}else if(_id.substr(0,query.length)!==query){

passType='';
continue;
}

if(entry.length>2){

if(passType!=='alias')continue;
}else{

if(passType==='alias')continue;
}

var typeIndex=BattleSearch.typeTable[type];


if(query.length===1&&typeIndex!==(qType?qTypeIndex:1))continue;


if(qType==='pokemon'&&(typeIndex===5||typeIndex>7))continue;
if(qType==='pokemon'&&typeIndex===3&&this.gen<8)continue;

if(qType==='move'&&(typeIndex!==8&&typeIndex>4||typeIndex===3))continue;

if(qType==='move'&&this.legalityFilter&&typeIndex===1)continue;

if((qType==='ability'||qType==='item')&&typeIndex!==qTypeIndex)continue;

if(qFilterType==='type'&&typeIndex!==2)continue;

if((_id==='megax'||_id==='megay')&&'mega'.startsWith(query))continue;

var matchStart=0;
var matchEnd=0;
if(passType==='alias'){


matchStart=entry[3];
var originalIndex=entry[2];
if(matchStart){
matchEnd=matchStart+query.length;
matchStart+=(BattleSearchIndexOffset[originalIndex][matchStart]||'0').charCodeAt(0)-48;
matchEnd+=(BattleSearchIndexOffset[originalIndex][matchEnd-1]||'0').charCodeAt(0)-48;
}
_id=BattleSearchIndex[originalIndex][0];
}else{
matchEnd=query.length;
if(matchEnd)matchEnd+=(BattleSearchIndexOffset[i][matchEnd-1]||'0').charCodeAt(0)-48;
}


if(queryAlias===_id&&query!==_id)continue;

if(qType&&qTypeIndex!==typeIndex){

if(!instafilter||instafilterSort[typeIndex]<instafilterSort[instafilter[2]]){
instafilter=[type,_id,typeIndex];
}
}


if(topbufIndex<0&&qTypeIndex<2&&passType==='alias'&&!bufs[1].length&&bufs[2].length)topbufIndex=2;

if(this.legalityFilter&&typeIndex===qTypeIndex){





if(!bufs[typeIndex].length&&!bufs[0].length){
bufs[0]=[['header',BattleSearch.typeName[type]]];
}
if(_id in this.legalityFilter)typeIndex=0;
}else{
if(!bufs[typeIndex].length){
bufs[typeIndex]=[['header',BattleSearch.typeName[type]]];
}
}


var curBufLength=passType==='alias'&&bufs[typeIndex].length;
if(curBufLength&&bufs[typeIndex][curBufLength-1][1]===_id)continue;

bufs[typeIndex].push([type,_id,matchStart,matchEnd]);

count++;
}

var topbuf=[];
if(nearMatch){
topbuf=[['html',"<em>No exact match found. The closest matches alphabetically are:</em>"]];
}
if(topbufIndex>=0){
topbuf=topbuf.concat(bufs[topbufIndex]);
bufs[topbufIndex]=[];
}
if(qTypeIndex>=0){
topbuf=topbuf.concat(bufs[0]);
topbuf=topbuf.concat(bufs[qTypeIndex]);
bufs[qTypeIndex]=[];
bufs[0]=[];
}

if(instafilter&&count<20){

bufs.push(this.instafilter(qType,instafilter[0],instafilter[1]));
}

this.results=Array.prototype.concat.apply(topbuf,bufs);
return true;
};_proto.
instafilter=function instafilter(qType,fType,fId){
var buf=[];
var illegalBuf=[];
var legal=this.legalityFilter;
if(qType==='pokemon'){
switch(fType){
case'type':
var type=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',type+"-type Pok&eacute;mon"]);
for(var _id2 in BattlePokedex){
if(!BattlePokedex[_id2].types)continue;
if(this.dex.getTemplate(_id2).types.includes(type)){
(legal&&!(_id2 in legal)?illegalBuf:buf).push(['pokemon',_id2]);
}
}
break;
case'ability':
var ability=Dex.getAbility(fId).name;
buf.push(['header',ability+" Pok&eacute;mon"]);
for(var _id3 in BattlePokedex){
if(!BattlePokedex[_id3].abilities)continue;
if(Dex.hasAbility(this.dex.getTemplate(_id3),ability)){
(legal&&!(_id3 in legal)?illegalBuf:buf).push(['pokemon',_id3]);
}
}
break;}

}else if(qType==='move'){
switch(fType){
case'type':
var _type=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',_type+"-type moves"]);
for(var _id4 in BattleMovedex){
if(BattleMovedex[_id4].type===_type){
(legal&&!(_id4 in legal)?illegalBuf:buf).push(['move',_id4]);
}
}
break;
case'category':
var category=fId.charAt(0).toUpperCase()+fId.slice(1);
buf.push(['header',category+" moves"]);
for(var _id5 in BattleMovedex){
if(BattleMovedex[_id5].category===category){
(legal&&!(_id5 in legal)?illegalBuf:buf).push(['move',_id5]);
}
}
break;}

}
return buf.concat(illegalBuf);
};_proto.
addFilter=function addFilter(node){
if(!node.dataset.entry)return;
var entry=node.dataset.entry.split('|');var
type=entry[0];
if(this.qType==='pokemon'){
if(type===this.sortCol)this.sortCol=null;
if(!['type','move','ability','egggroup','tier'].includes(type))return;
if(type==='move')entry[1]=toID(entry[1]);
if(!this.filters)this.filters=[];
this.q=undefined;for(var _i=0,_this$filters=
this.filters;_i<_this$filters.length;_i++){var filter=_this$filters[_i];
if(filter[0]===type&&filter[1]===entry[1]){
return true;
}
}
this.filters.push(entry);
return true;
}else if(this.qType==='move'){
if(type===this.sortCol)this.sortCol=null;
if(!['type','category','pokemon'].includes(type))return;
if(type==='pokemon')entry[1]=toID(entry[1]);
if(!this.filters)this.filters=[];
this.filters.push(entry);
this.q=undefined;
return true;
}
};_proto.
removeFilter=function removeFilter(e){
if(!this.filters)return false;
if(e){
var deleted=null;
var filterid=e.currentTarget.value;

for(var i=0;i<this.filters.length;i++){
if(filterid===this.filters[i].join(':')){
deleted=this.filters[i];
this.filters.splice(i,1);
break;
}
}
if(!deleted)return false;
}else{
this.filters.pop();
}
if(!this.filters.length)this.filters=null;
this.q=undefined;
this.find('');
return true;
};_proto.
allPokemon=function allPokemon(){
if(this.filters||this.sortCol)return this.filteredPokemon();
var results=[['sortpokemon','']];
for(var _id6 in BattlePokedex){
switch(_id6){
case'bulbasaur':
results.push(['header',"Generation 1"]);
break;
case'chikorita':
results.push(['header',"Generation 2"]);
break;
case'treecko':
results.push(['header',"Generation 3"]);
break;
case'turtwig':
results.push(['header',"Generation 4"]);
break;
case'victini':
results.push(['header',"Generation 5"]);
break;
case'chespin':
results.push(['header',"Generation 6"]);
break;
case'rowlet':
results.push(['header',"Generation 7"]);
break;
case'grookey':
results.push(['header',"Generation 8"]);
break;
case'missingno':
results.push(['header',"Glitch"]);
break;
case'tomohawk':
results.push(['header',"CAP"]);
break;
case'pikachucosplay':
continue;}

results.push(['pokemon',_id6]);
}
this.results=results;
};_proto.
teambuilderPokemon=function teambuilderPokemon(format){
var requirePentagon=format==='battlespotsingles'||format==='battledoubles'||format.slice(0,3)==='vgc';
var isDoublesOrBS=this.isDoubles;

var table=BattleTeambuilderTable;
if(format.endsWith('cap')||format.endsWith('caplc')){

if(this.gen<8){
table=table['gen'+this.gen];
}
}else if(this.gen===7&&requirePentagon){
table=table['gen'+this.gen+'vgc'];
isDoublesOrBS=true;
}else if(table['gen'+this.gen+'doubles']&&!this.isLetsGo&&(
format.includes('doubles')||format.includes('vgc')||format.includes('triples')||
format.endsWith('lc')||format.endsWith('lcuu')))
{
table=table['gen'+this.gen+'doubles'];
isDoublesOrBS=true;
}else if(this.gen<8){
table=table['gen'+this.gen];
}else if(this.isLetsGo){
table=table['letsgo'];
}

if(!table.tierSet){
table.tierSet=table.tiers.map(function(r){
if(typeof r==='string')return['pokemon',r];
return[r[0],r[1]];
});
table.tiers=null;
}
var tierSet=table.tierSet;
var slices=table.formatSlices;
var agTierSet=[];
if(this.gen>=6)agTierSet=[['header',"AG"],['pokemon','rayquazamega']];
if(format==='ubers'||format==='uber')tierSet=tierSet.slice(slices.Uber);else
if(format==='vgc2017')tierSet=tierSet.slice(slices.Regular);else
if(format==='vgc2018')tierSet=tierSet.slice(slices.Regular);else
if(format.startsWith('vgc2019'))tierSet=tierSet.slice(slices["Restricted Legendary"]);else
if(format==='battlespotsingles')tierSet=tierSet.slice(slices.Regular);else
if(format==='battlespotdoubles')tierSet=tierSet.slice(slices.Regular);else
if(format==='ou')tierSet=tierSet.slice(slices.OU);else
if(format==='uu')tierSet=tierSet.slice(slices.UU);else
if(format==='ru')tierSet=tierSet.slice(slices.RU||slices.UU);else
if(format==='nu')tierSet=tierSet.slice(slices.NU);else
if(format==='pu')tierSet=tierSet.slice(slices.PU||slices.NU);else
if(format==='zu')tierSet=tierSet.slice(slices.ZU||slices.PU||slices.NU);else
if(format==='lc'||format==='lcuu')tierSet=tierSet.slice(slices.LC);else
if(format==='cap')tierSet=tierSet.slice(0,slices.Uber).concat(tierSet.slice(slices.OU));else
if(format==='caplc')tierSet=tierSet.slice(slices['CAP LC'],slices.Uber).concat(tierSet.slice(slices.LC));else
if(format.startsWith('lc')||format.endsWith('lc'))tierSet=tierSet.slice(slices["LC Uber"]);else
if(format==='anythinggoes'||format==='ag')tierSet=agTierSet.concat(tierSet.slice(slices.Uber));else
if(format==='balancedhackmons'||format==='bh')tierSet=agTierSet.concat(tierSet.slice(slices.Uber));else
if(format==='doublesou')tierSet=tierSet.slice(slices.DOU);else
if(format==='doublesuu')tierSet=tierSet.slice(slices.DUU);else
if(format==='doublesnu')tierSet=tierSet.slice(slices.DNU||slices.DUU);else
if(this.isLetsGo)tierSet=tierSet.slice(slices.Uber);else

if(!isDoublesOrBS){
tierSet=[].concat(
tierSet.slice(slices.OU,slices.UU),
agTierSet,
tierSet.slice(slices.Uber,slices.OU),
tierSet.slice(slices.UU));

}

if(format==='zu'&&this.gen>=7){
tierSet=tierSet.filter(function(r){
if(r[1]in table.zuBans)return false;
return true;
});
}

if(format==='vgc2016'){
tierSet=tierSet.filter(function(r){
var banned=[
'deoxys','deoxysattack','deoxysdefense','deoxysspeed','mew','celebi','shaymin','shayminsky','darkrai','victini','keldeo','keldeoresolute','meloetta','arceus','genesect','jirachi','manaphy','phione','hoopa','hoopaunbound','diancie','dianciemega'];

if(banned.includes(r[1])||r[1].substr(0,6)==='arceus')return false;
return true;
});
}

this.defaultResults=tierSet;
this.legalityLabel="Banned";
};_proto.
allMoves=function allMoves(){
if(this.filters||this.sortCol)return this.filteredMoves();
var results=[['sortmove','']];
results.push(['header',"Moves"]);
for(var _id7 in BattleMovedex){
switch(_id7){
case'paleowave':
results.push(['header',"CAP moves"]);
break;
case'magikarpsrevenge':
continue;}

results.push(['move',_id7]);
}
this.results=results;
};_proto.
teambuilderMoves=function teambuilderMoves(format,set){
var template=Dex.getTemplate(set.species);
var isBH=format==='balancedhackmons'||format==='bh';

var learnsetid=this.nextLearnsetid(template.id);
var moves=[];
var sMoves=[];
var sketch=false;
var gen=''+this.gen;
while(learnsetid){
var learnset=BattleTeambuilderTable.learnsets[learnsetid];
if(this.isLetsGo)learnset=BattleTeambuilderTable['letsgo'].learnsets[learnsetid];
if(learnset){
for(var moveid in learnset){
var learnsetEntry=learnset[moveid];



if(learnsetEntry.indexOf(gen)<0){
continue;
}
if(moves.indexOf(moveid)>=0)continue;
moves.push(moveid);
if(moveid==='sketch')sketch=true;
if(moveid==='hiddenpower'){
moves.push(
'hiddenpowerbug','hiddenpowerdark','hiddenpowerdragon','hiddenpowerelectric','hiddenpowerfighting','hiddenpowerfire','hiddenpowerflying','hiddenpowerghost','hiddenpowergrass','hiddenpowerground','hiddenpowerice','hiddenpowerpoison','hiddenpowerpsychic','hiddenpowerrock','hiddenpowersteel','hiddenpowerwater');

}
}
}
learnsetid=this.nextLearnsetid(learnsetid,template.id);
}
if(sketch||isBH){
if(isBH)moves=[];
for(var i in BattleMovedex){
if(i==='chatter'&&!isBH)continue;
if(i==='magikarpsrevenge')continue;
if(format.substr(0,3)!=='cap'&&(i==='paleowave'||i==='shadowstrike'))continue;
if(!BattleMovedex[i].gen){
if(BattleMovedex[i].num>=622){
BattleMovedex[i].gen=7;
}else if(BattleMovedex[i].num>=560){
BattleMovedex[i].gen=6;
}else if(BattleMovedex[i].num>=468){
BattleMovedex[i].gen=5;
}else if(BattleMovedex[i].num>=355){
BattleMovedex[i].gen=4;
}else if(BattleMovedex[i].num>=252){
BattleMovedex[i].gen=3;
}else if(BattleMovedex[i].num>=166){
BattleMovedex[i].gen=2;
}else if(BattleMovedex[i].num>=1){
BattleMovedex[i].gen=1;
}else{
BattleMovedex[i].gen=0;
}
}
if(BattleMovedex[i].gen>this.gen)continue;
if(BattleMovedex[i].isZ)continue;
if(isBH){
moves.push(i);
}else{
sMoves.push(i);
}
}
}
if(format==='stabmons'){
for(var _i2 in BattleMovedex){
var types=[];
var baseTemplate=Dex.getTemplate(template.baseSpecies);for(var _i3=0,_template$types=
template.types;_i3<_template$types.length;_i3++){var type=_template$types[_i3];
if(template.battleOnly)continue;
types.push(type);
}
if(template.prevo){
var prevoTemplate=Dex.getTemplate(template.prevo);for(var _i4=0,_prevoTemplate$types=
prevoTemplate.types;_i4<_prevoTemplate$types.length;_i4++){var _type2=_prevoTemplate$types[_i4];
types.push(_type2);
}
if(prevoTemplate.prevo){for(var _i5=0,_Dex$getTemplate$type=
Dex.getTemplate(prevoTemplate.prevo).types;_i5<_Dex$getTemplate$type.length;_i5++){var _type3=_Dex$getTemplate$type[_i5];
types.push(_type3);
}
}
}
if(template.battleOnly)template=baseTemplate;
if(baseTemplate.otherFormes&&baseTemplate.baseSpecies!=='Wormadam'){for(var _i6=0,_baseTemplate$types=
baseTemplate.types;_i6<_baseTemplate$types.length;_i6++){var _type4=_baseTemplate$types[_i6];
if(template.forme==='Alola'||template.forme==='Alola-Totem'){
continue;
}
types.push(_type4);
}for(var _i7=0,_baseTemplate$otherFo=
baseTemplate.otherFormes;_i7<_baseTemplate$otherFo.length;_i7++){var formeid=_baseTemplate$otherFo[_i7];
var forme=Dex.getTemplate(formeid);for(var _i8=0,_forme$types=
forme.types;_i8<_forme$types.length;_i8++){var _type5=_forme$types[_i8];
if(forme.battleOnly||forme.forme==='Alola'||forme.forme==='Alola-Totem'){
continue;
}
types.push(_type5);
}
}
}
if(types.indexOf(BattleMovedex[_i2].type)<0)continue;
if(moves.indexOf(_i2)>=0)continue;
if(!BattleMovedex[_i2].gen){
if(BattleMovedex[_i2].num>=622){
BattleMovedex[_i2].gen=7;
}else if(BattleMovedex[_i2].num>=560){
BattleMovedex[_i2].gen=6;
}else if(BattleMovedex[_i2].num>=468){
BattleMovedex[_i2].gen=5;
}else if(BattleMovedex[_i2].num>=355){
BattleMovedex[_i2].gen=4;
}else if(BattleMovedex[_i2].num>=252){
BattleMovedex[_i2].gen=3;
}else if(BattleMovedex[_i2].num>=166){
BattleMovedex[_i2].gen=2;
}else if(BattleMovedex[_i2].num>=1){
BattleMovedex[_i2].gen=1;
}else{
BattleMovedex[_i2].gen=0;
}
}
if(BattleMovedex[_i2].gen>this.gen)continue;
if(BattleMovedex[_i2].isZ||BattleMovedex[_i2].isNonstandard||BattleMovedex[_i2].isUnreleased)continue;
moves.push(_i2);
}
}

moves.sort();
sMoves.sort();

var usableMoves=[];
var uselessMoves=[];
var sketchedMoves=[];for(var _i9=0,_moves=
moves;_i9<_moves.length;_i9++){var _BattleMovedex$_id;var _id8=_moves[_i9];
var isViable=(_BattleMovedex$_id=BattleMovedex[_id8])==null?void 0:_BattleMovedex$_id.isViable;
if(_id8==='aerialace')isViable=['scyther','aerodactylmega','kricketune'].includes(toID(set.species));
if(_id8==='ancientpower'){
isViable=
toID(set.ability)==='technician'||toID(set.ability)==='serenegrace'||
template.types.includes('Rock')&&moves.includes('powergem');

}
if(_id8==='bellydrum')isViable=['azumarill','linoone','slurpuff'].includes(toID(set.species));
if(_id8==='blizzard')isViable=toID(set.ability)==='snowwarning';
if(_id8==='counter'){
isViable=['chansey','skarmory','clefable','wobbuffet','alakazam'].includes(toID(set.species));
}
if(_id8==='curse')isViable=toID(set.species)==='snorlax';
if(_id8==='drainingkiss')isViable=toID(set.ability)==='triage';
if(_id8==='dynamicpunch')isViable=toID(set.ability)==='noguard';
if(_id8==='electroball')isViable=toID(set.ability)==='surgesurfer';
if(_id8==='gyroball')isViable=template.baseStats.spe<=60;
if(_id8==='headbutt')isViable=toID(set.ability)==='serenegrace'&&template.types.includes('Normal');
if(_id8==='heartswap')isViable=toID(set.species)==='magearna';
if(_id8==='hiddenpowerelectric')isViable=!moves.includes('thunderbolt');
if(_id8==='hiddenpowerfighting')isViable=!moves.includes('aurasphere')&&!moves.includes('focusblast');
if(_id8==='hiddenpowerfire')isViable=!moves.includes('flamethrower');
if(_id8==='hiddenpowergrass')isViable=!moves.includes('energyball')&&!moves.includes('gigadrain');
if(_id8==='hiddenpowerice')isViable=!moves.includes('icebeam')&&template.id!=='xerneas';
if(_id8==='hypnosis'){
isViable=this.gen<4&&!moves.includes('sleeppowder')||toID(set.species)==='darkrai';
}
if(_id8==='icywind')isViable=toID(set.species).startsWith('keldeo');
if(_id8==='infestation')isViable=toID(set.species)==='shuckle';
if(_id8==='irontail'){
isViable=template.types.includes('Steel')&&moves.indexOf('ironhead')<0||

(template.types.includes('Dark')||template.types.includes('Dragon'))&&
!moves.includes('ironhead')&&!moves.indexOf('gunkshot');

}
if(_id8==='jumpkick')isViable=moves.indexOf('highjumpkick')<0;
if(_id8==='leechlife')isViable=this.gen>6;
if(_id8==='petaldance')isViable=toID(set.ability)==='owntempo';
if(_id8==='reflecttype')isViable=['latias','starmie'].includes(toID(set.species));
if(_id8==='rocktomb')isViable=toID(set.species)==='groudon'||toID(set.ability)==='technician';
if(_id8==='selfdestruct')isViable=this.gen<5&&moves.indexOf('explosion')<0;
if(_id8==='skyattack')isViable=toID(set.species)==='hawlucha';
if(_id8==='smackdown')isViable=template.types.indexOf('Ground')>0;
if(_id8==='smartstrike')isViable=template.types.indexOf('Steel')>0&&moves.indexOf('ironhead')<0;
if(_id8==='solarbeam')isViable=['drought','chlorophyll'].includes(toID(set.ability));
if(_id8==='stompingtantrum'){
isViable=
!moves.includes('earthquake')&&!moves.includes('drillrun')||
toID(set.ability)==='toughclaws'&&!moves.includes('drillrun')&&!moves.includes('earthquake');

}
if(_id8==='storedpower')isViable=['necrozma','espeon','sigilyph'].includes(toID(set.species));
if(_id8==='stunspore')isViable=moves.indexOf('thunderwave')<0;
if(_id8==='thunder'){
isViable=['drizzle','primordialsea'].includes(toID(set.ability))||toID(set.species)==='xerneas';
}
if(_id8==='trickroom')isViable=template.baseStats.spe<=100;
if(_id8==='waterpulse')isViable=toID(set.ability)==='megalauncher'&&moves.indexOf('originpulse')<0;
if(format==='mixandmega'){
if(_id8==='blizzard')isViable=toID(set.item)==='abomasite'||toID(set.item)==='pidgeotite';
if(_id8==='feint')isViable=toID(set.species)==='weavile';
if(_id8==='grasswhistle')isViable=toID(set.item)==='pidgeotite';
if(_id8==='hypnosis')isViable=toID(set.item)==='pidgeotite';
if(_id8==='inferno')isViable=toID(set.item)==='pidgeotite'&&!moves.includes('fireblast');
if(_id8==='sing')isViable=toID(set.item)==='pidgeotite';
if(_id8==='thunder')isViable=toID(set.item)==='pidgeotite'&&!moves.includes('zapcannon');
if(_id8==='waterpulse')isViable=toID(set.item)==='blastoisinite'&&!moves.includes('originpulse');
if(_id8==='weatherball')isViable=toID(set.item)==='redorb';
if(_id8==='zapcannon')isViable=toID(set.item)==='pidgeotite';
}
if(this.isLetsGo){
if(_id8==='megadrain')isViable=true;
}
if(this.gen===1){

if([
'acidarmor','amnesia','barrier','bind','clamp','confuseray','counter','firespin',
'hyperbeam','mirrormove','pinmissile','razorleaf','sing','slash','sludge',
'twineedle','wrap'].
includes(_id8)){
isViable=true;
}


if([
'disable','firepunch','icepunch','leechseed','quickattack','roar','thunderpunch',
'toxic','triattack','whirlwind'].
includes(_id8)){
isViable=false;
}


if(_id8==='bubblebeam')isViable=!moves.includes('surf')&&!moves.includes('blizzard');
if(_id8==='doubleedge')isViable=!moves.includes('bodyslam');
if(_id8==='doublekick')isViable=!moves.includes('submission');
if(_id8==='megadrain')isViable=!moves.includes('razorleaf')&&!moves.includes('surf');
if(_id8==='megakick')isViable=!moves.includes('hyperbeam');
if(_id8==='reflect')isViable=!moves.includes('barrier')&&!moves.includes('acidarmor');
if(_id8==='submission')isViable=!moves.includes('highjumpkick');
}
if(isViable){
if(!usableMoves.length)usableMoves.push(['header',"Moves"]);
usableMoves.push(['move',_id8]);
}else{
if(!uselessMoves.length)uselessMoves.push(['header',"Usually useless moves"]);
uselessMoves.push(['move',_id8]);
}
}for(var _i10=0;_i10<
sMoves.length;_i10++){var _id9=sMoves[_i10];
if(!sketchedMoves.length)sketchedMoves.push(['header',"Sketched moves"]);
sketchedMoves.push(['move',_id9]);
}
this.defaultResults=usableMoves.concat(uselessMoves).concat(sketchedMoves);
};_proto.
allTypes=function allTypes(results){
if(!results)results=[];
for(var _id10 in window.BattleTypeChart){
results.push(['type',_id10]);
}
this.results=results;
};_proto.
allAbilities=function allAbilities(results){
if(!results)results=[];
for(var _id11 in BattleAbilities){
results.push(['ability',_id11]);
}
this.results=results;
};_proto.
teambuilderAbilities=function teambuilderAbilities(format,set){
var isBH=format==='balancedhackmons'||format==='bh';
var template=this.dex.getTemplate(set.species);
var abilitySet=[['header',"Abilities"]];

if(template.isMega){
abilitySet.unshift(['html',"Will be <strong>"+template.abilities['0']+"</strong> after Mega Evolving."]);
template=this.dex.getTemplate(template.baseSpecies);
}
abilitySet.push(['ability',toID(template.abilities['0'])]);
if(template.abilities['1']){
abilitySet.push(['ability',toID(template.abilities['1'])]);
}
if(template.abilities['H']){
abilitySet.push(['header',"Hidden Ability"]);
abilitySet.push(['ability',toID(template.abilities['H'])]);
}
if(template.abilities['S']){
abilitySet.push(['header',"Special Event Ability"]);
abilitySet.push(['ability',toID(template.abilities['S'])]);
}
if(format==='almostanyability'||isBH){
template=Dex.getTemplate(set.species);
var abilities=[];
if(template.isMega){
if(format==='almostanyability'){
abilitySet.unshift(['html',"Will be <strong>"+template.abilities['0']+"</strong> after Mega Evolving."]);
}

}
for(var i in BattleAbilities){
if(BattleAbilities[i].isNonstandard)continue;
if(BattleAbilities[i].gen>this.gen)continue;
abilities.push(i);
}

abilities.sort();

var goodAbilities=[['header',"Abilities"]];
var poorAbilities=[['header',"Situational Abilities"]];
var badAbilities=[['header',"Unviable Abilities"]];for(var _i11=0;_i11<
abilities.length;_i11++){var _BattleAbilities$_id;var _id12=abilities[_i11];
var rating=(_BattleAbilities$_id=BattleAbilities[_id12])==null?void 0:_BattleAbilities$_id.rating;
if(_id12==='normalize')rating=3;
if(rating>=3){
goodAbilities.push(['ability',_id12]);
}else if(rating>=2){
poorAbilities.push(['ability',_id12]);
}else{
badAbilities.push(['ability',_id12]);
}
}
abilitySet=goodAbilities.concat(poorAbilities).concat(badAbilities);
}
this.defaultResults=abilitySet;
};_proto.
allCategories=function allCategories(results){
if(!results)results=[];
results.push(['category','physical']);
results.push(['category','special']);
results.push(['category','status']);
this.results=results;
};_proto.
getTier=function getTier(pokemon){
if(!this.isDoubles)return pokemon.tier;
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
filteredPokemon=function filteredPokemon(){
var results=[];
var filters=this.filters||[];
var sortCol=this.sortCol;

this.results=[['sortpokemon','']];
if(filters.length){
this.results.push(['header',"Filtered results"]);
}
if(sortCol==='type'){
return this.allTypes(this.results);
}else if(sortCol==='ability'){
return this.allAbilities(this.results);
}

var illegalresults=[];
var genChar=''+this.gen;
var i;
for(var _id13 in BattlePokedex){
var template=this.dex.getTemplate(_id13);
if(template.exists===false)continue;
for(i=0;i<filters.length;i++){
if(filters[i][0]==='type'){
var type=filters[i][1];
if(template.types[0]!==type&&template.types[1]!==type)break;
}else if(filters[i][0]==='egggroup'){
var egggroup=filters[i][1];
if(!template.eggGroups)continue;
if(template.eggGroups[0]!==egggroup&&template.eggGroups[1]!==egggroup)break;
}else if(filters[i][0]==='tier'){
var tier=filters[i][1];
if(this.getTier(template)!==tier)break;
}else if(filters[i][0]==='ability'){
var ability=filters[i][1];
if(!Dex.hasAbility(template,ability))break;
}else if(filters[i][0]==='move'){
var learned=false;
var learnsetid=this.nextLearnsetid(_id13);
while(learnsetid){
var learnset=BattleTeambuilderTable.learnsets[learnsetid];
if(learnset&&filters[i][1]in learnset&&learnset[filters[i][1]].indexOf(genChar)>=0){
learned=true;
break;
}
learnsetid=this.nextLearnsetid(learnsetid,_id13);
}
if(!learned)break;
}
}
if(i<filters.length)continue;
if(this.legalityFilter&&!(_id13 in this.legalityFilter)){
if(!sortCol)illegalresults.push(['pokemon',_id13]);
}else{
results.push(['pokemon',_id13]);
}
}
if(['hp','atk','def','spa','spd','spe'].includes(sortCol)){
results=results.sort(function(row1,row2){
var stat1=BattlePokedex[row1[1]].baseStats[sortCol];
var stat2=BattlePokedex[row2[1]].baseStats[sortCol];
return stat2-stat1;
});
}else if(sortCol==='bst'){
results=results.sort(function(row1,row2){
var base1=BattlePokedex[row1[1]].baseStats;
var base2=BattlePokedex[row2[1]].baseStats;
var bst1=base1.hp+base1.atk+base1.def+base1.spa+base1.spd+base1.spe;
var bst2=base2.hp+base2.atk+base2.def+base2.spa+base2.spd+base2.spe;
return bst2-bst1;
});
}else if(sortCol==='name'){
results=results.sort(function(row1,row2){
var name1=row1[1];
var name2=row2[1];
return name1<name2?-1:name1>name2?1:0;
});
}
this.results=this.results.concat(results,illegalresults);
};_proto.
nextLearnsetid=function nextLearnsetid(learnsetid,speciesid){
if(!speciesid){
if(learnsetid in BattleTeambuilderTable.learnsets)return learnsetid;
var baseLearnsetid=BattlePokedex[learnsetid]&&toID(BattlePokedex[learnsetid].baseSpecies);
if(!baseLearnsetid){
baseLearnsetid=toID(BattleAliases[learnsetid]);
}
if(baseLearnsetid in BattleTeambuilderTable.learnsets)return baseLearnsetid;
return'';
}

if(learnsetid==='lycanrocdusk'||speciesid==='rockruff'&&learnsetid==='rockruff'){
return'rockruffdusk';
}
var template=BattlePokedex[learnsetid];
if(!template)return'';
if(template.prevo)return template.prevo;
var baseSpecies=template.baseSpecies;
if(baseSpecies!==template.species&&(baseSpecies==='Rotom'||baseSpecies==='Pumpkaboo')){
return toID(template.baseSpecies);
}
return'';
};_proto.
filteredMoves=function filteredMoves(){
var results=[];
var filters=this.filters||[];
var sortCol=this.sortCol;

this.results=[['sortmove','']];
if(filters.length){
this.results.push(['header',"Filtered results"]);
}
if(sortCol==='type'){
return this.allTypes(this.results);
}else if(sortCol==='category'){
return this.allCategories(this.results);
}

var illegalresults=[];
for(var _id14 in BattleMovedex){
var move=BattleMovedex[_id14];
if(move.exists===false)continue;
var i=void 0;
for(i=0;i<filters.length;i++){
if(filters[i][0]==='type'){
if(move.type!==filters[i][1])break;
}else if(filters[i][0]==='category'){
if(move.category!==filters[i][1])break;
}else if(filters[i][0]==='pokemon'){
var learned=false;
var speciesid=filters[i][1];
var learnsetid=this.nextLearnsetid(speciesid);
while(learnsetid){
var learnset=BattleTeambuilderTable.learnsets[learnsetid];
if(learnset&&_id14 in learnset){
learned=true;
break;
}
learnsetid=this.nextLearnsetid(learnsetid,speciesid);
}
if(!learned)break;
}
}
if(i<filters.length)continue;
if(this.legalityFilter&&!(_id14 in this.legalityFilter)){
if(!sortCol)illegalresults.push(['move',_id14]);
}else{
results.push(['move',_id14]);
}
}
if(sortCol==='power'){
var powerTable={
"return":102,frustration:102,spitup:300,trumpcard:200,naturalgift:80,grassknot:120,
lowkick:120,gyroball:150,electroball:150,flail:200,reversal:200,present:120,
wringout:120,crushgrip:120,heatcrash:120,heavyslam:120,fling:130,magnitude:150,
beatup:24,punishment:1020,psywave:1250,nightshade:1200,seismictoss:1200,
dragonrage:1140,sonicboom:1120,superfang:1350,endeavor:1399,sheercold:1501,
fissure:1500,horndrill:1500,guillotine:1500};

results=results.sort(function(row1,row2){
var move1=BattleMovedex[row1[1]];
var move2=BattleMovedex[row2[1]];
var pow1=move1.basePower||powerTable[row1[1]]||(move1.category==='Status'?-1:1400);
var pow2=move2.basePower||powerTable[row2[1]]||(move2.category==='Status'?-1:1400);
return pow2-pow1;
});
}else if(sortCol==='accuracy'){
results=results.sort(function(row1,row2){
var accuracy1=BattleMovedex[row1[1]].accuracy||0;
var accuracy2=BattleMovedex[row2[1]].accuracy||0;
if(accuracy1===true)accuracy1=101;
if(accuracy2===true)accuracy2=101;
return accuracy2-accuracy1;
});
}else if(sortCol==='pp'){
results=results.sort(function(row1,row2){
var pp1=BattleMovedex[row1[1]].pp||0;
var pp2=BattleMovedex[row2[1]].pp||0;
return pp2-pp1;
});
}
this.results=this.results.concat(results,illegalresults);
};_proto.
setType=function setType(qType){var format=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var set=arguments.length>2?arguments[2]:undefined;var cur=arguments.length>3&&arguments[3]!==undefined?arguments[3]:[];
if(this.qType!==qType){
this.filters=null;
this.sortCol=null;
}
this.qType=qType;
this.q=undefined;
this.cur=cur;
this.legalityFilter={};
this.legalityLabel="Illegal";
this.gen=6;
if(format.slice(0,3)==='gen'){
this.gen=Number(format.charAt(3))||6;
format=format.slice(4);
this.dex=Dex.forGen(this.gen);
}else if(!format){
this.gen=7;
this.dex=Dex;
}

this.isDoubles=format.includes('doubles');
this.isLetsGo=format.startsWith('letsgo');
if(this.isLetsGo)format=format.slice(6);

this.results=null;
this.defaultResults=null;

if(!qType||!set)return;

switch(qType){
case'pokemon':
this.teambuilderPokemon(format);
break;

case'item':
var table=BattleTeambuilderTable;
if(this.gen<8)table=table['gen'+this.gen];
if(!table.itemSet){
table.itemSet=table.items.map(function(r){
if(typeof r==='string')return['item',r];
return[r[0],r[1]];
});
table.items=null;
}
this.defaultResults=table.itemSet;
break;

case'ability':
this.teambuilderAbilities(format,set);
break;

case'move':
this.teambuilderMoves(format,set);
break;}


if(cur.length&&cur[0]){
this.defaultResults=[[qType,cur[0]]].concat(this.defaultResults||[]);
}
if(qType==='pokemon'){
this.defaultResults=[['sortpokemon','']].concat(this.defaultResults||[]);
}
if(qType==='move'){
this.defaultResults=[['sortmove','']].concat(this.defaultResults||[]);
}

if(this.legalityFilter&&this.defaultResults){for(var _i12=0,_this$defaultResults=
this.defaultResults;_i12<_this$defaultResults.length;_i12++){var _ref=_this$defaultResults[_i12];var type=_ref[0];var _id15=_ref[1];
if(type!=='header'){
this.legalityFilter[_id15]=1;
}
}
}
};BattleSearch.

getClosest=function getClosest(query){

var left=0;
var right=BattleSearchIndex.length-1;
while(right>left){
var mid=Math.floor((right-left)/2+left);
if(BattleSearchIndex[mid][0]===query&&(mid===0||BattleSearchIndex[mid-1][0]!==query)){

return mid;
}else if(BattleSearchIndex[mid][0]<query){
left=mid+1;
}else{
right=mid-1;
}
}
if(left>=BattleSearchIndex.length-1)left=BattleSearchIndex.length-1;else
if(BattleSearchIndex[left+1][0]&&BattleSearchIndex[left][0]<query)left++;
if(left&&BattleSearchIndex[left-1][0]===query)left--;
return left;
};return BattleSearch;}();BattleSearch.gen=8;BattleSearch.typeTable={pokemon:1,type:2,tier:3,move:4,item:5,ability:6,egggroup:7,category:8,article:9};BattleSearch.typeName={pokemon:'Pok&eacute;mon',type:'Type',tier:'Tiers',move:'Moves',item:'Items',ability:'Abilities',egggroup:'Egg group',category:'Category',article:'Article'};