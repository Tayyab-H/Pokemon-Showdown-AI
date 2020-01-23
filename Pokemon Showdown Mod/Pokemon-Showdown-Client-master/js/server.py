
from flask import Flask, request
import requests

app = Flask(__name__)

@app.route("/")
def main():
	return "Please Change this"


if __name__ == "__main__":
	app.run(debug=False, host="127.0.0.1", port=80)


@app.route('/postmethod', methods=['POST', 'GET'])
def get_post():
	data =  'Please Change This'
	if request.method == 'POST':
		data="IT POSTED"
		return data
	else:
		return data
