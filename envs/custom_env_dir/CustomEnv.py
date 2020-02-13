import gym
from gym import error, spaces, utils
from gym.utils import seeding
import random
from Agent import Agent


class PokemonEnv(gym.Env):
    metadata = {'render.modes': ['human']}

    def __init__(self):
        super(PokemonEnv, self).__init__()
        self.action_space = spaces.Discrete(12)
        self.observation_space = gym.spaces.Box(high=2, low=0, shape=(12, 16))
        self.player = Agent()
        self.room = ""
        self.reset()

    def step(self):
        self.randomAction(random.randint(0, 12))

    def randomAction(self, choice):
        if self.player.switch:
            choice = random.randint(4,8)
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
        while not self.player.isGameStarted:
            pass

    def render(self, mode='human', close=False):
        pass

    def getGamestate(self):
        x = self.player.getGameState()
        print("Pickled : " , x)
        return x
