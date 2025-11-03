# Windsurf Integration Guide

## Overview

Windsurf is an AI-enhanced IDE similar to Cursor, with a unique "Cascade" mode for complex multi-step tasks. It uses `.windsurfrules` for configuration.

## Setup

### 1. Add Submodule

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 2. Create `.windsurfrules` File

Create `.windsurfrules` at project root:

```markdown
# Windsurf Rules for [Your Project Name]

⚠️ CRITICAL - READ FIRST: Universal best practices in agentic-dev-standards/

Read these files IN ORDER before project-specific rules:

1. agentic-dev-standards/terminal-standards.md - Terminal environment (CRITICAL)
2. agentic-dev-standards/commit-conventions.md - Conventional Commits
3. agentic-dev-standards/universal-agent-rules.md - Universal best practices

Workflow guidance:
- agentic-dev-standards/workflow-patterns/session-management.md
- agentic-dev-standards/workflow-patterns/branch-strategy.md
- agentic-dev-standards/workflow-patterns/github-issues.md
- agentic-dev-standards/workflow-patterns/dependency-management.md

---

## Project-Specific Rules

### Overview
[Project description]

Tech Stack: [Languages, frameworks, tools]

### Code Style
[Your preferences]

### Testing
[Your testing approach]

### Notes
[Important project-specific info]
```

### 3. Configure Terminal

Create `.vscode/settings.json`:

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
git add .windsurfrules .vscode/settings.json agentic-dev-standards
git commit -m "chore: Configure Windsurf with universal standards"
```

## Usage

### Cascade Mode

Windsurf's Cascade mode handles complex multi-step tasks:

1. **Activate Cascade**: Click Cascade button or Cmd+Shift+K
2. **Describe task**: "Add user authentication with JWT following all standards from agentic-dev-standards/"
3. **Cascade will**:
   - Read `.windsurfrules`
   - Plan multi-step approach
   - Execute across multiple files
   - Follow universal standards
   - Present changes for review

### Chat Mode

1. **Open Chat**: Standard chat interface
2. **Ask questions** or request changes
3. Follows `.windsurfrules` automatically

### Inline AI

1. **Select code**
2. **Invoke AI**: Cmd+K or right-click
3. **Request change**: Inline edits

## Key Features

**Cascade Mode**:

- Complex multi-file tasks
- Autonomous planning and execution
- Context-aware suggestions
- Follows rules automatically

**vs Cursor**:

- Similar feature set
- Different UX/UI approach
- Both support autonomous modes
- Both read rules files

**vs GitHub Copilot**:

- Much better multi-file editing
- Autonomous Cascade mode
- Multiple AI models
- Larger context window

## Best Practices

**Keep `.windsurfrules` focused**:

- Reference universal standards (don't duplicate)
- Include only critical project-specific info
- Keep under ~8000 tokens

**Use Cascade for**:

- Large refactorings
- Feature implementation end-to-end
- Complex multi-file changes

**Use Chat for**:

- Questions
- Explanations
- Small code snippets

**Use Inline AI for**:

- Quick local edits
- Formatting
- Simple refactorings

## Troubleshooting

### Not following standards

- Ensure `.windsurfrules` at project root
- Reload window
- Reference explicitly: "Follow agentic-dev-standards/terminal-standards.md"

### Commands fail

- Verify bash wrapper pattern
- Check terminal profile config
- See `terminal-standards.md`

## Summary

**Key Files**:

- `.windsurfrules` - Windsurf reads this (~8000 tokens)
- `.vscode/settings.json` - Terminal config
- `agentic-dev-standards/` - Universal standards

**Advantages**:

- Cascade mode for complex tasks
- Good multi-file editing
- Multiple AI models
- VSCode-like familiarity

**Next**: Customize `.windsurfrules`, try Cascade mode
