#!/bin/bash

# small script to deploy to Vercel
set -xeu

# bootstrap the environment
yum install wget || true

wget -qO- https://micromamba.snakepit.net/api/micromamba/linux-64/latest | tar -xvj bin/micromamba

./bin/micromamba shell hook -p ~/micromamba -s posix
./bin/micromamba shell init -s bash -p ~/micromamba

source ~/.bashrc

micromamba activate
micromamba install python=3.10 -c conda-forge -y

# install dependencies
python -m pip install -r requirements-deploy.txt

# build the JupyterLite site
jupyter lite --version
jupyter lite build

# copy the favicon
cp ./favicon.ico ./_output/lab/favicon.ico