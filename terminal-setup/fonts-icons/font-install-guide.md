# Font Installation Guide

Install Nerd Fonts on your system so Starship glyphs render correctly.

## Quick Install (All Platforms)

We recommend **Cascadia Code Nerd Font**. Install with:

### macOS
```bash
brew install font-cascadia-code-nerd-font
```

### Linux (Ubuntu/Debian)
```bash
# Download
mkdir -p ~/.local/share/fonts
cd ~/.local/share/fonts
curl -fLo "Cascadia Code Nerd Font.zip" "https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/CascadiaCode.zip"
unzip "Cascadia Code Nerd Font.zip"
rm "Cascadia Code Nerd Font.zip"

# Rebuild font cache
fc-cache -fv

# Verify
fc-list | grep -i cascadia
```

### Linux (Fedora/RHEL)
```bash
mkdir -p ~/.local/share/fonts
cd ~/.local/share/fonts
curl -fLo "CascadiaCode.zip" "https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/CascadiaCode.zip"
unzip "CascadiaCode.zip"
rm "CascadiaCode.zip"
fc-cache -fv
```

### Linux (Arch)
```bash
sudo pacman -S nerd-fonts-cascadia-code
```

Or from AUR:
```bash
yay -S nerd-fonts-cascadia-code
```

### Windows / WSL
1. Download from: https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.0/CascadiaCode.zip
2. Extract the .zip file
3. Right-click any `.ttf` file → **Install Font**
4. Set font in **Windows Terminal** → Settings → Appearance → Font face → "Cascadia Code Nerd Font"

---

## Manual Installation (Any Font, Any Platform)

### Step 1: Download Font

Go to https://www.nerdfonts.com and download your preferred font:
- Cascadia Code (recommended)
- Fira Code
- JetBrains Mono
- Hack
- Or any other font with a download link

You'll get a `.zip` file.

### Step 2: Install Font File

#### macOS
1. Download the font .zip file
2. Extract it
3. Double-click any `.ttf` or `.otf` file
4. Click **"Install Font"** in the popup
5. Repeat for all font variants (Regular, Bold, etc.)

#### Linux
1. Create font directory (if not exists):
   ```bash
   mkdir -p ~/.local/share/fonts
   ```

2. Extract the font files:
   ```bash
   cd ~/Downloads
   unzip your-font.zip
   mv *.ttf ~/.local/share/fonts/
   ```

3. Rebuild font cache:
   ```bash
   fc-cache -fv ~/.local/share/fonts
   ```

4. Verify installation:
   ```bash
   fc-list | grep -i "font-name"
   # Example: fc-list | grep -i cascadia
   ```

#### Windows (WSL)
1. Download the font on Windows
2. Extract the .zip file
3. Right-click each `.ttf` file → **Install Font**
4. (WSL will share Windows fonts automatically)

---

## Step 3: Set Font in Terminal App

Once installed, tell your terminal app to USE the font.

### Windows Terminal
1. Open **Windows Terminal**
2. Click **Settings** (⚙️ icon at bottom)
3. Go to **Appearance** (left sidebar)
4. Find **Font face**
5. Select **Cascadia Code Nerd Font** (or your font name)
6. Close Settings (saves automatically)
7. Close and reopen terminal

### macOS Terminal
1. Open **Terminal**
2. Click **Terminal** → **Preferences** (or `Cmd+,`)
3. Go to **Profiles** tab
4. Select your profile (usually "Basic")
5. Click **Font** button
6. Search for your font (e.g., "Cascadia Code")
7. Select font and size (12pt is good)
8. Close preferences

### macOS iTerm2
1. Open **iTerm2**
2. Click **iTerm2** → **Preferences** (or `Cmd+,`)
3. Go to **Profiles** → **Text**
4. Click **Font** dropdown
5. Search for your font
6. Select size (12pt is good)
7. Close preferences

### Linux (GNOME Terminal)
1. Open **GNOME Terminal**
2. Click the hamburger menu (☰) → **Preferences**
3. Select your profile
4. Toggle **Custom font**
5. Click the font button
6. Search for your font (e.g., "Cascadia Code Nerd Font")
7. Select and close

### Linux (KDE Konsole)
1. Open **Konsole**
2. Click **Settings** → **Edit Current Profile**
3. Go to **Appearance**
4. Click **Font** button
5. Search for your font
6. Select and click **OK**

### Linux (Alacritty)
Edit `~/.config/alacritty/alacritty.yml`:

```yaml
font:
  normal:
    family: "Cascadia Code Nerd Font"
    style: Regular
  size: 12.0
```

Save and restart Alacritty.

### Linux (Kitty)
Edit `~/.config/kitty/kitty.conf`:

```
font_family Cascadia Code Nerd Font
font_size 12.0
```

Save and restart Kitty.

### PowerShell
1. Right-click PowerShell title bar → **Properties**
2. Go to **Font**
3. Select your font
4. Click **OK**

---

## Verify Installation

After setting the font, restart your terminal and run:

```bash
# Show a git icon (should render correctly)
starship prompt

# Or just check with Starship if installed
# Should show your custom prompt, no boxes
```

If you see **boxes or broken glyphs**, the font isn't set correctly. Try:

1. **Restart terminal completely** (close and reopen window)
2. **Double-check font settings** in your terminal app
3. **Try a different font** (maybe your choice has issues)
4. **Verify font file installation** (should appear in font list)

---

## Font Variants

Most Nerd Fonts come in variants:

- **Regular** — normal weight
- **Bold** — thicker weight
- **Italic** — slanted
- **Bold Italic** — both

Install all variants you want to use.

---

## Multiple Fonts

You can install multiple Nerd Fonts and switch between them:

```bash
# macOS
brew install font-cascadia-code-nerd-font
brew install font-fira-code-nerd-font
brew install font-jetbrains-mono-nerd-font

# Linux
# Download each font and install following the steps above
```

Then pick your favorite in terminal settings.

---

## Monospace Check

Make sure your font is **monospace** (all characters same width):

```
M = W
i = l
```

If width differs, the prompt alignment will look broken. All Nerd Fonts should be monospace, but if you download a custom font, verify this.

---

## Troubleshooting

**Font not showing in terminal app's font list:**
- Make sure font is fully installed (fc-cache on Linux, reboot on Windows/macOS)
- Try closing and reopening the terminal app
- Restart your computer

**Boxes showing instead of glyphs:**
- Font not actually installed — re-run installation steps
- Font not set in terminal app — double-check settings
- Terminal doesn't support the font — try a different font or terminal app

**Font looks pixelated/blurry:**
- Increase font size (currently too small for your display)
- Enable anti-aliasing (usually default)
- Try a different font

**Can't find font in terminal app's list:**
- Font name might be different than expected
- Run `fc-list | grep -i fontname` to see exact name (Linux)
- On macOS, try opening Font Book to verify font is installed
- On Windows, check Settings → Fonts → Installed fonts

---

## Recommended Fonts to Try

| Font | Best For | Install |
|------|----------|---------|
| Cascadia Code | Modern, clean, overall best | `brew install font-cascadia-code-nerd-font` |
| Fira Code | Minimal, popular | `brew install font-fira-code-nerd-font` |
| JetBrains Mono | IDE use, professional | `brew install font-jetbrains-mono-nerd-font` |
| Hack | Lightweight | Download from nerdfonts.com |

---

## Next Steps

1. **Font installed and set?** → Test with [Starship Configuration](../guides/starship-configuration.md)
2. **Glyphs still not showing?** → [Troubleshooting](../troubleshooting.md)
3. **Want different icons?** → [Custom Icons](icon-sets/custom-icons.md)
