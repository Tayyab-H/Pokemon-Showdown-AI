import json
import numpy as np
import gym
import torch
env1 = gym.make("custom_env_dir:showdown-v0")
obs1, _ , _ = env1.step()
print("OBSERVATION", obs1)

