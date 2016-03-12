#!/bin/sh
# Returns Resolution
fbset -s|grep 'mode '|sed 's/mode //'|sed 's/"//g'
