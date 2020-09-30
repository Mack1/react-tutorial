#!/usr/bin/python

playersPre = [1, 2, 3, 4, 5, 6]
playersPost = [5, 6, 1, 2, 3, 4]

limActions = ["raise, fold"]
actions = ["raise", "call", "fold"]
preflopOpens = []

#The first round assuming no limps use limAction
for player in playersPre:
	for action in limActions:
		preflopOpens.append([player, action])

print("first round of betting", preflopOpens)

for nextAction in preflopOpens:
	for prevAction in nextAction:
		if prevAction != int:

#This is not how you do this lol.			



