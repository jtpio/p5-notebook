#!/bin/bash

# small script to deploy to Vercel
set -xeu

# install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# install Python and run build commands with uv
# remove previous builds so the extensions are rebuilt in production mode
rm -rf p5_notebook/labextension p5_notebook/p5-theme-light p5_notebook/p5-theme-dark
~/.local/bin/uv python install 3.12
~/.local/bin/uv sync --locked --no-editable --reinstall-package p5-notebook
~/.local/bin/uv run --no-sync jupyter lite build
cp ./favicon.ico ./_output/favicon.ico
cp ./favicon.ico ./_output/lab/favicon.ico
