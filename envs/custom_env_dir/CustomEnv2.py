import gym
from gym import error, spaces, utils
from gym.utils import seeding
import random
import numpy as np
import json
from envs.Agent2 import Agent
from envs.utils2 import Utils as u
import torch


class PokemonEnv(gym.Env):
    metadata = {'render.modes': ['human']}

    def __init__(self):
        super(PokemonEnv, self).__init__()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.action_space = spaces.Discrete(13)
        self.action_space = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        self.observation_space = np.zeros(shape=(264, 1), dtype=np.float)
        self.observation_space = torch.from_numpy(self.observation_space)
        self.player = Agent()
        self.room = ""
        self.reward = 0
        self.isDone = False

    def step(self, move):
        self.action(move)
        self.getGamestate()
        self.reward = self.player.reward
        self.player.reward = 0
        return self.observation_space, torch.tensor([self.reward]), self.isDone

    def action(self, choice):
        if choice == 0:
            self.player.move(self.room, "|/move 1")
        elif choice == 1:
            self.player.move(self.room, "|/move 2")
        elif choice == 2:
            self.player.move(self.room, "|/move 3")
        elif choice == 3:
            self.player.move(self.room, "|/move 4")
        elif choice == 4:
            self.player.move(self.room, "|/switch 2")
        elif choice == 5:
            self.player.move(self.room, "|/switch 3")
        elif choice == 6:
            self.player.move(self.room, "|/switch 4")
        elif choice == 7:
            self.player.move(self.room, "|/switch 5")
        elif choice == 8:
            self.player.move(self.room, "|/switch 6")
        elif choice == 9:
            self.player.move(self.room, "|/choose move 1 dynamax")
        elif choice == 10:
            self.player.move(self.room, "|/choose move 2 dynamax")
        elif choice == 11:
            self.player.move(self.room, "|/choose move 3 dynamax")
        elif choice == 12:
            self.player.move(self.room, "|/choose move 4 dynamax")
        else:
            pass

        if self.player.isDone:
            self.isDone = True

    def randomAction(self, choice):
        if self.player.switch:
            choice = random.randint(4, 8)
            self.player.switch = False
        if choice == 0:
            self.player.move(self.room, "|/move 1")
        elif choice == 1:
            self.player.move(self.room, "|/move 2")
        elif choice == 2:
            self.player.move(self.room, "|/move 3")
        elif choice == 3:
            self.player.move(self.room, "|/move 4")
        elif choice == 4:
            self.player.move(self.room, "|/switch 2")
        elif choice == 5:
            self.player.move(self.room, "|/switch 3")
        elif choice == 6:
            self.player.move(self.room, "|/switch 4")
        elif choice == 7:
            self.player.move(self.room, "|/switch 5")
        elif choice == 8:
            self.player.move(self.room, "|/switch 6")
        elif choice == 9:
            self.player.move(self.room, "|/choose move 1 dynamax")
        elif choice == 10:
            self.player.move(self.room, "|/choose move 2 dynamax")
        elif choice == 11:
            self.player.move(self.room, "|/choose move 3 dynamax")
        elif choice == 12:
            self.player.move(self.room, "|/choose move 4 dynamax")
        else:
            pass

    def reset(self):
        if self.room != "":
            self.player.ws.send(self.room + "|/leave")
        self.room = self.player.challenge("RLShowdownBot")
        self.reward = 0
        self.isDone = False
        self.player.isDone = False
        while not self.player.isGameStarted:
            pass

    def render(self, mode='human', close=False):
        pass

    def getGamestate(self):
        x = self.player.getGameState()
        x.decode('utf-8')
        x = json.loads(x)
        ar = []
        for i in range(0, len(x)):
            ar.append(x[i]["species"] / 1500)
        if len(ar) < 12:
            for i in range(12 - len(ar)):
                ar.append(0)
        else:
            pass
        pokemonids = np.array(ar).ravel()
        pokemonids = pokemonids.tolist()

        # print(pokemonids)
        types = []
        for i in range(0, len(x)):
            types.append(x[i]["type"])
        for i in types:
            if len(i) < 2:
                i.append(0)
            else:
                pass
        if len(types) < 12:
            for i in range(12 - len(types)):
                temp = [0, 0]
                types.append(temp)

        types = np.array(types).ravel()
        typesarray = []

        for i in types.flat:
            typesarray.append(u.typeid[str(i).lower()] / 19)
        typesarray = np.array(typesarray).ravel()
        typesarray = typesarray.tolist()
        # typesarray = list(typesarray)
        # print(typesarray)

        statusEffects = []
        for i in range(0, len(x)):
            statusEffects.append(u.status[x[i]["statusEffect"]] / 7)
        if len(statusEffects) < 12:
            for i in range(12 - len(statusEffects)):
                statusEffects.append(0)
        statusEffects = np.array(statusEffects)
        statusEffects = statusEffects.ravel()
        statusEffects = statusEffects.tolist()
        # print(statusEffects)

        hp = []
        for i in range(0, len(x)):
            hp.append(round(float(x[i]["hp"]), 3))
        if len(hp) < 12:
            for i in range(12 - len(hp)):
                hp.append(round(1 / 1, 3))
        hp = np.array(hp).ravel()
        hp = hp.tolist()
        # print(hp)

        moves = []
        teammoves = []
        for i in range(0, 6):
            moves.append(x[i]["move1"])
            moves.append(x[i]["move1Type"])
            moves.append(x[i]["move1power"])
            moves.append(x[i]["move2"])
            moves.append(x[i]["move2Type"])
            moves.append(x[i]["move2power"])
            moves.append(x[i]["move3"])
            moves.append(x[i]["move3Type"])
            moves.append(x[i]["move3power"])
            moves.append(x[i]["move4"])
            moves.append(x[i]["move4Type"])
            moves.append(x[i]["move4power"])
            teammoves.append(moves)
            moves = []
        for i in range(0, 6):
            teammoves.append([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        moveids = []

        for i in range(0, 6):
            teammoves[i][0] = u.moves(teammoves[i][0]) / 1000
            teammoves[i][3] = u.moves(teammoves[i][3]) / 1000
            teammoves[i][6] = u.moves(teammoves[i][6]) / 1000
            teammoves[i][9] = u.moves(teammoves[i][9]) / 1000
            teammoves[i][1] = u.typeid[str(teammoves[i][1]).lower()] / 19
            teammoves[i][4] = u.typeid[str(teammoves[i][4]).lower()] / 19
            teammoves[i][7] = u.typeid[str(teammoves[i][7]).lower()] / 19
            teammoves[i][10] = u.typeid[str(teammoves[i][10]).lower()] / 19
            teammoves[i][2] = teammoves[i][2] / 250
            teammoves[i][5] = teammoves[i][5] / 250
            teammoves[i][8] = teammoves[i][8] / 250
            teammoves[i][11] = teammoves[i][11] / 250

        # print(teammoves)
        teammoves = np.array(teammoves).ravel()
        teammoves = teammoves.tolist()
        boosts = []

        for i in range(0, len(x)):
            temp = [0, 0, 0, 0, 0]
            getBoost = x[i]["boosts"]
            if "atk" in getBoost:
                temp[0] = getBoost["atk"] / 6
            if "def" in getBoost:
                temp[1] = getBoost["def"] / 6
            if "spa" in getBoost:
                temp[2] = getBoost["spa"] / 6
            if "spd" in getBoost:
                temp[3] = getBoost["spd"] / 6
            if "spe" in getBoost:
                temp[4] = getBoost["spe"] / 6
            boosts.append(temp)
        if len(boosts) < 12:
            for i in range(12 - len(boosts)):
                boosts.append([0, 0, 0, 0, 0])
        boosts = np.array(boosts).ravel()
        boosts = boosts.tolist()
        # print(boosts)
        obs = pokemonids + typesarray + hp + statusEffects + boosts + teammoves
        obs = np.array([obs], dtype="float")
        obs = torch.from_numpy(obs)
        self.observation_space = obs

    def closeClient(self):
        self.player.close = True

