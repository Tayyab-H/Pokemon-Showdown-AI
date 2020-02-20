import torch
from torch import nn
import torch.nn.functional as F
from torch import tensor as te

class DQN(nn.Module):
    def init(self, inFeatures):
        super().__init__()
        self.fc1 = nn.Linear(in_features=inFeatures, out_features=512)
        self.fc2 = nn.Linear(in_features=512, out_features=768)
        self.fc3 = nn.Linear(in_features=768, out_features=350)
        self.fc4 = nn.Linear(in_features=350, out_features=100)
        self.out = nn.Linear(in_features=350, out_features=13)

    def forward(self, t):
        t.flatten(start_dim = 1)
        t = F.relu(self.fc1(t))
        t = F.relu(self.fc2(t))
        t = F.relu(self.fc3(t))
        t = F.relu(self.fc4(t))
        t = F.relu(self.out(t))
        return t
