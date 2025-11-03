# GitHub Copilot (VSCode) Integration Guide

## Overview

GitHub Copilot in VSCode is configured using `.github/copilot-instructions.md`. This guide shows how to integrate universal standards from this repository.

## Prerequisites

- VSCode installed
- GitHub Copilot subscription ($10/mo individual, $19/mo business)
- GitHub Copilot extension installed in VSCode

## Setup Steps

### 1. Add Submodule

```bash
# In your project root
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

### 2. Create Copilot Instructions File

Create `.github/copilot-instructions.md` in your project:

```bash
mkdir -p .github
touch .github/copilot-instructions.md
```

### 3. Configure Instructions File

Edit `.github/copilot-instructions.md`:

```markdown
# GitHub Copilot Instructions for [Your Project Name]

**⚠️ CRITICAL - READ FIRST**: Universal best practices are in `agentic-dev-standards/`.

**BEFORE reading project-specific instructions below, you MUST read these files IN ORDER**:

1. **`agentic-dev-standards/terminal-standards.md`** - Terminal environment requirements (CRITICAL)
2. **`agentic-dev-standards/commit-conventions.md`** - Conventional Commits standard
3. **`agentic-dev-standards/universal-agent-rules.md`** - Universal best practices

**Workflow-specific guidance** (read as needed):
- `agentic-dev-standards/workflow-patterns/session-management.md` - Session summaries
- `agentic-dev-standards/workflow-patterns/branch-strategy.md` - Branch naming, git workflows
- `agentic-dev-standards/workflow-patterns/github-issues.md` - Issue/PR management
- `agentic-dev-standards/workflow-patterns/dependency-management.md` - Dependency management

---

## Project-Specific Instructions

### Project Overview

[Brief description of your project]

**Tech Stack**:
- Language: [e.g., TypeScript, Python]
- Framework: [e.g., React, Express, Django]
- Database: [e.g., PostgreSQL, MongoDB]
- Build Tool: [e.g., Webpack, Vite, esbuild]

### Project-Specific Rules

#### Code Style

[Your project-specific style preferences]

Example:
- Use functional components (not class components) for React
- Prefer async/await over promises
- Use named exports (not default exports)
- Max line length: 100 characters

#### Testing

[Your testing strategy]

Example:
- Test files: `*.test.ts` (not `*.spec.ts`)
- Use Jest with React Testing Library
- Minimum coverage: 80%
- Run tests before every commit: `npm test`

#### Project Structure

[Your directory organization]

Example:
```

src/
├── components/      # React components
├── services/        # API clients, business logic
├── utils/          # Helper functions
├── types/          # TypeScript type definitions
└── tests/          # Test files

```

#### Environment Variables

[Your env var conventions]

Example:
- Required: `DATABASE_URL`, `API_KEY`, `JWT_SECRET`
- Optional: `LOG_LEVEL`, `PORT`
- Use `.env.example` as template

### Important Notes

- [Any project-specific gotchas or important info]

Example:
- Database migrations must be run manually: `npm run db:migrate`
- API rate limit: 100 requests/minute in dev, 1000/min in prod
- Use staging environment for testing: `npm run deploy:staging`
```

### 4. Configure VSCode Terminal Profiles

Create or edit `.vscode/settings.json`:

```json
{
  "terminal.integrated.profiles.osx": {
    "Copilot-Clean-Bash": {
      "path": "/bin/bash",
      "args": ["--noprofile", "--norc"],
      "icon": "robot",
      "env": {
        "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    }
  },
  "terminal.integrated.profiles.linux": {
    "Copilot-Clean-Bash": {
      "path": "/bin/bash",
      "args": ["--noprofile", "--norc"],
      "icon": "robot",
      "env": {
        "PATH": "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
      }
    }
  },
  "terminal.integrated.profiles.windows": {
    "Copilot-Clean-Cmd": {
      "path": "${env:SystemRoot}\\System32\\cmd.exe",
      "args": ["/K"],
      "icon": "robot"
    }
  },
  "github.copilot.chat.terminalProfile.osx": "Copilot-Clean-Bash",
  "github.copilot.chat.terminalProfile.linux": "Copilot-Clean-Bash",
  "github.copilot.chat.terminalProfile.windows": "Copilot-Clean-Cmd"
}
```

**Note**: Adjust PATH for Apple Silicon vs Intel Mac:

- **Apple Silicon**: `/opt/homebrew/bin:/usr/local/bin:...`
- **Intel Mac**: `/usr/local/bin:/usr/bin:...`

### 5. Commit Configuration

```bash
git add .github/copilot-instructions.md .vscode/settings.json agentic-dev-standards
git commit -m "chore: Configure GitHub Copilot with universal standards"
```

## Usage

### Starting a Session

1. **Open VSCode** in your project
2. **Open Copilot Chat** (Ctrl+Shift+I / Cmd+Shift+I)
3. **Copilot automatically reads** `.github/copilot-instructions.md`

### Verifying Configuration

Ask Copilot:

```
"Have you read the universal standards from agentic-dev-standards/?"
```

Expected response should reference:

- Terminal standards (clean bash wrapper)
- Commit conventions (Conventional Commits)
- Universal best practices

### Example Interactions

**Good: Copilot follows standards**

User: "Create a new feature branch for user authentication"

Copilot:

```bash
# Following branch-strategy.md from universal standards
git checkout -b feature/user-authentication
```

**Good: Copilot uses terminal standards**

User: "Check git status"

Copilot:

```bash
# Following terminal-standards.md
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'git status'
```

**Good: Copilot uses commit conventions**

User: "Commit these changes"

Copilot:

```bash
git commit -m "feat: Add user authentication endpoint

- Implement JWT token generation
- Add login and logout routes
- Update user model with password field"
```

## Limitations

### Token Limit

`.github/copilot-instructions.md` has a limit of ~4000 tokens.

**Mitigation**:

- Keep project-specific instructions concise
- Reference universal standards (don't duplicate)
- Use external docs for detailed info

### No Auto-Update

Copilot doesn't auto-reload instructions when changed.

**Mitigation**:

- Reload VSCode window after changing instructions
- Or ask Copilot: "Please re-read .github/copilot-instructions.md"

### Limited Multi-File Editing

Copilot chat can suggest changes to multiple files but doesn't apply them automatically.

**Mitigation**:

- Use Copilot suggestions + manual edits
- Or consider Cursor for better multi-file editing

## Troubleshooting

### Issue: Copilot not following standards

**Symptoms**: Copilot doesn't use bash wrapper, doesn't follow commit conventions

**Solutions**:

1. Verify `.github/copilot-instructions.md` exists and has critical warnings at top
2. Reload VSCode window
3. Check file size is under ~4000 tokens
4. Explicitly remind: "Follow the terminal standards from agentic-dev-standards/terminal-standards.md"

### Issue: Terminal commands fail

**Symptoms**: Commands work manually but fail when Copilot runs them

**Solutions**:

1. Verify `.vscode/settings.json` has terminal profiles configured
2. Check PATH is correct for your system (Apple Silicon vs Intel)
3. Ensure Copilot is using bash wrapper (see `terminal-standards.md`)

### Issue: Submodule not visible to Copilot

**Symptoms**: Copilot says "can't find agentic-dev-standards/"

**Solutions**:

```bash
# Initialize submodule
git submodule update --init --recursive

# Verify it exists
ls agentic-dev-standards/

# Reload VSCode window
```

### Issue: Instructions file too large

**Symptoms**: Some instructions seem ignored, file > 4000 tokens

**Solutions**:

1. Move project-specific details to separate docs
2. Reference docs instead of duplicating: "See docs/development/testing-strategy.md"
3. Keep only critical info in `.github/copilot-instructions.md`

## Advanced Configuration

### Per-Language Instructions

Add language-specific sections to `.github/copilot-instructions.md`:

```markdown
### TypeScript-Specific Rules

- Always use `interface` for object shapes (not `type`)
- Use `unknown` instead of `any`
- Enable strict mode in tsconfig.json
- Prefer `as const` for literal types

### Python-Specific Rules

- Follow PEP 8
- Use type hints for all function signatures
- Use docstrings for public functions
- Prefer f-strings over .format()
```

### Workspace-Specific Settings

For monorepos, use workspace settings:

```json
// .vscode/settings.json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "For frontend code, follow React best practices"
    },
    {
      "text": "For backend code, follow Express.js conventions"
    }
  ]
}
```

### Custom Completions

Configure inline completion behavior:

```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": false,
    "plaintext": false
  },
  "github.copilot.advanced": {
    "debug.showScores": true,
    "debug.overrideEngine": "default"
  }
}
```

## Best Practices

### ✅ Do

- Keep `.github/copilot-instructions.md` under 4000 tokens
- Reference universal standards, don't duplicate
- Update instructions as project evolves
- Use terminal profiles for clean bash environment
- Commit instructions file to version control

### ❌ Don't

- Don't duplicate content from universal standards
- Don't include secrets or credentials in instructions
- Don't make instructions file too long (use external docs)
- Don't forget to reload VSCode after changing instructions
- Don't skip configuring terminal profiles

## Example Project Structure

```
my-project/
├── .github/
│   └── copilot-instructions.md         # References universal standards
├── .vscode/
│   └── settings.json                    # Terminal profiles configured
├── agentic-dev-standards/              # Submodule
│   ├── universal-agent-rules.md
│   ├── terminal-standards.md
│   ├── commit-conventions.md
│   └── workflow-patterns/
│       ├── session-management.md
│       ├── branch-strategy.md
│       ├── github-issues.md
│       └── dependency-management.md
├── docs/
│   ├── development/
│   │   ├── testing-strategy.md         # Project-specific
│   │   └── architecture.md             # Project-specific
│   └── setup/
│       └── local-development.md        # Project-specific
├── src/
└── [other project files]
```

## Updating Standards

When universal standards are updated:

```bash
# Update submodule
cd agentic-dev-standards
git pull origin main
cd ..

# Commit the update
git add agentic-dev-standards
git commit -m "chore: Update agentic-dev-standards submodule"
git push
```

Copilot will automatically use the updated standards (after VSCode reload).

## Summary

**Setup Checklist**:

- [x] Install GitHub Copilot extension
- [x] Add `agentic-dev-standards` submodule
- [x] Create `.github/copilot-instructions.md`
- [x] Reference universal standards from instructions file
- [x] Configure terminal profiles in `.vscode/settings.json`
- [x] Commit configuration files
- [x] Test by asking Copilot to follow standards

**Key Files**:

- `.github/copilot-instructions.md` - Copilot reads this automatically
- `.vscode/settings.json` - Terminal profiles for clean bash
- `agentic-dev-standards/` - Universal standards (submodule)

**Next Steps**:

1. Follow setup steps above
2. Customize project-specific instructions
3. Test Copilot follows standards
4. Update as project evolves

---

For general best practices applicable to all tools, see:

- [`universal-agent-rules.md`](../universal-agent-rules.md)
- [`terminal-standards.md`](../terminal-standards.md)
- [`commit-conventions.md`](../commit-conventions.md)
