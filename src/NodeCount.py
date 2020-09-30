#!/usr/bin/python

players = [1, 2, 3, 4, 5, 6]
actions = ["raise", "call", "fold"]
preflopOpens = []
for player in players:
	for action in actions:
		preflopOpens.append(player)

print "preflopOpens", preflopOpens
