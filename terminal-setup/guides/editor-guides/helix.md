# Helix Editor Setup

Helix is a **fast, modern modal editor** inspired by Vim, with great defaults and built-in LSP (language server) support.

## Why Helix?

- **No configuration needed** — works well out of the box
- **Modal editing** — efficient like Vim, but simpler
- **Built-in LSP** — language support (go-to-definition, autocomplete, etc.)
- **Modern defaults** — sensible keybindings, no `~/.config/helix/config.toml` needed for basics

## Installation

### macOS
```bash
brew install helix
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y helix
```

### Linux (Fedora/RHEL)
```bash
sudo dnf install -y helix
```

### Linux (Arch)
```bash
sudo pacman -Sy helix
```

### Verify
```bash
hx --version
# Should show: helix 23.x.x (version may vary)
```

## Basic Usage

### Open Helix
```bash
hx                    # New file
hx myfile.js          # Edit a file
hx .                  # Open current directory
```

### Key Concepts

**Mode switching** (like Vim):
- `i` — Insert mode (type text)
- `Esc` — Back to normal mode
- `:` — Command mode (`:w` to save, `:q` to quit)

**Essential keys:**
- `h/j/k/l` — Navigate (left/down/up/right)
- `d` — Delete selection
- `y` — Copy (yank)
- `p` — Paste
- `u` — Undo
- `Ctrl+r` — Redo
- `/` — Search
- `*` — Select word under cursor

**Running Claude Code from Helix:**

In command mode (`:`) type:
```
!claude
```

Helix will launch Claude Code in a subprocess. Output appears below the editor.

### Configuration (Optional)

Create `~/.config/helix/config.toml`:

```toml
theme = "onedark"

[editor]
line-number = "relative"
scroll-lines = 3
true-color = true

[editor.indent-guides]
render = true

[editor.cursor-shape]
insert = "bar"
normal = "block"

[keys.normal]
"C-s" = ":w"        # Ctrl+s to save
```

### Language Server Setup

Helix auto-detects languages. For JavaScript/Node:

```bash
# Make sure you have Node.js installed
npm install -g typescript-language-server
```

For other languages, see: https://docs.helix-editor.com/languages.html

## Integration with Claude Code

### Option A: Subprocess Command

Run Claude Code from inside Helix:

```
:!claude                              # New file
:!claude ./path/to/project            # Specific directory
:!claude --dangerously-skip-permissions  # Skip prompts
```

### Option B: External Session

Keep Claude Code open in another terminal while editing in Helix:

```bash
# Terminal 1: Helix
hx myfile.js

# Terminal 2: Claude Code
clady         # or: claude code --dangerously-skip-permissions
```

Switch between them with `Alt+Tab` or workspace switchers.

## Common Tasks

### Edit a File in Current Directory
```bash
hx .
```

Then navigate with `/` (search) or arrow keys.

### Create a New File
In Helix:
```
:new myfile.js
```

Type content, then `:w` to save.

### Search and Replace
```
:%s/oldtext/newtext/g
```

(Replace all instances of `oldtext` with `newtext`)

### Go to Definition (with LSP)
```
Ctrl+]
```

(Works if language server is set up)

## Troubleshooting

**Helix feels unfamiliar:**
- It's designed like Vim. Learn the basics: https://docs.helix-editor.com/keymap.html
- Take it slow — Helix modes are very similar to Vim

**Language server not working (no autocomplete/go-to-def):**
- Install language server: `npm install -g typescript-language-server`
- See full list: https://docs.helix-editor.com/languages.html
- Some languages need additional tools; Helix will warn you

**Claude Code not launching from `:!claude`:**
- Verify Claude Code CLI: `which claude`
- Check it's installed: `npm install -g @anthropic-ai/claude-code`

**Colors look weird:**
- Check theme: `:set theme onedark` or try another theme
- Verify terminal supports true color (256-color minimum)

---

## Next Steps

- **Want more editor options?** → [Vim/Neovim](vim-neovim.md), [Emacs](emacs.md), [Micro](micro.md)
- **Want Starship prompt?** → [Starship Configuration](../starship-configuration.md)
- **Need help?** → [Troubleshooting](../troubleshooting.md)

---

## Resources

- Official docs: https://docs.helix-editor.com/
- Keymap cheatsheet: https://docs.helix-editor.com/keymap.html
- Language servers: https://docs.helix-editor.com/languages.html
