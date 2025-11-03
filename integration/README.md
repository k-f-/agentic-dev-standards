# Integration Guide: Tool-Specific Setup

## Overview

This directory contains integration guides for various AI coding assistants. Each guide shows how to configure the specific tool to use these universal standards.

## Supported Tools

| Tool | Guide | Popularity | Best For |
|------|-------|------------|----------|
| **GitHub Copilot** (VSCode) | [Setup →](vscode-copilot.md) | ⭐⭐⭐⭐⭐ | VSCode users, GitHub integration |
| **Cursor** | [Setup →](cursor.md) | ⭐⭐⭐⭐⭐ | Modern AI-first IDE, inline editing |
| **Claude Code** (CLI) | [Setup →](claude-code.md) | ⭐⭐⭐⭐ | Terminal-first workflows, autonomous agents |
| **Windsurf** | [Setup →](windsurf.md) | ⭐⭐⭐⭐ | VSCode-like with enhanced AI features |
| **Continue** | [Setup →](continue.md) | ⭐⭐⭐ | Open-source, customizable, multi-provider |

## Tool Capabilities Matrix

| Feature | GitHub Copilot | Cursor | Claude Code | Windsurf | Continue |
|---------|----------------|--------|-------------|----------|----------|
| **Instruction Files** | `.github/copilot-instructions.md` | `.cursorrules` | Context files | `.windsurfrules` | `config.json` |
| **Instruction File Size Limit** | ~4000 tokens | ~8000 tokens | Varies | ~8000 tokens | Configurable |
| **Terminal Control** | `terminal.integrated.profiles` | Similar to VSCode | Native shell control | Similar to VSCode | Via extension |
| **File Access** | ✅ Full repo | ✅ Full repo | ✅ Full repo | ✅ Full repo | ✅ Full repo |
| **Multi-file Editing** | ⚠️ Limited | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Good |
| **Autonomous Mode** | ❌ No | ✅ Composer | ✅ Yes (agent mode) | ✅ Cascade | ⚠️ Limited |
| **Git Integration** | ✅ Via VSCode | ✅ Built-in | ✅ CLI-based | ✅ Built-in | ✅ Via VSCode |
| **Submodule Support** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Context Awareness** | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| **Code Completion** | ⭐⭐⭐⭐⭐ Best-in-class | ⭐⭐⭐⭐ Excellent | ❌ N/A | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Good |
| **Chat Interface** | ✅ Sidebar | ✅ Integrated | ✅ Terminal | ✅ Integrated | ✅ Sidebar |
| **Inline Suggestions** | ✅ Yes | ✅ Yes | ❌ N/A | ✅ Yes | ✅ Yes |
| **Model Choice** | GPT-4 only | Multiple (GPT-4, Claude, etc.) | Claude 3.5 Sonnet | Multiple | Multiple (configurable) |
| **Offline Mode** | ❌ No | ❌ No | ❌ No | ❌ No | ⚠️ With local models |
| **Open Source** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Pricing** | $10/mo individual | $20/mo | $20/mo | $15/mo | Free (bring your own API keys) |

## Quick Start by Tool

### GitHub Copilot (VSCode)

**Best for**: VSCode users already in GitHub ecosystem

**Setup**:

1. Install GitHub Copilot extension
2. Add this repo as submodule
3. Create `.github/copilot-instructions.md`
4. Reference universal standards

[Full Setup Guide →](vscode-copilot.md)

### Cursor

**Best for**: Developers wanting AI-first IDE with excellent multi-file editing

**Setup**:

1. Download Cursor IDE
2. Add this repo as submodule
3. Create `.cursorrules` file
4. Reference universal standards

[Full Setup Guide →](cursor.md)

### Claude Code (CLI)

**Best for**: Terminal-first developers, autonomous workflows, automation

**Setup**:

1. Install Claude CLI
2. Add this repo as submodule
3. Configure project context
4. Use in terminal sessions

[Full Setup Guide →](claude-code.md)

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

#### Choose GitHub Copilot if

- ✅ You're already using VSCode
- ✅ You're heavily integrated with GitHub
- ✅ You primarily need code completion (not chat)
- ✅ You want the simplest setup
- ❌ You don't need multi-file autonomous editing

#### Choose Cursor if

- ✅ You want best-in-class multi-file editing
- ✅ You like the Composer/agent mode
- ✅ You want model flexibility (GPT-4, Claude, etc.)
- ✅ You prefer AI-first IDE design
- ❌ You're not willing to switch from VSCode

#### Choose Claude Code if

- ✅ You work primarily in the terminal
- ✅ You need autonomous agent workflows
- ✅ You want powerful context awareness
- ✅ You prefer CLI over IDE
- ❌ You need inline code completion

#### Choose Windsurf if

- ✅ You want VSCode-like experience with better AI
- ✅ You like Cascade mode for complex tasks
- ✅ You want good balance of completion and chat
- ✅ You're willing to try newer tool
- ❌ You need the most mature ecosystem

#### Choose Continue if

- ✅ You prefer open-source software
- ✅ You want to use your own API keys
- ✅ You need custom configurations
- ✅ You want multi-provider support (OpenAI, Anthropic, local models)
- ❌ You want the most polished UX

## Common Integration Patterns

### Pattern 1: Single Tool per Project

**Most common**: Use one primary AI tool per project.

```bash
# Example: Cursor-based project
project/
├── .cursorrules                        # Cursor config
├── agentic-dev-standards/             # This submodule
│   ├── universal-agent-rules.md
│   ├── terminal-standards.md
│   └── commit-conventions.md
└── [project files]
```

### Pattern 2: Multi-Tool Support

**Advanced**: Support multiple tools in same project (team with different preferences).

```bash
# Example: Multi-tool project
project/
├── .github/
│   └── copilot-instructions.md        # GitHub Copilot config
├── .cursorrules                        # Cursor config
├── .windsurfrules                      # Windsurf config
├── .continue/
│   └── config.json                     # Continue config
├── agentic-dev-standards/             # This submodule
│   └── [universal standards]
└── [project files]
```

All config files reference the same universal standards from `agentic-dev-standards/`.

### Pattern 3: Team-Wide Standards

**Enterprise**: One submodule, many projects.

```bash
# Multiple projects, one standard
company-projects/
├── project-a/
│   ├── .cursorrules → references ../agentic-dev-standards/
│   └── agentic-dev-standards/        # Submodule
├── project-b/
│   ├── .github/copilot-instructions.md → references ../agentic-dev-standards/
│   └── agentic-dev-standards/        # Submodule
└── project-c/
    ├── .windsurfrules → references ../agentic-dev-standards/
    └── agentic-dev-standards/        # Submodule
```

## Troubleshooting

### Issue: AI not reading instructions

**Symptoms**: AI doesn't follow standards despite configuration.

**Solutions**:

- **GitHub Copilot**: Ensure file is `.github/copilot-instructions.md` (exact name)
- **Cursor**: Ensure file is `.cursorrules` at project root
- **Windsurf**: Ensure file is `.windsurfrules` at project root
- **Continue**: Check `config.json` has correct context paths
- **All**: Verify file size is under token limit

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

- [GitHub Copilot Setup →](vscode-copilot.md)
- [Cursor Setup →](cursor.md)
- [Claude Code Setup →](claude-code.md)
- [Windsurf Setup →](windsurf.md)
- [Continue Setup →](continue.md)

---

**Last Updated**: October 31, 2025
**Supported Tools**: 5
**Contributors**: AI dev community

## Summary

**Key Takeaways**:

1. Choose tool based on your workflow (IDE vs terminal, completion vs chat)
2. All tools can use the same universal standards via submodule
3. Keep tool-specific configs minimal, universal logic in submodule
4. Reference standards files from tool config, don't duplicate content
5. Test integration with your chosen tool(s) before committing

**Next Steps**:

1. Choose your tool(s) from the list above
2. Follow the tool-specific setup guide
3. Add `agentic-dev-standards` as submodule
4. Configure tool to reference universal standards
5. Start coding with AI assistance!
