# Agent Safety & Permissions

**Purpose**: Standards for managing AI agent permissions, preventing destructive operations, handling secrets, and maintaining audit trails in agentic coding workflows.

**Applies to**: All AI coding assistants operating with file system access, terminal access, and git integration.

---

## Table of Contents

- [Core Principle](#core-principle)
- [Permission Models by Tool](#permission-models-by-tool)
- [Destructive Operations](#destructive-operations)
- [Secrets Management](#secrets-management)
- [Sandboxing Strategies](#sandboxing-strategies)
- [Audit Trails](#audit-trails)
- [Rollback Patterns](#rollback-patterns)
- [Permission Escalation](#permission-escalation)
- [The YOLO Anti-Pattern](#the-yolo-anti-pattern)
- [Quick Reference](#quick-reference)

---

## Core Principle

**Agents should operate with the minimum permissions required to complete their task.** When in doubt, ask the human. The cost of asking is seconds; the cost of a destructive mistake can be hours or worse.

This applies regardless of tool, model, or workflow. Every agent with file system and terminal access is capable of causing irreversible damage if unconstrained.

---

## Permission Models by Tool

### Claude Code

**Configuration**: `.claude/settings.local.json` (per-user, gitignored) and `.claude/settings.json` (per-project, committed)

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm test)",
      "Bash(npm run build)",
      "Read(*)",
      "Write(src/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Bash(curl * | bash)"
    ]
  }
}
```

**Key features**:
- Glob-based allow/deny lists for bash commands
- Separate read/write file permissions
- Per-project and per-user settings (project settings committed to repo, user settings gitignored)
- Hooks for pre/post action validation

### OpenCode

**Configuration**: `.opencode/config.json` or `crush.json` (for Crush)

```json
{
  "permissions": {
    "allowed_tools": [
      "view",
      "ls",
      "grep",
      "edit",
      "write"
    ]
  }
}
```

**Key features**:
- Tool-level allow list
- Permission prompt before each tool invocation (by default)
- `--yolo` flag to skip all prompts (dangerous — see [The YOLO Anti-Pattern](#the-yolo-anti-pattern))
- Session-level "allow for session" option

### Cursor

**Configuration**: Workspace trust settings, `.cursor/rules/` for behavioral constraints

- Trusts the workspace by default when opened
- No granular per-command permission model
- Relies on behavioral instructions in rules files
- Agent mode runs commands with user confirmation

### GitHub Copilot

- No autonomous execution — suggestions only
- Agent mode (when available) requires user approval per action
- No persistent permission configuration

### Aider

- Asks confirmation before applying edits
- `--yes` flag auto-confirms (equivalent to YOLO)
- `--no-auto-commits` to prevent automatic git commits
- No granular permission system beyond these flags

---

## Destructive Operations

### Operations Agents Must NEVER Perform Without Explicit Confirmation

| Operation | Risk Level | Why |
|-----------|-----------|-----|
| `git push --force` | **CRITICAL** | Rewrites remote history, can destroy teammates' work |
| `git push --force` to `main`/`master` | **CRITICAL** | Should almost never happen; warn even when requested |
| `rm -rf` on directories | **CRITICAL** | Irreversible data loss |
| `DROP TABLE` / `DROP DATABASE` | **CRITICAL** | Irreversible data loss |
| Deploy to production | **CRITICAL** | User-facing impact |
| Modify CI/CD secrets | **CRITICAL** | Security and pipeline integrity |
| Delete git branches (remote) | **HIGH** | Disrupts other developers' work |
| Modify `.env` or credential files | **HIGH** | Security exposure |
| Run `curl | bash` or `eval` | **HIGH** | Arbitrary code execution |
| Major version dependency upgrades | **MEDIUM** | May introduce breaking changes |
| Database migrations | **MEDIUM** | Schema changes can be hard to reverse |
| Modify git hooks | **MEDIUM** | Changes team workflow without discussion |

### Safe Operations (Generally OK to Auto-Approve)

- Reading any file
- Searching/grepping across the codebase
- Running tests (`npm test`, `pytest`, etc.)
- Running linters
- Creating new files in expected locations
- Git operations: `status`, `diff`, `log`, `branch` (local)
- Building the project

### Recommended Permission Configuration

**Conservative (recommended for production codebases)**:
```
Allow: read, search, test, lint, build, local git operations
Deny: everything else (prompt for approval)
```

**Moderate (for active development)**:
```
Allow: read, search, test, lint, build, local git, file edits in src/
Deny: deployment, force push, delete, credential access
```

**Permissive (for greenfield/personal projects only)**:
```
Allow: most operations
Deny: force push, production deploy, credential modification
```

---

## Secrets Management

### Agents Must Never

1. **Display secrets in output**: API keys, tokens, passwords, connection strings
2. **Commit secret files**: `.env`, `credentials.json`, `*.pem`, `*.key`, service account JSON
3. **Log secrets**: Even in debug output or session summaries
4. **Include secrets in context**: Don't paste `.env` contents into agent prompts
5. **Send secrets to external services**: Including other MCP servers or APIs

### Patterns for Safe Secret Handling

**Reference, don't reveal**:
```
# GOOD: Tell the agent about the structure
"The API key is stored in .env as STRIPE_API_KEY. 
 Use process.env.STRIPE_API_KEY in the code."

# BAD: Paste the actual value
"The API key is sk_live_abc123..."
```

**Use .gitignore defensively**:
```gitignore
# Secrets - NEVER commit
.env
.env.*
*.pem
*.key
credentials.json
service-account.json
```

**Use .env.example for structure**:
```bash
# .env.example (committed to repo)
STRIPE_API_KEY=sk_test_replace_me
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

### Detection: Files Agents Should Flag

If an agent encounters these files in a commit staging area, it should **warn the user before committing**:

```
.env, .env.*, .env.local, .env.production
*.pem, *.key, *.p12, *.pfx
credentials.json, service-account*.json
*_rsa, *_ecdsa, *_ed25519
id_rsa, id_ecdsa, id_ed25519
*.keystore, *.jks
```

---

## Sandboxing Strategies

### Docker for Untrusted Operations

When running untrusted commands or testing potentially destructive operations:

```bash
# Run agent commands in a disposable container
docker run --rm -v $(pwd):/workspace -w /workspace node:20 npm test

# Sandbox file operations
docker run --rm -v $(pwd):/workspace:ro -w /workspace ubuntu bash -c "command"
```

**When to sandbox**:
- Running code from untrusted sources
- Testing database migration scripts
- Running cleanup/deletion scripts for the first time
- Evaluating third-party MCP servers

### Filesystem Access Restrictions

**Principle**: Agents should only access files within the project directory.

Most tools enforce this by default, but verify:
- Claude Code: Respects `.claude/settings.json` path restrictions
- OpenCode: `.crushignore` / `.opencodeignore` for exclusions
- Cursor: Workspace-scoped by default

**Never give agents access to**:
- `~/.ssh/` — SSH keys
- `~/.aws/` — AWS credentials
- `~/.config/` — Application configs with secrets
- `/etc/` — System configuration
- Other project directories (unless explicitly needed)

### Network Isolation

For sensitive projects:
- Restrict agent network access to known-safe endpoints
- Block access to external APIs unless explicitly needed
- Use environment-specific configs that point to staging, never production

---

## Audit Trails

### What to Track

Every agentic session should produce a record of:

1. **Commands executed** — What the agent ran in the terminal
2. **Files modified** — What changed and why
3. **Git operations** — Commits, branch operations, pushes
4. **Decisions made** — Key choices the agent made (and why)
5. **Permissions granted** — What the user approved during the session

### How to Track

**Git history is your primary audit trail**:
- Atomic commits with conventional commit messages document what changed
- `git diff` shows exactly what was modified
- `git log --author` can filter agent-made commits

**Session summaries** (see `session-management.md`):
- Created at end of each session
- Include files modified, commands run, decisions made
- Stored in `docs/archive/session-summaries/`

**Tool-specific logs**:
- Claude Code: Session transcripts
- OpenCode: `.opencode/logs/opencode.log` in project directory
- Cursor: Composer history

### Attribution in Commits

When agents create commits, attribution should be clear:

```bash
# Claude Code adds trailers automatically
# For other tools, consider:
git commit -m "feat: Add user dashboard

Co-Authored-By: AI Assistant <assistant@tool.com>"
```

OpenCode and Crush support configurable attribution:
```json
{
  "options": {
    "attribution": {
      "trailer_style": "assisted-by",
      "generated_with": true
    }
  }
}
```

---

## Rollback Patterns

### When an Agent Makes a Mistake

**Level 1: Undo last change** (within session)
```
# OpenCode
/undo

# Aider  
/undo

# Claude Code
"Revert the last change you made"
```

**Level 2: Git revert** (committed but not pushed)
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert abc1234

# Soft reset (keep changes, uncommit)
git reset --soft HEAD~1
```

**Level 3: Branch-based recovery** (multiple commits)
```bash
# The feature branch itself is the rollback boundary
# If things go wrong, just delete the branch
git checkout main
git branch -D feature/broken-attempt

# Or reset to a known-good point
git reset --hard <known-good-commit>
```

**Level 4: Stash recovery** (for uncommitted changes)
```bash
# Before letting an agent work, stash current state
git stash push -m "pre-agent-work snapshot"

# If agent breaks things
git checkout -- .
git stash pop
```

### Pre-Session Safety Checklist

Before starting a complex agentic session:

- [ ] Commit or stash all current work
- [ ] Create a feature branch (never work on main)
- [ ] Note the current HEAD commit hash
- [ ] Verify tests pass at current state
- [ ] Confirm the agent's permission level is appropriate

---

## Permission Escalation

### When Agents Should Ask the Human

Even with broad permissions, agents should pause and confirm before:

1. **First-time operations**: First deployment, first database migration, first CI change
2. **Operations affecting other developers**: Push to shared branches, modify shared configs
3. **Irreversible operations**: Anything that can't be undone with `git revert`
4. **Operations outside normal scope**: If asked to "fix the API" and the fix requires changing the database schema
5. **Security-sensitive changes**: Auth logic, encryption, access control, CORS
6. **Cost-incurring operations**: Cloud resource creation, paid API calls
7. **Scope expansion**: When the fix for issue A requires changing seemingly unrelated system B

### How to Ask

Agents should present the decision clearly:

```
I need to run a database migration that will add a new column to the users table.

This will:
- Add column 'last_login_at' (timestamp, nullable) to users table
- Run on the development database at DATABASE_URL

This is NOT reversible without a separate down migration.

Should I proceed? [Yes / No / Show me the migration first]
```

---

## The YOLO Anti-Pattern

### What It Is

Several tools offer "auto-approve everything" modes:
- OpenCode: `--yolo` flag
- Aider: `--yes` flag
- Crush: `--yolo` flag

These skip all permission prompts, letting the agent execute any tool without human confirmation.

### When It's Acceptable

- **Personal throwaway projects** with no production impact
- **Isolated sandbox environments** (Docker, VMs)
- **Automated CI/CD pipelines** where the agent's scope is pre-constrained
- **Demos and experimentation** where consequences don't matter

### When It's Dangerous

- **Any production codebase** — one wrong `rm -rf` or `git push --force` and you're recovering from backups
- **Shared repositories** — agent actions affect your teammates
- **Repositories with secrets** — agent might expose credentials
- **Unfamiliar codebases** — agent might misunderstand project structure

### The Middle Ground

Instead of full YOLO, selectively auto-approve safe operations:

```json
{
  "permissions": {
    "allowed_tools": ["view", "ls", "grep", "glob", "diagnostics"]
  }
}
```

This gives the agent read-only autonomy while still requiring approval for writes and commands. This is almost always the better choice.

---

## Quick Reference

### Permission Levels

| Level | Read | Write | Git (local) | Git (remote) | Terminal | Deploy |
|-------|------|-------|-------------|-------------|---------|--------|
| Read-only | Yes | No | No | No | No | No |
| Conservative | Yes | Prompt | Status/diff | No | Prompt | No |
| Moderate | Yes | Yes (src/) | Yes | Prompt | Tests/lint | No |
| Permissive | Yes | Yes | Yes | Prompt | Most | Prompt |
| YOLO | Yes | Yes | Yes | Yes | Yes | Yes |

### Secrets Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` exists with placeholder values
- [ ] No API keys or tokens in code or config files
- [ ] Agent prompts don't contain actual secret values
- [ ] CI/CD secrets are managed via platform (not files)
- [ ] Session summaries don't contain secrets

### Pre-Session Safety

```bash
# 1. Ensure clean starting state
git status  # Should be clean or stash first

# 2. Create a branch
git checkout -b feature/your-task

# 3. Note recovery point
git log -1 --format='%H'  # Save this hash

# 4. Set appropriate permissions for your tool
# (See tool-specific sections above)

# 5. Begin work
```

---

**Last Updated**: February 12, 2026
**Version**: 1.0.0

---

**Related Standards**:
- [`multi-agent-orchestration.md`](multi-agent-orchestration.md) - Sub-agent patterns and delegation
- [`session-management.md`](session-management.md) - Session lifecycle and summaries
- [`branch-strategy.md`](branch-strategy.md) - Branch naming and git workflows
