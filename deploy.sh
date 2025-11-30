#!/bin/bash

# small script to deploy to Vercel
set -xeu

# install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# run build commands with uv
~/.local/bin/uv sync
~/.local/bin/uv run jupyter lite build
cp ./favicon.ico ./_output/lab/favicon.ico
