#!/usr/bin/env bash
# Install Nerd Font (default: Cascadia Code)

set -euo pipefail

# Colors for output (TTY-aware)
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    GREEN=''
    RED=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# Helper functions
ok() { echo -e "${GREEN}✓${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }
note() { echo -e "${BLUE}→${NC} $1"; }
hint() { echo -e "  ${YELLOW}💡${NC} $1"; }

# Parse arguments
FONT="${1:-cascadia}"

case "${FONT,,}" in
    cascadia | cascadia-code)
        FONT_NAME="Cascadia Code"
        FONT_URL="https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/CascadiaCode.zip"
        ;;
    fira | fira-code)
        FONT_NAME="Fira Code"
        FONT_URL="https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/FiraCode.zip"
        ;;
    jetbrains | jetbrains-mono)
        FONT_NAME="JetBrains Mono"
        FONT_URL="https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/JetBrainsMono.zip"
        ;;
    hack)
        FONT_NAME="Hack"
        FONT_URL="https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/Hack.zip"
        ;;
    *)
        err "Unknown font: $FONT"
        hint "Supported fonts: cascadia (default), fira, jetbrains, hack"
        exit 1
        ;;
esac

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        *)
            echo "unsupported"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    note "Checking prerequisites..."

    if ! command -v curl &> /dev/null; then
        err "curl is required but not found"
        exit 1
    fi

    if ! command -v unzip &> /dev/null; then
        err "unzip is required but not found"
        hint "Install unzip: apt install unzip (Linux) or brew install unzip (macOS)"
        exit 1
    fi

    ok "Prerequisites OK"
}

# Install on macOS
install_macos() {
    note "Detecting Homebrew installation..."

    if ! command -v brew &> /dev/null; then
        hint "Homebrew not found, trying manual installation..."
        install_linux_manual
        return
    fi

    note "Installing $FONT_NAME via Homebrew..."

    local brew_font_name
    case "${FONT,,}" in
        cascadia)
            brew_font_name="font-cascadia-code-nerd-font"
            ;;
        fira)
            brew_font_name="font-fira-code-nerd-font"
            ;;
        jetbrains)
            brew_font_name="font-jetbrains-mono-nerd-font"
            ;;
        hack)
            brew_font_name="font-hack-nerd-font"
            ;;
    esac

    if brew install --cask "$brew_font_name" 2>/dev/null || \
       brew tap homebrew/cask-fonts && brew install --cask "$brew_font_name"; then
        ok "Installed $FONT_NAME via Homebrew"
        hint "Set font in Terminal/iTerm settings to see it"
    else
        hint "Homebrew installation failed, trying manual method..."
        install_linux_manual
    fi
}

# Install on Linux (manual)
install_linux_manual() {
    note "Installing $FONT_NAME (manual)..."

    local font_dir="${HOME}/.local/share/fonts"
    mkdir -p "$font_dir"

    local temp_dir=$(mktemp -d)

    note "Downloading $FONT_NAME..."
    if curl -sL "$FONT_URL" -o "$temp_dir/font.zip"; then
        ok "Downloaded"
    else
        err "Failed to download font"
        rm -rf "$temp_dir"
        exit 1
    fi

    note "Extracting..."
    unzip -q "$temp_dir/font.zip" -d "$temp_dir"

    note "Installing font files..."
    cp "$temp_dir"/*.ttf "$font_dir/" 2>/dev/null || true
    cp "$temp_dir"/*.otf "$font_dir/" 2>/dev/null || true

    # Rebuild font cache
    if command -v fc-cache &> /dev/null; then
        note "Rebuilding font cache..."
        fc-cache -fv "$font_dir" > /dev/null 2>&1 || true
    fi

    rm -rf "$temp_dir"

    ok "Installed $FONT_NAME to $font_dir"
    hint "You can now set the font in your terminal app"
}

# Verify installation
verify_installation() {
    note "Verifying installation..."

    case "$(detect_os)" in
        macos)
            if fc-list | grep -qi "$FONT_NAME"; then
                ok "Font verified in system"
            else
                hint "Font may not be showing in fc-list, but should work"
            fi
            ;;
        linux)
            if command -v fc-list &> /dev/null; then
                if fc-list | grep -qi "$FONT_NAME"; then
                    ok "Font verified"
                else
                    err "Font not found. Try: fc-list | grep -i $FONT_NAME"
                fi
            fi
            ;;
    esac
}

# Main
main() {
    note "Nerd Font Installation Script"
    echo "Font: $FONT_NAME"
    echo ""

    check_prerequisites

    local os=$(detect_os)

    case "$os" in
        macos)
            install_macos
            ;;
        linux)
            install_linux_manual
            ;;
        *)
            err "Unsupported OS"
            exit 1
            ;;
    esac

    verify_installation

    echo ""
    ok "Font installation complete!"
    echo ""
    hint "Set font in your terminal app:"
    case "$os" in
        macos)
            hint "  Terminal: Preferences → Profiles → Font"
            hint "  iTerm: Preferences → Profiles → Text → Font"
            ;;
        linux)
            hint "  GNOME: Preferences → Font"
            hint "  KDE: Settings → Font"
            hint "  Alacritty: ~/.config/alacritty/alacritty.yml"
            ;;
    esac
    hint "Restart your terminal to see the font"
}

main "$@"
