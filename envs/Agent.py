import ssl
import websocket
import requests
import json
import threading
from queue import Queue
import pickle
import time


class Agent:
    def __init__(self):
        self.login()
        self.q = Queue()
        self.gameState = ""
        self.PokemonMemory = {}
        self.moveMemory = {}
        self.isGameStarted = False
        self.switch = False
        self.reward = 0
        self.isDone = False

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
        t = threading.Thread(target=self.getResponse)
        t.start()

    def __battle(self, x):
        print("Battle Started with string: \n" + x)

    def challenge(self, name):
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

    def move(self, currentRoom, move):
        x = self.q.get()
        if "turn" in x or "invalid" in x or "Invalid" in x:
            self.ws.send(str(currentRoom) + str(move))
            self.reward -= 1
        elif "faint|p1" in x:
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
                self.reward = self.reward - 10
                self.switch = True
            if "-damage|p2" in x or ("-boost|p1" in x and "faint|p1" not in x):
                self.reward = self.reward + 2
            if "faint|p2" in x:
                self.reward = self.reward + 10
            if "-supereffective|p2" in x:
                self.reward = self.reward + 4
            if "-supereffective|p1" in x:
                self.reward = self.reward - 4
            if "-resisted|p1" in x:
                self.reward = self.reward + 4
            if "-resisted|p2" in x:
                self.reward = self.reward - 4
            if "|-immune|p1" in x:
                self.reward = self.reward + 5
            if "win|rlshowdownbot" in x:
                pass

    #                self.reward = self.reward + 20

    def getGameState(self):
        time.sleep(2)
        with open("gamestate.pickle", "rb") as file:
            g = pickle.load(file)
        return g
