import numpy as np
import torch
import os
import sys
import csv
xy = np.genfromtxt("dataset.csv", delimiter=',', dtype=np.float32)
length = len(xy)
string = ""
x_data = torch.from_numpy(xy[0:, 1:]).int().tolist()
y_data = torch.from_numpy(xy[0:, 0]).int().tolist()

with open(os.path.join(sys.path[0], "Ndataset.csv"), "a", newline="") as f:

    for j in range(0,len(xy)):
        x = []
        for i in x_data[j]:
            x.append(i/1000)
        towrite = [y_data[j]] + x
        writer = csv.writer(f)
        writer.writerow(towrite)
