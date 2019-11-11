from DataSetLoader import statsDataSet
from DataSetLoader import ReplaysDataSet
import csv

s = statsDataSet("statsDataset.csv")
x, y = s.__getitem__(0)
print(x)


