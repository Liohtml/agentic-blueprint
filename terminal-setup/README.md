# Terminal Setup Guide

Optimize your terminal environment for working with the Agentic Blueprint. This guide covers cross-platform setup for WSL, Linux, and macOS, including terminal styling (Starship prompt), fonts, icons, shell aliases, and editor integration.

**Not required for the blueprint**, but highly recommended if you spend time in the terminal.

## Quick Navigation

- **30-second setup?** → [QUICKSTART.md](QUICKSTART.md)
- **Windows user?** → Start with [WSL Setup](guides/wsl-setup.md)
- **Linux/macOS?** → [Unix Setup](guides/unix-setup.md)
- **Want a custom prompt?** → [Starship Configuration](guides/starship-configuration.md)
- **Want shell shortcuts?** → [Shell Aliases](guides/shell-aliases.md) (includes the `clady` alias)
- **Prefer an editor?** → [Editor Guides](guides/editor-guides/) (Helix, Vim, Emacs, Micro)
- **Font not rendering glyphs?** → [Fonts & Icons](fonts-icons/)
- **Something broken?** → [Troubleshooting](troubleshooting.md)

## What This Covers

### Terminal Prompt (Starship)
A **fast, minimal, modular shell prompt** that shows useful info at a glance (git status, Node version, error codes, execution time). Replaces the default `$` with something like:

```
❯ master ⬆ +5 !2 nodejs v20.10.0 master on main via node v20.10.0
❯ ~/projects/my-app
```

**Setup time:** 5 minutes  
**Benefit:** Instantly see git branch, uncommitted changes, and tool versions

### Fonts & Icons
**Nerd Fonts** provide special glyphs (icons, symbols) that Starship and other tools use. Without the right font:
- Prompt shows boxes instead of git icons
- Colors don't render correctly
- Starship looks broken

We recommend **Cascadia Code Nerd Font** (monospace, widely available, great for coding).

**Setup time:** 3 minutes  
**Benefit:** Beautiful, readable terminal prompt with proper glyphs

### Shell Aliases
Convenient shortcuts for common commands, including:
- **`clady`** = `claude code --dangerously-skip-permissions` (faster Claude Code startup in trusted environments)
- Other shortcuts for your workflow

**Setup time:** 2 minutes  
**Benefit:** Fewer keystrokes, faster workflow

### Editor Integration
Guides for setting up your preferred editor to work well with Claude Code:
- **Helix** — fast, modal, modern
- **Vim/Neovim** — ubiquitous, highly customizable
- **Emacs** — powerful, Lisp-configurable
- **Micro** — beginner-friendly, no learning curve

Each guide covers installation, basic config, and running Claude Code from the editor.

**Setup time per editor:** 10–20 minutes  
**Benefit:** Integrated workflow, no context switching

## Two Paths

### Path A: Quick Start (5 minutes)
Run the automated setup scripts and get a working Starship prompt + fonts + `clady` alias immediately.

→ [QUICKSTART.md](QUICKSTART.md)

### Path B: Custom Setup (30 minutes)
Read the guides, customize to your preferences, and understand what each component does.

1. [WSL Setup](guides/wsl-setup.md) (Windows only) or [Unix Setup](guides/unix-setup.md) (Linux/macOS)
2. [Starship Configuration](guides/starship-configuration.md)
3. [Font Installation](fonts-icons/font-install-guide.md)
4. [Shell Aliases](guides/shell-aliases.md)
5. Pick an [Editor Guide](guides/editor-guides/)

## Prerequisites

### All Platforms
- A shell: bash 5.0+, zsh, fish, or PowerShell 7.0+
- `curl` or `wget` (to download files)
- Node.js ≥ 18 and `npm` (for Claude Code CLI)
- Claude Code CLI: `npm install -g @anthropic-ai/claude-code`

### Windows
- Windows 10 build 19041+ or Windows 11
- WSL2 enabled
- A terminal emulator: Windows Terminal (recommended), Alacritty, or similar

### macOS
- macOS 10.15+ (Catalina or newer)
- Homebrew (for package management)
- Terminal.app, iTerm2, or similar

### Linux
- Any modern distro (Ubuntu, Fedora, Arch, etc.)
- `apt`, `yum`, `pacman`, or equivalent package manager
- GNOME Terminal, KDE Konsole, kitty, or similar

## Folder Structure

```
terminal-setup/
├── README.md                      (this file)
├── QUICKSTART.md                  (fast 5-min setup)
├── guides/                        (detailed guides)
│   ├── wsl-setup.md
│   ├── unix-setup.md
│   ├── starship-configuration.md
│   ├── shell-aliases.md
│   └── editor-guides/
│       ├── helix.md
│       ├── vim-neovim.md
│       ├── emacs.md
│       └── micro.md
├── fonts-icons/                   (font & icon setup)
│   ├── fonts-for-starship.md
│   ├── font-install-guide.md
│   └── icon-sets/
│       ├── nerd-fonts-reference.md
│       └── custom-icons.md
├── scripts/                       (automated setup)
│   ├── install-starship.sh
│   ├── install-fonts.sh
│   └── configure-clady.sh
├── templates/                     (config examples)
│   ├── starship.toml.template
│   ├── .bashrc-snippet.template
│   ├── .zshrc-snippet.template
│   ├── .fish-snippet.template
│   └── powershell-snippet.template
└── troubleshooting.md             (common issues)
```

## Next Steps

1. **Choose your path:** Quick (QUICKSTART.md) or detailed (guides/)
2. **Complete setup:** Run scripts or follow guides
3. **Verify:** Restart your terminal and check the prompt
4. **Optional:** Pick an editor guide and integrate with your workflow

---

## Integration with Agentic Blueprint

This terminal setup is **entirely optional** — the Agentic Blueprint works in any shell. However, if you spend a lot of time in the terminal, these optimizations can significantly improve your daily experience:

- **Starship prompt** keeps you aware of git status and project context
- **Shell aliases** speed up frequent commands
- **Editor integration** lets you switch between Claude Code and your preferred editor without context loss
- **Fonts & colors** make your terminal pleasant to use

If you're new to the blueprint, see [docs/GETTING-STARTED.md](../../docs/GETTING-STARTED.md) for the main onboarding flow. This terminal setup is an optional enhancement for Track B (developer) users.

---

## Troubleshooting

**Something not working?** Check [troubleshooting.md](troubleshooting.md) for common issues and solutions.

**Have a question or found a bug?** Open an issue at [github.com/Liohtml/agentic-blueprint](https://github.com/Liohtml/agentic-blueprint).

---

## Philosophy

This guide follows the Agentic Blueprint's principles:
- **Lean and minimal:** No unnecessary dependencies or bloat
- **Markdown-centric:** Documentation you can read and understand
- **Reusable tools:** Starship, Nerd Fonts, editors — all industry-standard
- **Optional:** Enhance your workflow, not required for the blueprint
- **Extensible:** Easy to add new editors, themes, or tools later

Happy coding! 🚀
