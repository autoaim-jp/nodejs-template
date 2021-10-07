#! /bin/bash

sudo forever stop nodejs_template
sudo ROARR_LOG=true forever --uid nodejs_template -a start app.js
sudo forever list

