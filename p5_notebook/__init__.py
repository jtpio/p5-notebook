import json
from pathlib import Path

from ._version import __version__

HERE = Path(__file__).parent.resolve()

with (HERE / "packages/lab-extension/package.json").open() as fid:
    data = json.load(fid)


def _jupyter_labextension_paths():
    return [{"src": "labextension", "dest": data["name"]}]
