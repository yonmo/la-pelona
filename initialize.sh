#!/bin/bash

if [ "$EUID" = 0 ]; then
    echo "Initializing La Pelona Project App Image..."
    sudo docker system prune
    sudo docker build -t solid-chainsaw .
    sudo docker run -d -p 443:443 --name solid-chainsaw solid-chainsaw
else
    echo "Please Run As A Priveledged User..."
    exit 1
fi
