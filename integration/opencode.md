# OpenCode Integration Guide

## Overview

[OpenCode](https://opencode.ai) is an open-source AI coding agent built for the terminal by [Anomaly](https://anoma.ly). With 100K+ GitHub stars and 700+ contributors, it is one of the most popular agentic coding tools. It supports 75+ LLM providers, has built-in LSP integration, and offers TUI, desktop, IDE, and web interfaces.

**Repository**: [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)

**Key differentiators vs Claude Code**:
- 100% open source (MIT license)
- Provider-agnostic — works with Claude, GPT, Gemini, local models, and more
- Built-in LSP support for richer code intelligence
- Client/server architecture — drive remotely from mobile or other clients
- TUI-first design with theming, keybind customization, and Vim-like editor
- Plan/Build mode split for safe exploration before making changes

---

## Setup

### 1. Install OpenCode

```bash
# Recommended (Homebrew, always up to date)
brew install anomalyco/tap/opencode

# Or via npm
npm install -g opencode-ai

# Or via install script
curl -fsSL https://opencode.ai/install | bash
```

### 2A. MCP Server Setup (RECOMMENDED)

OpenCode has full MCP support. Configure this standards repo as an MCP server for on-demand access to all standards.

**Edit your OpenCode config** (`.opencode/config.json` in your project, or global config):

```json
{
  "mcpServers": {
    "agentic-dev-standards": {
      "type": "stdio",
      "command": "node",
      "args": ["/full/path/to/agentic-dev-standards/mcp-server.js"]
    }
  }
}
```

**Important**: Replace `/full/path/to` with your actual path (e.g., `/Users/yourname/Development/agentic-dev-standards/mcp-server.js`).

#### Available MCP Tools

Once configured, OpenCode has access to these tools:

1. **`get_core_standard`** — Retrieve core standards (universal-agent-rules, terminal-standards, commit-conventions)
2. **`get_workflow_pattern`** — Retrieve workflow patterns (context-preservation, session-management, branch-strategy, github-issues, dependency-management, multi-agent-orchestration, agent-safety)
3. **`get_integration_guide`** — Retrieve tool-specific guides (overview, vscode-copilot, cursor, claude-code, windsurf, continue, opencode)
4. **`search_standards`** — Full-text search across all standards
5. **`list_available_standards`** — Discover all available standards and their descriptions

#### Testing MCP Setup

Start OpenCode and ask:

```
What are the terminal standards?
```

If the MCP server is configured correctly, OpenCode will fetch `terminal-standards.md` via the MCP tool and display the standards.

### 2B. Traditional Submodule Setup (Alternative)

If you prefer standards in your git repository:

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 3. Initialize Project Context

OpenCode uses `AGENTS.md` as its project context file (analogous to Claude Code's `CLAUDE.md`). Run the init command:

```bash
opencode
```

Then in the TUI:

```
/init
```

This analyzes your project and creates `AGENTS.md` with project-specific context. **Commit this file to git** — it helps OpenCode (and other agentic tools that read `AGENTS.md`) understand your project.

### 4. Configure Rules

For project-specific instructions beyond `AGENTS.md`, create rules files:

**`.opencode/rules/standards.md`**:

```markdown
# Development Standards

This project follows universal standards from agentic-dev-standards/:

## Critical Standards
- Follow terminal-standards.md for all terminal commands
- Follow commit-conventions.md for all commits
- Follow universal-agent-rules.md for all development work

## Workflow Patterns
- Use session-management.md for session lifecycle
- Use branch-strategy.md for git branching
- Use github-issues.md for issue/PR management
- Use dependency-management.md for adding dependencies
- Use multi-agent-orchestration.md for sub-agent work
- Use agent-safety.md for permissions and safety
```

### 5. Configure Permissions

Set appropriate permissions in `.opencode/config.json`:

```json
{
  "permissions": {
    "allowed_tools": [
      "view",
      "ls",
      "grep",
      "glob",
      "diagnostics"
    ]
  }
}
```

This allows read-only tools without prompting while requiring approval for writes and commands. Adjust based on your comfort level (see `workflow-patterns/agent-safety.md`).

---

## Usage

### Plan Mode (Read-Only Analysis)

Press **Tab** to toggle to Plan mode. In this mode, OpenCode:
- Cannot modify files (edit/write tools denied by default)
- Asks permission before running bash commands
- Ideal for exploring unfamiliar code, planning changes, or reviewing architecture

```
<Tab>  → Switch to Plan mode
"How is authentication handled in this project?"
"What would need to change to add rate limiting to the API?"
```

### Build Mode (Full Development)

Press **Tab** again to return to Build mode. Full access to all tools:

```
<Tab>  → Switch to Build mode
"Implement rate limiting based on the plan above"
"Add tests for the new rate limiter"
"Commit with a conventional commit message"
```

### Sub-Agent Delegation

Use `@general` to invoke the sub-agent for complex multi-step tasks:

```
@general Search for all files that import the deprecated 'utils/legacy' module
and list them with their line numbers
```

### Custom Commands

Create reusable commands in `.opencode/commands/`:

**`.opencode/commands/session-start.md`**:
```markdown
# Session Start

Read the latest session summary from docs/archive/session-summaries/.
Check git status and current branch.
Review any open TODOs in the codebase.
Summarize the current project state.
```

Then invoke with `Ctrl+K` → select `project:session-start`.

### Key Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Toggle Plan/Build mode |
| `Ctrl+O` | Switch model |
| `Ctrl+K` | Command palette |
| `Ctrl+N` | New session |
| `Ctrl+A` | Switch session |
| `Ctrl+S` | Send message |
| `Ctrl+E` | Open external editor |
| `Ctrl+X` | Cancel current operation |
| `Ctrl+L` | View logs |
| `i` | Focus editor (when not typing) |
| `Esc` | Blur editor / close dialog |

### Undo/Redo

```
/undo    → Revert last change, re-show your prompt for editing
/redo    → Re-apply the undone change
```

You can run `/undo` multiple times to step back through changes.

### Session Sharing

```
/share   → Creates a shareable link to the current conversation
```

Useful for team collaboration, debugging discussions, or documenting decisions.

---

## Model Configuration

### Multi-Model Setup

OpenCode supports assigning different models to different agent roles:

```json
{
  "agents": {
    "build": {
      "model": "anthropic/claude-opus-4"
    },
    "plan": {
      "model": "google/gemini-2.5-pro"
    }
  }
}
```

This leverages model specialization — use a reasoning-heavy model for planning and a code-focused model for implementation. See `workflow-patterns/multi-agent-orchestration.md` for the full model routing guide.

### Provider Configuration

**API key-based** (set environment variables):

| Variable | Provider |
|----------|----------|
| `ANTHROPIC_API_KEY` | Anthropic (Claude) |
| `OPENAI_API_KEY` | OpenAI (GPT) |
| `GEMINI_API_KEY` | Google (Gemini) |
| `GITHUB_TOKEN` | GitHub Copilot |
| `GROQ_API_KEY` | Groq |

**OpenCode Zen** (curated model access):
```
/connect → select opencode → sign in at opencode.ai/auth
```

**Local models** (Ollama, LM Studio):
```json
{
  "providers": {
    "ollama": {
      "name": "Ollama",
      "base_url": "http://localhost:11434/v1/",
      "type": "openai-compat",
      "models": [{
        "name": "Qwen 3 30B",
        "id": "qwen3:30b",
        "context_window": 256000
      }]
    }
  }
}
```

---

## LSP Integration

OpenCode automatically loads Language Server Protocol servers for enhanced code intelligence:

```json
{
  "lsp": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"]
    },
    "go": {
      "command": "gopls"
    },
    "python": {
      "command": "pyright-langserver",
      "args": ["--stdio"]
    }
  }
}
```

The agent can access LSP diagnostics for error checking and fix suggestions. This gives OpenCode richer code understanding than tools without LSP support.

---

## Key Features Comparison

| Feature | OpenCode | Claude Code | Cursor |
|---------|----------|-------------|--------|
| **Open Source** | Yes (MIT) | No | No |
| **Provider Agnostic** | Yes (75+) | Claude only* | Multiple |
| **Instruction File** | `AGENTS.md` | `CLAUDE.md` | `.cursor/rules/` |
| **MCP Support** | Yes (stdio, http, sse) | Yes (stdio) | Limited |
| **LSP Integration** | Built-in | No | Built-in |
| **Sub-Agents** | `@general` | Task tool | Background agents |
| **Mode Split** | Plan/Build (Tab) | N/A | N/A |
| **Undo/Redo** | `/undo`, `/redo` | No native undo | No native undo |
| **Session Sharing** | `/share` (link) | No | No |
| **Desktop App** | Yes (beta) | Yes | Yes (is IDE) |
| **IDE Extension** | Yes (VSCode) | Yes (VSCode, JetBrains) | N/A (is IDE) |
| **Web Interface** | Yes | Yes | No |
| **Pricing** | Free (BYOK) + Zen plans | Subscription | Subscription |

*Claude Code now supports third-party providers in some configurations.

---

## Recommended Plugins

OpenCode has a growing plugin ecosystem. These plugins implement patterns described in our standards and are worth evaluating for your workflow. Browse the full list at [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode).

### Safety & Permissions

These plugins implement patterns from `workflow-patterns/agent-safety.md`:

| Plugin | What It Does | Standards Alignment |
|--------|-------------|---------------------|
| [CC Safety Net](https://github.com/nicobailey/cc-safety-net) | Catches destructive commands (`rm -rf`, `git push --force`, `DROP TABLE`) before execution | Destructive operation detection |
| [Envsitter Guard](https://github.com/nicobailey/envsitter-guard) | Prevents `.env` file contents from leaking into LLM context | Secrets management |
| [Cupcake](https://github.com/AshDevFr/cupcake) | OPA/Rego policy enforcement for agent actions | Permission model enforcement |

### Memory & Context

These plugins implement patterns from `workflow-patterns/context-preservation.md`:

| Plugin | What It Does | Standards Alignment |
|--------|-------------|---------------------|
| [Simple Memory](https://github.com/dimdamgit/opencode-simple-memory) | Git-based persistent memory across sessions | Git-as-source-of-truth, session handoff |
| [Handoff](https://github.com/fargusplumdoodle/handoff) | Automates session summary creation and loading | Session management pattern |
| [Dynamic Context Pruning](https://github.com/kaiban-ai/opencode-dcp) | Automatically manages token budget by pruning stale context | Token budget strategies |

### Agent Orchestration

These plugins relate to `workflow-patterns/multi-agent-orchestration.md`:

| Plugin | What It Does | Standards Alignment |
|--------|-------------|---------------------|
| [Oh My Opencode Slim](https://github.com/nicobailey/oh-my-opencode-slim) | Specialist sub-agents (Explorer, Oracle, Librarian, Designer) | Model specialization pattern |
| [Pocket Universe](https://github.com/AshDevFr/pocket-universe) | Isolated sandbox for async agent work with verification | Verified merge pattern (prevents "Unverified Merge" anti-pattern) |

### Shell & Terminal

These plugins complement `terminal-standards.md`:

| Plugin | What It Does | Standards Alignment |
|--------|-------------|---------------------|
| [Froggy](https://github.com/chadgauth/froggy-opencode) | Hook system for OpenCode (pre-commit, post-edit, etc.) | Automation hooks (OpenCode lacks native hooks) |
| [Shell Strategy](https://github.com/wonderwhy-er/opencode-shell-strategy) | Teaches LLMs to avoid interactive shell hangs | Clean shell environment |

### Getting Started with Plugins

1. **Start minimal**: Don't install everything at once. Add plugins as you encounter the problems they solve.
2. **Safety first**: CC Safety Net and Envsitter Guard are low-risk, high-value starting points.
3. **Match your workflow**: If you do long sessions, prioritize Handoff and Dynamic Context Pruning. If you use sub-agents heavily, look at Oh My Opencode Slim.
4. **Reference config**: See [jjmartres/opencode](https://github.com/jjmartres/opencode) for a well-structured OpenCode configuration example.

### Ecosystem Gaps

These standard patterns don't yet have community plugins (potential contribution opportunities):

- **Conventional commits enforcement** — No plugin validates commit message format
- **ADR management** — No plugin automates Architecture Decision Records
- **Branch strategy enforcement** — No plugin enforces naming conventions
- **Dependency audit** — No plugin runs pre-install security checks

---

## Best Practices

### Starting a Session

1. Navigate to your project and run `opencode`
2. If first time: run `/init` to create `AGENTS.md`
3. Start in **Plan mode** (Tab) for orientation:
   ```
   "What's the current state of the project? Check git status, 
    recent commits, and any open TODOs."
   ```
4. Switch to **Build mode** (Tab) when ready to make changes

### During Development

- **Use Plan mode for research**: Explore code, understand architecture, draft approaches
- **Use Build mode for implementation**: Write code, run tests, make commits
- **Leverage `@general`**: For complex searches spanning many files
- **Switch models as needed**: `Ctrl+O` — use reasoning models for architecture, fast models for implementation
- **Reference standards**: Ask the MCP tools for specific standards when needed

### Ending a Session

1. Ensure all changes are committed with conventional commit messages
2. Run tests to verify nothing is broken
3. Create a session summary:
   ```
   "Create a session summary following the session-management workflow pattern.
    Include: what was done, key decisions, pending items, context for next session."
   ```
4. Use `/share` to save a link to the session if valuable for the team

---

## Troubleshooting

### MCP Server Not Loading

**Symptom**: Standards tools not available in session.

**Fix**:
1. Verify the path in config is absolute and correct
2. Check that `node` is installed and in PATH
3. Check that `npm install` was run in the agentic-dev-standards directory
4. Look at OpenCode logs: `.opencode/logs/opencode.log`

### Model Not Responding

**Symptom**: No response or timeout.

**Fix**:
1. Verify API key is set correctly
2. Check internet connectivity
3. Try a different model (`Ctrl+O`)
4. Check provider status page

### LSP Not Working

**Symptom**: No diagnostics or code intelligence.

**Fix**:
1. Verify the language server is installed (`which typescript-language-server`)
2. Check LSP config in `.opencode/config.json`
3. Enable debug logging: `"debug_lsp": true` in config
4. Check logs for LSP connection errors

### Agent Making Unwanted Changes

**Fix**:
1. `/undo` to revert the last change
2. Refine your prompt with more specific constraints
3. Switch to Plan mode to discuss approach before implementing
4. Adjust permissions in config to restrict scope

---

## Advanced Configuration

### Themes

OpenCode supports custom themes:

```bash
# List available themes
# Configure in .opencode/config.json
```

See [opencode.ai/docs/themes](https://opencode.ai/docs/themes) for the full theme gallery.

### Formatters

Auto-format code after agent edits:

```json
{
  "formatters": {
    "typescript": {
      "command": "prettier",
      "args": ["--write"]
    },
    "go": {
      "command": "gofmt",
      "args": ["-w"]
    }
  }
}
```

### Agent Skills

OpenCode supports the [Agent Skills](https://agentskills.io) open standard:

```
~/.config/opencode/skills/   → User-level skills
.opencode/skills/            → Project-level skills
```

Each skill is a folder with a `SKILL.md` file containing instructions the agent can activate on demand.

### GitHub / GitLab Integration

OpenCode can integrate with GitHub and GitLab for issue management:

```
# Create PR from current branch
"Create a pull request for this branch with a proper description"

# Reference GitHub issues
"Fix the bug described in issue #42"
```

See [opencode.ai/docs/github](https://opencode.ai/docs/github) and [opencode.ai/docs/gitlab](https://opencode.ai/docs/gitlab).

---

## Summary

**Key Strengths**:
- Open source, provider-agnostic, massive community
- Plan/Build mode split for safe exploration
- Built-in LSP for richer code intelligence
- Multi-model support with per-agent configuration
- Full MCP support for extensibility

**Setup**:
1. `brew install anomalyco/tap/opencode`
2. Configure MCP server for agentic-dev-standards
3. Run `/init` to create `AGENTS.md`
4. Configure rules and permissions

**Usage Pattern**:
1. Start: `opencode` in project directory
2. Orient: Plan mode → understand current state
3. Build: Build mode → implement changes
4. Verify: Run tests, review diffs
5. Commit: Conventional commits
6. End: Session summary, `/share` if valuable

---

**Last Updated**: February 12, 2026

For universal standards applicable to all tools:
- [`universal-agent-rules.md`](../universal-agent-rules.md)
- [`terminal-standards.md`](../terminal-standards.md)
- [`commit-conventions.md`](../commit-conventions.md)
