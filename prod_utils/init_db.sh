#!/usr/bin/env bash

set -e

psql -U fraterhqc -d testr -f drop_tables.sql &&
  psql -U fraterhqc -d testr -f create_tables.sql
