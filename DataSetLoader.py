import numpy as np
import torch
from torch.autograd import Variable
from torch.utils.data import Dataset, DataLoader
from torch.nn import functional as F


class ReplaysDataSet(Dataset):

    def __init__(self, file):
        self.xy = np.genfromtxt(file, delimiter=',', dtype=np.float32)
        self.length = len(self.xy)
        self.x_data = torch.from_numpy(self.xy[0:, 1:])
        self.y_data = torch.from_numpy(self.xy[0:, 0])
        self.length = len(self.xy)

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.length

class statsDataSet(Dataset):
    def __init__(self, file):
        self.xy = np.genfromtxt(file, delimiter=',', dtype=np.float32)
        self.length = len(self.xy)
        self.x_data = torch.from_numpy(self.xy[0:, 1:])
        self.y_data = torch.from_numpy(self.xy[0:, 0])
        self.length = len(self.xy)

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.length

    