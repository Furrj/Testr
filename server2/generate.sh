#!/usr/bin/env bash

cd internal/api/generation
go generate
cd -
cd internal/db/generation
go generate
cd -
