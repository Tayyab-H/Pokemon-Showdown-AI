import ssl
import websocket

ws = websocket.WebSocket()

ws.connect("ws://sim.smogon.com:8000/showdown/websocket")
ws.send("|/nick")
#ws.send("|/challenge blobbywob, gen8randombattle")
x = "Not Null"
while x != "":
    x = ws.recv()
    print(x)
