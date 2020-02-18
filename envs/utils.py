import pickle


class Utils:
    typeid = {"0": 0, "normal": 1, "water": 2, "fire": 3, "bug": 4, "dark": 5, "dragon": 6, "electric": 7, "fairy": 8,
              "fighting": 9, "flying": 10, "ghost": 11, "grass": 12, "ground": 13, "ice": 14, "poison": 15,
              "psychic": 16, "rock": 17, "steel": 18, "???": 19}

    status = {"": 0, "psn": 1, "frz": 2, "tox": 3, "brn": 4, "slp": 5, "par": 6, "???": 7}
    def moves(move):
        moves = {}
        with open("moves.pickle", "rb") as f:
            moves = dict(pickle.load(f, encoding="utf-8"))
        if move in moves:
            return moves[move]
        else:
            with open("moves.pickle", "wb") as f:
                moves[move] = max(moves.values()) + 1
                pickle.dump(moves, f)
                return moves[move]
