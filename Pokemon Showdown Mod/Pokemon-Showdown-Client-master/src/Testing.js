	fetch('http://127.0.0.1/postmethod', {
	method: 'POST', // or 'PUT'
	headers: {
		'Content-Type': 'text/plain',
	},
	body: "Possting Data",
})
	.then((response) => response.json())
	.then((data) => {
		console.log('Success:', data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
