**THIS PROJECT IS NOW DEPRECATED AS THE POKEMON SHOWDOWNS CLIENT HAS BEEN UPDATED.**

In the interest of preservation and potential reviving in the future, the project will remain here.

This project used deep Q learning and selfplay to develop and agent that could play competetivbe pokemon efficiently. By scraping data from pokemon showdown and creating a reward system based on metrics such as knockouts, damage dealt and ultimately winning, with enough games, data and a sufficiently large enough network, this agent should be able to compete against human players.

The corresponding paper can be found in the repository. 

The root folder contains scripts used for collecting replay data and creating a dataset from public pokemon showdown games. ```replays5.html``` contains 1250 games all scraped publicly from pokemon showdown. This data is normalised and a win predictor network was created.

The ```envs``` folder contains the agent, network and training scripts. 



*If anyone has a better knowledge of JS than me then please contact me, I'd love to revive this project.*
