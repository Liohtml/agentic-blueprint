# Nerd Fonts Reference

Quick reference for popular Nerd Fonts and their features.

## Tier 1: Recommended

### Cascadia Code Nerd Font ⭐
- **Creator:** Microsoft
- **Best for:** Overall daily use, coding, modern look
- **Features:** 
  - Clean, modern design
  - Excellent ligatures (`=>`, `->`, etc.)
  - True monospace
  - Full Nerd Font glyph set
- **Install:** `brew install font-cascadia-code-nerd-font` (macOS)
- **Download:** https://github.com/microsoft/cascadia-code

### Fira Code Nerd Font
- **Creator:** Tonsky
- **Best for:** Popular choice, distinctive style
- **Features:**
  - Wide adoption, well-tested
  - Excellent ligatures
  - Full glyph set
- **Install:** `brew install font-fira-code-nerd-font` (macOS)
- **Download:** https://www.nerdfonts.com/font-downloads

### JetBrains Mono Nerd Font
- **Creator:** JetBrains
- **Best for:** IDE use, professional coding
- **Features:**
  - Designed for IDEs and terminals
  - Excellent readability
  - Full glyph set
- **Install:** `brew install font-jetbrains-mono-nerd-font` (macOS)
- **Download:** https://www.nerdfonts.com/font-downloads

---

## Tier 2: Quality Alternatives

### Hack Nerd Font
- **Creator:** Chris Simpkins
- **Best for:** Lightweight, minimal
- **Features:**
  - Small file size
  - Minimal design
  - Good for slow terminals
- **Download:** https://www.nerdfonts.com/font-downloads

### IBM Plex Mono Nerd Font
- **Creator:** IBM
- **Best for:** Professional, corporate look
- **Features:**
  - Designed by IBM for readability
  - Professional appearance
- **Download:** https://www.nerdfonts.com/font-downloads

### Inconsolata Nerd Font
- **Creator:** Raph Levien
- **Best for:** Minimal, elegant
- **Features:**
  - Elegant design
  - Good monospace alignment
- **Download:** https://www.nerdfonts.com/font-downloads

---

## Tier 3: Stylized/Specialized

### Ubuntu Mono Nerd Font
- **Creator:** Canonical
- **Best for:** Ubuntu systems, distinctive style
- **Features:**
  - Matches Ubuntu OS aesthetic
  - Good readability
- **Download:** https://www.nerdfonts.com/font-downloads

### Noto Mono Nerd Font
- **Creator:** Google
- **Best for:** Unicode support, international
- **Features:**
  - Supports 800+ languages
  - Good for multilingual coding
- **Download:** https://www.nerdfonts.com/font-downloads

### DejaVu Sans Mono Nerd Font
- **Creator:** Community (open source)
- **Best for:** Compatibility, math symbols
- **Features:**
  - Very widely supported
  - Great for scientific notation
- **Download:** https://www.nerdfonts.com/font-downloads

---

## Quick Comparison

| Font | File Size | Modern | Ligatures | Glyph Support | Monospace |
|------|-----------|--------|-----------|---------------|-----------|
| Cascadia Code | ~1.2MB | ✓ | ✓ | Full | ✓ |
| Fira Code | ~0.9MB | ✓ | ✓ | Full | ✓ |
| JetBrains Mono | ~1.1MB | ✓ | ✗ | Full | ✓ |
| Hack | ~0.4MB | ✓ | ✗ | Full | ✓ |
| IBM Plex Mono | ~0.8MB | ✓ | ✗ | Full | ✓ |
| Inconsolata | ~0.5MB | ✓ | ✗ | Full | ✓ |
| Ubuntu Mono | ~0.6MB | ✗ | ✗ | Full | ✓ |
| Noto Mono | ~1.5MB | ✓ | ✗ | Full | ✓ |

---

## Installation Methods

### macOS (Homebrew)
```bash
brew tap homebrew/cask-fonts
brew install font-{name}-nerd-font
```

Example:
```bash
brew install font-cascadia-code-nerd-font
brew install font-fira-code-nerd-font
```

### Linux (Package Manager)
```bash
# Arch
sudo pacman -S nerd-fonts-{name}

# Ubuntu/Debian (add AUR or manual install)
# See: https://www.nerdfonts.com
```

### Manual Download (All Platforms)
https://www.nerdfonts.com/font-downloads

1. Click your desired font
2. Download the .zip file
3. Extract and install following [Font Install Guide](../font-install-guide.md)

---

## All Available Nerd Fonts

Nerd Fonts currently supports:

```
3270, Agave, AnonymousPro, Arimo, AurulentSansMono, 
BigBlueTerminal, BitstreamVeraSansMono, BlexMonoNerdFont,
CaskaydiaCove, CascadiaCode, CodeNewRoman, Cousine, D2Coding,
DaddyTimeMono, DankMono, DejaVuSansMono, DroidSansMono,
Envy Code R, FantasqueSansMono, FiraCode, FiraMono, Flottflott,
FontAwesome, FortuneDot2, GohuFont, GohufontPlus, Gomonotoki,
Hack, Hasklug, HeavyData, Hermit, HeptaodHeavy, HurmitNerdFont,
IBM Plex Mono, Iosevka, IosevkaTermSlab, IosevkaFixed, Iscp,
JetBrainsMono, JetBrainsMonoNL, Kalam, Karlita, Kode Mono,
Lekton, LiberationMono, Lilex, Lira, Liteweight, Lotion,
MartianMono, Meslo, Monofur, Monoid, Monoisome, MononokiNerdFont,
Monospace, MonotinuNerdFont, MPlus, MPlus1p, MPlus1mn, MPlus2c,
Myrica, MyriadPro, Noto, OpenDyslexic, Overpass, OverpassMono,
Oxalis Vera, Oxygen Mono, Papyrus, ParentheticalMono, Plex,
ProggyClean, ProFont, Recursive, Roboto Mono, Robotomono Nerd Font,
RobotoCondensed, Ryoji, Sana, SchlawackL, ShareTechMono, Shelter,
Shure Tech Mono, Signika, Source Code Pro, SourceCodePro, SourceSans,
Spacemono, SpaceMono Nerd Font, Sudo, Tex Gyre Cursor, Tex Gyre Termes,
TerminalDroid, Terminus, TeutonixMono, Tinos, TonalityMono, Torus,
Ubuntu, UbuntuCondensed, UbuntuMono, Uddig, Unispace, UistepMono,
VictorMono, VictorMonoNerdFont, VimDevIcons, Vitamin, VT323,
WeibeiScPro, WeblySleek, WhispacyMono, etc.
```

**Full list:** https://www.nerdfonts.com/#font-downloads

---

## Features by Font

### Ligature Support
Fonts with ligatures render `=>` as `⇒` visually:
- Cascadia Code ✓
- Fira Code ✓
- Source Code Pro ✓
- JetBrains Mono ✗

If you like ligatures, choose Cascadia Code or Fira Code.

### Math Symbols
For scientific/mathematical notation:
- DejaVu Sans Mono ✓ (best)
- Noto Mono ✓
- Most others ✓

### Unicode Support
All Nerd Fonts have strong Unicode support. For international/multilingual:
- Noto Mono (800+ languages)
- Google Noto fonts

---

## Recommended Setup

**Start with:** Cascadia Code Nerd Font (safe choice, looks great)

**If you want:** 
- Ligatures → Cascadia Code or Fira Code
- Minimal size → Hack or Inconsolata
- Professional → JetBrains Mono or IBM Plex Mono
- International → Noto Mono

---

## Testing Fonts Locally

You can try multiple fonts and pick your favorite:

```bash
# macOS: Install multiple fonts
brew install font-cascadia-code-nerd-font font-fira-code-nerd-font font-jetbrains-mono-nerd-font

# Then switch in terminal settings and see which you prefer
```

---

## Next Steps

1. **Ready to install?** → [Font Install Guide](../font-install-guide.md)
2. **Want to customize icons?** → [Custom Icons](custom-icons.md)
3. **Setting up Starship?** → [Starship Configuration](../../guides/starship-configuration.md)

---

## Resources

- Nerd Fonts: https://www.nerdfonts.com
- Glyph browser: https://www.nerdfonts.com/cheat-sheet
- GitHub: https://github.com/ryanoasis/nerd-fonts
