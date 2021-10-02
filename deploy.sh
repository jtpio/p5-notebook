#!/bin/bash

# small script to deploy to Vercel
set -xeu

# bootstrap the environment
curl -L  https://gist.githubusercontent.com/jtpio/4c184a755c332b35d7de456603eac119/raw/11a54dd5eacc833fafc9e24b5cef18c4d31586dd/bootstrap.sh | bash -

# activate the environment
micromamba activate

# install dependencies
python -m pip install -r requirements-deploy.txt

# build the JupyterLite site
jupyter lite --version
jupyter lite build