#!/bin/bash

# small script to deploy to Vercel
set -xeu

# bootstrap the environment
curl -L  https://gist.githubusercontent.com/jtpio/4c184a755c332b35d7de456603eac119/raw/11a54dd5eacc833fafc9e24b5cef18c4d31586dd/bootstrap.sh | bash -

# activate the environment
export ZSH_VERSION=""
source ~/.bashrc
micromamba activate

# install dependencies
python -m pip install -r requirements-deploy.txt

# build the JupyterLite site
jupyter lite --version
jupyter lite build

# copy the favicon
cp ./favicon.ico ./_output/lab/favicon.ico