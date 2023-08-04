from flask import Flask, request
import requests
import json
import gym
import multiprocessing
import pickle

#hosts a server that can be used to send data to the model from the pokemon showdown client
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
    array = []
    if request.method == 'POST':
        data = request.data
        dataJSON = json.loads(data)
        print(data)
        for i in range(len(dataJSON)):
            current = dataJSON[i]
            print(current["hp"])
        # open("gamestate.pickle", 'w').close()
        with open("gamestate.pickle", "wb") as f:
            pickle.dump(data, f)
        return data
    if request.method == 'GET':
        return data


@app.route('/postmethod2', methods=['POST', 'GET'])
def get_post2():
    data = 'Please Change This'
    if request.method == 'POST':
        data = request.data
        # data = json.load(data)
        print(data)
        # open("gamestate.pickle", 'w').close()
        with open("gamestate2.pickle", "wb") as f:
            pickle.dump(data, f)
        return data
    if request.method == 'GET':
        return data


if __name__ == "__main__":
    app.run(debug=False, host="127.0.0.1", port=80)
