# WSL2 Setup Guide for Windows

Windows Subsystem for Linux 2 (WSL2) gives you a real Linux environment on Windows, perfect for using Starship and other developer tools.

## Why WSL2?

- **Native Linux:** Real Linux kernel, not emulation (WSL2, not WSL1)
- **Fast:** Integrated with Windows, quick file access
- **Isolation:** Your terminal environment separate from Windows
- **Claude Code compatible:** Works perfectly with the Claude Code CLI

## Prerequisites

- Windows 10 build 19041+ or Windows 11
- Administrator access (for initial setup)
- 4GB+ RAM available

## Step 1: Enable WSL2

### Option A: Settings GUI (Easiest for Windows 11)

1. Open **Settings** → **System** → **Optional features**
2. Click **"More features"**
3. Search for and enable:
   - ✓ **Windows Subsystem for Linux**
   - ✓ **Virtual Machine Platform**
4. Click **"Install"**
5. Restart your computer

### Option B: PowerShell (Works on Windows 10 & 11)

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

This installs WSL2, the Linux kernel, and Ubuntu 22.04 LTS by default.

After completion, restart your computer.

### Verify WSL2 Installed

Open PowerShell and run:

```powershell
wsl --version
```

You should see:

```
WSL version: 2.0.0.0
Kernel version: 5.10.16
```

(Exact versions may differ; important thing is WSL version = 2)

## Step 2: Set Up a Terminal Emulator

WSL2 works with any terminal, but these are recommended:

### Option A: Windows Terminal (Recommended)

**Install:** Microsoft Store → search "Windows Terminal" → Install

After install:
1. Open Windows Terminal
2. Click the **dropdown ▼** next to the tab
3. Choose **"Ubuntu"** (or your WSL distro)
4. You now have an Ubuntu terminal on Windows

**You should see:**
```
user@computer:~$
```

### Option B: Windows PowerShell (Built-in)

No installation needed. In PowerShell, type:

```powershell
wsl
```

You enter your WSL2 Ubuntu environment. To exit:

```bash
exit
```

### Option C: Third-Party Emulators

- **Alacritty** (fast, minimal): https://alacritty.org
- **Cmder** (enhanced): https://cmder.app
- **ConEmu** (feature-rich): https://conemu.github.io

## Step 3: Update Linux Packages

In your WSL terminal, run:

```bash
sudo apt update
sudo apt upgrade
```

You should see:

```
[sudo] password for user:
```

(Default password is whatever you set during WSL setup; if unsure, just press Enter or set a new password with `passwd`)

## Step 4: Verify WSL2 Setup

In your WSL terminal, run:

```bash
uname -a
```

You should see something like:

```
Linux COMPUTER-NAME 5.10.16-1-microsoft-standard #1 SMP ... x86_64 GNU/Linux
```

This confirms you're in a real Linux environment.

Also verify Node.js:

```bash
node -v
npm -v
```

If not installed, install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## Step 5: Install Claude Code CLI

In your WSL terminal:

```bash
npm install -g @anthropic-ai/claude-code
```

Verify:

```bash
which claude
# Should show: /usr/local/bin/claude (or similar)

claude --version
# Should show version number
```

## Step 6: Set Font in Windows Terminal (Important!)

By default, Windows Terminal uses a system font that doesn't support Starship glyphs.

1. Open Windows Terminal
2. Click **Settings** (⚙️ icon, bottom left)
3. Go to **Appearance** (left sidebar)
4. Find **Font face**
5. Change to **Cascadia Code** (built-in, has Nerd Font variant)

Or if you prefer a custom Nerd Font:
- Install from nerdfonts.com
- Set it in the same settings menu

You should now see glyphs correctly when you add Starship (next steps).

## What's Next?

You now have WSL2 set up! Next:

1. **Inside your WSL terminal**, follow [Unix Setup](../guides/unix-setup.md) — you're running Linux now
2. Then [Starship Configuration](../guides/starship-configuration.md)
3. Then [Font Installation](../fonts-icons/font-install-guide.md) (for WSL)
4. Then [Shell Aliases](../guides/shell-aliases.md)

---

## Troubleshooting

**WSL installation fails with "not found":**
- Windows may be out of date. Run Windows Update and restart.
- Try Option B (PowerShell) instead of Option A (Settings).

**Can't access Ubuntu terminal in Windows Terminal:**
- Close and reopen Windows Terminal
- Restart your computer if you just enabled WSL2

**PowerShell command `wsl` not recognized:**
- WSL2 may not be fully installed. Go through Steps 1–2 again.
- Restart your computer.

**Font shows as boxes in terminal:**
- Set font to Cascadia Code (Step 6) or install a Nerd Font first
- See [Font Install](../fonts-icons/font-install-guide.md)

**Slow file access between Windows and WSL:**
- Normal WSL2 behavior (Windows ↔ Linux crossing has overhead)
- Keep your project files inside WSL (~/ instead of /mnt/c/) for speed

**Can't find password when setting up:**
- WSL doesn't require a password for the first user by default
- If you need to set one: `sudo passwd`

**More issues?** → [Troubleshooting](../troubleshooting.md)

---

## Fun Fact

WSL2 uses Hyper-V virtualization but is optimized for Windows integration. You get nearly native Linux performance with Windows convenience.
