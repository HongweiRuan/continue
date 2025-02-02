#!/usr/bin/env bash
# This is used in a task in .vscode/tasks.json
# Start developing with:
# - Run Task -> Install Dependencies
# - Debug -> Extension

# 使用 nvm 设定 Node.js 版本
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 22


set -e

echo "Installing root-level dependencies..."
npm install

echo "Installing Core extension dependencies..."
pushd core
## This flag is set because we pull down Chromium at runtime
export PUPPETEER_SKIP_DOWNLOAD='true'
npm install
npm link

popd

echo "Installing GUI extension dependencies..."
pushd gui
npm install
npm link @continuedev/core
npm run build

popd

# VSCode Extension (will also package GUI)
echo "Installing VSCode extension dependencies..."
pushd extensions/vscode
# This does way too many things inline but is the common denominator between many of the scripts
npm install
npm link @continuedev/core
npm run prepackage
npm run package

popd

echo "Installing binary dependencies..."
pushd binary
npm install
npm run build

popd

echo "Installing docs dependencies..."
pushd docs
npm install

popd
