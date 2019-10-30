from DataSetLoader import statsDataSet

s = statsDataSet("statsDataset.csv")
x, y = s.__getitem__(0)
print(x)