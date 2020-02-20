from gym.envs.registration import register

register(
    id='showdown-v0',
    entry_point='envs.custom_env_dir.CustomEnv:PokemonEnv',
)