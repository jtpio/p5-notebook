#!/bin/bash

# small script to deploy to Vercel
set -xeu

# install pixi
export PIXI_VERSION=v0.9.1 && curl -fsSL https://pixi.sh/install.sh | bash
source ~/.bashrc

pixi install
pixi run build_lite
pixi run copy_favicon
