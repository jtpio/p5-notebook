#!/bin/bash

# small script to deploy to Vercel
set -xeu

touch ~/.bashrc
touch ~/.bash_profile
ls -lisah ~

# install pixi
export PIXI_VERSION=v0.9.1 && curl -fsSL https://pixi.sh/install.sh | bash
ls -lisah ~
echo $(basename "$SHELL")
source ~/.bashrc
source ~/.bash_profile

pixi install
pixi run build_lite
pixi run copy_favicon
