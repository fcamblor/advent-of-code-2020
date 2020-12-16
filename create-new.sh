#!/bin/bash

year=$(date '+%Y')
day=$(date '+%d')

touch "src/$year-$day.ts"
touch "test/$year-$day.test.ts"
touch "test/$year-$day.inputs.ts"
