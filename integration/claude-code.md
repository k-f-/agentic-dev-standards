# Claude Code (CLI) Integration Guide

## Overview

Claude Code is a CLI tool for AI-assisted development using Claude 3.5 Sonnet. It excels at autonomous workflows, comprehensive codebase understanding, and terminal-first development.

## Setup

### 1. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
# or
brew install claude-code
```

### 2A. MCP Server Setup (RECOMMENDED - Token Efficient!)

**Model Context Protocol (MCP)** allows Claude to fetch standards on-demand rather than loading everything upfront, resulting in **74-86% token reduction** per session.

#### Benefits of MCP

- ✅ **Massive token savings**: Only load standards when actually needed
- ✅ **One-time setup**: Configure once, works across all projects
- ✅ **Instant updates**: No submodule management required
- ✅ **Cleaner projects**: No submodule directory needed
- ✅ **Automatic loading**: Claude fetches standards as needed

#### Step-by-Step MCP Setup

**1. Clone and install the standards repository**:

```bash
# Clone to a permanent location (not per-project)
cd ~/Development  # or your preferred location
git clone https://github.com/k-f-/agentic-dev-standards.git
cd agentic-dev-standards

# Install dependencies
npm install
```

**2. Configure Claude Code**:

Edit your Claude desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the MCP server configuration:

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

**Important**: Replace `/full/path/to` with your actual path (e.g., `/Users/yourname/Development/agentic-dev-standards/mcp-server.js`)

**3. Restart Claude Code**:

```bash
# Exit any running Claude sessions
exit

# Verify MCP server is loaded (optional)
# Check ~/.claude/logs/ for MCP connection messages
```

#### Available MCP Tools

Once configured, Claude has access to these tools (automatically invoked as needed):

1. **`get_core_standard`** - Retrieve core standards
   - `universal-agent-rules` - Meta-rules, MCP guidance, testing, code quality
   - `terminal-standards` - CRITICAL: Clean shell environment requirements
   - `commit-conventions` - Conventional Commits format

2. **`get_workflow_pattern`** - Retrieve workflow patterns
   - `context-preservation` - Token management, ADRs
   - `session-management` - Session start checklist, summaries
   - `branch-strategy` - Git workflows, PR guidelines
   - `github-issues` - Issue/PR management
   - `dependency-management` - Dependency evaluation

3. **`get_integration_guide`** - Retrieve tool-specific guides
   - `overview` - Comparison matrix
   - `vscode-copilot` - GitHub Copilot setup
   - `cursor` - Cursor IDE setup
   - `claude-code` - This guide!
   - `windsurf` - Windsurf IDE setup
   - `continue` - Continue extension setup

4. **`search_standards`** - Search across all standards
   - Find relevant sections by keyword
   - Returns matching lines with context

#### Testing MCP Setup

Start Claude Code in any project:

```bash
cd your-project
claude
```

Try asking:

```
You: "What are the terminal standards?"

Claude: [Automatically fetches terminal-standards.md via MCP and explains]
```

Or:

```
You: "Show me the commit conventions"

Claude: [Fetches commit-conventions.md and displays]
```

You don't need to explicitly tell Claude to use MCP - it will automatically fetch standards as needed!

#### Updating Standards

To get latest standards:

```bash
cd ~/Development/agentic-dev-standards  # or wherever you cloned it
git pull origin main
```

Changes are immediately available to Claude - no configuration updates needed!

#### Token Savings Example

**Without MCP** (traditional submodule approach):
```
Session start:
You: "Read agentic-dev-standards/universal-agent-rules.md"
You: "Read agentic-dev-standards/terminal-standards.md"
You: "Read agentic-dev-standards/commit-conventions.md"
You: "Read all workflow patterns..."
Result: ~23,000 tokens loaded upfront
```

**With MCP**:
```
Session start: 0 tokens from standards
You: "Help me commit this change"
Claude: [Fetches commit-conventions.md = 1,000 tokens, only when needed]
Result: ~1,000 tokens (96% reduction!)
```

### 2B. Traditional Submodule Setup (Alternative)

If you prefer the traditional approach or need standards in your git repository:

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

**Note**: With MCP setup, you don't need submodules anymore! Each project can be cleaner without the submodule directory.

### 3. Configure Project Context

Claude Code doesn't use a specific config file like `.cursorrules`. Instead, it reads from:

- Project files and structure
- README.md
- Documentation in `docs/`
- Context provided in conversation

**Best Practice**: Create `docs/development/claude-code-context.md`:

```markdown
# Claude Code Context for [Project Name]

## Universal Standards

This project follows universal standards from `agentic-dev-standards/`:

**CRITICAL - Read these first**:
1. `agentic-dev-standards/terminal-standards.md` - Clean bash environment requirements
2. `agentic-dev-standards/commit-conventions.md` - Conventional Commits
3. `agentic-dev-standards/universal-agent-rules.md` - Universal best practices

**Workflow patterns**:
- `agentic-dev-standards/workflow-patterns/session-management.md`
- `agentic-dev-standards/workflow-patterns/branch-strategy.md`
- `agentic-dev-standards/workflow-patterns/github-issues.md`
- `agentic-dev-standards/workflow-patterns/dependency-management.md`

## Project-Specific Context

[Your project details]
```

### 4. Start Session

```bash
cd your-project
claude
```

**First interaction**:

```
You: "Please read docs/development/claude-code-context.md and the universal standards from agentic-dev-standards/"

Claude: [reads files and confirms understanding]
```

## Usage

### Autonomous Mode

Claude Code can work autonomously on complex tasks:

```
You: "Add user authentication with JWT tokens. Follow all standards from agentic-dev-standards/. Create session summary when done."

Claude: [Plans the work]
I'll implement JWT authentication following the universal standards:

1. Create feature branch (feature/user-authentication)
2. Add jsonwebtoken dependency (with evaluation per dependency-management.md)
3. Implement auth middleware
4. Add tests
5. Use conventional commits
6. Create session summary

Shall I proceed?

You: "Yes"

Claude: [Works autonomously, following standards]
```

### Interactive Mode

```bash
# Start interactive session
claude

# Ask questions
You: "Explain the authentication flow"

# Request changes
You: "Refactor the validation logic to be more modular"

# Get codebase insights
You: "Show me all API endpoints"
```

### One-Shot Commands

```bash
# Ask a question
claude "Where is error handling implemented?"

# Request analysis
claude "Review the security of the authentication module"

# Generate code
claude "Create a new API endpoint for user profiles"
```

## Terminal Standards

Claude Code **natively follows clean bash practices**. It automatically:

- Uses clean shell environments
- Avoids pagers (`git --no-pager`)
- Uses absolute paths for core utilities
- Combines commands efficiently

**However**, you should still remind it:

```
"Follow terminal-standards.md from agentic-dev-standards/ for all commands"
```

## Key Features

**vs GitHub Copilot**:

- ✅ Much better at autonomous multi-step tasks
- ✅ Excellent codebase comprehension
- ✅ Natural conversation interface
- ✅ Can read and write any files
- ❌ No inline code completion
- ❌ Terminal-only (no IDE integration)

**vs Cursor**:

- ✅ Better for complex autonomous tasks
- ✅ More powerful context understanding
- ✅ Terminal-first workflow
- ❌ No IDE interface
- ❌ No inline editing

## Best Practices

### Starting a Session

```
You: "Read universal standards from agentic-dev-standards/:
1. terminal-standards.md
2. commit-conventions.md
3. universal-agent-rules.md

Then read docs/development/claude-code-context.md

Confirm you've read all files and understand the standards."
```

### During Development

**Leverage autonomous capabilities**:

```
"Implement feature X following all universal standards.
Break it into atomic commits.
Create session summary when complete."
```

**Track progress**:

```
"Show current status: branch, commits, pending tasks"
```

### End of Session

```
"Create session summary in docs/archive/session-summaries/YYYY-MM-DD_topic.md following session-management.md standards"
```

## Example Session

```bash
$ cd my-project
$ claude

You: Read universal standards from agentic-dev-standards/ and docs/development/claude-code-context.md

Claude: I've read all the files. Key standards I'll follow:
- Clean bash wrapper for all commands
- Conventional Commits (feat:, fix:, docs:, etc.)
- Atomic commits (one logical change per commit)
- Never use pagers
- Document decisions

Ready to work. What would you like me to help with?

You: Add rate limiting to the API. Follow all standards.

Claude: I'll implement rate limiting:

1. Evaluate dependencies (express-rate-limit vs alternatives)
2. Create feature branch: feature/api-rate-limiting
3. Add middleware with configuration
4. Add tests
5. Update documentation
6. Make atomic commits
7. Create session summary

Starting now...

[Claude works autonomously]

Claude: ✅ Complete. Created:
- 4 commits following conventional commits format
- feat: Add rate limiting middleware
- test: Add rate limiting tests
- docs: Document rate limiting configuration
- chore: Add express-rate-limit dependency

Session summary: docs/archive/session-summaries/2025-10-31_api-rate-limiting.md

Ready for PR creation or next task?

You: Create PR

Claude: Creating PR with proper description...
[Creates PR following branch-strategy.md standards]
```

## Integration with Git

Claude Code has excellent git integration:

```
# Automatic branch management
"Create feature branch for X"

# Atomic commits
"Commit these changes with appropriate conventional commit message"

# PR creation
"Create pull request for current branch"

# Git operations
"Rebase current branch onto main"
"Squash last 3 commits"
"Cherry-pick commit abc123 from main"
```

## Troubleshooting

### Claude not following standards

**Solution**: Explicitly reference files:

```
"Follow the standards in:
- agentic-dev-standards/terminal-standards.md
- agentic-dev-standards/commit-conventions.md"
```

### Context not persisted between sessions

**Solution**: Create session summary at end of each session:

```
"Create session summary following workflow-patterns/session-management.md"
```

Next session, reference it:

```
"Read the latest session summary from docs/archive/session-summaries/"
```

### Commands failing

**Solution**: Claude Code handles terminal well, but verify:

```
"Use clean bash wrapper from terminal-standards.md"
"Never use pagers - always use git --no-pager"
```

## Advanced Usage

### Custom Workflows

Create project-specific workflow docs that reference universal standards:

```markdown
# docs/development/workflows/new-feature.md

## Adding a New Feature

Follow universal standards from `agentic-dev-standards/`, with these project-specific steps:

1. Create feature branch (per branch-strategy.md)
2. Add feature with tests
3. Update API documentation
4. Run integration tests against staging
5. Create PR (per github-issues.md)
6. Deploy to staging
7. QA approval
8. Merge and deploy to production
```

Then:

```
You: "Add new feature X following docs/development/workflows/new-feature.md"
```

### Integration with CI/CD

Claude can interact with CI/CD:

```
You: "Check CI status for current PR"
You: "Fix the failing tests in CI"
You: "Deploy current branch to staging"
```

## Summary

**Key Strengths**:

- Autonomous multi-step workflows
- Excellent codebase understanding
- Natural terminal-first interaction
- Powerful git integration
- Follows standards well when instructed

**Setup**:

- Add `agentic-dev-standards` submodule
- Create `docs/development/claude-code-context.md`
- Reference standards at session start

**Usage Pattern**:

1. Start session: `claude`
2. Load context: "Read standards from agentic-dev-standards/"
3. Work autonomously: "Implement feature X following all standards"
4. End session: "Create session summary"

**Best For**:

- Complex multi-file refactorings
- Feature implementation end-to-end
- Codebase analysis and understanding
- Terminal-first developers
- Autonomous workflows

---

For universal standards applicable to all tools:

- [`universal-agent-rules.md`](../universal-agent-rules.md)
- [`terminal-standards.md`](../terminal-standards.md)
- [`commit-conventions.md`](../commit-conventions.md)
