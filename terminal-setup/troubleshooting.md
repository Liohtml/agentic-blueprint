# Troubleshooting Terminal Setup

Common issues and solutions when setting up your terminal environment.

---

## Starship Issues

### Prompt Still Shows `$` or `%` Instead of `❯`

**Cause:** Starship not initialized in your shell config.

**Solutions:**
1. Verify Starship is installed:
   ```bash
   which starship
   starship --version
   ```

2. Check shell config has initialization:
   ```bash
   # Bash
   grep "starship init" ~/.bashrc
   
   # Zsh
   grep "starship init" ~/.zshrc
   ```

3. If missing, add manually:
   ```bash
   # Bash
   echo 'eval "$(starship init bash)"' >> ~/.bashrc
   source ~/.bashrc
   
   # Zsh
   echo 'eval "$(starship init zsh)"' >> ~/.zshrc
   source ~/.zshrc
   ```

4. Restart terminal completely (close and reopen window)

### Starship Runs Slowly (Especially on Large Git Repos)

**Cause:** Git status checking is slow on large repos.

**Solutions:**
1. Disable git status in `~/.config/starship.toml`:
   ```toml
   [git_status]
   disabled = true
   ```

2. Or set a timeout:
   ```toml
   [git_status]
   timeout_ms = 100
   ```

3. Disable other slow modules:
   ```toml
   [kubernetes]
   disabled = true
   
   [package]
   disabled = true
   ```

4. Reload: `source ~/.bashrc` or restart terminal

---

## Font Issues

### Seeing Boxes Instead of Icons (🔲 Instead of ✓)

**Cause:** Nerd Font not installed or not set in terminal app.

**Solutions:**

**Step 1: Verify Font Installation**
```bash
# Linux/macOS
fc-list | grep -i cascadia
# Should show: path to Cascadia Code font file

# Windows
# Check Settings → Fonts → search "Cascadia Code"
```

If not found, install the font:
```bash
./terminal-setup/scripts/install-fonts.sh
```

**Step 2: Set Font in Terminal App**

The font must be set in your terminal app's settings:

- **Windows Terminal:** Settings → Appearance → Font face → Select "Cascadia Code Nerd Font"
- **macOS Terminal:** Preferences → Profiles → Font → Select font
- **macOS iTerm2:** Preferences → Profiles → Text → Font
- **Linux (GNOME):** Preferences → Profiles → Custom font
- **Linux (KDE):** Settings → Font
- **Alacritty:** `~/.config/alacritty/alacritty.yml` → `font.normal.family: "Cascadia Code Nerd Font"`

**Step 3: Restart Terminal**

Close and reopen your terminal window.

**Step 4: Test**
```bash
starship prompt
# Should show glyphs correctly
```

### Some Glyphs Show as Boxes, Others Don't

**Cause:** Partial font support or font file corruption.

**Solutions:**
1. Try a different Nerd Font (some may have better support):
   ```bash
   ./terminal-setup/scripts/install-fonts.sh fira
   # Set in terminal app to "Fira Code Nerd Font"
   ```

2. Reinstall the font:
   - Remove old font files
   - Download from https://www.nerdfonts.com
   - Reinstall following [Font Install Guide](fonts-icons/font-install-guide.md)

3. Check Starship config doesn't use unsupported glyphs:
   ```bash
   # Verify symbols are valid
   starship module git_branch
   ```

### Font Looks Pixelated or Blurry

**Cause:** Font size too small for display DPI.

**Solutions:**
1. Increase font size:
   - **Terminal.app:** Preferences → Profiles → Font → increase size to 13-14pt
   - **iTerm2:** Preferences → Text → increase size
   - **Linux/Alacritty:** `~/.config/alacritty/alacritty.yml` → `font.size: 13`

2. Enable anti-aliasing:
   - Usually enabled by default
   - Check terminal settings for "antialiasing" or "smooth" options

3. Try a different font:
   ```bash
   ./terminal-setup/scripts/install-fonts.sh jetbrains
   ```

---

## Shell Alias Issues

### `clady` Command Not Found

**Cause:** Alias not loaded in current shell.

**Solutions:**

1. **Restart terminal completely** (close and reopen window)

2. **Reload shell config manually:**
   ```bash
   source ~/.bashrc  # Bash
   source ~/.zshrc   # Zsh
   # Fish and PowerShell reload automatically
   ```

3. **Verify alias exists:**
   ```bash
   alias clady
   # Should show: alias clady='claude code --dangerously-skip-permissions'
   ```

4. **If missing, add manually:**
   ```bash
   echo "alias clady='claude code --dangerously-skip-permissions'" >> ~/.bashrc
   source ~/.bashrc
   ```

### Claude Code CLI Not Found

**Cause:** Claude Code not installed globally.

**Solution:**
```bash
npm install -g @anthropic-ai/claude-code

# Verify
which claude
# Should show: /usr/local/bin/claude (or similar)

claude --version
# Should show version number
```

### Permission Denied When Running Setup Scripts

**Cause:** Scripts don't have execute permission.

**Solution:**
```bash
chmod +x terminal-setup/scripts/*.sh

# Then try again
./terminal-setup/scripts/install-starship.sh
```

---

## Node.js / Claude Code Issues

### `node` or `npm` Command Not Found

**Cause:** Node.js not installed.

**Solution:**
```bash
# macOS
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Linux (Fedora/RHEL)
sudo dnf install -y nodejs

# Verify
node --version
npm --version
# Should show v18+ and 9+
```

### Claude Code Won't Launch from Terminal

**Cause:** Claude Code CLI not installed or PATH issue.

**Solutions:**
1. Install Claude Code:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. Verify it's in PATH:
   ```bash
   which claude
   # Should show a path like /usr/local/bin/claude
   ```

3. Check it works:
   ```bash
   claude --version
   claude --help
   ```

4. If `which claude` doesn't show it, add to PATH manually:
   ```bash
   # Add to ~/.bashrc or ~/.zshrc:
   export PATH="$PATH:$(npm root -g)/.bin"
   ```

---

## Editor-Specific Issues

### Vim: Claude Code Not Launching from `:!claude`

**Cause:** Command not found in vim's shell.

**Solutions:**
1. Verify command works outside vim:
   ```bash
   # Exit vim, test in shell
   which claude
   claude --version
   ```

2. Inside vim, check PATH:
   ```vim
   :!echo $PATH
   ```

3. If claude not in PATH, use full path:
   ```vim
   :!/usr/local/bin/claude
   ```

4. Or add to vim config (~/.vimrc):
   ```vim
   let $PATH = '/usr/local/bin:' . $PATH
   ```

### Helix: LSP Not Working (No Autocomplete/Go-to-Definition)

**Cause:** Language server not installed.

**Solution:**
```bash
# For JavaScript/Node
npm install -g typescript-language-server

# For Python
pip install python-lsp-server

# Restart Helix
```

See [Helix Guide](guides/editor-guides/helix.md#language-server-setup)

### Emacs: Config File Not Loading

**Cause:** Config in wrong location or syntax error.

**Solutions:**
1. Verify location: `~/.emacs.d/init.el`

2. Check for syntax errors:
   ```emacs
   M-x toggle-debug-on-error
   ```

3. Try reloading:
   ```emacs
   M-x load-file
   ~/.emacs.d/init.el
   ```

4. Check Emacs version:
   ```emacs
   M-x emacs-version
   # Should be 26.0+
   ```

### Micro: Keybinding Not Working

**Cause:** Config syntax error or wrong location.

**Solutions:**
1. Verify location: `~/.config/micro/settings.json`

2. Check JSON syntax is valid (use https://jsonlint.com/)

3. Restart Micro

4. Test keybinding:
   ```
   Ctrl+e
   help keybindings
   ```

---

## WSL-Specific Issues

### Font Not Rendering in WSL Terminal

**Cause:** Font set in Windows Terminal but not installed in WSL.

**Solutions:**
1. Fonts are shared between Windows and WSL, but sometimes need reinstalling:
   ```bash
   # Inside WSL
   mkdir -p ~/.local/share/fonts
   # Copy font files here from Windows
   fc-cache -fv
   ```

2. Set font in Windows Terminal settings:
   - Settings → Appearance → Font face → "Cascadia Code Nerd Font"

3. Restart terminal

### Slow File Access Between Windows and WSL

**Cause:** Normal WSL2 behavior when accessing /mnt/c/

**Solution:**
- Keep your projects inside WSL (~/ directory) for fast access
- Avoid /mnt/c/ for day-to-day work

### WSL Terminal Doesn't Show Starship Prompt

**Cause:** WSL running bash/zsh without Starship initialization.

**Solution:**
1. Inside WSL terminal, verify Starship:
   ```bash
   which starship
   starship --version
   ```

2. Add to ~/.bashrc or ~/.zshrc:
   ```bash
   eval "$(starship init bash)"
   # or
   eval "$(starship init zsh)"
   ```

3. Reload: `source ~/.bashrc` or restart terminal

---

## General Troubleshooting

### "Permission Denied" Errors

**Cause:** Trying to write to system directories without permission.

**Solutions:**
1. For package installs, use package managers:
   ```bash
   brew install ...    # macOS
   sudo apt install... # Linux
   ```

2. For user-level installs:
   ```bash
   npm install -g ...  # npm handles permissions
   ```

3. If absolutely needed, use sudo carefully:
   ```bash
   sudo mkdir -p /path
   sudo chown $(whoami):$(whoami) /path
   ```

### Configuration Files Not Found

**Cause:** Hidden files/directories not visible.

**Solution:**
```bash
# Show hidden files
ls -la ~/
ls -la ~/.config/

# Create if missing
mkdir -p ~/.config
touch ~/.bashrc
```

### Terminal Completely Broken After Changes

**Solution - Quick Recovery:**
1. Open a new terminal window
2. Rename your config file:
   ```bash
   mv ~/.bashrc ~/.bashrc.broken
   ```
3. Restart that terminal
4. Manually fix ~/.bashrc

### Still Stuck?

1. **Check [QUICKSTART.md](QUICKSTART.md)** — simple step-by-step guide
2. **Re-read relevant guide** — sometimes details are easy to miss
3. **Run setup scripts again** — they're idempotent (safe to re-run)
4. **Restart your computer** — fixes many shell/font caching issues
5. **Open an issue** — at https://github.com/Liohtml/agentic-blueprint/issues

---

## Terminal App-Specific Help

**Windows Terminal:** https://github.com/microsoft/terminal/issues
**macOS Terminal:** Apple Support
**iTerm2:** https://iterm2.com/documentation.html
**GNOME Terminal:** https://help.gnome.org/
**KDE Konsole:** https://konsole.kde.org/

---

## Quick Checklist

- [ ] Starship installed: `which starship`
- [ ] Starship in shell config: `grep starship ~/.bashrc`
- [ ] Nerd Font installed: `fc-list | grep -i cascadia`
- [ ] Nerd Font set in terminal app
- [ ] Claude Code installed: `which claude`
- [ ] clady alias added: `alias clady`
- [ ] Terminal restarted (close and reopen)

If all boxes are checked and something still doesn't work, restart your computer and try again.

---

## Still Need Help?

→ [Agentic Blueprint Issues](https://github.com/Liohtml/agentic-blueprint/issues)
