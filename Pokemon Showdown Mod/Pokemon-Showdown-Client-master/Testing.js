var xhr = new XMLHttpRequest();
xhr.open("POST", '127.0.0.1:80', true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({
	value: 'POSSSTTT MEEEEE'
}));
