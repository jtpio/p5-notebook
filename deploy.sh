#!/bin/bash

# small script to deploy to Vercel
set -xeu

# install pixi
export PIXI_VERSION=v0.9.1 && curl -fsSL https://pixi.sh/install.sh | bash

# This started to fail as of February 21st 2024
# See commit log in https://github.com/jtpio/p5-notebook/pull/118
# source ~/.bashrc

# So explicitly pointing to the pixi binary instead
~/.pixi/bin/pixi install
~/.pixi/bin/pixi run build_lite
~/.pixi/bin/pixi run copy_favicon
