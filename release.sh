#!/bin/bash
# Find a way to run nvm in bash
# nvm use
# yarn ci:build
NEWTAG=$1
PREVIOUSTAG=$(git describe --abbrev=0 --tags)
FILES=("README.md" "package.json")
for FILE in "${FILES[@]}"
do
    sed -i '' -e "s/$PREVIOUSTAG/$NEWTAG/g" $FILE
    echo "Updated version in $FILE from $PREVIOUSTAG to $NEWTAG" 
done