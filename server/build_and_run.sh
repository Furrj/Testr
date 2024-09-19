#!/usr/bin/env bash

set -e

go build -o server.exe cmd/server.go
./server.exe