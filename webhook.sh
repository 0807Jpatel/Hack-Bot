#!/bin/bash

git fetch HackList
DIFF=$(git diff HEAD HackList/master api/1.0) 
if [ "$DIFF" != "" ] 
then
    git checkout HackList/master api/1.0
fi
np