# Agentic Development Standards

Universal best practices and guidelines for AI-assisted development across all projects.

## Contents

- `copilot-best-practices.md` - Universal AI agent guidelines
- `copilot-terminal-config.md` - Terminal configuration strategy
- `commit-convention.md` - Conventional commit standards
- `agent-terminal-rollout.md` - Deployment guide
- `terminal-testing.md` - Terminal testing guide

## Usage

Add as submodule to your projects:

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

Reference in your project's `.github/copilot-instructions.md`:

```markdown
**⚠️ CRITICAL**: Universal best practices are in `agentic-dev-standards/copilot-best-practices.md`.
**READ THAT FILE FIRST** before reading project-specific instructions below.
```

## Updating

To pull latest universal guidelines:

```bash
cd agentic-dev-standards
git pull origin main
cd ..
git add agentic-dev-standards
git commit -m "chore: Update agentic-dev-standards submodule"
```

## Contributing

When you discover new universal rules while working on any project, update this submodule and push changes so all projects benefit.
