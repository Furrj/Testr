#!/usr/bin/env bash

set -e

prettier --write . | grep -v "(unchanged)"
