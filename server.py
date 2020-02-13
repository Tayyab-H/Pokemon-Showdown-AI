from flask import Flask, request
import requests
import json
import gym
import multiprocessing
import pickle
app = Flask(__name__)


def createGameState(data):
	# json.load(data)
	x = json.loads(data.decode('utf-8'))


@app.route("/")
def main():
	return "Please Change this"


@app.route('/postmethod', methods=['POST', 'GET'])
def get_post():
	data = 'Please Change This'
	if request.method == 'POST':
		data = request.data
		print(data)
		with open("gamestate.pickle","wb") as f:
			pickle.dump(data, f)
		return data
	if request.method == 'GET':
		return data


if __name__ == "__main__":
	app.run(debug=False, host="127.0.0.1", port=80)
