# Micro Editor Setup

Micro is a **beginner-friendly** terminal text editor with no learning curve. If you want to avoid Vim's modal editing, Micro is for you.

## Why Micro?

- **No modal editing** — Type to edit, no learning Vim modes
- **Intuitive** — Works like you expect (Ctrl+S to save, Ctrl+C to copy)
- **Terminal-native** — Mouse support, keybindings you know
- **Fast startup** — Minimal dependencies
- **Easy config** — JSON-based, not cryptic

**Best for:** New developers, quick edits, avoiding modal editors.

## Installation

### macOS
```bash
brew install micro
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y micro
```

### Linux (Fedora/RHEL)
```bash
sudo dnf install -y micro
```

### Linux (Arch)
```bash
sudo pacman -Sy micro
```

### Build from Source (Any Platform)
```bash
# Requires Go 1.16+
go install github.com/zyedidia/micro/v2/cmd/micro@latest
```

### Verify
```bash
micro --version
# Should show: micro v2.x.x
```

## Quick Start

### Open Micro
```bash
micro                    # New file
micro myfile.js          # Edit a file
micro .                  # Open current directory (file browser)
```

## Essential Keys

Unlike Vim, Micro uses familiar keybindings:

**File Operations:**
- `Ctrl+s` — Save
- `Ctrl+q` — Quit
- `Ctrl+o` — Open file

**Editing:**
- `Ctrl+x` — Cut line
- `Ctrl+c` — Copy line
- `Ctrl+v` — Paste
- `Ctrl+z` — Undo
- `Ctrl+y` — Redo
- `Ctrl+a` — Select all

**Navigation:**
- `Ctrl+f` — Find
- `Ctrl+h` — Find and replace
- `Ctrl+g` — Go to line
- `Alt+arrows` — Scroll

**Cursor:**
- `Home` / `End` — Line start/end
- `Ctrl+Home` / `Ctrl+End` — File start/end
- `PageUp` / `PageDown` — Page navigation

## Running Claude Code from Micro

### Using Command Mode

In Micro, press `Ctrl+e` to open command mode:

```
> sh claude
```

This launches Claude Code in a subprocess.

### With a Keybinding

Edit `~/.config/micro/settings.json`:

```json
{
    "keybindings": {
        "Alt+c": "lua:execute_command(\"sh claude\")"
    }
}
```

Then press `Alt+c` to launch Claude Code.

## Configuration

Micro config is at `~/.config/micro/settings.json`.

### Basic Config

```json
{
    "colorscheme": "onedark",
    "tabsize": 2,
    "indentchar": " ",
    "ruler": true,
    "softwrap": false,
    "mouse": true
}
```

### With Claude Code Shortcut

```json
{
    "colorscheme": "onedark",
    "tabsize": 2,
    "indentchar": " ",
    "ruler": true,
    "mouse": true,
    "keybindings": {
        "Alt+c": "lua:execute_command(\"sh clady\")"
    }
}
```

Then press `Alt+c` to launch Claude Code.

## Syntax Highlighting

Micro includes syntax highlighting for most languages automatically. To change theme:

1. Press `Ctrl+e`
2. Type: `colorscheme onedark` (or try: `monokai`, `dracula`, `zenburn`)

Themes available: https://github.com/zyedidia/micro/tree/master/runtime/colorschemes

## Plugins (Optional)

Micro supports plugins. Some useful ones:

- **fzf** — Fuzzy file search
- **lsp** — Language server support
- **jump** — Cursor jump navigation

Install with:
```
Ctrl+e
plugin install <pluginname>
```

## Using Micro for Claude Code Workflow

### Side-by-Side Setup

1. Open Micro in one terminal window
2. Open Claude Code in another terminal window:
   ```bash
   clady    # or: claude code --dangerously-skip-permissions
   ```
3. Switch between windows with `Alt+Tab` or split terminal

### Running Claude Code from Micro

Press `Alt+c` (if you configured it above) or use command mode:
```
Ctrl+e
sh clady
```

## Troubleshooting

**Micro not found after install:**
- Restart your terminal
- Check: `which micro`

**Colors look wrong:**
- Try different theme: `Ctrl+e` → `colorscheme dracula`
- Check terminal color support (should be 256-color minimum)

**Keybindings not working:**
- Check `~/.config/micro/settings.json` syntax (valid JSON)
- Restart Micro after editing config
- Test keybinding directly: `Ctrl+e` → `sh micro`

**Mouse not working:**
- Enable in settings: Add `"mouse": true` to `~/.config/micro/settings.json`
- Restart Micro

**Claude Code not launching:**
- Verify from command line: `which claude` and `which clady`
- Check installation: `npm install -g @anthropic-ai/claude-code`

**Syntax highlighting missing for my language:**
- Check supported languages: https://github.com/zyedidia/micro/tree/master/runtime/syntax
- File extension must match (`.js`, `.py`, etc.)

---

## Next Steps

- **Want another editor?** → [Helix](helix.md), [Vim](vim-neovim.md), [Emacs](emacs.md)
- **Want Starship prompt?** → [Starship Configuration](../starship-configuration.md)
- **Need help?** → [Troubleshooting](../troubleshooting.md)

---

## Resources

- Official repo: https://github.com/zyedidia/micro
- Documentation: https://micro-editor.github.io/
- Themes: https://github.com/zyedidia/micro/tree/master/runtime/colorschemes
- Plugins: https://github.com/micro-editor/micro/wiki/Plugins
