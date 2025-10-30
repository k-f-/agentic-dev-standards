# Conventional Commits Guide

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to automatically generate release notes.

## Commit Message Format

```text
<type>: <description>

[optional body]
```

## Types

Use these prefixes for your commit messages:

### Primary Types (appear in changelog)

- `feat:` - ✨ **New features**
  - Example: `feat: Add support for MERGE statements`
  - Appears in: **Features** section

- `fix:` - 🐛 **Bug fixes**
  - Example: `fix: Correct alias alignment for long comments`
  - Appears in: **Bug Fixes** section

- `docs:` - 📝 **Documentation**
  - Example: `docs: Update README with configuration examples`
  - Appears in: **Documentation** section

### Supporting Types

- `test:` - 🧪 **Testing**
  - Example: `test: Add idempotence tests`
  - Appears in: **Testing** section

- `ci:` - 🤖 **CI/CD changes**
  - Example: `ci: Add automated release workflow`
  - Appears in: **CI/CD** section

- `refactor:` - ♻️ **Code refactoring**
  - Example: `refactor: Extract comment parsing logic`
  - Appears in: **Refactoring** section

- `chore:` - 🔧 **Maintenance**
  - Example: `chore: Bump version to 0.0.4`
  - Appears in: **Maintenance** section

- `perf:` - ⚡ **Performance improvements**
  - Example: `perf: Optimize regex patterns`
  - Appears in: **Performance** section

## Examples

### Good Commit Messages

```bash
# Feature
git commit -m "feat: Add support for window functions formatting"

# Bug fix
git commit -m "fix: Prevent corruption of comments with SQL keywords"

# Documentation
git commit -m "docs: Add troubleshooting guide for common issues"

# Multiple changes
git commit -m "feat: Implement CASE expression breaking

- Breaks long CASE expressions across lines
- Aligns WHEN clauses
- Preserves inline comments"

# Breaking change
git commit -m "feat!: Change default semicolon style to leading

BREAKING CHANGE: The default semicolon.style is now 'leading-when-multi'.
Users who prefer trailing semicolons must update their settings."
```

### Bad Commit Messages (avoid)

```bash
# Too vague
git commit -m "fix stuff"
git commit -m "update"

# Missing type
git commit -m "Added new feature"
git commit -m "Fixed bug in formatter"

# Wrong type
git commit -m "feat: Fix typo in README"  # Should be "docs:"
git commit -m "fix: Add new configuration option"  # Should be "feat:"
```

## How It Works

When you create a release tag, the automated workflow:

1. **Collects commits** since the last tag
2. **Parses commit messages** by type
3. **Groups changes** into sections
4. **Generates markdown** with emojis
5. **Creates GitHub release** with formatted changelog

### Generated Changelog Example

```markdown
## What's Changed

### ✨ Features

- Add support for window functions formatting
- Implement CASE expression breaking

### 🐛 Bug Fixes

- Prevent corruption of comments with SQL keywords
- Correct alias alignment for long comments

### 📝 Documentation

- Add troubleshooting guide for common issues
- Update README with configuration examples

### 🤖 CI/CD

- Add automated release workflow

## 📦 Installation

\`\`\`bash
code --install-extension kf-sql-formatter-0.0.4.vsix
\`\`\`
```

## Tips

1. **Use present tense**: "Add feature" not "Added feature"
2. **Be specific**: "Fix alias alignment" not "Fix bug"
3. **One logical change per commit**: Split unrelated changes
4. **Reference issues**: `fix: Correct indentation (#42)`
5. **Use body for details**: Add explanation after blank line

## Custom Release Notes

For major releases, you can still create custom release notes:

```bash
# Create custom notes (overrides auto-generation)
cat > RELEASE_NOTES_v0.1.0.md << 'EOF'
## 🎯 Major Release - v0.1.0

This release includes significant improvements to...

### Highlights

- ...
EOF
```

If `RELEASE_NOTES_vX.X.X.md` exists, it will be used instead of auto-generated notes.

---

**Reference**: <https://www.conventionalcommits.org/>
