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
        self.close = False

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
            #print(x)
            if ">" in x[0] and "init|" in x[1]:
                x = x[0]
                room = x[1:]
                break
        self.__battle(x)
        self.isGameStarted = True
        return room

    def move(self, currentRoom, move):
        x = str(self.q.get())
        if x.__contains__("turn|"):
            self.ws.send(str(currentRoom) + str(move))
        if "invalid" in x or "Invalid" in x or "Unavailable" in x:
            self.ws.send(str(currentRoom) + str(move))
            self.reward -= 5
        elif "faint|" in x:
            self.ws.send(str(currentRoom) + str(move))
        else:
            while "faint|" not in x and "invalid" not in x and "Invalid" not in x and "turn|" not in x and "Unavailable" not in x and '{"forceSwitch":[true]' not in x:
                x = str(self.q.get())
            self.ws.send(str(currentRoom) + str(move))


    def getResponse(self):
        while True:
            x = self.ws.recv()
            self.q.put(x)
            if "|request|" in x and "{" in x:
                x = x[x.find("{"):x.rfind("}") + 1]
                self.gameState = x
            elif "faint|p1" in x:
                self.reward = self.reward - 10
                self.switch = True
            if "-damage|p2" in x or ("-boost|p1" in x and "faint|p1" not in x):
                self.reward = self.reward + 2
            if "faint|p2" in x:
                self.reward = self.reward + 50
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
            if "win|RLShowdownBot" in x:
                self.reward += 200
                self.isDone = True
            if "win|" in x and "RLShowdownBot" not in x:
                self.reward -= 100
                self.isDone = True
            if "Unavailable choice" in x:
                self.reward -= 5

    def getGameState(self):
        if self.close:
            return
        time.sleep(1)
        try:
            with open("gamestate.pickle", "rb") as file:
                g = pickle.load(file)
            return g
        except EOFError:
            time.sleep(0.5)
            g = self.getGameState()
            print("CAUGHT")
            return g

