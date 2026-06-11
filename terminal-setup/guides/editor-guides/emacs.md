# Emacs Setup

Emacs is a powerful, extensible text editor with Lisp scripting and deep integration capabilities.

## Why Emacs?

- **Extensible** — Nearly everything configurable in Elisp
- **Powerful** — Built-in package manager, mail client, shell, more
- **Org-mode** — Great for writing specs, plans, and documentation
- **Community** — Large ecosystem of packages and configs

**Tradeoff:** Steeper learning curve than Vim or Micro.

## Installation

### macOS
```bash
brew install emacs
```

Or build from source:
```bash
brew tap-new local/emacs
brew extract --version=29.1 emacs local/emacs
brew install emacs@29.1
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y emacs
```

### Linux (Fedora/RHEL)
```bash
sudo dnf install -y emacs
```

### Linux (Arch)
```bash
sudo pacman -Sy emacs
```

### Verify
```bash
emacs --version
# Should show: GNU Emacs 28.x or 29.x
```

## Quick Start: Minimal Config

Create `~/.emacs.d/init.el`:

```elisp
;; Minimal Emacs config

;; Basic UI
(menu-bar-mode -1)
(tool-bar-mode -1)
(scroll-bar-mode -1)

;; Line numbers and whitespace
(global-display-line-numbers-mode t)
(global-whitespace-mode -1)

;; Indentation
(setq-default tab-width 2)
(setq-default indent-tabs-mode nil)

;; Launch Claude Code
(defun launch-claude ()
  (interactive)
  (async-shell-command "claude"))

(global-set-key (kbd "C-c c") 'launch-claude)
```

Save and restart Emacs.

## Essential Emacs Keys

**Navigation:**
- `C-f` — forward character
- `C-b` — backward character
- `C-n` — next line
- `C-p` — previous line
- `M-f` — forward word
- `M-b` — backward word
- `C-a` — line start
- `C-e` — line end
- `M-<` — file start
- `M->` — file end

**Editing:**
- `C-d` — delete character
- `M-d` — delete word
- `C-k` — kill (cut) to end of line
- `C-y` — yank (paste)
- `C-x u` — undo
- `C-/` — undo (alternative)

**Saving & Quitting:**
- `C-x C-s` — save
- `C-x C-c` — quit
- `C-x C-w` — save as

**Search & Replace:**
- `C-s` — search forward
- `M-%` — query replace

## Configuration for Claude Code

### Simple Approach

```elisp
;; Launch Claude Code in a new window
(defun claude-code ()
  (interactive)
  (async-shell-command "claude code"))

(global-set-key (kbd "C-c c") 'claude-code)
```

Press `Ctrl+c c` to launch Claude Code.

### With Current Directory

```elisp
(defun claude-code-here ()
  (interactive)
  (async-shell-command (concat "claude code " default-directory)))

(global-set-key (kbd "C-c c") 'claude-code-here)
```

## Org-Mode Integration

Emacs has great org-mode for writing PLAN and SPEC documents:

```elisp
(require 'org)

;; Org-mode configs
(setq org-log-done 'time)
(setq org-todo-keywords '((sequence "TODO" "IN-PROGRESS" "|" "DONE")))

;; Font sizes for headings
(set-face-attribute 'org-level-1 nil :height 1.3)
(set-face-attribute 'org-level-2 nil :height 1.1)
```

Create a file `plan.org`:

```
* Project Title
** Phase 1: Planning
   - [ ] Research
   - [ ] Design
** Phase 2: Implementation
   - [ ] Build
   - [ ] Test
```

## Using Emacs with Claude Code

### Side-by-Side Workflow

1. Split Emacs into two windows:
   ```
   C-x 2   (split vertically)
   C-x 3   (split horizontally)
   ```

2. Keep your code in one window
3. Launch Claude Code in another terminal (`:!claude` or use your shortcut)
4. Switch between windows with `C-x o`

### LSP (Language Server) Integration

For better IDE features:

```elisp
;; Install lsp-mode from MELPA, then:
(require 'lsp-mode)
(add-hook 'js-mode-hook #'lsp)
(add-hook 'python-mode-hook #'lsp)
```

But this is optional — Emacs works fine without it.

## Troubleshooting

**Emacs feels overwhelming:**
- Start minimal (just basics above)
- Learn one thing at a time
- See https://www.gnu.org/software/emacs/manual/html_node/emacs/

**C-c c not launching Claude Code:**
- Check key binding: `C-h k C-c c` (shows what's bound to that key)
- Verify `async-shell-command` is available (built-in to Emacs 28+)
- Try: `M-x launch-claude` to test the function directly

**Config not loading:**
- Restart Emacs completely
- Check file location: `~/.emacs.d/init.el` (exact path)
- Check for errors: `M-x toggle-debug-on-error`

**Line numbers look weird:**
- Try: `M-x linum-mode` or `M-x display-line-numbers-mode`

**Want a starter config?**
- See https://github.com/bbatsov/prelude
- Or https://github.com/hlissner/doom-emacs

---

## Next Steps

- **Want another editor?** → [Helix](helix.md), [Vim](vim-neovim.md), [Micro](micro.md)
- **Want Starship prompt?** → [Starship Configuration](../starship-configuration.md)
- **Need help?** → [Troubleshooting](../troubleshooting.md)

---

## Resources

- Official docs: https://www.gnu.org/software/emacs/
- Org-mode: https://orgmode.org/
- Package manager (MELPA): https://melpa.org/
- Starter configs: https://www.emacswiki.org/
