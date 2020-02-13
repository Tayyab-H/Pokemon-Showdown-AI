from Agent import Agent
import json
from envs.custom_env_dir.CustomEnv import PokemonEnv

env = PokemonEnv()
while True:
    env.step()
    print("Gamestate is : ", env.getGamestate())
