#!/bin/bash

# small script to deploy to Vercel
set -xeu

# bootstrap the environment
yum install tar wget || true

cd $HOME
export MAMBA_VERSION=0.20.0
URL="https://anaconda.org/conda-forge/micromamba/${MAMBA_VERSION}/download/linux-64/micromamba-${MAMBA_VERSION}-0.tar.bz2"
wget -qO- ${URL} | tar -xvj bin/micromamba

eval "$(./bin/micromamba shell hook --shell=bash)"

micromamba activate
micromamba install python=3.10 -c conda-forge -y

# install dependencies
python -m pip install -r requirements-deploy.txt

# build the JupyterLite site
jupyter lite --version
jupyter lite build

# copy the favicon
cp ./favicon.ico ./_output/lab/favicon.ico