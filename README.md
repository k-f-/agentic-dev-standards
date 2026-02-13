# Agentic Development Standards

**Universal best practices for AI-assisted development**, compatible with OpenCode, Claude Code, Cursor, GitHub Copilot, Windsurf, Continue, Aider, and other AI coding assistants.

## 🎯 Purpose

This repository provides a comprehensive set of standards and best practices for working with AI coding assistants. Use it as a **Git submodule** in your projects to ensure consistent, high-quality AI-assisted development across your entire team and all your projects.

## 📚 Contents

### Core Standards

- **[universal-agent-rules.md](universal-agent-rules.md)** - Universal best practices for all AI agents
- **[terminal-standards.md](terminal-standards.md)** - Clean shell environment requirements (CRITICAL)
- **[commit-conventions.md](commit-conventions.md)** - Conventional Commits standard

### Workflow Patterns

- **[context-preservation.md](workflow-patterns/context-preservation.md)** - Context management and token optimization
- **[session-management.md](workflow-patterns/session-management.md)** - Session summaries and tracking
- **[branch-strategy.md](workflow-patterns/branch-strategy.md)** - Branch naming and git workflows
- **[github-issues.md](workflow-patterns/github-issues.md)** - Issue and PR management
- **[dependency-management.md](workflow-patterns/dependency-management.md)** - Adding and maintaining dependencies
- **[multi-agent-orchestration.md](workflow-patterns/multi-agent-orchestration.md)** - Sub-agent patterns, model routing, task decomposition
- **[agent-safety.md](workflow-patterns/agent-safety.md)** - Permissions, destructive operations, secrets management

### Tool Integration

- **[Integration Guide](integration/README.md)** - Tool capabilities matrix and setup overview
- **[OpenCode](integration/opencode.md)** - OpenCode terminal agent integration (open-source, provider-agnostic)
- **[Claude Code](integration/claude-code.md)** - Claude CLI integration
- **[Cursor](integration/cursor.md)** - Cursor IDE integration
- **[GitHub Copilot](integration/vscode-copilot.md)** - VSCode + Copilot integration
- **[Windsurf](integration/windsurf.md)** - Windsurf IDE integration
- **[Continue](integration/continue.md)** - Continue extension integration

### Migration

- **[Migration Guide](migration/README.md)** - Migrate from tool-specific to universal standards

## 🔌 MCP Server (Token Efficient!)

**For OpenCode and Claude Code users**: Access standards on-demand via Model Context Protocol (MCP) instead of loading everything upfront.

### What is MCP?

Model Context Protocol (MCP) is a standardized way for AI assistants to fetch context on-demand rather than front-loading everything. Think of it as "function calling for external data" - Claude only loads standards when actually needed.

### Why Use MCP?

**Token Savings**: 74-86% reduction per session

**Before MCP** (traditional approach):
```
Session starts:
- Load universal-agent-rules.md (17KB) = 4,500 tokens
- Load terminal-standards.md (9KB) = 2,500 tokens
- Load commit-conventions.md (4KB) = 1,000 tokens
- Load all workflow patterns (60KB) = 15,000 tokens
Total: 23,000 tokens BEFORE any actual work!
```

**After MCP** (on-demand approach):
```
Session starts: 0 tokens from standards
User: "Help me commit"
Claude: Fetches commit-conventions.md = 1,000 tokens (only when needed)
User: "Now help with testing"
Claude: Uses existing context, no new standards needed
Total: 1,000 tokens (96% reduction!)
```

**Additional Benefits**:
- ✅ Instant updates (no submodule management)
- ✅ Scales to any number of projects (one-time setup)
- ✅ Standards loaded only when actually needed
- ✅ Cleaner project structure (no submodule)

### Quick MCP Setup

**1. Install dependencies**:
```bash
cd /path/to/agentic-dev-standards
npm install
```

**2. Configure your tool**:

**OpenCode** (`.opencode/config.json`):
```json
{
  "mcpServers": {
    "agentic-dev-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/agentic-dev-standards/mcp-server.js"]
    }
  }
}
```

**Claude Code** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "agentic-dev-standards": {
      "command": "node",
      "args": ["/path/to/agentic-dev-standards/mcp-server.js"]
    }
  }
}
```

**3. Restart your tool** - Standards now available via 5 MCP tools:
- `get_core_standard` - universal-agent-rules, terminal-standards, commit-conventions
- `get_workflow_pattern` - session-management, branch-strategy, multi-agent-orchestration, agent-safety, etc.
- `get_integration_guide` - tool-specific setup guides
- `search_standards` - search across all standards
- `list_available_standards` - discover all available standards

Full setup guides: [OpenCode →](integration/opencode.md) | [Claude Code →](integration/claude-code.md)

### Other AI Tools?

MCP is fully supported by OpenCode and Claude Code. For other tools:
- **Quick reference**: Use [`copilot-essentials.md`](copilot-essentials.md) (~150 lines, distilled core standards)
- **Full standards**: Use git submodule (traditional approach, see below)

## 🚀 Quick Start

### 1. Choose Your AI Tool

| Tool | Best For | Setup Guide |
|------|----------|-------------|
| **OpenCode** | Open-source, provider-agnostic, terminal-first | [Setup →](integration/opencode.md) |
| **Claude Code** | Anthropic ecosystem, autonomous agents, CI/CD | [Setup →](integration/claude-code.md) |
| **Cursor** | AI-first IDE, agent mode, multi-file editing | [Setup →](integration/cursor.md) |
| **GitHub Copilot** | VSCode users, GitHub integration | [Setup →](integration/vscode-copilot.md) |
| **Windsurf** | VSCode-like with Cascade mode | [Setup →](integration/windsurf.md) |
| **Continue** | Open-source, customizable | [Setup →](integration/continue.md) |

See [full comparison →](integration/README.md)

### 2. Choose Integration Method

**Option A: MCP Server** (OpenCode, Claude Code - RECOMMENDED for token efficiency)
- See [MCP Server section above](#-mcp-server-new---token-efficient) for setup
- 74-86% token reduction per session
- One-time setup, works across all projects

**Option B: Git Submodule** (All AI tools)
- Traditional approach, works with all tools
- Add once per project:

```bash
# In your project root
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

**Option C: Copilot Essentials** (GitHub Copilot only)
- Lightweight option: Copy [`copilot-essentials.md`](copilot-essentials.md) to your project
- ~150 lines covering core standards
- Good for quick reference, but missing full workflow patterns

### 3. Configure Your Tool (for Submodule/Copilot Essentials)

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
- **Multi-Agent Orchestration**: Sub-agent patterns, model specialization and routing, task decomposition, cost management
- **Agent Safety**: Permission models, destructive operation detection, secrets management, sandboxing, audit trails

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

**After** (one source of truth - multiple options):

**Option 1: MCP Server** (Claude Code):
```
project-a/ (no submodule needed!)
project-b/ (no submodule needed!)
~/Library/Application Support/Claude/claude_desktop_config.json (one-time MCP config)
# Standards loaded on-demand, 74-86% token reduction!
```

**Option 2: Git Submodule** (All tools):
```
project-a/.github/copilot-instructions.md (50 lines) → references submodule
project-b/.github/copilot-instructions.md (50 lines) → references submodule
project-c/.cursorrules (50 lines) → references submodule
agentic-dev-standards/ (submodule, single source of truth)
```

**Option 3: Copilot Essentials** (GitHub Copilot):
```
project-a/.github/copilot-instructions.md (references copilot-essentials.md)
project-a/copilot-essentials.md (150 lines, distilled standards)
# Lightweight, but missing full workflow patterns
```

### Multi-Tool Support

Support multiple AI tools without duplication:

```bash
my-project/
├── AGENTS.md                           # OpenCode context
├── CLAUDE.md                           # Claude Code context
├── .cursor/rules/                      # Cursor rules
├── .github/copilot-instructions.md     # GitHub Copilot config
├── .windsurfrules                      # Windsurf config
├── .continue/config.json               # Continue config
└── agentic-dev-standards/              # ONE source of truth for all
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
├── AGENTS.md                            # OpenCode project context
├── CLAUDE.md                            # Claude Code project context
├── .github/
│   └── copilot-instructions.md          # GitHub Copilot config
├── .cursor/rules/                       # Cursor rules
├── .vscode/
│   └── settings.json                    # Terminal profiles
├── agentic-dev-standards/               # This submodule
│   ├── README.md                        # This file
│   ├── universal-agent-rules.md         # Core standards
│   ├── terminal-standards.md            # Terminal requirements
│   ├── commit-conventions.md            # Commit format
│   ├── workflow-patterns/               # Specific workflows
│   │   ├── session-management.md
│   │   ├── branch-strategy.md
│   │   ├── github-issues.md
│   │   ├── dependency-management.md
│   │   ├── multi-agent-orchestration.md
│   │   └── agent-safety.md
│   ├── integration/                     # Tool-specific guides
│   │   ├── README.md
│   │   ├── opencode.md
│   │   ├── claude-code.md
│   │   ├── cursor.md
│   │   ├── vscode-copilot.md
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

- **Terminal-first, open-source, multi-provider**: OpenCode
- **Terminal-first, Anthropic ecosystem**: Claude Code
- **IDE-first, agent mode + completion**: Cursor
- **IDE-first, GitHub ecosystem**: GitHub Copilot
- **Open-source, IDE extension**: Continue
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

**Version**: 2.0.0 (Multi-Agent, Safety, OpenCode Support)
**Last Updated**: February 12, 2026
**Maintained by**: k-f- and contributors
**Repository**: https://github.com/k-f-/agentic-dev-standards

**Make your AI-assisted development consistent, efficient, and high-quality across all tools and projects!** 🚀
