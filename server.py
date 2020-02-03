from flask import Flask, request
import requests

app = Flask(__name__)


@app.route("/")
def main():
	return "Please Change this"

@app.route('/postmethod', methods=['POST', 'GET'])
def get_post():
	data = 'Please Change This'
	if request.method == 'POST':
		data = request.data
		print(data)
		return data
	if request.method == 'GET':
		return data

if __name__ == "__main__":
	app.run(debug=False, host="127.0.0.1", port=80)



def createGameState(data):
	pass