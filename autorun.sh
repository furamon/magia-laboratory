#!/bin/bash

export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
cd /home/furamon/magia-laboratory
/bin/webhook -hooks ./gh-webhook.json &
pnpm run watch
