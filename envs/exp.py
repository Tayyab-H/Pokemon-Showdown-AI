from collections import namedtuple
import random
import math
import torch
Experience = namedtuple(
    'Experience',
    ('state', 'action', 'nextState', 'reward')
)


class ReplayMemory:
    def __init__(self, capacity):
        self.capacity = capacity
        self.memory = []
        self.pushCount = 0

    def push(self, experience):
        if len(self.memory) < self.capacity:
            self.memory.append(experience)
        else:
            self.memory[self.pushCount % self.capacity] = experience
        self.pushCount += 1

    def sample(self, batchSize):
        return random.sample(self.memory, batchSize)

    def canProvideSample(self, batchSize):
        return len(self.memory) >= batchSize


class EpsilonGreedyStrategy:
    def __init__(self, start, end, decay):
        self.start = start
        self.end = end
        self.decay = decay

    def getExplorationRate(self, currentStep):
        return self.end + (self.start - self.end) * math.exp(-1. * currentStep * self.decay)


class Player:
    def __init__(self, strategy, numOfActions):
        self.strategy = strategy
        self.numOfActions = numOfActions
        self.currentStep = 0

    def selectAction(self, state, policyNetwork):
        rate = self.strategy.getExplorationRate(self.currentStep)
        self.currentStep += 1

        if rate > random.random():
            return random.randrange(self.numOfActions)
        else:
            with torch.no_grad():
                return policyNetwork(state).argmax(dim=1).item()
