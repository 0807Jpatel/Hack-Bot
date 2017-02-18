#!/bin/bash

git fetch HackList
git diff HEAD HackList/master api/1.0/

if [ $? -ne 0 ]
	then
	#if this equals 0 then we need to retrieve the info 
	git checkout HackList/master api/1.0
fi
