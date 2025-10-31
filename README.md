# Agentic Development Standards

**Universal best practices for AI-assisted development**, compatible with GitHub Copilot, Cursor, Claude Code, Windsurf, Continue, and other AI coding assistants.

## 🎯 Purpose

This repository provides a comprehensive set of standards and best practices for working with AI coding assistants. Use it as a **Git submodule** in your projects to ensure consistent, high-quality AI-assisted development across your entire team and all your projects.

## 📚 Contents

### Core Standards

- **[universal-agent-rules.md](universal-agent-rules.md)** - Universal best practices for all AI agents
- **[terminal-standards.md](terminal-standards.md)** - Clean shell environment requirements (CRITICAL)
- **[commit-conventions.md](commit-conventions.md)** - Conventional Commits standard

### Workflow Patterns

- **[session-management.md](workflow-patterns/session-management.md)** - Session summaries and tracking
- **[branch-strategy.md](workflow-patterns/branch-strategy.md)** - Branch naming and git workflows
- **[github-issues.md](workflow-patterns/github-issues.md)** - Issue and PR management
- **[dependency-management.md](workflow-patterns/dependency-management.md)** - Adding and maintaining dependencies

### Tool Integration

- **[Integration Guide](integration/README.md)** - Tool capabilities matrix and setup overview
- **[GitHub Copilot](integration/vscode-copilot.md)** - VSCode + Copilot integration
- **[Cursor](integration/cursor.md)** - Cursor IDE integration
- **[Claude Code](integration/claude-code.md)** - Claude CLI integration
- **[Windsurf](integration/windsurf.md)** - Windsurf IDE integration
- **[Continue](integration/continue.md)** - Continue extension integration

### Migration

- **[Migration Guide](migration/README.md)** - Migrate from tool-specific to universal standards

## 🚀 Quick Start

### 1. Choose Your AI Tool

| Tool | Best For | Setup Guide |
|------|----------|-------------|
| **GitHub Copilot** | VSCode users, GitHub integration | [Setup →](integration/vscode-copilot.md) |
| **Cursor** | AI-first IDE, multi-file editing | [Setup →](integration/cursor.md) |
| **Claude Code** | Terminal workflows, autonomous agents | [Setup →](integration/claude-code.md) |
| **Windsurf** | VSCode-like with Cascade mode | [Setup →](integration/windsurf.md) |
| **Continue** | Open-source, customizable | [Setup →](integration/continue.md) |

See [full comparison →](integration/README.md)

### 2. Add as Submodule

```bash
# In your project root
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 3. Configure Your Tool

Create your tool's configuration file and reference these standards:

**GitHub Copilot** - Create `.github/copilot-instructions.md`:
```markdown
# GitHub Copilot Instructions for [Your Project]

⚠️ CRITICAL - READ FIRST: Universal standards in `agentic-dev-standards/`

1. agentic-dev-standards/terminal-standards.md
2. agentic-dev-standards/commit-conventions.md
3. agentic-dev-standards/universal-agent-rules.md

---

## Project-Specific Instructions
[Your project-specific rules here]
```

**Cursor** - Create `.cursorrules`:
```markdown
# Cursor Rules for [Your Project]

⚠️ READ FIRST: agentic-dev-standards/ contains universal standards
[Same references as above]

## Project-Specific Rules
[Your rules]
```

**Other tools**: See [integration guides](integration/) for tool-specific setup.

### 4. Start Using AI Assistance

Your AI assistant will now:
- ✅ Use clean bash environments (no user aliases, predictable behavior)
- ✅ Follow Conventional Commits (feat:, fix:, docs:, etc.)
- ✅ Make atomic commits (one logical change per commit)
- ✅ Follow universal best practices for code quality, testing, documentation

## 🎯 What's Included

### Terminal Standards

**Problem**: User shell customizations (aliases, prompts, slow configs) break AI assumptions and waste tokens.

**Solution**: All AI agents use clean, minimal bash:
```bash
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command'
```

**Benefits**:
- Predictable command behavior
- No alias interference (`cat` → `bat`, `ls` → `exa`)
- Faster execution (no slow shell frameworks)
- Reduced token usage (no custom prompts)

[Full details →](terminal-standards.md)

### Commit Conventions

**Standard**: [Conventional Commits](https://www.conventionalcommits.org/)

```bash
feat: Add user authentication
fix: Correct validation logic
docs: Update API documentation
test: Add integration tests
```

**Benefits**:
- Clean git history
- Automated changelog generation
- Easy rollback of specific changes
- Better code review

[Full details →](commit-conventions.md)

### Universal Best Practices

- 📝 Documentation organization (where to place files)
- 📁 File naming conventions (lowercase-with-hyphens)
- ✅ Testing best practices (TDD, coverage, idempotence)
- 🎯 Code quality standards (DRY, SOLID, meaningful names)
- 🔍 Debugging tips and common issues
- 📚 External resources and references

[Full details →](universal-agent-rules.md)

### Workflow Patterns

- **Session Management**: Create summaries at end of work sessions for context preservation
- **Branch Strategy**: Consistent branch naming (feature/, bugfix/, etc.) and git workflows
- **GitHub Issues**: Label management, issue templates, PR best practices
- **Dependency Management**: Evaluation checklist before adding dependencies

[Full details →](workflow-patterns/)

## 🔄 Updating Standards

When universal standards are updated, pull latest in each project:

```bash
cd agentic-dev-standards
git pull origin main
cd ..
git add agentic-dev-standards
git commit -m "chore: Update agentic-dev-standards submodule"
git push
```

AI assistants will automatically use the updated standards.

## 💡 Why Use This

### Single Source of Truth

**Before** (duplicated everywhere):
```
project-a/.github/copilot-instructions.md (500 lines)
project-b/.github/copilot-instructions.md (500 lines)
project-c/.cursorrules (450 lines)
# Same content duplicated! Hard to keep in sync.
```

**After** (one source of truth):
```
project-a/.github/copilot-instructions.md (50 lines) → references submodule
project-b/.github/copilot-instructions.md (50 lines) → references submodule
project-c/.cursorrules (50 lines) → references submodule
agentic-dev-standards/ (submodule, single source of truth)
```

### Multi-Tool Support

Support multiple AI tools without duplication:

```bash
my-project/
├── .github/copilot-instructions.md    # GitHub Copilot config
├── .cursorrules                        # Cursor config
├── .windsurfrules                      # Windsurf config
├── .continue/config.json               # Continue config
└── agentic-dev-standards/             # ONE source of truth for all
```

All configs reference the same universal standards.

### Continuous Improvement

- **Discover new patterns?** Update once, benefit everywhere
- **Better practices emerge?** Pull updates to all projects
- **Team grows?** New members get same standards
- **Switch tools?** Standards apply to new tool

## 📖 Example Project Structure

```
my-project/
├── .github/
│   └── copilot-instructions.md         # Tool config (references submodule)
├── .vscode/
│   └── settings.json                    # Terminal profiles
├── agentic-dev-standards/              # This submodule
│   ├── README.md                        # This file
│   ├── universal-agent-rules.md         # Core standards
│   ├── terminal-standards.md            # Terminal requirements
│   ├── commit-conventions.md            # Commit format
│   ├── workflow-patterns/               # Specific workflows
│   │   ├── session-management.md
│   │   ├── branch-strategy.md
│   │   ├── github-issues.md
│   │   └── dependency-management.md
│   ├── integration/                     # Tool-specific guides
│   │   ├── README.md
│   │   ├── vscode-copilot.md
│   │   ├── cursor.md
│   │   ├── claude-code.md
│   │   ├── windsurf.md
│   │   └── continue.md
│   └── migration/
│       └── README.md                    # Migration guide
├── docs/
│   ├── development/                     # Project-specific dev docs
│   ├── planning/                        # Project-specific planning
│   └── archive/                         # Historical docs
├── src/
└── [other project files]
```

## 🤝 Contributing

### Discovered New Universal Patterns?

1. **Test in real projects** first
2. **Document clearly** with examples
3. **Submit PR** to this repository
4. **Help everyone** benefit from your discovery!

### Reporting Issues

Found a problem or have a suggestion?

1. Check [existing issues](https://github.com/k-f-/agentic-dev-standards/issues)
2. Open new issue with:
   - Clear description
   - Examples (what's wrong, what should happen)
   - Your use case (which tool, what project type)

### Adding Support for New Tools

Using an AI tool not listed here?

1. Follow [integration/README.md](integration/README.md) structure
2. Create guide in `integration/<tool-name>.md`
3. Update capabilities matrix in `integration/README.md`
4. Submit PR!

## 📋 Best Practices

### ✅ Do

- Keep tool configs minimal (reference submodule, don't duplicate)
- Update submodule regularly to get latest standards
- Contribute universal patterns back to this repo
- Test with your AI tool after initial setup
- Document project-specific rules separately from universal

### ❌ Don't

- Don't duplicate universal standards in project files
- Don't modify submodule files directly in projects (contribute via PR instead)
- Don't skip reading [terminal-standards.md](terminal-standards.md) (critical!)
- Don't forget to commit submodule updates

## 🔗 Related Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Cursor Documentation](https://docs.cursor.com/)
- [Anthropic Claude Documentation](https://docs.anthropic.com/)

## 📄 License

MIT License - Copyright © 2025 k-f-

See [LICENSE](LICENSE) file for details.

## 🙋 FAQ

### Q: Which AI tool should I use?

**A**: Depends on your workflow:
- **IDE-first, want completion + chat**: GitHub Copilot or Cursor
- **Terminal-first, complex tasks**: Claude Code
- **Open-source, customizable**: Continue
- See [full comparison →](integration/README.md)

### Q: Can I use this with multiple tools?

**A**: Yes! Create config for each tool, all reference same submodule.

### Q: Do I need to use ALL standards?

**A**: Core standards (terminal, commits) are highly recommended. Workflow patterns are optional but helpful.

### Q: How do I keep standards updated?

**A**: `cd agentic-dev-standards && git pull origin main`

### Q: Can I customize standards for my team?

**A**: Yes! Fork this repo, customize, use your fork as submodule.

### Q: What if standards change and break my workflow?

**A**: Submodule pins to specific commit. Update when ready:
```bash
cd agentic-dev-standards
git checkout v2.1.0  # or specific commit
cd ..
git add agentic-dev-standards
git commit -m "chore: Pin agentic-dev-standards to v2.1.0"
```

## 🚀 Next Steps

1. **[Choose your tool →](integration/README.md)** - See capabilities matrix
2. **[Follow setup guide →](integration/)** - Tool-specific integration
3. **[Read core standards →](universal-agent-rules.md)** - Universal best practices
4. **[Explore workflows →](workflow-patterns/)** - Session management, branches, issues
5. **[Contribute →](#contributing)** - Share your discoveries!

---

**Version**: 2.0.0 (Universal Tool Support)
**Last Updated**: October 31, 2025
**Maintained by**: k-f- and contributors
**Repository**: https://github.com/k-f-/agentic-dev-standards

**Make your AI-assisted development consistent, efficient, and high-quality across all tools and projects!** 🚀
