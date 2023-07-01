#!/usr/bin/env bash

SRC=${1}
DEST=${2}
IGNORE_FILE=${3:-.rsyncignore}

if [ -z "$SRC" ] || [ -z "$DEST" ]; then
	echo "Usage: $0 <src> <dest> [ignore_file]"
	exit 1
fi

if [ ! -f $IGNORE_FILE ]; then
	echo "No ignore file found at $IGNORE_FILE"
	read -p "Continue without ignore file? (y/n) " -n 1 -r
	echo
	if [[ ! $REPLY =~ ^[Yy]$ ]]
	then
	    exit 1
	fi
fi

rsync --progress -av --exclude-from=$IGNORE_FILE $SRC $DEST
