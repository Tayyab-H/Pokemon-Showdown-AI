 function send(data){
	 var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;
	 var xhr = new XMLHttpRequest();
	 xhr.open("POST", 'http://127.0.0.1/postmethod', true);
	 xhr.setRequestHeader('Content-Type', 'text/html; charset=utf-8');
	 xhr.send(data);
 }

 let x = {name:"Tayyab"};
 z = JSON.stringify(x);
 send(z);
