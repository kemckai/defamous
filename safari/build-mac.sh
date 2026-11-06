#!/bin/bash
# Build the macOS Safari wrapper. Signing is never stored in the repository.
#
#   DEVELOPMENT_TEAM     optional Apple team id, from the environment or
#                        safari/Defamous/Local.xcconfig (gitignored)
#   CODE_SIGN_IDENTITY   optional. When DEVELOPMENT_TEAM is unset and this
#                        is unset, the build uses an ad-hoc identity ("-"),
#                        which is the per-session unsigned development route.
#   CONFIGURATION        Debug (default) or Release
#   --sync-only          refresh bundled resources and exit (no xcodebuild)
#
# This script does not install the app and does not change Safari settings.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="$ROOT/safari/Defamous/Defamous.xcodeproj"
SCHEME="Defamous"
CONFIGURATION="${CONFIGURATION:-Debug}"
SYNC_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --sync-only) SYNC_ONLY=1 ;;
    -h|--help)
      sed -n '2,16p' "$0"
      exit 0
      ;;
    *)
      echo "unknown argument: $arg" >&2
      exit 1
      ;;
  esac
done

"$ROOT/safari/sync-extension-resources.sh"

if [[ "$SYNC_ONLY" -eq 1 ]]; then
  exit 0
fi

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "xcodebuild is not available. Resources are synced; build safari/Defamous/Defamous.xcodeproj on a Mac with Xcode." >&2
  exit 2
fi

DERIVED="${DERIVED_DATA_PATH:-$ROOT/safari/DerivedData}"
SYMROOT="${SYMROOT:-$ROOT/safari/build}"

SIGN_ARGS=()
if [[ -n "${DEVELOPMENT_TEAM:-}" ]]; then
  # Apple Development (or whatever CODE_SIGN_IDENTITY the caller set).
  # The team id stays in the environment; it is not written into the project.
  SIGN_ARGS+=(
    "CODE_SIGN_STYLE=${CODE_SIGN_STYLE:-Automatic}"
    "DEVELOPMENT_TEAM=${DEVELOPMENT_TEAM}"
  )
  if [[ -n "${CODE_SIGN_IDENTITY:-}" ]]; then
    SIGN_ARGS+=("CODE_SIGN_IDENTITY=${CODE_SIGN_IDENTITY}")
  fi
  echo "Building $CONFIGURATION with DEVELOPMENT_TEAM set in the environment (value not printed)."
else
  # Ad-hoc / Sign to Run Locally. Safari only loads this while
  # Develop > Allow Unsigned Extensions is enabled for the current session.
  # That menu item does not survive quitting Safari on current macOS, and
  # restart persistence of an already-enabled ad-hoc copy has not been verified.
  SIGN_ARGS+=(
    CODE_SIGN_STYLE=Manual
    CODE_SIGN_IDENTITY=-
    CODE_SIGNING_ALLOWED=YES
  )
  echo "No DEVELOPMENT_TEAM set. Building $CONFIGURATION with an ad-hoc signature."
  echo "This is the per-session unsigned development route, not a distribution signature."
fi

xcodebuild \
  -project "$PROJECT" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "platform=macOS" \
  -derivedDataPath "$DERIVED" \
  "SYMROOT=$SYMROOT" \
  "${SIGN_ARGS[@]}" \
  build

echo "Build finished. Product is under $SYMROOT. This script does not install it."
