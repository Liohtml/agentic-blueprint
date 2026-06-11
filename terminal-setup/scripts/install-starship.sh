#!/usr/bin/env bash
# Install Starship prompt with shell initialization

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

# Check prerequisites
check_prerequisites() {
    note "Checking prerequisites..."

    if ! command -v curl &> /dev/null; then
        err "curl is required but not found"
        hint "Install curl: apt install curl (Ubuntu/Debian) or brew install curl (macOS)"
        exit 1
    fi

    if ! command -v tar &> /dev/null; then
        err "tar is required but not found"
        exit 1
    fi

    ok "Prerequisites OK"
}

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        MINGW* | MSYS*)
            echo "windows"
            ;;
        *)
            err "Unsupported OS: $(uname -s)"
            exit 1
            ;;
    esac
}

# Detect architecture
detect_arch() {
    case "$(uname -m)" in
        x86_64)
            echo "x86_64"
            ;;
        aarch64 | arm64)
            echo "aarch64"
            ;;
        *)
            err "Unsupported architecture: $(uname -m)"
            exit 1
            ;;
    esac
}

# Download and install Starship
install_starship() {
    local os=$(detect_os)
    local arch=$(detect_arch)
    local version="latest"

    note "Detecting Starship version..."

    # Get latest release
    local release_url="https://api.github.com/repos/starship/starship/releases/latest"
    local latest=$(curl -s "$release_url" | grep -o '"tag_name": "[^"]*' | cut -d'"' -f4)

    if [ -z "$latest" ]; then
        err "Failed to fetch latest Starship version"
        exit 1
    fi

    ok "Latest Starship: $latest"

    # Determine binary name
    local binary_name
    case "$os" in
        macos)
            binary_name="starship-x86_64-apple-darwin.tar.gz"
            ;;
        linux)
            if [ "$arch" = "aarch64" ]; then
                binary_name="starship-aarch64-unknown-linux-gnu.tar.gz"
            else
                binary_name="starship-x86_64-unknown-linux-gnu.tar.gz"
            fi
            ;;
        windows)
            binary_name="starship-x86_64-pc-windows-msvc.zip"
            ;;
    esac

    local download_url="https://github.com/starship/starship/releases/download/${latest}/${binary_name}"

    note "Downloading Starship..."
    local temp_dir=$(mktemp -d)

    if curl -sL "$download_url" -o "$temp_dir/$binary_name"; then
        ok "Downloaded"
    else
        err "Failed to download Starship"
        rm -rf "$temp_dir"
        exit 1
    fi

    note "Extracting..."
    case "$binary_name" in
        *.tar.gz)
            tar -xzf "$temp_dir/$binary_name" -C "$temp_dir"
            ;;
        *.zip)
            unzip -q "$temp_dir/$binary_name" -d "$temp_dir"
            ;;
    esac

    # Install to system path
    note "Installing to system path..."
    if [ -w "/usr/local/bin" ]; then
        mv "$temp_dir/starship" /usr/local/bin/starship
    elif sudo -n true 2>/dev/null; then
        sudo mv "$temp_dir/starship" /usr/local/bin/starship
    else
        err "Cannot write to /usr/local/bin and sudo not available"
        hint "Try: sudo mkdir -p /usr/local/bin && sudo mv $temp_dir/starship /usr/local/bin/"
        rm -rf "$temp_dir"
        exit 1
    fi

    chmod +x /usr/local/bin/starship
    rm -rf "$temp_dir"

    ok "Starship installed"
}

# Initialize Starship in shell
init_shell() {
    note "Initializing Starship in your shell..."

    local shell_name=$(basename "$SHELL")

    case "$shell_name" in
        bash)
            init_bash
            ;;
        zsh)
            init_zsh
            ;;
        fish)
            init_fish
            ;;
        *)
            err "Unsupported shell: $shell_name"
            hint "Please manually add: eval \"\$(starship init $shell_name)\" to your shell config"
            exit 1
            ;;
    esac
}

init_bash() {
    local bashrc="${HOME}/.bashrc"
    if [ ! -f "$bashrc" ]; then
        touch "$bashrc"
    fi

    # Check if already initialized
    if grep -q "starship init bash" "$bashrc"; then
        ok "Starship already initialized in ~/.bashrc"
        return
    fi

    # Add initialization
    echo "" >> "$bashrc"
    echo "# Initialize Starship prompt" >> "$bashrc"
    echo 'eval "$(starship init bash)"' >> "$bashrc"

    ok "Added Starship to ~/.bashrc"
}

init_zsh() {
    local zshrc="${HOME}/.zshrc"
    if [ ! -f "$zshrc" ]; then
        touch "$zshrc"
    fi

    if grep -q "starship init zsh" "$zshrc"; then
        ok "Starship already initialized in ~/.zshrc"
        return
    fi

    echo "" >> "$zshrc"
    echo "# Initialize Starship prompt" >> "$zshrc"
    echo 'eval "$(starship init zsh)"' >> "$zshrc"

    ok "Added Starship to ~/.zshrc"
}

init_fish() {
    local fish_config="${HOME}/.config/fish/config.fish"
    mkdir -p "$(dirname "$fish_config")"

    if [ ! -f "$fish_config" ]; then
        touch "$fish_config"
    fi

    if grep -q "starship init fish" "$fish_config"; then
        ok "Starship already initialized in ~/.config/fish/config.fish"
        return
    fi

    echo "" >> "$fish_config"
    echo "# Initialize Starship prompt" >> "$fish_config"
    echo "starship init fish | source" >> "$fish_config"

    ok "Added Starship to ~/.config/fish/config.fish"
}

# Main
main() {
    note "Starship Installation Script"
    echo ""

    check_prerequisites

    # Check if already installed
    if command -v starship &> /dev/null; then
        ok "Starship already installed"
        starship --version
        note "Skipping installation, proceeding to shell initialization..."
        init_shell
    else
        install_starship
        init_shell
    fi

    echo ""
    ok "Installation complete!"
    echo ""
    hint "Restart your terminal or run: source ~/.bashrc (or ~/.zshrc)"
    hint "After restart, you should see the Starship prompt (❯ symbol)"
    hint "Read more: https://starship.rs/config/"
}

main "$@"
