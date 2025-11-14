# Agentic Development Standards - Copilot Essentials

**Purpose**: Distilled standards for GitHub Copilot users (MCP not available). For full standards, use the [MCP server](#using-the-full-standards) or [git submodule](README.md).

---

## 🚨 Critical Terminal Standards

**MUST USE** clean shell environments for all commands:

```bash
# macOS/Linux: Bypass all shell customizations
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'your-command'

# Windows (PowerShell): Clean environment
pwsh.exe -NoProfile -Command "your-command"
```

**Why**: User shell customizations (oh-my-zsh, custom aliases, fancy prompts) break AI agent assumptions and waste tokens.

**Critical Rules**:
- ✅ No custom aliases (`cat` → `bat` breaks parsing)
- ✅ No pagers (always use `git --no-pager`)
- ✅ Combine commands with `&&` for efficiency
- ✅ Use absolute paths for core utilities

---

## 📝 Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]
```

**Types**:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `test:` - Testing
- `refactor:` - Code refactoring
- `chore:` - Maintenance
- `perf:` - Performance
- `ci:` - CI/CD changes

**Examples**:
- ✅ `feat: Add user authentication`
- ✅ `fix: Correct timezone handling in date parser`
- ✅ `docs: Update API documentation`
- ❌ `updated stuff` (no type, vague)
- ❌ `Add new feature` (no type)

---

## 🎯 Top Universal Rules

### 1. Meta-Rule: Capture New Instructions
When you discover a new rule/pattern during work:
1. Ask user: "Should this become a permanent rule?"
2. Offer: Project-specific OR universal OR workflow-specific
3. Update immediately if confirmed

### 2. Testing Standards
- **TDD strongly preferred**: Write tests before implementation
- **Minimum 80% code coverage** for new code
- **Idempotence**: Tests must pass multiple times
- Always run tests after changes

### 3. Code Quality
- **DRY**: Don't repeat yourself - extract common logic
- **SOLID**: Follow SOLID principles
- **Meaningful names**: Variables/functions should be self-documenting
- **Small functions**: Single responsibility, easy to test

### 4. File Naming
- Use `lowercase-with-hyphens.md` for markdown
- Use `camelCase.js` or `kebab-case.js` consistently per project
- Be descriptive: `user-authentication.md` not `auth.md`

### 5. Documentation
- Place standards in `/docs/` or project root
- Session summaries: `docs/archive/session-summaries/YYYY-MM-DD_topic.md`
- Use markdown for all documentation

### 6. Git Workflows
- **Branch naming**: `feature/`, `bugfix/`, `hotfix/`, `docs/`, `test/`, `refactor/`
- **PR size**: Keep under 500 lines (split larger changes)
- **Atomic commits**: One logical change per commit
- **Never force push** to main/master

### 7. GitHub Issues
- **ALWAYS run `gh label list` BEFORE `gh issue create`** (labels must exist first!)
- Use standard labels: `bug`, `enhancement`, `documentation`
- Reference issues in commits: `fix: Correct login bug (#123)`

### 8. Dependency Management
Before adding dependencies, ask:
1. Is it necessary? (Can we implement this ourselves?)
2. Is it actively maintained? (Recent commits, active issues)
3. What's the license? (Compatible with our project?)
4. Bundle size impact? (Check bundlephobia)
5. Security vulnerabilities? (Check Snyk/npm audit)

Always document WHY a dependency was added.

### 9. Context Preservation
- Use comments to explain WHY, not WHAT
- Keep critical decisions in code comments
- For major decisions, create ADRs (Architecture Decision Records)
- Tag important sections: `// CRITICAL:`, `// IMPORTANT:`, `// NOTE:`

### 10. Session Start Checklist
At session start, always:
1. Read project-specific instructions (`.github/copilot-instructions.md`, etc.)
2. Read latest session summary (`docs/archive/session-summaries/`)
3. Check branch state: `git status`, `git log -5`
4. Review project README and docs

---

## 🔍 Debugging Tips

**Systematic approach**:
1. **Reproduce**: Get minimal reproduction case
2. **Hypothesize**: Form testable hypothesis
3. **Test**: Verify hypothesis with evidence
4. **Fix**: Make smallest possible change
5. **Verify**: Confirm fix works, doesn't break other things

**Tools**:
- Logging (better than `console.log` - use proper logger)
- Debuggers (step through, inspect state)
- Tests (regression tests prevent re-breaking)

---

## 📊 Token Efficiency

**Strategies**:
- Load only relevant context
- Use external storage (files) for large data
- Progressive summarization for long threads
- Reference existing files instead of pasting content

---

## 🔗 Using the Full Standards

For **complete standards** with workflow patterns, integration guides, and detailed best practices:

### Option 1: MCP Server (Recommended for Claude Code)
See [integration/claude-code.md](integration/claude-code.md) for MCP setup instructions.

**Benefits**: 74-86% token reduction, on-demand loading, instant updates

### Option 2: Git Submodule (All Tools)
```bash
# Add to your project
git submodule add https://github.com/k-f-/agentic-dev-standards.git

# Reference from your tool's instructions file
# (See integration/ for tool-specific examples)
```

**Benefits**: Full standards available, version control, works with all AI tools

---

## 📚 Available Workflow Patterns

For detailed guidance on specific workflows, see:
- `workflow-patterns/context-preservation.md` - Token management, ADRs
- `workflow-patterns/session-management.md` - Session summaries, start checklist
- `workflow-patterns/branch-strategy.md` - Git workflows, PR guidelines
- `workflow-patterns/github-issues.md` - Issue/PR management
- `workflow-patterns/dependency-management.md` - Dependency evaluation

---

**Version**: 1.0.0 | **License**: MIT | **Maintained by**: k-f-
