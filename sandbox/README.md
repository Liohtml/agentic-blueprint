# sandbox/ — Docker Sandbox Template

A ready-to-copy Docker setup for running coding agents (Claude Code) in an
isolated container, so an autonomous agent cannot touch your host system.

Two ways to use it:

1. **VS Code Dev Container** (recommended for beginners): copy `Dockerfile` +
   `devcontainer.json` into `<your-project>/.devcontainer/` and "Reopen in Container".
2. **Plain Docker CLI**: `docker build` this image, then `docker run` it with
   your project folder mounted at `/workspace`.

Full walkthrough, security trade-offs, and Blueprint integration:
[docs/docker-sandbox.md](../docs/docker-sandbox.md)
