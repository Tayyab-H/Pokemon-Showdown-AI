import gym
from gym import error, spaces, utils
from gym.utils import seeding
import random
import numpy as np
import json
from envs.Agent import Agent
from envs.utils import Utils as u


class PokemonEnv(gym.Env):
    metadata = {'render.modes': ['human']}

    def __init__(self):
        super(PokemonEnv, self).__init__()
        self.action_space = spaces.Discrete(13)
        self.action_space = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        self.observation_space = gym.spaces.Box(high=1, low=-1, shape=(12, 6))
        self.player = Agent()
        self.room = ""
        self.reward = 0
        self.isDone = False
        self.reset()

    def step(self):
        self.randomAction(random.randint(0, 12))
        self.getGamestate()
        self.reward += self.player.reward
        self.player.reward = 0
        return self.observation_space, self.reward, self.isDone

    def action(self, choice):
        if choice == 0:
            self.player.randomMove(self.room, "|/move 1")
        elif choice == 1:
            self.player.randomMove(self.room, "|/move 2")
        elif choice == 2:
            self.player.randomMove(self.room, "|/move 3")
        elif choice == 3:
            self.player.randomMove(self.room, "|/move 4")
        elif choice == 4:
            self.player.randomMove(self.room, "|/switch 2")
        elif choice == 5:
            self.player.randomMove(self.room, "|/switch 3")
        elif choice == 6:
            self.player.randomMove(self.room, "|/switch 4")
        elif choice == 7:
            self.player.randomMove(self.room, "|/switch 5")
        elif choice == 8:
            self.player.randomMove(self.room, "|/switch 6")
        elif choice == 9:
            self.player.randomMove(self.room, "|/choose move 1 dynamax")
        elif choice == 10:
            self.player.randomMove(self.room, "|/choose move 2 dynamax")
        elif choice == 11:
            self.player.randomMove(self.room, "|/choose move 3 dynamax")
        else:
            self.player.randomMove(self.room, "|/choose move 4 dynamax")

    def randomAction(self, choice):
        if self.player.switch:
            choice = random.randint(4, 8)
            self.player.switch = False
        if choice == 0:
            self.player.randomMove(self.room, "|/move 1")
        elif choice == 1:
            self.player.randomMove(self.room, "|/move 2")
        elif choice == 2:
            self.player.randomMove(self.room, "|/move 3")
        elif choice == 3:
            self.player.randomMove(self.room, "|/move 4")
        elif choice == 4:
            self.player.randomMove(self.room, "|/switch 2")
        elif choice == 5:
            self.player.randomMove(self.room, "|/switch 3")
        elif choice == 6:
            self.player.randomMove(self.room, "|/switch 4")
        elif choice == 7:
            self.player.randomMove(self.room, "|/switch 5")
        elif choice == 8:
            self.player.randomMove(self.room, "|/switch 6")
        elif choice == 9:
            self.player.randomMove(self.room, "|/choose move 1 dynamax")
        elif choice == 10:
            self.player.randomMove(self.room, "|/choose move 2 dynamax")
        elif choice == 11:
            self.player.randomMove(self.room, "|/choose move 3 dynamax")
        else:
            self.player.randomMove(self.room, "|/choose move 4 dynamax")

    def reset(self):
        self.room = self.player.challenge("TheDonOfDons")
        self.reward = 0
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
        pokemonids = np.array(ar)
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

        types = np.array(types)
        typesarray = []

        for i in types.flat:
            typesarray.append(u.typeid[str(i).lower()] / 19)
        typesarray = np.array(typesarray).reshape(-1, 2)
        #typesarray = list(typesarray)
        # print(typesarray)

        statusEffects = []
        for i in range(0, len(x)):
            statusEffects.append(u.status[x[i]["statusEffect"]] / 7)
        if len(statusEffects) < 12:
            for i in range(12 - len(statusEffects)):
                statusEffects.append(0)
        # print(statusEffects)

        hp = []
        for i in range(0, len(x)):
            hp.append(round(float(x[i]["hp"]), 3))
        if len(hp) < 12:
            for i in range(12 - len(hp)):
                hp.append(round(1 / 1, 3))
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
        # print(boosts)

        obs = np.array([np.array(pokemonids).flatten().reshape(-1), np.array(typesarray).flatten().reshape(-1), np.array(hp).flatten().reshape(-1), np.array(statusEffects).flatten().reshape(-1), np.array(boosts).flatten().reshape(-1), np.array(teammoves).flatten().reshape(-1)], dtype=float)
        self.observation_space = obs
