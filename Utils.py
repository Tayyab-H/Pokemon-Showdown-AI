from bs4 import BeautifulSoup as bs
import requests
import csv
import os
import sys

class Utils:
    def statsFromId(id):
        with open(os.path.join(sys.path[0], "stats.csv"), "r") as f:
            file = csv.reader(f, delimiter=",")
            stats = []
            if id == 0 or id == str(0):
                stats = [0, 0, 0, 0, 0, 0]
                return stats
            for line in file:
                if line[0] == str(id):
                    stats.append(int(line[2]))
            return stats


    def dexToId(dex):
        with open(os.path.join(sys.path[0], "dex.csv") ,"r") as f:
            file = csv.reader(f, delimiter=",")
            if dex == 0 or dex == str(0):
                return 0
            for line in file:
                if line[2] == str(dex):
                    return int(line[0])


    def IdToDex(id):
        with open(os.path.join(sys.path[0], "dex.csv"),"r") as f:
            file = csv.reader(f, delimiter=",")
            for line in file:
                if line[0] == str(id):
                    return int(line[2])
