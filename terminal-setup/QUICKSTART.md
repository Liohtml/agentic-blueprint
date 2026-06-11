# Quick Start: 5-Minute Terminal Setup

Get Starship prompt + Nerd Fonts + `clady` alias working in 5 minutes.

## Prerequisites Check

Before you start, verify you have:

```bash
# Check shell
echo $SHELL
# Should show: /bin/bash, /bin/zsh, /bin/fish, or /bin/sh

# Check curl (to download files)
which curl
# Should show: /usr/bin/curl (or similar)

# Check Node.js (for Claude Code)
node -v
npm -v
# Should show versions ≥ 18.0.0

# Check Claude Code CLI
which claude
# Should show: /usr/local/bin/claude (or similar)
```

If any are missing, see [Unix Setup](guides/unix-setup.md) (Linux/macOS) or [WSL Setup](guides/wsl-setup.md) (Windows) for installation.

## Choose Your Path

### Path A: Automated Setup (Recommended)
Run our scripts to install everything in ~3 minutes.

```bash
# Make scripts executable
chmod +x terminal-setup/scripts/*.sh

# Step 1: Install Starship prompt (2 min)
./terminal-setup/scripts/install-starship.sh

# Step 2: Install Nerd Font (1 min)
./terminal-setup/scripts/install-fonts.sh

# Step 3: Add clady alias (30 sec)
./terminal-setup/scripts/configure-clady.sh
```

After each step, **restart your terminal** and verify the output.

#### Step 1 Expected Output
After restarting your terminal, you should see:

```
❯ master ⬆  +3 nodejs v20.10.0
❯ ~/my-project
```

(Instead of just `$` or `%`)

If you see **boxes or broken glyphs** (e.g., `□` instead of `git` icon), you're missing the font. Go to Step 2.

#### Step 2 Expected Output
After restarting terminal and setting the font in your terminal app:

```
❯ master ⬆  +3 nodejs v20.10.0
❯ ~/my-project
```

Should render **correctly with git icons and colors** (not boxes).

#### Step 3 Expected Output
After restarting terminal:

```bash
alias clady
# Should show: alias clady='claude code --dangerously-skip-permissions'

# Test it
clady --help
# Should show Claude Code help
```

---

### Path B: Manual Setup (Learn as You Go)
Read the guides and set up each component by hand.

1. **WSL setup** (Windows only): [WSL Setup](guides/wsl-setup.md)
2. **Unix setup** (Linux/macOS): [Unix Setup](guides/unix-setup.md)
3. **Starship**: [Starship Configuration](guides/starship-configuration.md)
4. **Fonts**: [Font Install](fonts-icons/font-install-guide.md)
5. **Aliases**: [Shell Aliases](guides/shell-aliases.md)
6. **Editor** (optional): [Editor Guides](guides/editor-guides/)

---

## Verification Checklist

✓ **After Step 1 (Starship):**
- [ ] Prompt changed from `$` to `❯`
- [ ] Git branch shows when inside a repo
- [ ] No errors in shell startup

✓ **After Step 2 (Fonts):**
- [ ] Git icon renders (not a box)
- [ ] Colors are correct
- [ ] Prompt looks clean and readable

✓ **After Step 3 (Aliases):**
- [ ] `clady --help` works
- [ ] `alias clady` shows the alias
- [ ] Terminal reloaded (no "command not found")

---

## Troubleshooting

### Prompt still looks like `$` or `%`
- Restart your terminal completely (close and reopen the window)
- Check `~/.bashrc` or `~/.zshrc` for the line: `eval "$(starship init bash)"`

### Seeing boxes instead of icons
- Missing Nerd Font — run Step 2 (install-fonts.sh)
- Font not set in terminal app — see [Font Install](fonts-icons/font-install-guide.md) for per-app instructions

### `clady` command not found
- Shell not reloaded — restart your terminal
- Alias not added — check `~/.bashrc` or `~/.zshrc` for the `clady=...` line
- Run Step 3 again: `./terminal-setup/scripts/configure-clady.sh`

### Scripts fail with "permission denied"
```bash
chmod +x terminal-setup/scripts/*.sh
```

### Still stuck?
→ [Troubleshooting Guide](troubleshooting.md)

---

## What's Next?

- **Want to customize Starship?** → [Starship Configuration](guides/starship-configuration.md)
- **Want more aliases?** → [Shell Aliases](guides/shell-aliases.md)
- **Want to use an editor?** → [Editor Guides](guides/editor-guides/)
- **Still have questions?** → [FAQ & Troubleshooting](troubleshooting.md)

---

## Why These Tools?

- **Starship** — Fast (written in Rust), modular, no heavy shell frameworks
- **Nerd Fonts** — Support for 1000+ glyphs, monospace for coding
- **clady alias** — Faster Claude Code startup in trusted projects

All industry-standard, widely adopted by developers.
