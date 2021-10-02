# small script to deploy to Vercel

set -xeu

yum install wget

wget -qO- https://micromamba.snakepit.net/api/micromamba/linux-64/latest | tar -xvj bin/micromamba

./bin/micromamba shell init -s bash -p ~/micromamba
source ~/.bashrc

micromamba activate
micromamba install python=3.9 -c conda-forge -y

python -m pip install -r requirements-deploy.txt

jupyter lite --version
jupyter lite build