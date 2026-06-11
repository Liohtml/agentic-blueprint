# Vim and Neovim Setup

Vim is the ubiquitous terminal text editor. Neovim is a modern fork with better defaults and Lua scripting.

## Vim vs Neovim

| Aspect | Vim | Neovim |
|--------|-----|--------|
| **Installation** | Built-in most systems | `brew install neovim` |
| **Learning curve** | Steep, but rewarding | Same as Vim |
| **Plugins** | Vimscript (complex) | Lua (modern) + Vimscript |
| **Defaults** | Minimal | Better (sensible) |
| **Recommendation** | Use if Vim already installed | Install fresh, Vim is outdated |

**For new users: install Neovim.** It's Vim with better UX.

## Installation

### Neovim (Recommended)

**macOS:**
```bash
brew install neovim
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install -y neovim
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install -y neovim
```

**Linux (Arch):**
```bash
sudo pacman -Sy neovim
```

**Verify:**
```bash
nvim --version
# Should show: NVIM v0.9.x (or higher)
```

### Vim (If You Prefer)

Usually pre-installed. Verify:

```bash
vim --version
# Should show: VIM version 8.0+ (or 9.x)
```

If not installed:

**macOS:**
```bash
brew install vim
```

**Linux:** See your distro's package manager (Ubuntu: `apt`, Fedora: `dnf`, Arch: `pacman`)

## Quick Start: Minimal Config

### For Neovim

Create `~/.config/nvim/init.vim` (or `init.lua` for Lua):

```vim
" Minimal Neovim config

set number               " Show line numbers
set relativenumber       " Relative line numbers
set tabstop=2            " 2 spaces per tab
set shiftwidth=2         " Auto-indent width
set expandtab            " Use spaces instead of tabs
set mouse=a              " Enable mouse support

" Quick Claude Code launch
map <Leader>c :!claude<CR>
```

### For Vim

Create `~/.vimrc`:

```vim
" Minimal Vim config

set number
set tabstop=2
set shiftwidth=2
set expandtab

" Quick Claude Code launch
map <Leader>c :!claude<CR>
```

After creating, reload in editor:
```vim
:source ~/.vimrc      " (Vim)
:source ~/.config/nvim/init.vim  " (Neovim)
```

## Essential Vim Keys

**Navigation:**
- `h/j/k/l` — left/down/up/right
- `w` — next word
- `b` — previous word
- `gg` — start of file
- `G` — end of file
- `Ctrl+f` — page down
- `Ctrl+b` — page up

**Editing:**
- `i` — insert mode (before cursor)
- `a` — append mode (after cursor)
- `o` — new line below
- `O` — new line above
- `d` — delete (e.g., `dw` = delete word)
- `y` — yank/copy (e.g., `yw` = copy word)
- `p` — paste
- `u` — undo
- `Ctrl+r` — redo

**Saving & Quitting:**
- `:w` — save
- `:q` — quit
- `:wq` — save and quit
- `:q!` — quit without saving

**Search:**
- `/pattern` — search forward
- `?pattern` — search backward
- `n` — next match
- `N` — previous match
- `:%s/old/new/g` — replace all

## Running Claude Code from Vim

### Quick Launch

In Vim command mode:
```vim
:!claude
```

Launches Claude Code. Output shows below your editor.

### With a Keybinding

Add to your `.vimrc` or `init.vim`:

```vim
" Launch Claude Code
map <Leader>c :!claude<CR>
map <Leader>C :!claude --dangerously-skip-permissions<CR>

" Or using the clady alias
map <Leader>c :!clady<CR>
```

Then press `<Leader>c` (usually `\c` by default) to launch Claude Code.

## Plugins for Claude Code Workflow

### Popular Plugin Manager: vim-plug (Vim) or packer.nvim (Neovim)

### Recommended Plugins

**File Navigation (fzf.vim):**
```vim
" Add to .vimrc or init.vim
Plug 'junegunn/fzf'
Plug 'junegunn/fzf.vim'

" Usage: :Files (fuzzy find files)
```

**Language Server (Neovim only with nvim-lsp):**
```lua
-- nvim-lsp in init.lua
require('nvim-lsp').setup()
```

**Treesitter (Better Syntax Highlighting):**
```lua
-- init.lua
require('nvim-treesitter.configs').setup()
```

See https://neovim.io/ for plugin setup details.

## Configuration Examples

### Minimal (Fast Startup)
```vim
set number
set tabstop=4
set expandtab
map <Leader>c :!claude<CR>
```

### Developer-Friendly
```vim
set number
set relativenumber
set tabstop=2
set shiftwidth=2
set expandtab
set mouse=a
set ignorecase
set smartcase

" Search highlighting
set hlsearch
nnoremap <Esc> :noh<CR>

" Claude Code shortcuts
map <Leader>c :!claude<CR>
map <Leader>C :!clady<CR>
```

## Troubleshooting

**Vim feels unfamiliar:**
- Run `vimtutor` (comes with Vim) — 30-minute interactive tutorial
- Or read: https://vim.fandom.com/wiki/Best_of_Vim_Tips

**Mouse not working:**
- Add `set mouse=a` to your config

**Neovim not finding config:**
- Create directory: `mkdir -p ~/.config/nvim`
- Config goes in `~/.config/nvim/init.vim` or `~/.config/nvim/init.lua`

**Claude Code not launching:**
- Test command directly: `:!which claude`
- Check installation: `npm install -g @anthropic-ai/claude-code`

**Indentation looks wrong:**
- Check `tabstop` and `shiftwidth` settings
- Tip: Use `set list` to see tabs vs spaces (`set nolist` to hide)

**Plugins not loading:**
- Verify plugin manager installed (vim-plug for Vim, packer for Neovim)
- Restart Vim after editing config

---

## Next Steps

- **Want another editor?** → [Helix](helix.md), [Emacs](emacs.md), [Micro](micro.md)
- **Want Starship prompt?** → [Starship Configuration](../starship-configuration.md)
- **Need help?** → [Troubleshooting](../troubleshooting.md)

---

## Resources

- Vim docs: `:help` (inside Vim)
- Vim cheat sheet: https://vim.rtorr.com/
- Neovim docs: https://neovim.io/
- Plugin ecosystem: https://github.com/neovim/neovim/wiki/Related-projects
