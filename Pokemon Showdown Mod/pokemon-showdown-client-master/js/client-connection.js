/**
 * Connection library
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */var



PSConnection=function(){



function PSConnection(){this.socket=null;this.connected=false;this.queue=[];
this.connect();
}var _proto=PSConnection.prototype;_proto.
connect=function connect(){var _this=this;
var server=PS.server;
var port=server.protocol==='https'?'':':'+server.port;
var url=server.protocol+'://'+server.host+port+server.prefix;
var socket=this.socket=new SockJS(url,[],{timeout:5*60*1000});
socket.onopen=function(){
console.log("\u2705 (CONNECTED)");
_this.connected=true;
PS.connected=true;for(var _i=0,_this$queue=
_this.queue;_i<_this$queue.length;_i++){var msg=_this$queue[_i];socket.send(msg);}
_this.queue=[];
PS.update();
};
socket.onmessage=function(e){
PS.receive(''+e.data);
};
socket.onclose=function(){
console.log("\u2705 (DISCONNECTED)");
_this.connected=false;
PS.connected=false;
PS.isOffline=true;
for(var roomid in PS.rooms){
PS.rooms[roomid].connected=false;
}
_this.socket=null;
PS.update();
};
};_proto.
send=function send(msg){
if(!this.connected){
this.queue.push(msg);
return;
}
this.socket.send(msg);
};return PSConnection;}();


PS.connection=new PSConnection();

var PSLoginServer=new(function(){function _class(){}var _proto2=_class.prototype;_proto2.
query=function query(data,callback){
var url='/~~'+PS.server.id+'/action.php';
if(location.pathname.endsWith('.html')){
url='https://play.pokemonshowdown.com'+url;

if(typeof POKEMON_SHOWDOWN_TESTCLIENT_KEY==='string'){

data.sid=POKEMON_SHOWDOWN_TESTCLIENT_KEY.replace(/\%2C/g,',');
}
}
this.request(url,data,function(res){
if(!res)callback(null);else
callback(JSON.parse(res.slice(1)));
});
};_proto2.
request=function request(url,data,callback){
var xhr=new XMLHttpRequest();
xhr.open(data?'POST':'GET',url);
xhr.onreadystatechange=function(){
if(xhr.readyState===4){
try{
callback(xhr.responseText||null);
}catch(_unused){
callback(null);
}
}
};
if(data){
var urlencodedData='';
for(var key in data){
if(urlencodedData)urlencodedData+='&';
urlencodedData+=encodeURIComponent(key)+'='+encodeURIComponent(data[key]);
}
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send(urlencodedData);
}else{
xhr.send();
}
};return _class;}())();