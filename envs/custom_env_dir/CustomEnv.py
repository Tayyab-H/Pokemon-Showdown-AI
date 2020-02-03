import gym
from gym import error, spaces, utils
from gym.utils import seeding
import ssl
import websocket

class PokemonEnv(gym.Env):
    metadata = {'render.modes': ['human']}

    def __init__(self):
        super(PokemonEnv, self).__init__()
        self.action_space = spaces.Discrete(9)
        self.observation_space = spaces.box()
        ws = websocket.WebSocket()
        ws.connect("ws://sim.smogon.com:8000/showdown/websocket")


    def step(self, action):
        pass

    def action(self, choice, ws):
        if choice == 0:
            ws.send("|/move 1")
        elif choice == 1:
            ws.send("|/move 2")
        elif choice == 2:
            ws.send("|/move 3")
        elif choice == 3:
            ws.send("|/move 4")
        elif choice == 4:
            ws.send("|/move dynamax")
        elif choice == 5:
            ws.send("|/switch 2")
        elif choice == 6:
            ws.send("|/switch 3")
        elif choice == 6:
            ws.send("|/switch 4")
        elif choice == 6:
            ws.send("|/switch 5")
        else:
            ws.send("|/switch 6")


    def reset(self, ws):
        ws.send("|/challenge blobbywob, gen8randombattle")

    def render(self, mode='human', close=False):
        pass
