# Shell Aliases and Shortcuts

Create convenient shortcuts for common commands, including the `clady` alias for Claude Code.

## What Are Aliases?

An alias is a shorthand for a longer command. Instead of typing:

```bash
claude code --dangerously-skip-permissions
```

You can just type:

```bash
clady
```

## The `clady` Alias

**What it does:** Launches Claude Code in your current directory without permission prompts.

**Why use it:** Faster workflow in trusted projects or development environments.

**Safety warning:** ⚠️ Use `--dangerously-skip-permissions` only in:
- Your own projects
- Trusted, sandboxed environments
- CI/CD pipelines where you control the code

**Do NOT use** on untrusted code or shared systems.

### Installation

If you used the automated setup (QUICKSTART.md), this is already done.

To add manually:

**Bash** — add to `~/.bashrc`:
```bash
alias clady='claude code --dangerously-skip-permissions'
```

**Zsh** — add to `~/.zshrc`:
```bash
alias clady='claude code --dangerously-skip-permissions'
```

**Fish** — add to `~/.config/fish/config.fish`:
```fish
alias clady='claude code --dangerously-skip-permissions'
```

**PowerShell** — add to `$PROFILE`:
```powershell
Set-Alias -Name clady -Value 'claude code --dangerously-skip-permissions'
```

After adding, restart your terminal or run:

```bash
source ~/.bashrc    # bash
source ~/.zshrc     # zsh
# fish and PowerShell reload automatically
```

### Verify Installation

```bash
alias clady
# Should show: alias clady='claude code --dangerously-skip-permissions'

# Test it
clady --help
# Should show Claude Code help text
```

## Other Useful Aliases

### Quick Directory Navigation

```bash
alias ll='ls -lah'        # List all files with details
alias la='ls -A'          # List hidden files
alias ..='cd ..'          # Go up one directory
alias ...='cd ../..'      # Go up two directories
```

### Development Shortcuts

```bash
alias cls='claude code'                              # Quick Claude Code launch
alias clobs='claude code --dangerously-skip-permissions'  # Shorter than clady
alias gitstatus='git status'                         # Full git status
alias gitlog='git log --oneline -10'                 # Recent commits
```

### Project-Specific

```bash
alias blog='cd ~/projects/my-blog && code .'         # Jump to project
alias work='cd ~/projects/work && code .'            # Jump to work folder
```

## Creating an Alias

**Basic syntax:**
```bash
alias shortname='command'
```

**Example:**
```bash
alias newname='claude code --dangerously-skip-permissions'
```

**With arguments:**
```bash
alias newname='command --flag value'
```

### Adding to Your Shell Config

**Bash/Zsh:**

1. Open your config file:
   ```bash
   # Bash
   nano ~/.bashrc
   
   # Zsh
   nano ~/.zshrc
   ```

2. Add your aliases at the end:
   ```bash
   # My aliases
   alias clady='claude code --dangerously-skip-permissions'
   alias ll='ls -lah'
   ```

3. Save (`Ctrl+O`, then `Enter`, then `Ctrl+X`)

4. Reload:
   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

**Fish:**

1. Open Fish config:
   ```bash
   nano ~/.config/fish/config.fish
   ```

2. Add aliases:
   ```fish
   alias clady='claude code --dangerously-skip-permissions'
   alias ll='ls -lah'
   ```

3. Save and reload (Fish reloads automatically)

**PowerShell:**

1. Open PowerShell profile:
   ```powershell
   notepad $PROFILE
   ```

2. Add aliases:
   ```powershell
   Set-Alias -Name clady -Value 'claude code --dangerously-skip-permissions'
   Set-Alias -Name ll -Value 'Get-ChildItem -Force'
   ```

3. Save and reload (PowerShell reloads automatically on next session)

## Listing Aliases

See all your aliases:

```bash
# Bash/Zsh/Fish
alias

# PowerShell
Get-Alias
```

## Removing an Alias

If you want to remove an alias:

```bash
# Bash/Zsh/Fish
unalias clady

# PowerShell
Remove-Item Alias:clady
```

This removes it for the current session only. To permanently remove, edit your shell config file and delete the line.

## Temporary Alias (Current Session Only)

Create an alias that disappears when you close the terminal:

```bash
alias clady='claude code --dangerously-skip-permissions'
```

(This is temporary. To make it permanent, add it to your shell config file.)

## Troubleshooting

**Alias not working after adding to config:**
- Restart your terminal completely (close and reopen)
- Or reload the config: `source ~/.bashrc` or `source ~/.zshrc`
- Check that you edited the correct file (`~/.bashrc` vs `~/.zshrc`)

**Seeing "command not found":**
- Check the alias exists: `alias clady`
- Check the underlying command works: `claude code --help`
- Make sure you didn't accidentally put the alias in the wrong file

**Want to see what an alias does:**
```bash
alias clady
# Shows: alias clady='claude code --dangerously-skip-permissions'
```

**Alias works differently than expected:**
- Check for conflicting aliases: `alias`
- Try the full command to verify it works: `claude code --dangerously-skip-permissions --help`

---

## Next Steps

- **Want to customize your prompt?** → [Starship Configuration](starship-configuration.md)
- **Want to use an editor?** → [Editor Guides](editor-guides/)
- **Something not working?** → [Troubleshooting](../troubleshooting.md)

---

## Tips

- **Name aliases after what they do** (easy to remember)
- **Keep aliases simple** (complex logic belongs in scripts)
- **Document aliases** (add comments in your config: `# Quick git status`)
- **Don't shadow system commands** (don't create `alias ls='rm'` 😅)

Happy typing! 🚀
