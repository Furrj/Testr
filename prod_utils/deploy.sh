#!/usr/bin/env bash

set -e

cd .. &&
  mkdir deploy &&
  cp prod_utils/* deploy &&
  rm deploy/deploy.sh &&
  cp -r client/dist deploy/client &&
  cp config/sql/* deploy &&
  cd server &&
  GOOS=linux GOARCH=amd64 go build -o ../deploy/mathtestr.exe cmd/server.go &&
  cd .. &&
  rsync -avz deploy/* mathtestr:/home/fraterhqc/mathtestr &&
  rm -rf deploy
