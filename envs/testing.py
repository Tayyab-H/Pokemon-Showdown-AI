import json
import numpy as np
import gym
import torch
env1 = gym.make("custom_env_dir:showdown-v0")


for _ in range(200):
    obs1, rew, _ = env1.step()
    print("REWARD: ", rew)