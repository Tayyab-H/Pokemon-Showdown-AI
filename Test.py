import requests
from bs4 import BeautifulSoup
import csv


def createDataset(link="https://replay.pokemonshowdown.com/gen7ou-994429357"):
    print(link)
    result = requests.get(link)
    src = result.content
    src = str(src)

    fear = False
    pokemon = src[src.find("|poke|"):src.find("|teampreview")].replace(", M|item", "").replace(", F|item", "").replace(
        "|" + "\\n", "").replace("|item", "").replace('\\n', '').replace("|poke", "").replace(", M", "").replace(", F",
                                                                                                                 "")
    if pokemon[len(pokemon) - 1] == "|":
        pokemon = pokemon[:len(pokemon) - 1]
    p1 = pokemon[:pokemon.find("|p2")].lower().split("|p1|")
    p2 = pokemon[pokemon.find("|p2"):].lower().split("|p2|")
    del p1[0]
    del p2[0]
    if "L1" in pokemon or "L2" in pokemon or "L9" in pokemon or "L3" in pokemon or "L5" in pokemon:
        fear = True

    if fear == True:
        for i in range(0, len(p1)):
            string = str(p1[i])
            if "," in p1[i]:
                string = string[:string.find(",")]
                p1[i] = string
            else:
                pass
        for i in range(0, len(p1)):
            string = str(p2[i])
            if "," in p2[i]:
                string = string[:string.find(",")]
                p2[i] = string
            else:
                pass

    dex1 = []
    dex2 = []
    print(src)
    print(pokemon)
    for i in range(0, len(p1)):
        dex1.append(pokemonId[pokemonList.index(p1[i])])
    for i in range(0, len(p2)):
        dex2.append(pokemonId[pokemonList.index(p2[i])])

    names = src[:src.find("Pok&eacute;mon Showdown")]
    names = names[names.find("OU replay:"):].replace("OU replay:", "").replace(" ", "").split("vs.")
    winner = src[src.find("|win|"):]
    winner = winner[:winner.find("\\n")].replace(" ", "").replace("|win|", "")
    if winner == names[0]:
        label = 1
    else:
        label = 0
    while len(dex1) < 6:
        dex1.append(0)
    while len(dex2) < 6:
        dex2.append(0)

    print(dex1, dex2)
    print(label)
    towrite = []
    towrite = [label] + dex1 + dex2
    print(towrite)
    with open("dataset3.csv", "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(towrite)





# Open database of pokemon to get pokemon ID numbers
with open("Dex.csv", "r") as f:
    dex = csv.reader(f, delimiter=',')
    pokemonList = []
    pokemonId = []

    for row in dex:
        id = row[2]
        pokemonName = row[1]
        pokemonId.append(id)
        pokemonList.append(pokemonName)

i = 0
file = "Replays3.html"
f = open(file, 'r', encoding='cp850')
soup = BeautifulSoup(f, 'lxml')
for link in soup.findAll('a'):
    print(i)
    createDataset(link.get('href'))
    i += 1
f.close()
