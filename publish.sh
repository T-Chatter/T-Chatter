#!/bin/sh

if [ -z "$GH_TOKEN" ]; then
    echo "You must set the GH_TOKEN environment variable."
    read
    exit 1
fi

# This will build, package and upload the app to GitHub.
cd ./renderer
npm run build
rm -rf ../main/build
mv build ../main/build
cd ../main
npm run publish