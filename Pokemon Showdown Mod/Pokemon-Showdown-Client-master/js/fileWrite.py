import sys

def read_in():
	lines = sys.argv[1]
	return lines


def main():
	lines = read_in()
	lines = "1|" + lines
	with open("gameState.txt",'w+') as F:
		F.write(lines)
	print(lines, " written")

if __name__ == '__main__':
    main()

