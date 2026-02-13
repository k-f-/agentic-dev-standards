# Cursor Integration Guide

## Overview

Cursor is an AI-first IDE built on VSCode with enhanced AI capabilities. It supports multiple AI models, has agent mode for autonomous multi-file work, and background agents for parallel task execution.

**Key changes since late 2025**: Cursor now uses `.cursor/rules/` directory (replacing the old `.cursorrules` file) and has a full agent mode with tool use, terminal access, and multi-step reasoning.

## Setup

### 1. Add Submodule

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 2. Create Rules Directory

Cursor now uses `.cursor/rules/` for project rules (the old `.cursorrules` file is still supported but deprecated).

Create `.cursor/rules/standards.md`:

```markdown
# Development Standards

⚠️ CRITICAL - READ FIRST: Universal best practices are in `agentic-dev-standards/`

BEFORE reading project-specific rules below, you MUST read these files IN ORDER:

1. agentic-dev-standards/terminal-standards.md (CRITICAL - terminal environment requirements)
2. agentic-dev-standards/commit-conventions.md (Conventional Commits standard)
3. agentic-dev-standards/universal-agent-rules.md (Universal best practices)

Workflow-specific guidance (read as needed):
- agentic-dev-standards/workflow-patterns/session-management.md
- agentic-dev-standards/workflow-patterns/branch-strategy.md
- agentic-dev-standards/workflow-patterns/github-issues.md
- agentic-dev-standards/workflow-patterns/dependency-management.md
- agentic-dev-standards/workflow-patterns/multi-agent-orchestration.md
- agentic-dev-standards/workflow-patterns/agent-safety.md
```

Create `.cursor/rules/project.md`:

```markdown
# Project-Specific Rules

### Project Overview
[Your project description]

Tech Stack: [TypeScript/Python/etc], [Framework], [Database]

### Code Style
[Your style preferences]

### Testing Strategy
[Your testing approach]

### Important Notes
[Project-specific gotchas]
```

**Note**: You can split rules into as many files as you want. Cursor loads all `.md` files from `.cursor/rules/` automatically.

### 3. Configure Terminal (Optional)

Cursor inherits VSCode terminal settings. Create `.vscode/settings.json`:

```json
{
  "terminal.integrated.profiles.osx": {
    "Clean-Bash": {
      "path": "/bin/bash",
      "args": ["--noprofile", "--norc"],
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    }
  },
  "terminal.integrated.defaultProfile.osx": "Clean-Bash"
}
```

### 4. Commit

```bash
git add .cursor/ .vscode/settings.json agentic-dev-standards
git commit -m "chore: Configure Cursor with universal standards"
```

## Usage

### Agent Mode (Autonomous)

Cursor's agent mode can make multi-file changes autonomously with tool use, terminal access, and multi-step reasoning:

1. **Open Chat**: Cmd+L (or Ctrl+L)
2. **Select Agent mode** from the mode dropdown
3. **Give high-level task**: "Add user authentication with JWT"
4. **Agent will**:
   - Read `.cursor/rules/` files
   - Follow universal standards
   - Edit multiple files, run terminal commands
   - Use tools to explore codebase
   - Propose changes for review

### Background Agents

Cursor supports background agents that run tasks in parallel without blocking your main workflow. Useful for:
- Running long test suites while you continue coding
- Executing multi-step tasks that don't need constant supervision
- Processing code generation tasks in the background

### Composer Mode

For quick multi-file edits without full agent capabilities:

1. **Open Composer**: Cmd+I (or Ctrl+I)
2. **Describe changes across files**
3. **Review and apply** suggested edits

### Chat Mode

1. **Open Chat**: Cmd+L (or Ctrl+L)
2. **Ask questions** or request code
3. Chat reads `.cursor/rules/` automatically

### Inline Edit

1. **Select code**
2. **Cmd+K** (or Ctrl+K)
3. **Describe change**: "Make this function async"

## Key Features

**Compared to other tools**:

- Agent mode with tool use, terminal, and multi-step reasoning
- Background agents for parallel task execution
- Multiple AI models (Claude, GPT-4o, Gemini, etc.)
- `.cursor/rules/` directory for organized project rules
- Excellent multi-file editing
- Built-in code completion + chat + agent in one IDE

## Best Practices

**Keep rules organized**:

- Use `.cursor/rules/` directory with multiple focused files
- Reference universal standards (don't duplicate)
- Include only project-specific critical info

**Use Agent mode for**:

- Complex multi-step tasks requiring tool use
- Tasks that need terminal access (running tests, builds)
- Large refactorings across multiple files

**Use Composer for**:

- Quick multi-file edits
- Adding new features with straightforward requirements

**Use Chat for**:

- Questions about codebase
- Explaining code
- Small code snippets

**Use Inline Edit for**:

- Quick local changes
- Formatting improvements
- Renaming patterns

## Troubleshooting

### Cursor not following standards

- Ensure rules exist in `.cursor/rules/` directory (or `.cursorrules` at project root for legacy setup)
- Reload Cursor window
- Explicitly mention: "Follow agentic-dev-standards/terminal-standards.md"

### Commands fail in Agent mode

- Verify bash wrapper pattern is used
- Check terminal profile configuration
- See `terminal-standards.md` for details

### Migrating from `.cursorrules`

If you have an existing `.cursorrules` file:
1. Create `.cursor/rules/` directory
2. Move content to `.cursor/rules/standards.md` (split into multiple files as desired)
3. Delete `.cursorrules`
4. Reload Cursor

## Summary

**Key Files**:

- `.cursor/rules/*.md` - Cursor reads all rule files automatically
- `.vscode/settings.json` - Terminal configuration
- `agentic-dev-standards/` - Universal standards

**Advantages**:

- Agent mode with tool use and terminal access
- Background agents for parallel tasks
- Excellent multi-file editing
- Multiple AI models
- Organized rules directory

**Next**: Set up `.cursor/rules/` for your project, test with agent mode

---

**Last Updated**: February 12, 2026
