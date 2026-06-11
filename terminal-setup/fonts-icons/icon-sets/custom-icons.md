# Customizing Starship Icons

Change which icons Starship displays in your prompt.

## Default Icons

Starship comes with default icons:
- Git: ` ` (branch)
- Node.js: ` ` (node icon)
- Python: ` ` (python icon)
- Rust: ` ` (rust crab)
- And 200+ others

## Customizing Icons

Edit your Starship config at `~/.config/starship.toml` and change the `symbol` for each module:

```toml
[git_branch]
symbol = " "          # Default
# Change to any other symbol or emoji

[nodejs]
symbol = " "         # Default
# Change to any other symbol
```

## Available Symbols

### Common Nerd Font Symbols

**Version Control:**
```
 = git branch
 = git merge
 = git commit
 = git stash
```

**Languages:**
```
 = Node.js
 = Python
 = Rust
 = Go
 = Ruby
 = Java
 = C++
 = Bash
```

**Status:**
```
✓ = success (checkmark)
✗ = error (cross)
⬆ = ahead in git
⬇ = behind in git
⬍ = diverged (merge)
⚠ = warning
```

**Other:**
```
→ = arrow right
← = arrow left
⚡ = lightning (speed)
🚀 = rocket (launch)
🐳 = whale (Docker)
☁ = cloud
⭐ = star
```

### Full Glyph Cheat Sheet

See all available Nerd Font glyphs: https://www.nerdfonts.com/cheat-sheet

You can use any glyph from there in your config.

## Example Customizations

### Minimal Icons

```toml
[git_branch]
symbol = "git:"

[git_status]
symbol = "["
```

### Emojis Instead of Symbols

```toml
[git_branch]
symbol = "🌳 "

[nodejs]
symbol = "⬢ "

[python]
symbol = "🐍 "
```

### Custom Style

```toml
[git_branch]
symbol = " "
style = "bold blue"

[nodejs]
symbol = " "
style = "bold green"

[python]
symbol = " "
style = "bold yellow"
```

## All Customizable Modules

You can customize symbols for:

```toml
[aws]                  symbol = "🅰 "
[buf]                  symbol = "🦬 "
[cmake]                symbol = "△ "
[cobol]                symbol = "⚙️ "
[conda]                symbol = "🅒 "
[dart]                 symbol = "🎯 "
[deno]                 symbol = "🦕 "
[directory]            symbol = "📁 "
[docker_context]       symbol = "🐋 "
[dotnet]               symbol = "•NET "
[elixir]               symbol = "💧 "
[elm]                  symbol = "🌳 "
[erlang]               symbol = "e "
[fennel]               symbol = "🧅 "
[git_branch]           symbol = " "
[git_status]           symbol = "["
[git_metrics]          symbol = "+"
[gleam]                symbol = "⭐ "
[golang]               symbol = " "
[guix_shell]           symbol = "🐃 "
[haskell]              symbol = "λ "
[haxe]                 symbol = "⚡ "
[helm]                 symbol = "⎈ "
[hg_branch]            symbol = "🌿 "
[java]                 symbol = " "
[julia]                symbol = "ஸ "
[kotlin]               symbol = "🅺 "
[kubernetes]           symbol = "☸ "
[lua]                  symbol = "🌙 "
[nim]                  symbol = "👑 "
[nix_shell]            symbol = "❄️ "
[nodejs]               symbol = " "
[nushell]              symbol = "🧬 "
[ocaml]                symbol = "🐫 "
[package]              symbol = "📦 "
[php]                  symbol = "🐘 "
[pulumi]               symbol = "🛡️ "
[purescript]           symbol = "<=- "
[python]               symbol = " "
[quarto]               symbol = "⨸ "
[raku]                 symbol = "🦋 "
[rlang]                symbol = "📈 "
[ruby]                 symbol = " "
[rust]                 symbol = " "
[scala]                symbol = "🔗 "
[singularity]          symbol = "📦 "
[solidity]             symbol = "🔷 "
[spack]                symbol = "🅢 "
[swift]                symbol = "🍎 "
[terraform]            symbol = "💠 "
[typst]                symbol = "t "
[vlang]                symbol = "V "
[vagrant]              symbol = "⍱ "
[zig]                  symbol = "⚡ "
```

## Performance Tip

Too many symbols can slow down your prompt (especially on large git repos). Start with essentials:

```toml
[git_branch]
symbol = " "

[nodejs]
symbol = " "

[python]
symbol = " "

# Disable less important symbols for speed
[docker_context]
disabled = true

[kubernetes]
disabled = true

[time]
disabled = true
```

## Emoji Support

If you want emojis instead of Nerd Font glyphs:

```toml
[git_branch]
symbol = "🌳 "

[nodejs]
symbol = "⬢ "

[python]
symbol = "🐍 "

[rust]
symbol = "🦀 "

[docker_context]
symbol = "🐋 "
```

This works if your font supports emojis (most modern fonts do).

## Troubleshooting

**Symbol shows as a box:**
- Missing Nerd Font (see [Font Installation](../font-install-guide.md))
- Your font doesn't have that particular glyph
- Try a different glyph

**Symbol is invisible or blank:**
- Glyph exists but blends with background
- Try a different symbol color: `style = "bold blue"`
- Choose a more visible glyph

**Config not reloading:**
- Restart your terminal completely
- Or: `eval "$(starship init bash)"` (reload Starship)

**Want to see all your current symbols?**
```bash
starship module git_branch
starship module nodejs
# etc.
```

---

## Next Steps

1. **Finished customizing?** → [Starship Configuration](../../guides/starship-configuration.md)
2. **Want shell aliases?** → [Shell Aliases](../../guides/shell-aliases.md)
3. **Need help?** → [Troubleshooting](../../troubleshooting.md)

---

## Resources

- Glyph cheat sheet: https://www.nerdfonts.com/cheat-sheet
- Emoji list: https://emojipedia.org/
- Starship modules: https://starship.rs/config/#modules
