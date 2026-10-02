"""
Build the p5 notebook site with the Galata helpers, for the UI tests.
"""

import json
import shutil
from pathlib import Path
from subprocess import run

import jupyterlab

HERE = Path(__file__).parent
ROOT = HERE.parent
OUTPUT = HERE / "dist"
GALATA = Path(jupyterlab.__file__).parent / "galata"

# A stale doit cache skips the jupyter-lite.json merge into a fresh output
shutil.rmtree(OUTPUT, ignore_errors=True)
(HERE / ".jupyterlite.doit.db").unlink(missing_ok=True)

run(
    [
        "jupyter",
        "lite",
        "build",
        "--lite-dir",
        str(ROOT),
        "--output-dir",
        str(OUTPUT),
        f"--FederatedExtensionAddon.extra_labextensions_path={GALATA}",
    ],
    check=True,
    cwd=HERE,
)

# Galata reads the application from window.jupyterapp
config_file = OUTPUT / "jupyter-lite.json"
config = json.loads(config_file.read_text())
config["jupyter-config-data"]["exposeAppInBrowser"] = True
config_file.write_text(json.dumps(config, indent=2))
