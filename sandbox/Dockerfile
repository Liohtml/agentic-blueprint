# Agent sandbox image — a minimal, isolated environment for running coding
# agents (Claude Code) without giving them access to your host system.
#
# Usage and background: docs/docker-sandbox.md
# Modeled after Anthropic's reference devcontainer:
# https://github.com/anthropics/claude-code/tree/main/.devcontainer

# Node LTS on Debian slim (Node 22 — Node 20 reached end-of-life 2026-04-30).
# Claude Code is a Node CLI, so a Node base image keeps the setup to one
# layer. Swap in a language-specific image (python, golang, ...) if your
# project needs it — just keep a supported Node version available for the CLI.
FROM node:22-slim

# Tools agents actually use:
#   git      — version control (commit before autonomous runs!)
#   tmux     — split panes; required for Agent Teams inside the container
#   ripgrep  — fast code search (Claude Code's Grep tool shells out to rg)
#   procps   — ps/top, useful for debugging running agents
#   ca-certificates, curl — HTTPS and basic downloads
# Add your project's build/test toolchain here (compilers, make, etc.).
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       git \
       tmux \
       ripgrep \
       procps \
       less \
       ca-certificates \
       curl \
  && rm -rf /var/lib/apt/lists/*

# Claude Code CLI, installed globally while still root so it lands on PATH
# for every user. The bare package name resolves to the stable "latest" tag —
# do not pin a freshly released version (repo rule: no packages younger than
# 14 days).
RUN npm install -g @anthropic-ai/claude-code

# Run as the non-root "node" user (uid 1000) that ships with the Node images.
# Even inside a container, not running as root limits what a misbehaving
# agent (or a compromised dependency) can do.
USER node

# The project is mounted here — see docs/docker-sandbox.md for the
# `docker run -v "$PWD":/workspace` invocation.
WORKDIR /workspace

# Drop into a shell by default; start the agent yourself with `claude`.
CMD ["/bin/bash"]
