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

# Step 5: Install package dependencies
echo "📦 Installing package dependencies..."
SDK_TSLIB_PATH="$SDK_DIR/node_modules/tslib"
TARGET_NODE_MODULES="$EXAMPLE_DIR/node_modules/react-native-adapty/node_modules"

# Fast path: reuse tslib from the SDK build (speeds up the script)
if [[ -d "$SDK_TSLIB_PATH" ]]; then
    echo "⚡ Reusing tslib from SDK build cache..."
    mkdir -p "$TARGET_NODE_MODULES"
    rm -rf "$TARGET_NODE_MODULES/tslib"
    cp -R "$SDK_TSLIB_PATH" "$TARGET_NODE_MODULES/"
else
    echo "🌐 Installing dependencies via npm (tslib cache missing)..."
    cd node_modules/react-native-adapty
    npm install --omit=dev --legacy-peer-deps --no-save --prefer-offline
    cd "$EXAMPLE_DIR"
fi

echo "✅ Successfully installed React Native Adapty SDK pack!"
echo "📍 Location: $EXAMPLE_DIR/node_modules/react-native-adapty"

echo "📋 Installed contents:"
ls -la node_modules/react-native-adapty/


