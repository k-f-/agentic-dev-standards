# Cursor Integration Guide

## Overview

Cursor is an AI-first IDE built on VSCode with enhanced AI capabilities. It uses `.cursorrules` for configuration and supports multiple AI models.

## Setup

### 1. Add Submodule

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 2. Create `.cursorrules` File

Create `.cursorrules` at project root:

```markdown
# Cursor Rules for [Your Project Name]

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

---

## Project-Specific Rules

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
git add .cursorrules .vscode/settings.json agentic-dev-standards
git commit -m "chore: Configure Cursor with universal standards"
```

## Usage

### Composer Mode (Autonomous)

Cursor's Composer mode can make multi-file changes autonomously:

1. **Open Composer**: Cmd+I (or Ctrl+I)
2. **Give high-level task**: "Add user authentication with JWT"
3. **Composer will**:
   - Read `.cursorrules`
   - Follow universal standards
   - Edit multiple files
   - Propose changes for review

### Chat Mode

1. **Open Chat**: Cmd+L (or Ctrl+L)
2. **Ask questions** or request code
3. Chat follows `.cursorrules` automatically

### Inline Edit

1. **Select code**
2. **Cmd+K** (or Ctrl+K)
3. **Describe change**: "Make this function async"

## Key Features

**vs GitHub Copilot**:
- ✅ Better multi-file editing (Composer mode)
- ✅ Multiple AI models (GPT-4, Claude 3.5, etc.)
- ✅ Larger context window (~8000 tokens for rules)
- ✅ More autonomous (Composer can work independently)
- ⚠️ Different interface (not VSCode extension)

## Best Practices

**Keep `.cursorrules` concise**:
- Reference universal standards (don't duplicate)
- Include only project-specific critical info
- Use under 8000 tokens for best results

**Use Composer for**:
- Large refactorings across multiple files
- Adding new features with tests
- Implementing complex requirements

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

- Ensure `.cursorrules` exists at project root (not `.github/`)
- Reload Cursor window
- Explicitly mention: "Follow agentic-dev-standards/terminal-standards.md"

### Commands fail in Composer

- Verify bash wrapper pattern is used
- Check terminal profile configuration
- See `terminal-standards.md` for details

## Summary

**Key Files**:
- `.cursorrules` - Cursor reads this automatically (~8000 token limit)
- `.vscode/settings.json` - Terminal configuration
- `agentic-dev-standards/` - Universal standards

**Advantages**:
- Excellent multi-file editing
- Multiple AI models
- Larger context window
- Autonomous Composer mode

**Next**: Customize `.cursorrules` for your project, test with Composer mode
