import ssl
import websocket

ws = websocket.WebSocket()

ws.connect("ws://sim.smogon.com:8000/showdown/websocket")
ws.send("|/nick showdownbot1234")
ws.send("|/challenge blobbywob, gen8randombattle")

while ws.recv() != "":
    print(ws.recv())
