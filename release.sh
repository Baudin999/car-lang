#!/bin/bash
yarn nvm use
yarn ci:build

# OLDVERSION=$(cat package.json \
#   | grep version \
#   | head -1 \
#   | awk -F: '{ print $2 }' \
#   | sed 's/[",]//g')
# NEWVERSION=$(npm version $0)
# sed -i -e 's/'+$OLDVERSION+'/'+$NEWVERSION+'/g' README.md