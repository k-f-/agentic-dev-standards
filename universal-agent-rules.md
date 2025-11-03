# Universal AI Agent Best Practices

**Purpose**: Universal best practices for AI-assisted development that apply across ALL AI coding assistants (GitHub Copilot, Cursor, Claude Code, Windsurf, Continue, etc.).

**Usage**: Reference these guidelines from your tool-specific instructions file. See `integration/` for tool-specific setup guides.

---

## 📚 Related Standards

**CRITICAL - Read these first**:

- **`terminal-standards.md`** - Clean shell environment requirements (MUST READ)
- **`commit-conventions.md`** - Conventional Commits standard

**Workflow-specific guidance**:

- **`workflow-patterns/session-management.md`** - Session summaries and tracking
- **`workflow-patterns/branch-strategy.md`** - Branch naming and git workflows
- **`workflow-patterns/github-issues.md`** - Issue and PR management
- **`workflow-patterns/dependency-management.md`** - Adding and maintaining dependencies

---

## 🎯 Meta-Rule: Capturing New Instructions (CRITICAL)

**When you discover a new rule, pattern, or best practice during work:**

1. **Immediately ask the user**: "Should this become a permanent rule? If so, where should it be documented?"

2. **Offer these options**:
   - **Option A**: Add to **this project's** instructions (project-specific file - e.g., `.github/copilot-instructions.md`, `.cursorrules`, etc.)
   - **Option B**: Add to **universal best practices** (`agentic-dev-standards/universal-agent-rules.md` - shared across all repos via submodule)
   - **Option C**: Create/update **workflow-specific** instructions (e.g., `workflow-patterns/github-issues.md` for issue management)
   - **Option D**: Combination of A, B, C without conflict

3. **Examples of new rules to capture**:
   - "Always reference anonymized examples when making style decisions" → Project-specific (A)
   - "AI agents should verify labels exist before creating GitHub issues" → Universal (B)
   - "Run idempotence tests after every formatter change" → Workflow-specific (C)
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

Then create your tool-specific instructions file (see `integration/` for templates).

---

## 🔧 Terminal Usage Rules (CRITICAL)

**ALL terminal commands MUST use clean, minimal shell environment to reduce token usage and ensure predictable behavior.**

**See `terminal-standards.md` for complete details.**

### Quick Reference

**macOS/Linux**:

```bash
# ALWAYS wrap commands in clean bash
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin /bin/bash --noprofile --norc -c 'command'

# Use absolute paths for core utilities
/bin/cat file.txt      # NOT cat
/bin/ls -la            # NOT ls
/bin/grep pattern file # NOT grep
```

**Windows**:

```cmd
cmd.exe /c command
```

**NEVER**:

- ❌ Use commands that trigger pagers (`git log`, `git diff` without `--no-pager`)
- ❌ Rely on user's default shell or aliases
- ❌ Use bare command names for core utilities

**ALWAYS**:

- ✅ Use `git --no-pager <subcommand>`
- ✅ Combine commands with `&&` to reduce terminal calls
- ✅ Use absolute paths (`/bin/cat`, `/bin/ls`)

→ **Full details in `terminal-standards.md`**

---

## 📝 Commit Message Conventions (CRITICAL)

**Use [Conventional Commits](https://www.conventionalcommits.org/) for clean git history and automated changelog generation.**

**See `commit-conventions.md` for complete details.**

### Quick Reference

**Format**:

```text
<type>: <description>
```

**Types**:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Testing changes
- `ci:` - CI/CD changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

**Atomic Commits** - One logical change per commit:

```bash
# ✅ GOOD - Atomic commits
git commit -m "fix: Correct semicolon placement"
git commit -m "docs: Update README"

# ❌ BAD - Multiple changes
git commit -m "fix: Multiple issues and update docs"
```

→ **Full details in `commit-conventions.md`**

---

## 📂 Documentation Organization Rules

### Where to Place Documentation Files

#### ✅ User-Facing Documentation → `docs/` or `docs/setup/`

**When to use**: Documentation that helps users configure, use, or understand features.

**Examples**:

- Setup guides
- Quick reference cards
- Configuration guides
- Troubleshooting guides
- Feature explanations

#### ✅ Development Documentation → `docs/development/`

**When to use**: Documentation for developers/contributors.

**Examples**:

- Architecture documentation
- Testing strategies
- Contribution guidelines
- Coding standards
- Development workflows

#### ✅ Planning & Future Work → `docs/planning/` or `docs/development/planning/`

**When to use**: Documents about future plans, refactoring ideas, or outstanding work.

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

#### ❌ NEVER Create Documentation at Root

**Wrong**:

```
project-root/
├── ANALYSIS.md        ❌ Wrong location
├── TESTING.md         ❌ Wrong location
├── TODO.md            ❌ Wrong location
```

**Correct**:

```
project-root/
├── docs/
│   ├── development/
│   │   ├── testing-strategy.md    ✅ Correct
│   ├── planning/
│   │   ├── todo-list.md           ✅ Correct
│   ├── archive/
│   │   ├── analysis-2024-10.md    ✅ Correct
```

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

5. **Never use spaces in filenames**:
   - ✅ `my-file.md`
   - ❌ `my file.md`

### Why This Matters

- Cross-platform compatibility
- URL-friendly (no escaping needed)
- Command-line friendly (no quoting needed)
- Consistency across projects
- Aligns with open-source conventions

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

## 📚 External Resources & Standards

### Essential References

**Commit & Versioning**:

- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message specification
- [Semantic Versioning](https://semver.org/) - Version numbering (MAJOR.MINOR.PATCH)
- [Keep a Changelog](https://keepachangelog.com/) - Changelog format

**Git Workflows**:

- [GitHub Flow](https://guides.github.com/introduction/flow/) - Simple branching workflow
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) - Advanced branching model
- [Trunk-Based Development](https://trunkbaseddevelopment.com/) - Alternative to feature branches

**Code Quality & Style**:

- [Google Style Guides](https://google.github.io/styleguide/) - Multi-language style guides
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) - JavaScript/React conventions
- [PEP 8](https://pep8.org/) - Python style guide
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - TypeScript best practices

**Documentation**:

- [Write the Docs](https://www.writethedocs.org/) - Documentation community
- [Markdown Guide](https://www.markdownguide.org/) - Markdown reference
- [Google Documentation Guide](https://google.github.io/styleguide/docguide/) - Technical writing

**Testing**:

- [Test-Driven Development](https://testdriven.io/test-driven-development/) - TDD methodology
- [AAA Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) - Test structure
- [F.I.R.S.T Principles](https://github.com/ghsukumar/SFDC_Best_Practices/wiki/F.I.R.S.T-Principles-of-Unit-Testing) - Unit testing principles

**Code Review**:

- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/) - How to review code
- [Conventional Comments](https://conventionalcomments.org/) - Code review comment format

**API Design**:

- [RESTful API Design](https://restfulapi.net/) - REST best practices
- [OpenAPI Specification](https://swagger.io/specification/) - API documentation standard

**Security**:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Top security risks
- [npm Security Best Practices](https://snyk.io/blog/ten-npm-security-best-practices/) - Node.js security

**AI/LLM Resources**:

- [GitHub Copilot Docs](https://docs.github.com/en/copilot) - Official Copilot documentation
- [Prompt Engineering Guide](https://www.promptingguide.ai/) - Effective prompts
- [Anthropic Claude Docs](https://docs.anthropic.com/) - Claude best practices
- [Cursor Documentation](https://docs.cursor.com/) - Cursor AI IDE

**Books**:

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) by Robert C. Martin
- [The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/) - Software practices
- [Refactoring](https://martinfowler.com/books/refactoring.html) by Martin Fowler
- [Design Patterns](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612) (Gang of Four)

---

## 🔖 How to Use These Standards

1. **Start with the basics** - Read `terminal-standards.md` and `commit-conventions.md` first
2. **Integrate with your tool** - See `integration/` for your specific AI coding assistant
3. **Reference as needed** - Don't memorize everything; use this as a reference
4. **Apply incrementally** - Adopt practices gradually
5. **Share with team** - Ensure everyone has access to these guidelines
6. **Keep learning** - Standards evolve; revisit periodically
7. **Contribute improvements** - When you discover new patterns, update these docs

---

**Last Updated**: October 31, 2025
**Version**: 2.0.0 (Refactored for universal tool support)

---

## 🚀 Next Steps

1. **Read** `terminal-standards.md` - Critical for all AI agents
2. **Read** `commit-conventions.md` - For clean git history
3. **Choose your tool** - See `integration/` for setup guides
4. **Explore workflows** - See `workflow-patterns/` for specific processes
5. **Contribute** - Help improve these standards for everyone
