# Fonts for Starship

Starship uses special Unicode glyphs (icons, symbols) that require a special font to render properly.

## The Problem

Without the right font, Starship shows **boxes instead of glyphs**:

```
❯ master ⬆  +3 nodejs v20.10.0     (correct — shows git icon + arrow)
□ master □ +3 nodejs v20.10.0      (wrong — shows boxes)
```

## The Solution: Nerd Fonts

**Nerd Fonts** are monospace fonts with special glyphs added. They include:
- Git symbols (branch, merge, commit)
- Programming language icons (Node, Python, Rust, etc.)
- UI symbols (arrows, status icons)
- Powerline symbols (prompts, transitions)

## Recommended Fonts

**Tier 1 (Best):**
- **Cascadia Code Nerd Font** ⭐ (Microsoft's modern font, excellent for coding)
- **Fira Code Nerd Font** (popular, clean)
- **JetBrains Mono Nerd Font** (excellent for IDE use)

**Tier 2 (Good):**
- **Hack Nerd Font** (lightweight, clean)
- **IBM Plex Mono Nerd Font** (professional)
- **Inconsolata Nerd Font** (minimal)

**Tier 3 (Stylized):**
- **Ubuntu Mono Nerd Font** (distinctive)
- **Noto Mono Nerd Font** (wide language support)

## Why Cascadia Code?

We recommend **Cascadia Code Nerd Font** as the default because:
- ✓ Modern and clean design
- ✓ Excellent ligatures (=>, ->, etc.)
- ✓ Good monospace alignment (important for terminal)
- ✓ Available on all platforms (Microsoft font)
- ✓ Free and open-source

## What Makes a Font "Nerd Font"

A Nerd Font has:
- **Monospace** — all glyphs same width (required for terminal)
- **1000+ glyphs** — includes PowerLine + Font Awesome + more
- **Ligatures** (optional) — visual combinations like `=>` rendering as a single symbol

See all Nerd Fonts: https://www.nerdfonts.com

## Installation

Follow [Font Install Guide](font-install-guide.md) for per-OS instructions.

## Verifying Font Installation

### Test Glyphs Display

```bash
# Show a Starship git icon
echo ""

# Show Node.js icon
echo ""

# Show git branch icon
echo ""
```

If you see symbols (not boxes), your font is working.

### In Your Terminal

1. Open your terminal app's settings
2. Look for "Font" or "Font Family"
3. Choose your Nerd Font (e.g., "Cascadia Code")
4. Restart terminal
5. Run `starship prompt` — should show correctly

## Troubleshooting

**Still seeing boxes:**

1. **Font not actually installed:**
   - Windows: Right-click .ttf file → Install
   - macOS: Double-click .ttf file → Install Font
   - Linux: Check `fc-list | grep <fontname>`

2. **Font set in terminal but still not working:**
   - Restart the terminal completely (close and reopen window)
   - Try a different Nerd Font
   - Check terminal supports true color (most modern terminals do)

3. **Font looks broken:**
   - Try a different Nerd Font (maybe the one you chose has issues)
   - Reinstall the font
   - Check terminal settings are correct

4. **Only some glyphs show as boxes:**
   - Your font may have partial Nerd Font support
   - Try a different Nerd Font (full variant)
   - Download from https://www.nerdfonts.com directly (ensure full download)

## Installing Specific Fonts

### Cascadia Code (Recommended)

**macOS:**
```bash
brew install font-cascadia-code-nerd-font
```

**Linux (Manual):**
1. Download from https://www.nerdfonts.com/font-downloads
2. Find "Cascadia Code" and download
3. Install following [Font Install Guide](font-install-guide.md)

**Windows/WSL:**
1. Download from https://github.com/microsoft/cascadia-code/releases
2. Right-click → Install Font
3. Set in Windows Terminal → Settings → Appearance → Font face

### Fira Code

```bash
# macOS
brew install font-fira-code-nerd-font

# Linux: download from nerdfonts.com and follow install guide
# Windows: download and right-click → Install Font
```

### JetBrains Mono

```bash
# macOS
brew install font-jetbrains-mono-nerd-font

# Linux/Windows: download from https://www.nerdfonts.com
```

## Font vs Terminal Settings

**Important:** You must set the font in TWO places:

1. **Font file installation** — Install the .ttf file on your system
2. **Terminal app settings** — Tell your terminal to USE the font

If font is installed but terminal isn't using it, you'll still see boxes.

**Set the font in your terminal app:**
- **Windows Terminal:** Settings → Appearance → Font face
- **macOS Terminal:** Preferences → Profiles → Font
- **macOS iTerm:** Preferences → Profiles → Text → Font
- **Linux GNOME Terminal:** Preferences → Profiles → Custom font
- **Alacritty:** `~/.config/alacritty/alacritty.yml` → `font.normal.family`

---

## Next Steps

1. **Don't have a font yet?** → [Font Install Guide](font-install-guide.md)
2. **Want to customize icons?** → [Custom Icons](icon-sets/custom-icons.md)
3. **Setting up Starship?** → [Starship Configuration](../guides/starship-configuration.md)
4. **Still having issues?** → [Troubleshooting](../troubleshooting.md)

---

## Resources

- Nerd Fonts website: https://www.nerdfonts.com
- Nerd Fonts GitHub: https://github.com/ryanoasis/nerd-fonts
- Glyph cheat sheet: https://www.nerdfonts.com/cheat-sheet
