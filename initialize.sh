#!/bin/bash

if [ "$EUID" = 0 ]; then
    echo "Initializing solid-chainsaw App Image..."
    npm run copy
    npm run tls
    npm run build
    sudo docker kill solid-chainsaw
    sudo docker system prune
    sudo docker build -t solid-chainsaw .
    sudo docker run -d -p 443:443 --name solid-chainsaw solid-chainsaw
    if [ -z "$(sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' solid-chainsaw)" ]
        then
            echo "An Error Occurred During Initialization..."
            sudo docker logs solid-chainsaw
            exit 1
    else
        echo "Initialization of the Container was Successful..."
        echo "The IPv4 Address of the Container is: $(sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' solid-chainsaw)"
        exit 0
    fi
    
else
    echo "Please Run As A Privileged User..."
    exit 1
fi
