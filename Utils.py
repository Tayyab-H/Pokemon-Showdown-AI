from bs4 import BeautifulSoup as bs
import requests
import csv


class Utils:
    def statsFromId(id):
        with open('stats.csv', "r") as f:
            file = csv.reader(f, delimiter=",")
            stats = []
            for line in file:
                if line[0] == str(id):
                    stats.append(line[2])

    def dexToId(dex):
        with open("dex.csv", "r") as f:
            file = csv.reader(f, delimiter=",")
            for line in file:
                if line[2] == str(dex):
                    return line[0]

        return None

    def IdToDex(id):
        with open("dex.csv", "r") as f:
            file = csv.reader(f, delimiter=",")
            for line in file:
                if line[0] == str(id):
                    return line[2]

        return None


