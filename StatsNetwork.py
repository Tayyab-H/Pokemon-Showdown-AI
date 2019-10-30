from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
from torch.nn import functional as F
from DataSetLoader import ReplaysDataSet
import matplotlib.pyplot as plt
import torch

class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
        self.l1 = torch.nn.Linear(12,32)
        self.l2 = torch.nn.Linear(32, 12)
        self.l3 = torch.nn.Linear(12, 14)
        self.l4 = torch.nn.Linear(14, 1)

    def forward(self, t):

        t = F.relu(self.l1(t))
        t = F.relu(self.l2(t))
        t = F.relu(self.l3(t))
        y_pred = torch.sigmoid(self.l4(t))

        return y_pred

    def get_num_correct(self,preds,labels):
        return preds.round().squeeze().eq(labels).numpy().sum()

class Test():
        model = Model()
        optimiser = torch.optim.Adam(model.parameters(), lr=0.001)
        dataset = ReplaysDataSet("statsDataset.csv")
        trainLoader = DataLoader(dataset=dataset, batch_size=150, shuffle=True)
        batch = next(iter(trainLoader))
        criterion = nn.BCELoss()
        for epoch in range(1500):
            totalLoss = 0
            totalCorrect = 0
            for batch in trainLoader:
                data, label = batch
                prediction = model(data)
                loss = criterion(prediction.squeeze(), label)
                optimiser.zero_grad()
                loss.backward()
                optimiser.step()
                #plt.scatter(epoch, loss.item(), s=10, color='r')
                totalLoss += loss.item()
                totalCorrect += model.get_num_correct(prediction, label)
            print("Total loss : " , totalLoss)
            print("total correct : ", totalCorrect)
            accuracy = totalCorrect / 3243
            plt.scatter(epoch, accuracy, s=10, color='g')
        plt.show()
        dataset = ReplaysDataSet("statsTest.csv")
        trainLoader = DataLoader(dataset=dataset, batch_size=500, shuffle=True)
        totalLoss = 0
        totalCorrect = 0
        for batch in trainLoader:
            data, label = batch
            prediction = model(data)
            #print(label)

            loss = criterion(prediction.squeeze(), label)
            optimiser.zero_grad()

            loss.backward()
            #optimiser.step()
            totalLoss += loss.item()
            print("Testing total loss is : ", totalLoss)
            totalCorrect += model.get_num_correct(prediction, label)
            print("Testing total correct is : ", totalCorrect)
            print("Accuracy on testing set is ", ((totalCorrect/500)*100), "%")
