# Integration Guide: Tool-Specific Setup

## Overview

This directory contains integration guides for various AI coding assistants. Each guide shows how to configure the specific tool to use these universal standards.

**Integration Methods**:
- **MCP Server** (recommended) — On-demand access via Model Context Protocol. Works with Claude Code, OpenCode, and any MCP-compatible tool.
- **Git Submodule** — Traditional approach, works with all tools.
- **Copilot Essentials** — Lightweight distilled reference for GitHub Copilot.

## Supported Tools

| Tool | Guide | Type | Best For |
|------|-------|------|----------|
| **OpenCode** | [Setup →](opencode.md) | Terminal agent (TUI) | Open-source, provider-agnostic, terminal-first |
| **Claude Code** | [Setup →](claude-code.md) | Terminal agent (CLI) | Anthropic ecosystem, autonomous workflows |
| **Cursor** | [Setup →](cursor.md) | AI-first IDE | Multi-file editing, agent mode |
| **GitHub Copilot** (VSCode) | [Setup →](vscode-copilot.md) | IDE extension | VSCode users, GitHub integration |
| **Windsurf** | [Setup →](windsurf.md) | AI-first IDE | VSCode-like with Cascade mode |
| **Continue** | [Setup →](continue.md) | IDE extension | Open-source, customizable, multi-provider |

**Other notable tools** (no dedicated guide yet):
- **[Aider](https://aider.chat)** — Open-source terminal-based coding agent. Supports git-aware editing, multiple models, and works well with these standards via its `.aider.conf.yml` and in-chat `/conventions` commands. Community contributions welcome.

## Tool Capabilities Matrix

| Feature | OpenCode | Claude Code | Cursor | GitHub Copilot | Windsurf | Continue |
|---------|----------|-------------|--------|----------------|----------|----------|
| **Instruction File** | `AGENTS.md` + `.opencode/rules/` | `CLAUDE.md` | `.cursor/rules/` | `.github/copilot-instructions.md` | `.windsurfrules` | `config.json` |
| **MCP Support** | Yes (stdio, http, sse) | Yes (stdio) | Limited | No | No | Partial |
| **Sub-Agents** | `@general` | Task tool (general, explore) | Background agents | No | No | No |
| **Terminal Control** | Built-in TUI | Native shell | Similar to VSCode | `terminal.integrated.profiles` | Similar to VSCode | Via extension |
| **File Access** | Full repo | Full repo | Full repo | Full repo | Full repo | Full repo |
| **Multi-file Editing** | Excellent | Excellent | Excellent | Limited | Excellent | Good |
| **Autonomous Mode** | Yes (Build mode) | Yes (agent mode) | Yes (agent mode) | Agent mode (preview) | Yes (Cascade) | Limited |
| **Git Integration** | CLI-based | CLI-based | Built-in | Via VSCode | Built-in | Via VSCode |
| **Code Completion** | No | No | Excellent | Best-in-class | Excellent | Good |
| **Inline Suggestions** | No | No | Yes | Yes | Yes | Yes |
| **Model Choice** | 75+ providers | Claude (+ third-party) | Multiple | Multiple (GPT, Claude, Gemini) | Multiple | Multiple (configurable) |
| **LSP Integration** | Built-in | No | Built-in (is IDE) | Built-in (VSCode) | Built-in (is IDE) | Via IDE |
| **Undo/Redo** | `/undo`, `/redo` | No | No | No | No | No |
| **Open Source** | Yes (MIT) | No | No | No | No | Yes |
| **Pricing** | Free (BYOK) + Zen | Subscription ($20/mo) | Subscription ($20/mo) | Free tier + $10/mo | $15/mo | Free (BYOK) |

## Quick Start by Tool

### OpenCode

**Best for**: Open-source advocates, multi-provider users, terminal-first developers

**Setup**:

1. `brew install anomalyco/tap/opencode`
2. Configure MCP server for agentic-dev-standards
3. Run `/init` to create `AGENTS.md`
4. Configure rules and permissions

[Full Setup Guide →](opencode.md)

### Claude Code

**Best for**: Anthropic ecosystem, autonomous workflows, CI/CD integration

**Setup**:

1. `curl -fsSL https://claude.ai/install.sh | bash`
2. Configure MCP server for agentic-dev-standards
3. Create `CLAUDE.md` project instructions
4. Configure hooks and custom commands

[Full Setup Guide →](claude-code.md)

### Cursor

**Best for**: Developers wanting AI-first IDE with excellent multi-file editing

**Setup**:

1. Download Cursor IDE
2. Add this repo as submodule (or use MCP if supported)
3. Create rules in `.cursor/rules/`
4. Reference universal standards

[Full Setup Guide →](cursor.md)

### GitHub Copilot (VSCode)

**Best for**: VSCode users already in GitHub ecosystem

**Setup**:

1. Install GitHub Copilot extension
2. Add this repo as submodule
3. Create `.github/copilot-instructions.md`
4. Reference universal standards

[Full Setup Guide →](vscode-copilot.md)

### Windsurf

**Best for**: VSCode-like experience with enhanced AI features (Cascade mode)

**Setup**:

1. Download Windsurf IDE
2. Add this repo as submodule
3. Create `.windsurfrules` file
4. Reference universal standards

[Full Setup Guide →](windsurf.md)

### Continue

**Best for**: Open-source enthusiasts, custom configurations, multi-provider support

**Setup**:

1. Install Continue extension (VSCode or JetBrains)
2. Add this repo as submodule
3. Configure in `config.json`
4. Set up context providers

[Full Setup Guide →](continue.md)

## Universal Standards (All Tools)

Regardless of which tool you use, these standards apply:

### 1. Terminal Standards

**All tools must use clean bash environment**:

```bash
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command'
```

See [`terminal-standards.md`](../terminal-standards.md) for complete details.

### 2. Commit Conventions

**All tools must use Conventional Commits**:

```
feat: Add new feature
fix: Correct bug
docs: Update documentation
```

See [`commit-conventions.md`](../commit-conventions.md) for complete details.

### 3. Documentation Organization

**All tools must follow standard doc organization**:

```
docs/
├── setup/              # User-facing docs
├── development/        # Developer docs
├── planning/           # Future work
└── archive/           # Historical docs
```

See [`universal-agent-rules.md`](../universal-agent-rules.md) for complete details.

## Integration Comparison

### When to Choose Each Tool

#### Choose OpenCode if

- You want a fully open-source tool (MIT license)
- You need provider flexibility (75+ LLM providers)
- You work primarily in the terminal
- You want Plan/Build mode separation for safety
- You value built-in LSP and undo/redo
- You want a plugin ecosystem for extensibility

#### Choose Claude Code if

- You're in the Anthropic ecosystem
- You need autonomous agent workflows
- You want CI/CD integration (GitHub Actions, GitLab)
- You need hooks for automation (pre-commit, post-edit)
- You want the Agent SDK for building custom tools

#### Choose Cursor if

- You want best-in-class multi-file editing
- You like agent mode for autonomous work
- You want model flexibility within an IDE
- You prefer AI-first IDE design
- You need inline code completion + chat

#### Choose GitHub Copilot if

- You're already using VSCode
- You're heavily integrated with GitHub
- You primarily need code completion
- You want the simplest setup
- You need the most mature ecosystem

#### Choose Windsurf if

- You want VSCode-like experience with better AI
- You like Cascade mode for complex tasks
- You want good balance of completion and chat

#### Choose Continue if

- You prefer open-source software
- You want to use your own API keys
- You need custom configurations
- You want multi-provider support with local models

## Common Integration Patterns

### Pattern 1: MCP Server (Recommended)

**Best approach for MCP-compatible tools** (OpenCode, Claude Code):

```bash
# One-time setup — no per-project configuration needed
# Configure MCP server in tool's global config
# Standards loaded on-demand, 74-86% token reduction
```

See tool-specific guides for MCP configuration.

### Pattern 2: Single Tool per Project

**Most common for IDE-based tools**:

```bash
project/
├── .cursor/rules/standards.md          # Cursor config
├── agentic-dev-standards/             # This submodule
│   ├── universal-agent-rules.md
│   ├── terminal-standards.md
│   └── commit-conventions.md
└── [project files]
```

### Pattern 3: Multi-Tool Support

**Advanced**: Support multiple tools in same project (team with different preferences).

```bash
project/
├── AGENTS.md                           # OpenCode context
├── CLAUDE.md                           # Claude Code context
├── .cursor/rules/                      # Cursor rules
├── .github/
│   └── copilot-instructions.md        # GitHub Copilot config
├── .windsurfrules                      # Windsurf config
├── .continue/
│   └── config.json                     # Continue config
├── agentic-dev-standards/             # This submodule
│   └── [universal standards]
└── [project files]
```

All config files reference the same universal standards from `agentic-dev-standards/`.

### Pattern 4: Team-Wide Standards

**Enterprise**: One submodule, many projects.

```bash
company-projects/
├── project-a/
│   ├── AGENTS.md → references ../agentic-dev-standards/
│   └── agentic-dev-standards/        # Submodule
├── project-b/
│   ├── CLAUDE.md → references ../agentic-dev-standards/
│   └── agentic-dev-standards/        # Submodule
└── project-c/
    ├── .cursor/rules/ → references ../agentic-dev-standards/
    └── agentic-dev-standards/        # Submodule
```

## Troubleshooting

### Issue: AI not reading instructions

**Symptoms**: AI doesn't follow standards despite configuration.

**Solutions**:

- **OpenCode**: Ensure `AGENTS.md` exists at project root, check `.opencode/rules/`
- **Claude Code**: Ensure `CLAUDE.md` exists at project root
- **Cursor**: Ensure rules exist in `.cursor/rules/` directory
- **GitHub Copilot**: Ensure file is `.github/copilot-instructions.md` (exact name)
- **Windsurf**: Ensure file is `.windsurfrules` at project root
- **Continue**: Check `config.json` has correct context paths
- **All**: Verify file size is under token limit

### Issue: MCP server not connecting

**Symptoms**: Standards tools not available in session.

**Solutions**:

1. Verify the path in config is absolute and correct
2. Check that `node` is installed and in PATH
3. Run `npm install` in the agentic-dev-standards directory
4. Check tool-specific logs for connection errors

### Issue: Terminal commands fail

**Symptoms**: Commands work manually but fail when AI runs them.

**Solutions**:

- Verify bash wrapper is used (see `terminal-standards.md`)
- Check PATH is correctly set
- Ensure no pagers are triggered (`git --no-pager`)
- Verify absolute paths for core utilities (`/bin/cat`, `/bin/ls`)

### Issue: Submodule not updating

**Symptoms**: Changes to universal standards don't appear in projects.

**Solutions**:

```bash
# Update submodule to latest
cd agentic-dev-standards
git pull origin main
cd ..
git add agentic-dev-standards
git commit -m "chore: Update agentic-dev-standards submodule"

# Or update all submodules
git submodule update --remote --merge
```

### Issue: Different tools behaving inconsistently

**Symptoms**: Same instruction interpreted differently by different tools.

**Solutions**:

- Keep tool-specific configs minimal
- Put all universal logic in `agentic-dev-standards/`
- Use explicit references to standard files
- Test with multiple tools before committing configs

## Contributing

Found a better integration pattern? Have a guide for a new tool?

1. Create new guide in `integration/<tool-name>.md`
2. Update this README with tool info
3. Submit PR to `agentic-dev-standards` repository

## Tool-Specific Deep Dives

- [OpenCode Setup →](opencode.md)
- [Claude Code Setup →](claude-code.md)
- [Cursor Setup →](cursor.md)
- [GitHub Copilot Setup →](vscode-copilot.md)
- [Windsurf Setup →](windsurf.md)
- [Continue Setup →](continue.md)

---

**Last Updated**: February 12, 2026
**Supported Tools**: 6 (+ Aider mentioned)
**Contributors**: AI dev community

## Summary

**Key Takeaways**:

1. Choose tool based on your workflow (IDE vs terminal, completion vs chat, open-source vs proprietary)
2. **MCP Server is the recommended integration method** for compatible tools (OpenCode, Claude Code)
3. All tools can use the same universal standards via submodule
4. Keep tool-specific configs minimal, universal logic in submodule
5. Reference standards files from tool config, don't duplicate content
6. Test integration with your chosen tool(s) before committing

**Next Steps**:

1. Choose your tool(s) from the list above
2. Follow the tool-specific setup guide
3. Configure MCP server or add `agentic-dev-standards` as submodule
4. Start coding with AI assistance!
