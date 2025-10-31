# GitHub Copilot Best Practices - Universal Template

**Purpose**: This file contains universal best practices that should be shared across all repositories where AI agents work.

**Usage**: Copy relevant sections to each repo's `.github/copilot-instructions.md` and customize with project-specific details.

---

## Further specific rules to ALWAYS be incorporated

`copilot-terminal-config.md`
`copilot-commit-convention.md`


## 🎯 Meta-Rule: Capturing New Instructions (CRITICAL)

**When you discover a new rule, pattern, or best practice during work:**

1. **Immediately ask the user**: "Should this become a permanent rule? If so, where should it be documented?"

2. **Offer these options**:
   - **Option A**: Add to **this project's** instructions (`.github/copilot-instructions.md` - project-specific section)
   - **Option B**: Add to **universal best practices** (`agentic-dev-standards/copilot-best-practices.md` - shared across all repos via submodule)
   - **Option C**: Create/update **domain-specific** instructions (e.g., `docs/development/TESTING_PLAN.md` for testing-specific rules)
   - **Option D**: Combination of A, B, C without conflict

3. **Examples of new rules to capture**:
   - "Always reference anonymized examples when making style decisions" → Project-specific (A)
   - "VS Code simplifies terminal commands, keep using wrapper anyway" → Universal (B)
   - "Run idempotence tests after every formatter change" → Testing-specific (C)
   - "Use atomic commits" → Universal + project workflow (B + A)

4. **Don't assume** - If you're unsure whether something should be a rule, ASK

5. **Update immediately** - If user confirms, update the appropriate file(s) in the same session

### Why This Matters

Rules discovered during work are often the most valuable because they come from real experience. If not captured immediately, they're forgotten and we repeat mistakes. This meta-rule ensures continuous improvement of AI agent guidelines.

---

## 🔄 Submodule Management (CRITICAL)

**EVERY SESSION START:**

1. **Check if `agentic-dev-standards/` submodule exists**
2. **If NO**: Ask user "Should I add the agentic-dev-standards submodule to this project?"
3. **If YES**: Run update to get latest universal guidelines:
   ```bash
   git submodule update --remote agentic-dev-standards
   ```

**WHEN YOU MODIFY UNIVERSAL RULES:**

1. **Ask user**: "Should this update be pushed to agentic-dev-standards submodule?"
2. **If YES**:
   ```bash
   cd agentic-dev-standards
   git add .
   git commit -m "docs: [describe universal rule change]"
   git push origin main
   cd ..
   git add agentic-dev-standards
   git commit -m "chore: Update agentic-dev-standards submodule"
   git push
   ```

**ADDING SUBMODULE TO NEW PROJECT:**

```bash
git submodule add https://github.com/k-f-/agentic-dev-standards.git
git submodule update --init --recursive
```

Then create `.github/copilot-instructions.md` with:

```markdown
# GitHub Copilot Instructions for [Project Name]

**⚠️ CRITICAL**: Universal best practices are in `agentic-dev-standards/copilot-best-practices.md`.
**READ THAT FILE FIRST** before reading project-specific instructions below.

---

## Project-Specific Instructions

[Project-specific content here...]
```

---

## 🔧 Terminal Usage Rules (CRITICAL)

**ALL terminal commands MUST use clean, minimal shell environment to reduce token usage and ensure predictable behavior.**

**IMPORTANT**: The `run_in_terminal` tool uses the user's active terminal (zsh with custom config). To avoid this, **EVERY command must explicitly invoke clean bash**:

```bash
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'actual command here'
```

### macOS/Linux Terminal Rules

1. **ALWAYS wrap commands in clean bash** (do not run commands directly):

   ```bash
   # CORRECT - Every single command
   PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'npm run compile'

   # WRONG - Uses user's zsh with custom config
   npm run compile
   ```

2. **Use absolute paths for standard utilities**:
   - `/bin/cat` (NOT `cat` - user may have aliased to `bat`)
   - `/bin/ls` (NOT `ls`)
   - `/bin/grep` (NOT `grep`)
   - `/usr/bin/git` (when possible)

3. **Minimal PATH** (Apple Silicon Mac):

   ```bash
   PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
   ```

4. **Development tools**: npm, node, etc. should work from `/usr/local/bin` or workspace-local `node_modules/.bin`

### Windows Terminal Rules

1. **Use cmd.exe** (NOT PowerShell):

   ```cmd
   cmd.exe /c command
   ```

2. **Use absolute paths**:
   - `%SystemRoot%\System32\cmd.exe`
   - `type` instead of `cat`

### Efficiency Rules

**CRITICAL**: Minimize terminal commands to reduce token usage:

1. **Combine commands** - Use `&&` to run multiple commands in one terminal call:
   ```bash
   PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'echo "Test 1" && npm --version && echo "Test 2" && git status'
   ```

2. **Batch test suites** - Run all tests in a single command instead of individual tests:
   ```bash
   # GOOD - One terminal call for all tests
   PATH=... /bin/bash --noprofile --norc -c 'echo "=== Tests ===" && test1 && test2 && test3 && echo "All done"'

   # BAD - Multiple terminal calls
   PATH=... /bin/bash --noprofile --norc -c 'test1'
   PATH=... /bin/bash --noprofile --norc -c 'test2'
   PATH=... /bin/bash --noprofile --norc -c 'test3'
   ```

3. **Use file reads for simple checks** - Read files directly instead of running commands when possible

4. **NEVER use commands that trigger pagers** - Pagers will hang VS Code and kill the session:
   ```bash
   # WRONG - These can trigger pagers and hang VS Code
   git log
   git diff
   less file.txt
   man command

   # CORRECT - Disable pagers or limit output
   git --no-pager log -10 --oneline
   git --no-pager diff | head -50
   cat file.txt | head -100
   command --help | head -20
   ```

### Never Do

- ❌ Rely on user's default shell (zsh, fish, PowerShell with custom profiles)
- ❌ Assume aliases exist or work as expected
- ❌ Use bare command names for core utilities (`cat`, `ls`, `grep`)
- ❌ Launch terminals that load slow configuration files
- ❌ Trust VS Code's "simplified command" optimization - ALWAYS use the full bash wrapper
- ❌ Use commands that trigger pagers (`git log`, `git diff`, `less`, `more`, `man`) without `--no-pager` or output limiting

### Why This Matters

User's shell has custom aliases (e.g., `cat` → `bat`) that break agent assumptions. Custom prompts and slow shell initialization waste tokens. This configuration saves significant tokens and ensures predictable behavior.

### VS Code Tool Behavior (IMPORTANT)

**The `run_in_terminal` tool may display "Note: The tool simplified the command to..."** This means VS Code stripped your bash wrapper. This is a VS Code "optimization" that defeats our clean environment strategy.

**What to do**:
- **Keep using the full bash wrapper** - Even if VS Code simplifies it, the wrapper is still executed
- **Don't get lazy** - Always use the pattern even when it seems to work without it
- **Document intent** - The wrapper makes our requirements explicit
- **Trust the pattern** - The bash wrapper works even when terminal profiles fail

---

## 📝 Commit Message Conventions (CRITICAL)

**This project uses [Conventional Commits](https://www.conventionalcommits.org/) for clean git history and automated changelog generation.**

### Format

```text
<type>: <description>

[optional body]
```

### Required Types

- `feat:` - ✨ New features
- `fix:` - 🐛 Bug fixes
- `docs:` - 📝 Documentation changes
- `test:` - 🧪 Testing changes
- `ci:` - 🤖 CI/CD changes
- `refactor:` - ♻️ Code refactoring (no behavior change)
- `chore:` - 🔧 Maintenance tasks
- `perf:` - ⚡ Performance improvements
- `style:` - 💄 Code style changes (formatting, etc.)

### Atomic Commits - One Logical Change Per Commit

**ALWAYS make commits atomic** - each commit should contain ONE logical change:

✅ **Good (Atomic):**

```bash
git commit -m "fix: Correct semicolon placement for first statement"
git commit -m "fix: Remove blank line after SELECT keyword"
git commit -m "docs: Update CHANGELOG for v0.0.3"
```

❌ **Bad (Multiple changes):**

```bash
git commit -m "fix: Multiple formatter issues and update docs"
```

### Benefits of Atomic Commits

1. **Clean git history** - Easy to understand what changed and why
2. **Easy rollback** - Revert specific changes without affecting others
3. **Better code review** - Reviewers can understand each change independently
4. **Automated changelog** - Each commit becomes a clear changelog entry
5. **Easier debugging** - `git bisect` works better with focused commits

### Commit Guidelines

1. **One logical change**: Fix one bug, add one feature, update one doc
2. **Present tense**: "Add feature" not "Added feature"
3. **Be specific**: "Fix alias alignment" not "Fix bug"
4. **Imperative mood**: "Change" not "Changes" or "Changed"
5. **No period at end**: `feat: Add feature` not `feat: Add feature.`
6. **Reference issues**: `fix: Correct indentation (#42)` when applicable

### When to Split Commits

Split commits when you've made changes to:

- ✅ Multiple unrelated features → Separate commit per feature
- ✅ Code + documentation → Separate commits
- ✅ Multiple bug fixes → Separate commit per bug
- ✅ Code + tests → Can be same commit if tightly coupled, otherwise split

---

## 🏷️ GitHub Issue Management Rules

### CRITICAL: Always Check Labels Exist Before Creating Issues

**When creating GitHub issues with `gh issue create`:**

1. **Check if custom labels exist first**:

   ```bash
   /bin/bash -c 'gh label list'
   ```

2. **Create missing labels before using them**:

   ```bash
   /bin/bash -c 'gh label create <label-name> --description "<description>" --color "<hex-color>"'
   ```

3. **Common label colors** (GitHub standards):

   - `bug` - `#d73a4a` (red)
   - `enhancement` - `#a2eeef` (light blue)
   - `documentation` - `#0075ca` (blue)
   - `good first issue` - `#7057ff` (purple)
   - `help wanted` - `#008672` (green)

4. **Then create issues** with those labels:

   ```bash
   /bin/bash -c 'gh issue create --title "..." --body "..." --label "bug,enhancement"'
   ```

**Why bash wrapper?** See `copilot-terminal-config.md` - user may have zsh aliases/configs that interfere with gh commands.

### Example Workflow

```bash
# Step 1: Check existing labels (with bash wrapper)
/bin/bash -c 'gh label list'

# Step 2: Create custom labels if needed
/bin/bash -c 'gh label create formatter --description "Issues related to SQL formatting logic" --color "0366d6"'
/bin/bash -c 'gh label create post-processing --description "Issues related to post-processing passes" --color "d4c5f9"'

# Step 3: Create issue with labels
/bin/bash -c 'gh issue create \
  --title "Fix FROM/JOIN alias placement" \
  --body "**Problem**: ..." \
  --label "enhancement,formatter,post-processing"'
```

### Closing Issues

**When work is complete**, close issues with reference in commit:

```bash
# In commit message
git commit -m "fix: Correct FROM/JOIN alias placement (closes #3)"

# Or manually
/bin/bash -c 'gh issue close 3 --comment "Fixed in commit abc123"'
```

### Why This Matters

Labels help organize issues by category, priority, and type. Attempting to use non-existent labels causes `gh issue create` to fail with cryptic errors like "could not add label: 'formatter' not found". Always verify labels exist or create them first.

---

## 📂 Documentation Organization Rules

### CRITICAL: Where to Place Documentation Files

#### ✅ User-Facing Documentation → `docs/setup/` or `docs/`

**When to use**: Creating documentation that helps users configure, use, or understand features.

**Examples**:
- Setup guides (e.g., "How to install X")
- Quick reference cards (e.g., "Common commands cheat sheet")
- Configuration guides (e.g., "How to customize settings")
- Troubleshooting guides
- Feature explanations

**File naming**: `lowercase-with-hyphens.md`

#### ✅ Development Documentation → `docs/development/`

**When to use**: Creating documentation for developers/contributors.

**Examples**:
- Architecture documentation
- Testing strategies
- Contribution guidelines
- Coding standards
- Development workflows

**File naming**: `UPPERCASE_WITH_UNDERSCORES.md` or `lowercase-with-hyphens.md` (be consistent)

#### ✅ Planning & Future Work → `docs/development/planning/` or `docs/planning/`

**When to use**: Creating documents about future plans, refactoring ideas, or outstanding work.

**Examples**:
- Refactoring plans
- Roadmaps
- TODOs and remaining issues
- Architecture proposals
- Migration plans

#### ✅ Historical/Archive → `docs/archive/`

**When to use**: Preserving old documentation that's no longer current but has historical value.

**Examples**:
- Old design documents
- Deprecated feature docs
- Session summaries
- Test results from previous versions

#### ❌ NEVER Create Documentation in Root

**Wrong**:
```
project-root/
├── SOME_ANALYSIS.md        ❌ Wrong location
├── TESTING_RESULTS.md      ❌ Wrong location
├── TODO_LIST.md            ❌ Wrong location
```

**Correct**:
```
project-root/
├── docs/
│   ├── development/
│   │   ├── TESTING_RESULTS.md      ✅ Correct
│   ├── planning/
│   │   ├── TODO_LIST.md            ✅ Correct
│   ├── archive/
│   │   ├── SOME_ANALYSIS.md        ✅ Correct (if historical)
```

---

## 🌿 Branch Strategy

### Branch Naming Conventions

Use these prefixes for all branches:

- `feature/*` - New features or enhancements (e.g., `feature/test-suite`)
- `bugfix/*` - Bug fixes (e.g., `bugfix/alias-alignment-multiline`)
- `refactor/*` - Code refactoring without behavior changes
- `docs/*` - Documentation updates only
- `test/*` - Test-related changes only
- `chore/*` - Maintenance tasks (dependencies, config, etc.)

### Development Branches

- **`main`**: Production-ready code, tagged releases only
- **`develop`**: (Optional) Integration branch for multiple features
- **`feature/*`**: Individual feature development
- **`bugfix/*`**: Bug fixes

---

## 📋 Session Management

**IMPORTANT**: At the end of each work session (every 24 hours or when user indicates session is ending):

1. **Create a session summary** in `docs/archive/session-summaries/YYYY-MM-DD_topic.md`
2. **Include in the summary**:
   - Session goals and what was accomplished
   - All commits made (with conventional commit messages)
   - Pending items and blockers
   - Technical details (files modified/created)
   - Lessons learned
   - Next session focus
3. **Update the index** in `docs/archive/session-summaries/README.md`
4. **Commit the summary** with: `docs: Add session summary for YYYY-MM-DD`

**Session summary format**: See existing summaries in `docs/archive/session-summaries/` for template.

**When to create summaries**:
- At the end of each work session
- When user says "leaving", "pausing", "done for now"
- After completing major milestones
- Every 24 hours of active work

---

## ✅ Testing Best Practices

### Before Committing Any Code Changes

- [ ] Run all tests (if test suite exists)
- [ ] Verify no regressions (compare against previous behavior)
- [ ] Check idempotence (for formatters/transformers: run twice, compare results)
- [ ] Update tests if behavior changed
- [ ] Update documentation if user-facing change

### Test-Driven Development

1. **Understand the requirement** - Read specs, examples, user requests
2. **Create test cases first** - Cover happy path and edge cases
3. **Implement the feature** - Make tests pass
4. **Refactor** - Clean up code while keeping tests green
5. **Document** - Update relevant docs

---

## 🎯 Code Quality Standards

### General Principles

1. **Keep it simple** - Favor clarity over cleverness
2. **DRY (Don't Repeat Yourself)** - Extract common patterns
3. **Single Responsibility** - Functions/classes should do one thing well
4. **Meaningful names** - Variables, functions, files should be self-documenting
5. **Comment why, not what** - Code should be self-explanatory; comments explain intent

### Language-Specific Standards

#### TypeScript/JavaScript
- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names (no single letters except loop counters)
- Keep functions small (< 50 lines)
- Use async/await over callbacks

#### Python
- Follow PEP 8 style guide
- Use type hints for function signatures
- Write docstrings for public functions/classes
- Prefer list comprehensions for simple transformations

#### Shell Scripts
- Use `set -euo pipefail` at the top
- Quote all variables: `"$variable"`
- Use `[[` instead of `[` for conditionals
- Add comments for non-obvious commands

---

## 🔍 Debugging Tips

### When Things Go Wrong

1. **Read error messages carefully** - They usually tell you exactly what's wrong
2. **Check recent changes** - Use `git diff` to see what changed
3. **Isolate the problem** - Simplify until you find the minimum failing case
4. **Use debugging tools** - Debuggers, console.log, print statements
5. **Search for similar issues** - GitHub issues, Stack Overflow
6. **Ask for help** - Provide context, error messages, what you've tried

### Common Issues

- **Build/compile errors**: Check dependencies, node_modules, package versions
- **Runtime errors**: Check inputs, validate assumptions, add logging
- **Test failures**: Verify test expectations, check for side effects, race conditions
- **Performance issues**: Profile the code, look for loops, large data structures

---

## 📦 Dependency Management

### When Adding Dependencies

1. **Evaluate necessity** - Can you implement it yourself? Is it actively maintained?
2. **Check license** - Compatible with your project?
3. **Check bundle size** - Will it bloat your application?
4. **Check security** - Any known vulnerabilities?
5. **Document why** - Add comment explaining why dependency is needed

### Keeping Dependencies Updated

- Run `npm audit` or equivalent regularly
- Update dependencies incrementally, not all at once
- Test after updating
- Use lock files (`package-lock.json`, `Pipfile.lock`)

---

## 🚀 Release Process

### Versioning (Semantic Versioning)

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Release Checklist

1. **Update version** in all relevant files (package.json, README, etc.)
2. **Update CHANGELOG** with all changes since last release
3. **Run full test suite** - Ensure everything passes
4. **Commit version bump** - `chore: Bump version to x.y.z`
5. **Tag release** - `git tag -a vx.y.z -m "Release vx.y.z"`
6. **Push to remote** - `git push origin main --tags`
7. **Create GitHub release** - Add release notes, attach binaries if applicable

---

## 🤝 Collaboration Best Practices

### Pull Requests

- **Keep them small** - Easier to review, faster to merge
- **Write clear descriptions** - What, why, how
- **Reference issues** - Link to relevant issue numbers
- **Self-review first** - Check your own changes before requesting review
- **Respond to feedback** - Be open to suggestions

### Code Reviews

- **Be constructive** - Suggest improvements, don't just criticize
- **Ask questions** - Seek to understand before judging
- **Check for edge cases** - What could go wrong?
- **Verify tests** - Are changes adequately tested?
- **Approve when ready** - Don't nitpick minor style issues

---

## 📁 File Naming Conventions

### Universal Standards

1. **Use lowercase with hyphens** for all files:
   - ✅ `my-config-file.md`
   - ✅ `test-results.json`
   - ✅ `deploy-script.sh`
   - ❌ `My_Config_File.md`
   - ❌ `TEST_RESULTS.json`

2. **Exceptions** (use UPPERCASE):
   - `README.md` - Standard documentation entry point
   - `LICENSE` - Standard license file
   - `CHANGELOG.md` - Standard version history
   - `CONTRIBUTING.md` - Standard contribution guide
   - `AUTHORS` - Standard authors list
   - `CODEOWNERS` - GitHub-specific file

3. **Prefer hyphens over underscores**:
   - ✅ `my-long-filename.txt`
   - ❌ `my_long_filename.txt`

4. **Use dots for file versioning/variants**:
   - ✅ `config.json.backup`
   - ✅ `testfile.txt.old`
   - ❌ `config-backup.json`
   - ❌ `testfile-old.txt`

5. **Never use spaces in filenames**:
   - ✅ `my-file.md`
   - ❌ `my file.md`

### Why This Matters

- **Cross-platform compatibility** - Works on all operating systems
- **URL-friendly** - No escaping needed in web URLs
- **Command-line friendly** - No quoting needed in shell scripts
- **Consistency** - Easier to find and reference files
- **Standard practice** - Aligns with open-source conventions

---

## 📚 External Resources & Standards

### Commit & Versioning Standards

- **[Conventional Commits](https://www.conventionalcommits.org/)** - Commit message specification
- **[Semantic Versioning](https://semver.org/)** - Version numbering standard (MAJOR.MINOR.PATCH)
- **[Keep a Changelog](https://keepachangelog.com/)** - Changelog format standard
- **[Commitizen](https://commitizen-tools.github.io/commitizen/)** - Tool for enforcing conventional commits

### Git Workflows

- **[GitHub Flow](https://guides.github.com/introduction/flow/)** - Simple branching workflow
- **[Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)** - Advanced branching model
- **[Trunk-Based Development](https://trunkbaseddevelopment.com/)** - Alternative to feature branches

### Code Quality & Style

- **[Google Style Guides](https://google.github.io/styleguide/)** - Language-specific style guides (Python, JavaScript, Shell, etc.)
- **[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)** - Popular JavaScript/React conventions
- **[PEP 8](https://pep8.org/)** - Python style guide
- **[TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)** - TypeScript best practices
- **[The Twelve-Factor App](https://12factor.net/)** - Methodology for building SaaS apps

### Documentation

- **[Write the Docs](https://www.writethedocs.org/)** - Documentation best practices community
- **[Markdown Guide](https://www.markdownguide.org/)** - Comprehensive markdown reference
- **[Documentation Guide by Google](https://google.github.io/styleguide/docguide/)** - Technical writing standards
- **[README Template by PurpleBooth](https://github.com/PurpleBooth/a-good-readme-template)** - README.md best practices

### Testing

- **[Test-Driven Development (TDD)](https://testdriven.io/test-driven-development/)** - Testing methodology
- **[AAA Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)** - Arrange-Act-Assert test structure
- **[F.I.R.S.T Principles](https://github.com/ghsukumar/SFDC_Best_Practices/wiki/F.I.R.S.T-Principles-of-Unit-Testing)** - Fast, Independent, Repeatable, Self-validating, Timely

### Code Review

- **[Google's Code Review Guidelines](https://google.github.io/eng-practices/review/)** - How to review code
- **[Conventional Comments](https://conventionalcomments.org/)** - Format for code review comments
- **[Pull Request Best Practices](https://github.com/blog/1943-how-to-write-the-perfect-pull-request)** - GitHub PR guide

### API Design

- **[RESTful API Design](https://restfulapi.net/)** - REST API best practices
- **[OpenAPI Specification](https://swagger.io/specification/)** - API documentation standard
- **[Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)** - Comprehensive API guide

### Security

- **[OWASP Top 10](https://owasp.org/www-project-top-ten/)** - Top security risks
- **[npm Security Best Practices](https://snyk.io/blog/ten-npm-security-best-practices/)** - Node.js security
- **[GitHub Security Best Practices](https://docs.github.com/en/code-security)** - Repository security

### Performance

- **[Web Performance Working Group](https://www.w3.org/webperf/)** - Web performance standards
- **[Google Web Fundamentals](https://developers.google.com/web/fundamentals)** - Web dev best practices

### AI/LLM-Specific Resources

- **[GitHub Copilot Documentation](https://docs.github.com/en/copilot)** - Official Copilot docs
- **[Prompt Engineering Guide](https://www.promptingguide.ai/)** - How to write effective prompts
- **[OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)** - Prompt engineering techniques
- **[Anthropic Claude Documentation](https://docs.anthropic.com/)** - Claude best practices
- **[Cursor AI Documentation](https://docs.cursor.com/)** - Cursor IDE with AI

### Project Management

- **[Agile Manifesto](https://agilemanifesto.org/)** - Agile principles
- **[Shape Up by Basecamp](https://basecamp.com/shapeup)** - Alternative to Scrum/Kanban
- **[Getting Things Done (GTD)](https://gettingthingsdone.com/)** - Personal productivity system

### Books (Highly Recommended)

- **[Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)** - Code quality fundamentals
- **[The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)** - Software development practices
- **[Refactoring by Martin Fowler](https://martinfowler.com/books/refactoring.html)** - Code improvement techniques
- **[Design Patterns (Gang of Four)](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)** - Classic design patterns
- **[Don't Make Me Think](https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515)** - UX/usability

---

**Last Updated**: October 30, 2025
**Version**: 1.0.0

---

## 🔖 How to Use These Resources

1. **Start with the basics** - Conventional Commits, Semantic Versioning, basic style guides
2. **Reference as needed** - Don't try to read everything upfront
3. **Apply incrementally** - Adopt practices gradually, not all at once
4. **Share with team** - Ensure everyone has access to relevant guides
5. **Keep learning** - Standards evolve; revisit periodically
