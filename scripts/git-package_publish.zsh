#!/bin/zsh
set -euo pipefail
setopt null_glob

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFAULT_TARGET_BRANCH="${PACK_BRANCH:-pack-dist}"
TMP_BASE="${TMPDIR:-/tmp}"

echo "🚀 Building and installing React Native Adapty SDK pack..."

read "USER_TARGET_BRANCH?Enter target branch name (template: dist/3.11.2-rc.1) [${DEFAULT_TARGET_BRANCH}]: "
if [[ -z "$USER_TARGET_BRANCH" ]]; then
    TARGET_BRANCH="$DEFAULT_TARGET_BRANCH"
else
    TARGET_BRANCH="$USER_TARGET_BRANCH"
fi

echo "🎯 Target branch: $TARGET_BRANCH"

# Step 1: Build the SDK (minimal steps, skip linting/formatting/tests)
echo "📦 Building SDK..."
cd "$REPO_ROOT"

ORIGINAL_BRANCH=""
RETURNED=false
cleanup() {
    if [[ -n "$ORIGINAL_BRANCH" && "$RETURNED" = false ]]; then
        git checkout -q "$ORIGINAL_BRANCH" >/dev/null 2>&1 || true
    fi
}
trap cleanup EXIT

ORIGINAL_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$ORIGINAL_BRANCH" = "$TARGET_BRANCH" ]]; then
    echo "❌ Please run this script from a branch other than $TARGET_BRANCH."
    exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
    echo "❌ Working tree is not clean. Commit or stash changes before running the script."
    exit 1
fi

PACKAGE_VERSION="$(node -p "require('./package.json').version")"

yarn update-versions
yarn build

# Step 2: Create pack (bypass prepack script)
echo "🗜️  Creating package archive..."
rm -f react-native-adapty-*.tgz
PACK_FILE="$(npm pack --ignore-scripts)"
PACK_PATH="$REPO_ROOT/$PACK_FILE"

if [[ ! -f "$PACK_PATH" ]]; then
    echo "❌ Error: Package file not found!"
    exit 1
fi

echo "📋 Created: $PACK_PATH"

TEMP_DIR="$(mktemp -d "${TMP_BASE%/}/adapty-pack.XXXXXX")"
mv "$PACK_PATH" "$TEMP_DIR/"
PACK_PATH="$TEMP_DIR/$PACK_FILE"

echo "📦 Archive stored at: $PACK_PATH"

echo "📂 Extracting package archive..."
tar -xzf "$PACK_PATH" -C "$TEMP_DIR"
PACKAGE_DIR="$TEMP_DIR/package"

if [[ ! -d "$PACKAGE_DIR" ]]; then
    echo "❌ Error: Extracted package directory not found!"
    exit 1
fi

echo "🧹 Cleaning build artefacts..."
rm -rf "$REPO_ROOT/dist"

echo "🌿 Switching to branch: $TARGET_BRANCH"
if git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
    git checkout "$TARGET_BRANCH"
elif git ls-remote --exit-code origin "$TARGET_BRANCH" >/dev/null 2>&1; then
    git checkout -b "$TARGET_BRANCH" "origin/$TARGET_BRANCH"
else
    git checkout --orphan "$TARGET_BRANCH"
fi

echo "🧽 Clearing existing files from branch..."
find "$REPO_ROOT" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

echo "📦 Copying package contents..."
rsync -a "$PACKAGE_DIR"/ "$REPO_ROOT"/

git add --all

if git diff --cached --quiet; then
    echo "ℹ️  No changes detected on $TARGET_BRANCH. Skipping commit."
else
    git commit -m "chore: update pack $PACKAGE_VERSION"
    echo "✅ Commit created on $TARGET_BRANCH"
fi

git checkout "$ORIGINAL_BRANCH"
RETURNED=true
trap - EXIT

echo "🔙 Switched back to $ORIGINAL_BRANCH"
echo "📦 Archive retained at $PACK_PATH"
echo "⬆️  Push updated branch with: git push origin $TARGET_BRANCH"


