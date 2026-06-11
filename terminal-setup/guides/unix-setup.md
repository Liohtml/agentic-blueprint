# Unix Setup Guide for Linux and macOS

Check that your system has everything needed for Starship, fonts, and the Claude Code CLI.

## Prerequisites

You'll need:
- A modern shell: bash 5.0+, zsh, fish, or sh
- `curl` or `wget` (to download files)
- Node.js 18+
- npm (Node's package manager)
- Claude Code CLI

## Step 1: Check Your Shell

```bash
echo $SHELL
```

You should see one of:
- `/bin/bash` (default on Linux)
- `/bin/zsh` (default on macOS Catalina+)
- `/bin/fish` (if you use fish)

### If You Need a Newer Shell

**macOS:**
```bash
# Install bash 5+ with Homebrew
brew install bash

# Or install zsh (recommended)
brew install zsh
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y bash zsh

# Fedora/RHEL
sudo dnf install -y bash zsh

# Arch
sudo pacman -Sy bash zsh
```

## Step 2: Check curl

```bash
which curl
```

Should show something like `/usr/bin/curl` or `/usr/local/bin/curl`.

### If curl is Missing

**macOS:**
```bash
brew install curl
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install -y curl
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install -y curl
```

**Linux (Arch):**
```bash
sudo pacman -Sy curl
```

## Step 3: Check Node.js and npm

```bash
node -v
npm -v
```

You should see versions ≥ 18.0.0. If not, or if the commands don't exist:

### Installing Node.js

**macOS (with Homebrew):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install -y nodejs
```

**Linux (Arch):**
```bash
sudo pacman -Sy nodejs npm
```

**Or use nvm (Node Version Manager, works everywhere):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart your terminal, then:
nvm install 20
nvm use 20
```

## Step 4: Install Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

Verify installation:

```bash
which claude
# Should show a path like /usr/local/bin/claude

claude --version
# Should show a version number
```

## Step 5: Install Homebrew (macOS Only)

If you're on macOS and don't have Homebrew:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After install, verify:

```bash
brew --version
```

## Verification Checklist

Run each command and verify the output:

```bash
# Shell check
echo $SHELL
# Should show /bin/bash, /bin/zsh, /bin/fish, or /bin/sh

# curl check
curl --version
# Should show version info

# Node check
node --version
# Should show v18.0.0 or higher

# npm check
npm --version
# Should show 9.0.0 or higher

# Claude Code check
claude --version
# Should show version number like 0.5.2 or similar
```

All should return without "command not found" errors.

## What's Next?

You're all set! Now:

1. [Starship Configuration](starship-configuration.md) — set up your prompt
2. [Font Installation](../fonts-icons/font-install-guide.md) — make sure glyphs render correctly
3. [Shell Aliases](shell-aliases.md) — add the `clady` alias and others
4. [Editor Setup](editor-guides/) (optional) — integrate with your favorite editor

---

## Troubleshooting

**Command not found errors:**
- Run `which <command>` to see if the tool is in your PATH
- If installed but not found, restart your terminal
- If still not found, reinstall the tool

**npm install -g fails with permission error:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g @anthropic-ai/claude-code

# Option 2: Change npm default directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
# Add the PATH line to your ~/.bashrc or ~/.zshrc to make it permanent
```

**Old Bash on macOS:**
macOS ships with bash 3.x (old). Use Homebrew to install bash 5:
```bash
brew install bash
# Then add to ~/.zshrc or create ~/.bashrc:
# if [ -x /usr/local/bin/bash ]; then
#   exec /usr/local/bin/bash
# fi
```

**More issues?** → [Troubleshooting](../troubleshooting.md)

---

## Next: Starship

Once these prerequisites are verified, you're ready for [Starship Configuration](starship-configuration.md).
