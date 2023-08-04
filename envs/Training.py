import json
import numpy as np
import gym
import torch
from gym.spaces import Box
from matplotlib import pyplot as plt
from envs.exp import EpsilonGreedyStrategy, ReplayMemory, Player, Experience, TensorExtraction
from envs.Network import DQN
from torch import optim
from envs.custom_env_dir.CustomEnv import PokemonEnv
from itertools import count
import torch.nn.functional as F

# The agent is trained using deep Q learning against itself. 
# It does this by estimating a policy (the reward for each given action)
# The agent starts by picking a random action and stores the reward for that action in "Memory"
# When the agent has enough experiences stored in memory it will sample a batch of experiences from memory to train on
# This will be a random sample of experiences from memory
# Over time its ability to pick the best action will improve as it learns from its experiences

# Trains the Neural Network on the dataset
batchSize = 250
gamma = 0.999
epStart = 1
epEnd = 0.01
epDecay = 0.00001
targetUpdate = 1
memorySize = 100000
lr = 0.01
numEpisodes = 2000
numActions = 13

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
env1 = PokemonEnv()
strategy = EpsilonGreedyStrategy(epStart, epEnd, epDecay)
player = Player(strategy, numActions)
memory = ReplayMemory(memorySize)

policyNetwork = DQN(264).to(device)
targetNetwork = DQN(264).to(device)
l = torch.load('policynet.pth')
policyNetwork.load_state_dict(l['params'])
policyNetwork.eval()
targetNetwork.load_state_dict(policyNetwork.state_dict())
targetNetwork.eval()
optimiser = optim.Adam(params=policyNetwork.parameters(), lr=lr)
currentEpisode = l['episode']
currentStep = l['step']



for episode in range(currentEpisode, numEpisodes):
    print("Start")
    env1.reset()
    env1.getGamestate()
    epReward = 0 # total reward for the episode
    state = env1.observation_space 
    state = state.to(device)
    for timestep in count():
        if env1.isDone:
            print("DONE")
            break
        action = player.selectAction(state=state, policyNetwork=policyNetwork, currentStep=currentStep) # select an action
        state = state.to("cpu")
        action = torch.from_numpy(np.array([action], dtype="float"))
        newState, reward, isDone = env1.step(action) # take the action and return the new state, reward and if the game is done
        epReward += reward # add the reward to the total reward for the episode
        memory.push(Experience(state=state, action=action, nextState=newState, reward=reward)) # add the experience to the memory
        state = newState
        if memory.canProvideSample(batchSize=batchSize):
            experiences = memory.sample(batchSize=batchSize)
            states, actions, rewards, newStates = TensorExtraction.extractTensor(experiences)
            states = states.to(device)
            newStates = newStates.to(device)
            actions = actions.long().to(device)
            currentQVal = policyNetwork(states.float()).gather(dim=1, index= actions.unsqueeze(-1)) # get the current Q value
            nextQVal = targetNetwork(newStates.float()).max(dim=1)[0].detach() # Estimate the next Q value
            nextQVal = nextQVal.float().to("cpu")
            rewards = rewards.float() 
            targetQVal = (nextQVal + gamma) + rewards # calculate the target Q value
            currentQVal = currentQVal.to("cpu")
            loss = F.mse_loss(currentQVal, targetQVal.unsqueeze(-1)) # calculate the loss
            optimiser.zero_grad()
            loss.backward()
            optimiser.step()
        if env1.isDone:
            print("DONE2")
            break
    currentStep += 1
    plt.scatter(episode, epReward, c="g")
    if episode % targetUpdate == 0:
        targetNetwork.load_state_dict(policyNetwork.state_dict())
    torch.save({'params': targetNetwork.state_dict(), 'step': currentStep, 'episode': episode}, "targetnet.pth")


env1.closeClient()
plt.show()
print("done")


