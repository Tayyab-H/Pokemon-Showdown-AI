import numpy as np
import torch
from torch.autograd import Variable
from torch.utils.data import Dataset, DataLoader
from torch.nn import functional as F
import csv

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
        self.t1 = []
        self.t2 = []
        self.x_data = []
        self.x2_data = []
        self.y_data = []
        self.length = 0
        self.x_return = []
        with open("statsDataset.csv", "r") as f:
            file = csv.reader(f)
            for line in file:
                s = line[1:7]
                t = line[7:]
                y = line[0]
                for i in range(0, len(s)):
                    s[i] = s[i].replace("[", "").replace("]", "").split(",")
                    t[i] = t[i].replace("[", "").replace("]", "").split(",")
                    s[i] = list(map(float, s[i]))
                    t[i] = list(map(float, t[i]))
                self.x_data.append(s)
                self.x_data.append(t)
                self.x2_data.append(self.x_data)
                self.x_data = []
                self.y_data.append(int(y))

        self.x_return = np.array(self.x2_data)

        self.x_return = torch.from_numpy(self.x_return)
        print(self.x_return.size())
        #self.x_return = self.x_return.permute(0,2,1,3)
        print(self.x_return.size())

        self.y_data = torch.from_numpy(np.array(self.y_data))


    def __getitem__(self, index):
        return self.x_return[index], self.y_data[index]

    def __len__(self):
        return len(self.x_return)
