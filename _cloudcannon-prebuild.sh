#!/usr/bin/env bash

#Backup whatever cloudcannon has put in dist
echo "Backing up dist"
rm -rf ./dist-back
cp -R ./dist ./dist-back

echo "Cleaning"
rm -rf package-lock.json
rm -rf ./node_modules

#Standard npm install
echo "Install"
npm install
#Dev npm install for gulp, webpack, etc
echo "Dev install"
npm install --only=dev

cd examples/example-bookshop

echo "Sub Cleaning"
rm -rf package-lock.json
rm -rf ./node_modules

#Standard npm install
echo "Sub Install"
npm install
#Dev npm install for gulp, webpack, etc
echo "Sub Dev install"
npm install --only=dev

echo "Build"
#Run static gulp tasks
npm run build

cd ../../

echo "Restore dist"
cp -Rn ./dist-back/* ./dist
