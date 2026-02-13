# Claude Code Integration Guide

## Overview

[Claude Code](https://code.claude.com) is Anthropic's agentic coding tool. It reads your codebase, edits files, runs commands, and integrates with your development tools. Available as a terminal CLI, VS Code/JetBrains extension, desktop app, and web interface.

**Key capabilities**:
- Autonomous multi-step workflows with sub-agent delegation
- `CLAUDE.md` project context files (auto-read at session start)
- Hooks for pre/post action automation
- Custom slash commands (Skills) for repeatable workflows
- Full MCP support for extensibility
- GitHub Actions and GitLab CI/CD integration
- Multi-surface: terminal, IDE, desktop, web, mobile (iOS), Slack, Chrome

---

## Setup

### 1. Install Claude Code

```bash
# macOS, Linux, WSL (recommended — auto-updates)
curl -fsSL https://claude.ai/install.sh | bash

# Homebrew (manual updates via brew upgrade)
brew install --cask claude-code

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Windows WinGet
winget install Anthropic.ClaudeCode
```

### 2A. MCP Server Setup (RECOMMENDED)

Configure this standards repo as an MCP server for on-demand access to all standards.

**Add to your Claude Code MCP configuration**:

Use the Claude Code CLI to add the server:
```bash
claude mcp add agentic-dev-standards node /full/path/to/agentic-dev-standards/mcp-server.js
```

Or manually edit your config:
- **macOS**: `~/.claude/` configuration
- **Linux**: `~/.claude/` configuration

```json
{
  "mcpServers": {
    "agentic-dev-standards": {
      "command": "node",
      "args": ["/full/path/to/agentic-dev-standards/mcp-server.js"]
    }
  }
}
```

**Important**: Replace `/full/path/to` with your actual path.

#### Available MCP Tools

1. **`get_core_standard`** — Core standards (universal-agent-rules, terminal-standards, commit-conventions)
2. **`get_workflow_pattern`** — Workflow patterns (context-preservation, session-management, branch-strategy, github-issues, dependency-management, multi-agent-orchestration, agent-safety)
3. **`get_integration_guide`** — Tool-specific guides (overview, vscode-copilot, cursor, claude-code, windsurf, continue, opencode)
4. **`search_standards`** — Full-text search across all standards
5. **`list_available_standards`** — Discover all available standards and their descriptions

#### Token Savings

**Without MCP** (loading everything upfront): ~23,000 tokens per session start
**With MCP** (on-demand): ~1,000 tokens per standard fetched, only when needed

### 2B. Traditional Submodule Setup (Alternative)

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 3. Configure CLAUDE.md

`CLAUDE.md` is Claude Code's project context file — a markdown file in your project root that Claude reads at the start of every session. Use it to set coding standards, architecture decisions, and project-specific instructions.

**Create `CLAUDE.md`** in your project root:

```markdown
# Project Context

## Standards
This project follows universal development standards via MCP (agentic-dev-standards).
Fetch standards on-demand using the MCP tools when needed.

## Architecture
[Describe your project architecture]

## Key Decisions
[Document important technical decisions]

## Coding Standards
- [Language-specific conventions]
- [Testing requirements]
- [PR review process]

## Common Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
```

**Commit `CLAUDE.md` to your repo** — it's shared project context, not personal config.

### 4. Configure Permissions

**Per-project** (`.claude/settings.json`, committed):
```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(git --no-pager *)",
      "Read(*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(rm -rf *)"
    ]
  }
}
```

**Per-user** (`.claude/settings.local.json`, gitignored):
```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Write(src/**)"
    ]
  }
}
```

See `workflow-patterns/agent-safety.md` for comprehensive permission guidance.

---

## Usage

### Terminal CLI

The primary interface. Start in any project:

```bash
cd your-project
claude
```

**One-shot commands** (non-interactive):
```bash
# Ask a question
claude "Where is error handling implemented?"

# Pipe input
git diff | claude "Review this diff for security issues"

# Automate in scripts
claude -p "Translate new strings into French and raise a PR"
```

### VS Code Extension

Install from the Extensions view — search "Claude Code" or use:
- [Install for VS Code](vscode:extension/anthropic.claude-code)
- [Install for Cursor](cursor:extension/anthropic.claude-code)

Features: inline diffs, @-mentions, plan review, conversation history in the editor.

### JetBrains Plugin

Install from the JetBrains Marketplace — search "Claude Code". Supports IntelliJ IDEA, PyCharm, WebStorm, and other JetBrains IDEs.

### Desktop App

Standalone app for running sessions outside your IDE. Download from:
- [macOS](https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect)
- [Windows](https://claude.ai/api/desktop/win32/x64/exe/latest/redirect)

### Web Interface

Run Claude Code in your browser at [claude.ai/code](https://claude.ai/code). No local setup required. Works on desktop browsers and the Claude iOS app.

### Slack Integration

Mention `@Claude` in Slack with a bug report or feature request to get a pull request back. See [Claude Code Slack docs](https://docs.anthropic.com/en/docs/claude-code/slack).

---

## Sub-Agents

Claude Code can spawn multiple sub-agents to work on different parts of a task simultaneously.

### How It Works

A lead agent coordinates the work, assigns subtasks, and merges results:

```
You: "Refactor the auth module and update all tests"

Claude: I'll split this into parallel tasks:
  → Sub-agent 1: Refactor auth middleware 
  → Sub-agent 2: Update unit tests
  → Sub-agent 3: Update integration tests
  
  [Agents work in parallel]
  
  All sub-agents complete. Merging results and verifying...
```

### Sub-Agent Types

- **`general`** — Multi-step tasks, research, complex operations
- **`explore`** — Fast codebase search and exploration

### Best Practices

- Use sub-agents for 3+ independent units of work
- Keep sub-agent prompts focused and specific
- Verify merged results (run tests, check consistency)
- See `workflow-patterns/multi-agent-orchestration.md` for comprehensive patterns

---

## Hooks

Hooks let you run shell commands before or after Claude Code actions. Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "afterFileEdit": [
      "prettier --write $FILE"
    ],
    "beforeCommit": [
      "npm run lint",
      "npm test"
    ]
  }
}
```

**Common hooks**:
- Auto-format after every file edit
- Run lint before commits
- Run tests before pushing
- Generate types after schema changes

---

## Custom Slash Commands (Skills)

Package repeatable workflows as slash commands your team can share:

**`.claude/commands/review-pr.md`**:
```markdown
Review the current PR. Check for:
1. Code quality and readability
2. Test coverage
3. Security issues
4. Performance concerns
5. Documentation completeness

Provide feedback in conventional comments format.
```

**Usage**: Type `/review-pr` in the Claude Code session.

---

## CI/CD Integration

### GitHub Actions

Automate code review, issue triage, and PR management:

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropic/claude-code-action@v1
        with:
          prompt: "Review this PR for code quality, security, and test coverage"
```

### GitLab CI/CD

```yaml
claude-review:
  stage: review
  script:
    - claude -p "Review the changes in this merge request"
```

---

## Terminal Standards

Claude Code natively follows clean bash practices. It automatically:
- Uses clean shell environments
- Avoids pagers (`git --no-pager`)
- Combines commands efficiently

See `terminal-standards.md` for the complete specification.

---

## Key Features Comparison

| Feature | Claude Code | OpenCode | Cursor |
|---------|-------------|----------|--------|
| **Instruction File** | `CLAUDE.md` | `AGENTS.md` | `.cursor/rules/` |
| **MCP Support** | Yes | Yes (stdio, http, sse) | Limited |
| **Sub-Agents** | Task tool (general, explore) | `@general` | Background agents |
| **Hooks** | Before/after actions | Via formatters/plugins | N/A |
| **Custom Commands** | `.claude/commands/` | `.opencode/commands/` | N/A |
| **CI/CD Integration** | GitHub Actions, GitLab | N/A | N/A |
| **IDE Support** | VS Code, JetBrains | VS Code (beta) | Is the IDE |
| **Web Interface** | claude.ai/code | opencode.ai | No |
| **Slack Integration** | Yes | No | No |
| **Open Source** | No | Yes (MIT) | No |

---

## Best Practices

### Starting a Session

1. `claude` in your project directory
2. Claude auto-reads `CLAUDE.md` — no manual loading needed
3. Reference standards via MCP when needed:
   ```
   "Fetch the branch-strategy workflow pattern — I need to set up a new feature branch"
   ```

### During Development

- **Leverage autonomous mode**: Describe the goal, let Claude plan and execute
  ```
  "Add rate limiting to the API. Follow conventional commits. Run tests when done."
  ```
- **Use sub-agents**: For large tasks, Claude will automatically parallelize when appropriate
- **Pipe context in**: `git diff | claude "Review this"` is powerful for quick feedback
- **Let hooks handle formatting**: Configure `afterFileEdit` hooks so you never think about it

### Ending a Session

1. Ensure all changes are committed
2. Create a session summary:
   ```
   "Create session summary in docs/archive/session-summaries/ 
    following the session-management workflow pattern"
   ```

---

## Agent SDK

For building custom agents powered by Claude Code's tools and capabilities:

- Full control over orchestration, tool access, and permissions
- Build specialized agents for your team's workflows
- See [Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview)

---

## Troubleshooting

### Claude Not Following Standards

**Fix**: Ensure `CLAUDE.md` references the standards. If using MCP, verify the MCP server is loaded:
```
"List the MCP tools you have available"
```

### MCP Server Not Loading

**Fix**:
1. Verify path: `claude mcp list` should show the server
2. Check logs: `~/.claude/logs/`
3. Test the server manually: `node /path/to/mcp-server.js`
4. Ensure `npm install` was run in the standards directory

### Context Not Persisting Between Sessions

**Fix**: Create session summaries at end of each session. Next session, Claude reads `CLAUDE.md` automatically and you can reference previous summaries.

### Commands Hanging

**Fix**: Ensure no pagers are triggered. Claude Code handles this well, but verify:
- `git config --global core.pager ""` or use `git --no-pager`
- Never use `less`, `more`, or `man` in agent workflows

---

## Summary

**Key Strengths**:
- Multi-surface (terminal, IDE, desktop, web, Slack, CI/CD)
- Sub-agent delegation for parallel work
- Hooks and custom commands for automation
- `CLAUDE.md` for shared project context
- GitHub Actions / GitLab CI integration

**Setup**:
1. Install via `curl -fsSL https://claude.ai/install.sh | bash`
2. Configure MCP server for agentic-dev-standards
3. Create `CLAUDE.md` in project root
4. Configure permissions in `.claude/settings.json`

**Usage Pattern**:
1. Start: `claude` in project directory
2. Context: `CLAUDE.md` auto-loaded, standards via MCP
3. Work: Autonomous mode with sub-agent delegation
4. Verify: Hooks auto-format and lint
5. Commit: Conventional commits
6. End: Session summary

---

**Last Updated**: February 12, 2026

For universal standards applicable to all tools:
- [`universal-agent-rules.md`](../universal-agent-rules.md)
- [`terminal-standards.md`](../terminal-standards.md)
- [`commit-conventions.md`](../commit-conventions.md)
