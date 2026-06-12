# Starship Configuration

Starship is a **minimal, fast, customizable shell prompt** written in Rust. It shows useful info like git branch, Node.js version, and error codes without slowing down your shell.

## What Starship Shows

By default, Starship displays:
- **Git branch** (if inside a repo): `master ⬆` (branch, with ahead/behind indicator)
- **Git status**: `+3 !2` (staged changes, unstaged changes)
- **Tool versions**: `nodejs v20.10.0` (shows current Node version)
- **Exit code**: Shows ✗ if the last command failed
- **Execution time**: Shows how long a command took if > 1 second

Example prompt:

```
❯ master ⬆ +3 nodejs v20.10.0
❯ ~/projects/my-app
```

Instead of just:
```
$
```

## Installation

If you used the automated setup (QUICKSTART.md), Starship is already installed.

To install manually:

```bash
# Install Starship
curl -sS https://starship.rs/install.sh | sh

# Initialize Starship in your shell
# For bash, add to ~/.bashrc:
eval "$(starship init bash)"

# For zsh, add to ~/.zshrc:
eval "$(starship init zsh)"

# For fish, add to ~/.config/fish/config.fish:
starship init fish | source

# Then restart your terminal
```

## Configuration

Starship configuration goes in:

- **Linux/macOS:** `~/.config/starship.toml`
- **Windows (WSL):** `~/.config/starship.toml`
- **Windows (PowerShell):** `$env:APPDATA\starship.toml`

### Create a Basic Config

```bash
mkdir -p ~/.config
cat > ~/.config/starship.toml << 'EOF'
# Starship Configuration

[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"

[git_branch]
symbol = " "
truncation_length = 20

[git_status]
ahead = "⬆"
behind = "⬇"
diverged = "⬍"

[nodejs]
symbol = " "

[rust]
symbol = " "

[python]
symbol = " "

[line_break]
disabled = false

EOF
```

After saving, reload your shell:

```bash
source ~/.bashrc  # or ~/.zshrc, or restart terminal
```

You should see the custom prompt with symbols:

```
❯ master ⬆ +3 nodejs v20.10.0
❯ ~/projects/my-app
```

## Understanding the Config

Each `[section]` in the config controls a different part of the prompt:

- `[character]` — The `❯` symbol and its color
- `[git_branch]` — Shows current git branch with custom symbol
- `[git_status]` — Shows git changes (`+3`, `!2`)
- `[nodejs]` — Shows Node.js version when in a Node project
- `[line_break]` — Adds a newline before the path

### More Modules You Can Add

```toml
[rust]
symbol = " "
detect_files = ["Cargo.toml"]

[python]
symbol = " "

[go]
symbol = " "

[package]
symbol = " "

[time]
disabled = false
format = "🕙[$time]($style) "
```

See all available modules: https://starship.rs/config/#prompt

## Customize Colors

Change the color of any element:

```toml
[git_branch]
symbol = " "
style = "bold 208"  # Orange (ANSI color code)

[nodejs]
style = "bold green"
```

Common colors: `black`, `red`, `green`, `yellow`, `blue`, `purple`, `cyan`, `white`

Or use ANSI codes (0-255). See: https://starship.rs/config/#style-strings

## Performance Tips

If your prompt feels slow, disable modules you don't need:

```toml
[package]
disabled = true

[python]
disabled = true

[kubernetes]
disabled = true
```

For large git repos (1000+ files), disable `git_status`:

```toml
[git_status]
disabled = true

[git_branch]
# Still shows branch, but not status (faster)
```

## Troubleshooting

**Symbols show as boxes:**
- You're missing a Nerd Font
- See [Font Installation](../fonts-icons/font-install-guide.md)

**Prompt is slow on large repos:**
- Disable `git_status` (see Performance Tips above)
- Or set a timeout:

```toml
[git_status]
timeout_ms = 100  # Skip git status if it takes > 100ms
```

**Changes not showing up:**
- Reload your shell: `source ~/.bashrc` or restart terminal
- Check config file location: `~/.config/starship.toml` (Linux/macOS) or `$env:APPDATA\starship.toml` (Windows)

**More options?** See https://starship.rs/config/

---

## Example Configs

### Minimal (Fast)
```toml
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"

[git_branch]
symbol = " "

[git_status]
disabled = true  # Fast, but won't show changes

[line_break]
disabled = false
```

### Full (Feature-Rich)
```toml
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"

[git_branch]
symbol = " "
truncation_length = 20

[git_status]
ahead = "⬆"
behind = "⬇"

[nodejs]
symbol = " "

[rust]
symbol = " "

[python]
symbol = " "

[time]
disabled = false
format = "[$time]($style) "

[line_break]
disabled = false
```

### Claude Code Optimized
Focus on git and Node (common in agentic development):

```toml
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"

[git_branch]
symbol = " "
truncation_length = 20

[git_status]
ahead = "⬆"
diverged = "⬍"

[nodejs]
symbol = " "
format = "via [$symbol($version)]($style) "

[line_break]
disabled = false
```

### Catppuccin Mocha with Powerline Pills ✨

A beautiful **theme with Powerline-style pill segments** using the Catppuccin Mocha palette:
- 💗 Pink: username
- 🍑 Peach: directory
- 💚 Green: git
- 🩵 Teal: Node.js version
- 💜 Lavender: time

**Visual preview:**
```
🐧  user  ~/projects/my-app   main   v20.10.0  14:32  ❯
```

**To use this preset:**

1. Copy the template:
   ```bash
   cp terminal-setup/templates/starship-catppuccin-mocha.toml ~/.config/starship.toml
   ```

2. Or manually: replace your `~/.config/starship.toml` with the content below

3. Restart your terminal

**Configuration (show/hide modules as needed):**

The template includes: OS icon, username, directory, git branch/status, Node.js version, time, and custom prompt character. You can disable modules by setting `disabled = true` in the `[module_name]` section.

For example, to disable the time display:
```toml
[time]
disabled = true
```

**Customize colors:**

The preset uses these Catppuccin Mocha color hex codes:
- `pink` = #f5c2e7
- `peach` = #fab387
- `green` = #a6e3a1
- `teal` = #94e2d5
- `lavender` = #b4befe

To change colors, edit the `style` or `format` lines in `~/.config/starship.toml`. Example:

```toml
[username]
style = "bg:pink fg:black bold"     # Change "pink" to another Catppuccin color
```

Available Catppuccin Mocha colors: rosewater, flamingo, pink, mauve, red, maroon, peach, yellow, green, teal, sky, sapphire, blue, lavender

---

## Next Steps

1. **Fonts not rendering?** → [Font Installation](../fonts-icons/font-install-guide.md)
2. **Want shell aliases?** → [Shell Aliases](shell-aliases.md)
3. **Want to use an editor?** → [Editor Guides](editor-guides/)

---

## More Resources

- Official docs: https://starship.rs/
- Config reference: https://starship.rs/config/
- Symbol cheat sheet: https://starship.rs/presets/
