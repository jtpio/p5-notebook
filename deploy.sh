#!/bin/bash

# small script to deploy to Vercel
set -xeu

# install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# install Python and run build commands with uv
# --no-editable builds the extensions in production mode
~/.local/bin/uv python install 3.12
~/.local/bin/uv sync --locked --no-editable
~/.local/bin/uv run --no-sync jupyter lite build
cp ./favicon.ico ./_output/favicon.ico
cp ./favicon.ico ./_output/lab/favicon.ico
