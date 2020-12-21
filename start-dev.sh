#!/bin/sh

concurrently "cd ./renderer && npm run start" "cd ./main && npm run start"