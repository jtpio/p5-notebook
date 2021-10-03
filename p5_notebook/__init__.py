import json
from pathlib import Path

from ._version import __version__

HERE = Path(__file__).parent.resolve()

_extensions = []

for folder in ["labextension", "p5-theme-light", "p5-theme-dark"]:
    with (HERE / folder / "package.json").open() as fid:
        data = json.load(fid)
        _extensions += [{"src": folder, "dest": data["name"]}]


def _jupyter_labextension_paths():
    return _extensions
