from collections import namedtuple
import random
import math
import torch


# This is the experience that is stored in memory
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
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def selectAction(self, state, policyNetwork, currentStep):
        rate = self.strategy.getExplorationRate(currentStep)

        if rate > random.random():
            return random.randrange(self.numOfActions)
        else:
            with torch.no_grad():
                state = state.float().to(self.device)
                return policyNetwork(state).argmax(dim=1).item()


class TensorExtraction:
    @staticmethod
    def extractTensor(experiencesObj):
        batch = Experience(*zip(*experiencesObj))
        t1 = torch.cat(batch.state)
        t2 = torch.cat(batch.action)
        t3 = torch.cat(batch.reward)
        t4 = torch.cat(batch.nextState)
        return t1, t2, t3, t4
