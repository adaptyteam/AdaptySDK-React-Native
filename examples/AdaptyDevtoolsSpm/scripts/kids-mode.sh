#!/usr/bin/env bash
#
# Toggle Adapty SPM Kids Mode for THIS app.
#
# The CLI ships inside the SDK and edits the Package.swift of the copy it lives in, so it has
# to be the copy installed here (node_modules), never the repo's own tracked manifest.
#
# Usage: scripts/kids-mode.sh [enable|disable]
#
# Never fails the caller when the CLI is absent: a plain `yarn install` pulls the PUBLISHED
# react-native-adapty, which predates this CLI, and a failing postinstall would break the install.
# `yarn update-sdk-full` delivers the local build, which has it.
set -euo pipefail

CLI="node_modules/react-native-adapty/scripts/kids-mode.cjs"
COMMAND="${1:-enable}"

if [[ ! -f "$CLI" ]]; then
  echo "kids-mode: $CLI not found — the installed react-native-adapty has no SPM Kids Mode CLI." >&2
  echo "kids-mode: run 'yarn update-sdk-full' to install the local SDK build, then re-run this." >&2
  exit 0
fi

exec node "$CLI" "$COMMAND" --app-root="$PWD"
