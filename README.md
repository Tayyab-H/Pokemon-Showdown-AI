**THIS PROJECT IS NOW DEPRECATED AS THE POKEMON SHOWDOWNS CLIENT HAS BEEN UPDATED. **

In the interest of preservation and potential reviving in the future, the project will remain here.

This project used deep Q learning and self-play to develop an agent that could play competitive Pokemon efficiently. By scraping data from Pokemon Showdown and creating a reward system based on metrics such as knockouts, damage dealt, and ultimately winning, with enough games, data, and a sufficiently large enough network, this agent should be able to compete against human players.

The corresponding paper can be found [here](https://github.com/Tayyab-H/Pokemon-Showdown-AI/blob/master/Deep%20Q%20Learning%20for%20Pokemon%20Showdown.pdf).  Please read this first, as it will provide the necessary context for the project.

The root folder contains scripts used for collecting replay data and creating a dataset from public Pokemon Showdown games. ```replays5.html``` contains 1250 games, all scraped publicly from  Pokemon Showdown. This data is normalised, and a win-predictor network was created.

The ```envs``` folder contains the agent, network, and training scripts. 


*If anyone has a better knowledge of JS than me then please contact me. I'd love to revive this project.*
