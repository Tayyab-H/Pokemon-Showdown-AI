import csv
import Utils
import os
import sys

with open("dataset.csv","r") as F:
    with open("statsDataset.csv", "a", newline="") as S:
        file = csv.reader(F, delimiter=',')
        writer = csv.writer(S)
        for line in file:
            towrite = []
            for i in range(0, len(line)):
                if i == 0:
                   towrite.append(int(line[0]))
                else:
                    id = Utils.Utils.dexToId(line[i])
                    stats = Utils.Utils.statsFromId(id)
                    #print(stats)
                    #stats = stats.replace("[","").replace("]","").split(",","")
                    towrite.append(stats)
            print(towrite)
            writer.writerow(towrite)
