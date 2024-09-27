#!/usr/bin/env bash

set -e

export MODE=PROD
export DB_URL=postgres://fraterhqc:habeo@localhost:5432/testr
export PORT=:5000
export JWT_SECRET=DoAsThouWiltIsTheWholeOfTheLaw
export GIN_MODE=release

./mathtestr.exe 1>>logs/std 2>>logs/err &
