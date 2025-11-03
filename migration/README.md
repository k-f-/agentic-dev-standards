# Migration Guide

## Overview

This guide helps you migrate from tool-specific instructions to universal standards, or from old versions of these standards to the latest version.

## Common Migration Scenarios

### Scenario 1: From VSCode Copilot-Only to Universal Standards

**Before**: You have `.github/copilot-instructions.md` with all your rules.

**Problem**: Rules are locked to GitHub Copilot, can't be used with other tools.

**Migration Steps**:

1. **Identify universal vs project-specific rules**:

   Review your `.github/copilot-instructions.md` and categorize each section:
   - ✅ **Universal**: Applies to all AI-assisted projects (commit format, terminal usage, code quality)
   - ⚠️ **Project-specific**: Unique to this project (tech stack, architecture, team preferences)

2. **Add this repository as submodule**:

   ```bash
   git submodule add https://github.com/k-f-/agentic-dev-standards.git
   ```

3. **Extract universal rules** (if you have custom ones):

   If you have universal patterns not in this repo:

   ```bash
   cd agentic-dev-standards
   # Edit files to add your patterns
   git commit -m "docs: Add custom universal patterns"
   cd ..
   ```

4. **Refactor `.github/copilot-instructions.md`**:

   **Old** (everything in one file):

   ```markdown
   # Copilot Instructions

   ## Terminal Usage
   [100 lines of terminal config]

   ## Commit Format
   [50 lines of commit conventions]

   ## Project-Specific
   [20 lines of actual project-specific rules]
   ```

   **New** (references universal standards):

   ```markdown
   # GitHub Copilot Instructions for [Project]

   ⚠️ CRITICAL - READ FIRST: Universal standards in `agentic-dev-standards/`

   Read these first:
   1. agentic-dev-standards/terminal-standards.md
   2. agentic-dev-standards/commit-conventions.md
   3. agentic-dev-standards/universal-agent-rules.md

   ---

   ## Project-Specific Instructions

   ### Tech Stack
   [Your stack]

   ### Code Style
   [Your preferences]

   ### Important Notes
   [Project-specific gotchas]
   ```

5. **Test** with GitHub Copilot:

   ```
   Ask Copilot: "Have you read the universal standards from agentic-dev-standards/?"
   ```

6. **Commit**:

   ```bash
   git add .github/copilot-instructions.md agentic-dev-standards
   git commit -m "refactor: Migrate to universal standards via submodule"
   ```

### Scenario 2: From Cursor `.cursorrules` to Universal Standards

**Before**: You have `.cursorrules` with tool-specific rules.

**Migration Steps**:

1. **Add submodule** (same as above)

2. **Refactor `.cursorrules`**:

   **Old**:

   ```markdown
   # Cursor Rules

   Use clean bash for all commands.
   Follow conventional commits.
   [etc - duplicating everything]

   Project uses React with TypeScript.
   ```

   **New**:

   ```markdown
   # Cursor Rules for [Project]

   ⚠️ READ FIRST: agentic-dev-standards/ contains universal standards

   1. agentic-dev-standards/terminal-standards.md
   2. agentic-dev-standards/commit-conventions.md
   3. agentic-dev-standards/universal-agent-rules.md

   ---

   ## Project-Specific

   Tech Stack: React, TypeScript, Vite
   [Only project-specific rules here]
   ```

3. **Test** with Cursor Composer mode

4. **Commit** changes

### Scenario 3: From Multiple Tool-Specific Files to Unified Standards

**Before**: You support multiple tools but duplicate rules in each config:

```
.github/copilot-instructions.md (500 lines)
.cursorrules (450 lines)
.windsurfrules (480 lines)
# Most content is duplicated!
```

**After**: Single source of truth:

```
.github/copilot-instructions.md (50 lines - references submodule)
.cursorrules (50 lines - references submodule)
.windsurfrules (50 lines - references submodule)
agentic-dev-standards/ (submodule - 1 source of truth)
```

**Migration Steps**:

1. **Add submodule**

2. **Extract common patterns** to `agentic-dev-standards/` (contribute back!)

3. **Update each tool's config** to reference submodule

4. **Delete duplicated content** from tool-specific files

5. **Test with each tool**

### Scenario 4: From No Standards to Universal Standards

**Before**: No AI coding assistant configuration, ad-hoc usage.

**Migration Steps**:

1. **Choose your tool(s)**: GitHub Copilot, Cursor, Claude Code, Windsurf, or Continue

2. **Add submodule**:

   ```bash
   git submodule add https://github.com/k-f-/agentic-dev-standards.git
   ```

3. **Follow tool-specific setup guide**:
   - [GitHub Copilot →](../integration/vscode-copilot.md)
   - [Cursor →](../integration/cursor.md)
   - [Claude Code →](../integration/claude-code.md)
   - [Windsurf →](../integration/windsurf.md)
   - [Continue →](../integration/continue.md)

4. **Create tool config file** (`.github/copilot-instructions.md`, `.cursorrules`, etc.)

5. **Add project-specific rules** (tech stack, architecture, team conventions)

6. **Commit and test**

### Scenario 5: From v1.x to v2.x of These Standards

**Changes in v2.0**:

- Renamed files to remove "copilot" branding
- Split large file into focused modules
- Added integration guides for multiple tools
- Created workflow-patterns directory

**Migration Steps**:

1. **Update submodule**:

   ```bash
   cd agentic-dev-standards
   git pull origin main
   cd ..
   ```

2. **Update references in your tool configs**:

   **Old references**:

   ```markdown
   Read copilot-best-practices.md
   Read copilot-terminal-config.md
   Read copilot-commit-convention.md
   ```

   **New references**:

   ```markdown
   Read agentic-dev-standards/terminal-standards.md
   Read agentic-dev-standards/commit-conventions.md
   Read agentic-dev-standards/universal-agent-rules.md
   ```

3. **Optionally: Use new workflow-patterns**:

   Add to your tool config:

   ```markdown
   Workflow guidance:
   - agentic-dev-standards/workflow-patterns/session-management.md
   - agentic-dev-standards/workflow-patterns/branch-strategy.md
   - agentic-dev-standards/workflow-patterns/github-issues.md
   - agentic-dev-standards/workflow-patterns/dependency-management.md
   ```

4. **Commit**:

   ```bash
   git add agentic-dev-standards .github/copilot-instructions.md
   git commit -m "chore: Update agentic-dev-standards to v2.0"
   ```

## Tool-Specific Migration Guides

### Migrating GitHub Copilot Config

**File to update**: `.github/copilot-instructions.md`

**Before**:

```markdown
# GitHub Copilot Instructions

[Everything duplicated here - 1000+ lines]
```

**After**:

```markdown
# GitHub Copilot Instructions for [Project]

⚠️ READ FIRST: agentic-dev-standards/

1. agentic-dev-standards/terminal-standards.md
2. agentic-dev-standards/commit-conventions.md
3. agentic-dev-standards/universal-agent-rules.md

---

## Project-Specific

[Only project-specific rules - ~100 lines]
```

See [full guide →](../integration/vscode-copilot.md)

### Migrating Cursor Config

**File to update**: `.cursorrules`

Same pattern as Copilot above.

See [full guide →](../integration/cursor.md)

### Migrating Windsurf Config

**File to update**: `.windsurfrules`

Same pattern as Copilot/Cursor.

See [full guide →](../integration/windsurf.md)

### Migrating Continue Config

**File to update**: `.continue/config.json`

**Before**:

```json
{
  "systemMessage": "[Long duplicated instructions]"
}
```

**After**:

```json
{
  "systemMessage": "Follow standards from agentic-dev-standards/: terminal-standards.md, commit-conventions.md, universal-agent-rules.md",
  "contextProviders": [
    {
      "name": "docs",
      "params": {
        "folders": ["agentic-dev-standards"]
      }
    }
  ]
}
```

See [full guide →](../integration/continue.md)

## Migration Checklist

### For Each Project

- [ ] Add `agentic-dev-standards` as submodule
- [ ] Identify universal vs project-specific rules
- [ ] Extract universal rules (contribute back if valuable!)
- [ ] Update tool config files to reference submodule
- [ ] Remove duplicated content from tool configs
- [ ] Test with your tool(s)
- [ ] Commit changes
- [ ] Update team documentation

### For Multiple Projects

- [ ] Choose one pilot project
- [ ] Complete migration for pilot
- [ ] Document lessons learned
- [ ] Create template for other projects
- [ ] Roll out to remaining projects
- [ ] Train team on new structure

## Common Pitfalls

### ❌ Pitfall 1: Not Removing Duplicated Content

**Problem**: Keeping duplicated rules in tool config AND in submodule.

**Solution**: Delete duplicated content from tool configs after migration.

### ❌ Pitfall 2: Not Testing After Migration

**Problem**: Breaking AI assistant functionality.

**Solution**: Always test with your tool after migration:

- Ask AI to confirm it read universal standards
- Request a commit following conventions
- Run a terminal command and verify bash wrapper used

### ❌ Pitfall 3: Losing Custom Rules

**Problem**: Deleting valuable custom rules during migration.

**Solution**: Before deleting anything:

1. Review all existing rules
2. Identify which are universal (contribute back!)
3. Keep project-specific rules in tool config
4. Only then delete duplicated universal content

### ❌ Pitfall 4: Not Updating Old References

**Problem**: Tool config still references old file names.

**Solution**: Update all references from v1.x to v2.x file names.

## Rollback Plan

If migration causes issues:

1. **Revert submodule**:

   ```bash
   git submodule deinit agentic-dev-standards
   git rm agentic-dev-standards
   ```

2. **Restore old config**:

   ```bash
   git checkout HEAD~1 .github/copilot-instructions.md
   # or .cursorrules, .windsurfrules, etc.
   ```

3. **Commit rollback**:

   ```bash
   git commit -m "revert: Rollback universal standards migration"
   ```

4. **Investigate issue**, fix, retry migration

## Getting Help

**Issues during migration?**

1. Check [integration guides](../integration/) for your tool
2. Review [troubleshooting sections](../integration/README.md#troubleshooting)
3. Open issue in `agentic-dev-standards` repository
4. Ask in your tool's community (Discord, GitHub Discussions)

## Contributing Back

**Found valuable patterns during migration?**

1. Identify universal patterns worth sharing
2. Fork `agentic-dev-standards`
3. Add your patterns to appropriate files
4. Submit pull request
5. Help other teams benefit!

## Summary

**Migration Path**:

1. Add submodule
2. Identify universal vs project-specific
3. Extract universal (contribute back!)
4. Update tool configs to reference submodule
5. Remove duplicated content
6. Test thoroughly
7. Commit

**Benefits After Migration**:

- ✅ Single source of truth for universal standards
- ✅ Easy to update standards across all projects
- ✅ Support multiple AI tools without duplication
- ✅ Smaller tool-specific config files
- ✅ Contribute to and benefit from community standards

**Next Steps**:

- Choose your migration scenario above
- Follow step-by-step instructions
- Test thoroughly
- Roll out to other projects
