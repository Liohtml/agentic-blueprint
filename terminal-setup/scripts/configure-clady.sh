#!/usr/bin/env bash
# Configure clady alias (claude code --dangerously-skip-permissions)

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

# Detect shell
detect_shell() {
    basename "$SHELL"
}

# Check Claude Code installation
check_claude() {
    if command -v claude &> /dev/null; then
        ok "Claude Code CLI found"
        return 0
    else
        err "Claude Code CLI not found"
        hint "Install with: npm install -g @anthropic-ai/claude-code"
        return 1
    fi
}

# Configure bash
configure_bash() {
    local bashrc="${HOME}/.bashrc"

    if [ ! -f "$bashrc" ]; then
        touch "$bashrc"
    fi

    # Check if already configured
    if grep -q "alias clady" "$bashrc"; then
        ok "clady alias already in ~/.bashrc"
        return
    fi

    # Add alias
    echo "" >> "$bashrc"
    echo "# Added by terminal-setup/scripts/configure-clady.sh" >> "$bashrc"
    echo "alias clady='claude code --dangerously-skip-permissions'" >> "$bashrc"

    ok "Added clady alias to ~/.bashrc"
}

# Configure zsh
configure_zsh() {
    local zshrc="${HOME}/.zshrc"

    if [ ! -f "$zshrc" ]; then
        touch "$zshrc"
    fi

    if grep -q "alias clady" "$zshrc"; then
        ok "clady alias already in ~/.zshrc"
        return
    fi

    echo "" >> "$zshrc"
    echo "# Added by terminal-setup/scripts/configure-clady.sh" >> "$zshrc"
    echo "alias clady='claude code --dangerously-skip-permissions'" >> "$zshrc"

    ok "Added clady alias to ~/.zshrc"
}

# Configure fish
configure_fish() {
    local fish_config="${HOME}/.config/fish/config.fish"
    mkdir -p "$(dirname "$fish_config")"

    if [ ! -f "$fish_config" ]; then
        touch "$fish_config"
    fi

    if grep -q "alias clady" "$fish_config"; then
        ok "clady alias already in ~/.config/fish/config.fish"
        return
    fi

    echo "" >> "$fish_config"
    echo "# Added by terminal-setup/scripts/configure-clady.sh" >> "$fish_config"
    echo "alias clady='claude code --dangerously-skip-permissions'" >> "$fish_config"

    ok "Added clady alias to ~/.config/fish/config.fish"
}

# Configure PowerShell (Windows)
configure_powershell() {
    local profile_path="${PROFILE:-}"

    if [ -z "$profile_path" ]; then
        err "PowerShell profile path not found"
        hint "Manually add to your PowerShell profile:"
        hint "  Set-Alias -Name clady -Value 'claude code --dangerously-skip-permissions'"
        return
    fi

    mkdir -p "$(dirname "$profile_path")"

    if [ -f "$profile_path" ] && grep -q "clady" "$profile_path"; then
        ok "clady alias already in PowerShell profile"
        return
    fi

    # Add alias to PowerShell profile
    cat >> "$profile_path" << 'EOF'

# Added by terminal-setup/scripts/configure-clady.sh
Set-Alias -Name clady -Value 'claude code --dangerously-skip-permissions'
EOF

    ok "Added clady alias to PowerShell profile"
}

# Show warning
show_warning() {
    echo ""
    echo -e "${YELLOW}⚠️  Safety Notice:${NC}"
    echo ""
    echo "The --dangerously-skip-permissions flag bypasses safety checks."
    echo "Use clady only in:"
    echo "  • Your own projects"
    echo "  • Trusted, sandboxed environments"
    echo "  • CI/CD pipelines where you control the code"
    echo ""
    echo "DO NOT use on untrusted code or shared systems."
    echo ""
}

# Main
main() {
    note "Configure clady alias"
    echo ""

    if ! check_claude; then
        exit 1
    fi

    show_warning

    local shell_name=$(detect_shell)

    case "$shell_name" in
        bash)
            configure_bash
            ;;
        zsh)
            configure_zsh
            ;;
        fish)
            configure_fish
            ;;
        powershell | pwsh)
            configure_powershell
            ;;
        *)
            err "Unsupported shell: $shell_name"
            hint "Manually add to your shell config:"
            hint "  alias clady='claude code --dangerously-skip-permissions'"
            exit 1
            ;;
    esac

    echo ""
    ok "Configuration complete!"
    echo ""

    # Try to reload shell
    if [ -t 0 ]; then
        hint "Reloading shell..."
        case "$shell_name" in
            bash)
                source ~/.bashrc 2>/dev/null || true
                ;;
            zsh)
                source ~/.zshrc 2>/dev/null || true
                ;;
            *)
                echo ""
                hint "Restart your terminal or run: source ~/.<shell>rc"
                ;;
        esac

        # Verify
        if alias clady &> /dev/null 2>&1; then
            ok "Alias is working!"
            alias clady
        else
            hint "Restart your terminal to activate the alias"
        fi
    else
        hint "Restart your terminal to activate the alias"
    fi

    echo ""
    hint "Test it: clady --help"
}

main "$@"
