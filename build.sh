#!/bin/sh

cd ./renderer
npm run build
rm -rf ../main/build
mv build ../main/build
cd ../main/
npm run build