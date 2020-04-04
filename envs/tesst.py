from envs.Network import DQN
import torch

targetnet = DQN(264)
policynet = DQN(264)
torch.save({'params': targetnet.state_dict(), 'step': 1, 'episode': 0}, "targetnet.pth")
torch.save({'params': policynet.state_dict(), 'step': 1, 'episode': 0}, "policynet.pth")

