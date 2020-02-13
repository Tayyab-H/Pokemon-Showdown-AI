import ssl
import websocket
import requests
import json
import threading
from queue import Queue
import numpy as np
import pickle


class Agent:
    def __init__(self):
        self.login()
        self.q = Queue()
        self.gameState = ""
        self.PokemonMemory = {}
        self.moveMemory = {}
        self.isGameStarted = False
        self.switch = False

    def login(self):
        self.ws = websocket.WebSocket()
        data = self.ws.connect("ws://sim.smogon.com:8000/showdown/websocket")
        url = "http://play.pokemonshowdown.com/action.php"
        x = ""
        x += self.ws.recv()
        x += self.ws.recv()
        challstr = x.split("|")
        challstr.reverse()
        challstr, key = challstr[0], challstr[1]
        challstr = key + "|" + challstr
        string = '{"act":"login","name":"rlshowdownbot","pass":"throwawaypass",' + '"challstr":' + '"' + challstr + '"' + '}'
        js = json.loads(string)
        r = requests.post("http://play.pokemonshowdown.com/action.php?", js)
        r = r.content[1:]
        r = json.loads(r)
        assertion = r["assertion"]
        self.ws.send("|/trn rlshowdownbot,0," + assertion)
        print(self.ws.recv())
        print(self.ws.recv())
        print(self.ws.recv())
        print(self.ws.recv())

    def __battle(self, x):
        print("Battle Started with string: \n" + x)

    def challenge(self, name):
        t = threading.Thread(target=self.getResponse)
        t.start()
        self.ws.send("|/challenge " + name + ", gen8randombattle")
        x = "initial string"
        while x != "":
            x = self.q.get()
            x = x.split("\n")
            x = x[0]
            # print(x)
            if ">" in x:
                room = x[1:]
                break
        self.__battle(x)
        self.isGameStarted = True
        return room

    def randomMove(self, currentRoom, move):
        x = self.q.get()
        if "turn" in x or "invalid" in x or "Invalid" in x:
            self.ws.send(str(currentRoom) + str(move))
        else:
            pass

    def getResponse(self):
        while True:
            x = self.ws.recv()
            print(x)
            self.q.put(x)
            if "|request|" in x and "{" in x:
                x = x[x.find("{"):x.rfind("}") + 1]
                # print(x)
                self.gameState = x
            elif "faint|p1" in x:
                self.switch = True

    def getGameState(self):
        with open("gamestate.pickle", "rb") as file:
            g = pickle.load(file)
        return g
