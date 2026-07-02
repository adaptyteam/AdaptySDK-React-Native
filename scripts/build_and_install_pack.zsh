#!/bin/bash

echo "🚀 Building and installing React Native Adapty SDK pack..."

# Get paths based on current working directory (example app directory)
EXAMPLE_DIR="$(pwd)"
SDK_DIR="$(dirname "$(dirname "$EXAMPLE_DIR")")"

echo "📍 Example app: $EXAMPLE_DIR"
echo "📍 SDK directory: $SDK_DIR"

# Step 1: Build the SDK (minimal steps, skip linting/formatting/tests)
echo "📦 Building SDK..."
cd "$SDK_DIR"

# Only run essential build steps
yarn update-versions
yarn build

# Step 2: Create pack (bypass prepack script)
echo "🗜️  Creating package archive..."
# Use yarn pack with --ignore-scripts to skip prepack
npm pack --ignore-scripts

# Find the created .tgz file
PACK_FILE=$(ls react-native-adapty-*.tgz | head -1)

if [[ ! -f "$PACK_FILE" ]]; then
    echo "❌ Error: Package file not found!"
    exit 1
fi

echo "📋 Created: $PACK_FILE"

# Step 3: Go to example app and clean up
cd "$EXAMPLE_DIR"

echo "🧹 Cleaning up old installation..."
rm -rf node_modules/react-native-adapty

# Step 4: Extract the pack manually
echo "📂 Extracting package..."
mkdir -p node_modules/react-native-adapty

# Extract the .tgz to a temp directory first
TEMP_DIR=$(mktemp -d)
tar -xzf "$SDK_DIR/$PACK_FILE" -C "$TEMP_DIR"

# Copy contents from package/ subdirectory to our target
cp -r "$TEMP_DIR/package/"* node_modules/react-native-adapty/

# Clean up temp directory and source pack file
rm -rf "$TEMP_DIR"
rm "$SDK_DIR/$PACK_FILE"

# Step 5: Install production dependencies manually (tslib, @adapty/core)
echo "📦 Installing production dependencies..."
TARGET_NODE_MODULES="$EXAMPLE_DIR/node_modules/react-native-adapty/node_modules"
mkdir -p "$TARGET_NODE_MODULES"

# 5a: tslib — reuse from SDK build cache
SDK_TSLIB_PATH="$SDK_DIR/node_modules/tslib"
if [[ -d "$SDK_TSLIB_PATH" ]]; then
    echo "⚡ Reusing tslib from SDK build cache..."
    rm -rf "$TARGET_NODE_MODULES/tslib"
    cp -R "$SDK_TSLIB_PATH" "$TARGET_NODE_MODULES/"
else
    echo "⚠️  tslib not found in SDK cache, installing from npm..."
    npm pack tslib --pack-destination "$TEMP_DIR" --quiet
    mkdir -p "$TARGET_NODE_MODULES/tslib"
    tar -xzf "$TEMP_DIR"/tslib-*.tgz -C "$TARGET_NODE_MODULES/tslib" --strip-components=1
    rm -rf "$TEMP_DIR"
fi

# 5b: @adapty/core — copy from the SDK root node_modules (single source of truth).
# On CI, `yarn install` populates the root with the published version from npm.
# Locally, you can override it with a local build (e.g. via BUILD_OUT_DIR) and it
# gets picked up automatically. core's only runtime dep (tslib) is handled in 5a.
SDK_CORE_PATH="$SDK_DIR/node_modules/@adapty/core"
if [[ -d "$SDK_CORE_PATH" ]]; then
    CORE_VERSION=$(node -p "require('$SDK_CORE_PATH/package.json').version")
    echo "📦 Copying @adapty/core@$CORE_VERSION from SDK root node_modules..."
    rm -rf "$TARGET_NODE_MODULES/@adapty/core"
    mkdir -p "$TARGET_NODE_MODULES/@adapty"
    cp -R "$SDK_CORE_PATH" "$TARGET_NODE_MODULES/@adapty/"
    echo "Installed @adapty/core@$CORE_VERSION"
else
    echo "❌ Error: @adapty/core not found at $SDK_CORE_PATH"
    echo "   Run 'yarn install' in the SDK root (or build core locally) first."
    exit 1
fi

echo "✅ Successfully installed React Native Adapty SDK pack!"
echo "📍 Location: $EXAMPLE_DIR/node_modules/react-native-adapty"

echo "📋 Installed contents:"
ls -la node_modules/react-native-adapty/


