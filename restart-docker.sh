#!/bin/sh

if [ "$1" ]
then
  docker rm -f $1
  bash start-docker.sh
fi